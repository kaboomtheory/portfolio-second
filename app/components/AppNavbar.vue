<script setup lang="ts">
import { navItems, profile } from '~/data/site'
import { useHomeSectionScroll } from '~/composables/useHomeSectionScroll'
import { useSharedScrollY, useScrollLayoutSubscription } from '~/composables/useScrollLayoutBus'

const route = useRoute()
const { scrollToHomeHash } = useHomeSectionScroll()

const effectiveHash = computed(() => {
  if (route.path !== '/') return ''
  return route.hash || '#intro'
})

function navTarget(path: string) {
  if (!path.includes('#')) return path
  const [pathname, frag] = path.split('#')
  return { path: pathname || '/', hash: `#${frag}` }
}

function isNavActive(path: string) {
  if (!path.includes('#')) {
    return route.path === path && !route.hash
  }
  const hash = path.slice(path.indexOf('#'))
  const pathOnly = path.slice(0, path.indexOf('#')) || '/'
  if (route.path !== pathOnly) return false
  if (hash === '#intro') {
    return effectiveHash.value === '#intro' || effectiveHash.value === ''
  }
  return effectiveHash.value === hash
}

const CONDENSE_THRESHOLD = 72
/** When intro bottom rises above this (viewport px), content behind the fixed nav is mostly light. */
const HOME_INTRO_NAV_THRESHOLD_PX = 88

const scrollY = useSharedScrollY()
const isCondensed = computed(() => scrollY.value > CONDENSE_THRESHOLD)
const isHomeHero = computed(() => route.path === '/')

const isPastHomeIntro = ref(false)

function updatePastHomeIntro() {
  if (!import.meta.client) return
  if (route.path !== '/') {
    isPastHomeIntro.value = false
    return
  }
  const intro = document.getElementById('intro')
  if (!intro) {
    isPastHomeIntro.value = false
    return
  }
  const { bottom } = intro.getBoundingClientRect()
  isPastHomeIntro.value = bottom < HOME_INTRO_NAV_THRESHOLD_PX
}

useScrollLayoutSubscription(() => {
  updatePastHomeIntro()
})

watch(
  () => route.fullPath,
  () => {
    nextTick(() => updatePastHomeIntro())
  },
)

function parseInPageHash(path: string): { pathOnly: string, hash: string } | null {
  if (!path.includes('#')) return null
  const i = path.indexOf('#')
  return {
    pathOnly: path.slice(0, i) || '/',
    hash: path.slice(i),
  }
}

/** Re-scroll + replay arrival when the primary link target is already active (Vue Router no-op). */
function onInPageNavClick(e: MouseEvent, path: string) {
  const parsed = parseInPageHash(path)
  if (!parsed) return
  const { pathOnly, hash } = parsed
  if (route.path !== pathOnly) return

  if (route.hash !== hash) return

  e.preventDefault()
  scrollToHomeHash(hash)
}
</script>

<template>
  <header
    class="navbar"
    :class="{
      'navbar--condensed': isCondensed,
      'navbar--home-hero': isHomeHero,
      'navbar--home-on-light': isHomeHero && isPastHomeIntro,
    }"
  >
    <div
      class="navbar-inner container mx-auto w-full min-w-0 max-w-full px-[clamp(1.25rem,3vw,2.5rem)] md:max-w-[82rem]"
      :class="{ 'navbar-inner--condensed': isCondensed }"
    >
      <div class="navbar-row">
        <NuxtLink
          :to="navTarget('/#intro')"
          class="navbar-brand"
          @click="onInPageNavClick($event, '/#intro')"
        >
          <img :src="profile.photo" :alt="profile.name" class="navbar-brand-avatar">
          <span class="navbar-brand-name eyebrow-sans">{{ profile.name }}</span>
        </NuxtLink>

        <nav class="navbar-nav" aria-label="Primary">
          <NuxtLink
            v-for="item in navItems"
            :key="item.path"
            :to="navTarget(item.path)"
            class="nav-link"
            :class="{ 'nav-link--active': isNavActive(item.path) }"
            @click="onInPageNavClick($event, item.path)"
          >
            {{ item.title }}
          </NuxtLink>
          <ThemeToggle />
        </nav>
      </div>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  width: 100%;
  padding: 1.1rem 0;
  pointer-events: none;
  transition: padding 0.25s ease;
}

.navbar--home-hero {
  background-color: transparent;
}

.navbar--condensed {
  padding: 0.55rem 0;
}

@media (max-width: 767px) {
  .navbar {
    padding: 0.75rem 0;
  }

  .navbar--condensed {
    padding: 0.45rem 0;
  }
}

.navbar-inner {
  pointer-events: auto;
  transition:
    background-color 0.3s var(--motion-ease-standard, cubic-bezier(0.25, 0.46, 0.45, 0.94)),
    box-shadow 0.3s var(--motion-ease-standard, cubic-bezier(0.25, 0.46, 0.45, 0.94)),
    border-color 0.3s ease;
}

.navbar-inner--condensed {
  background-color: color-mix(in srgb, var(--shell-ui-bg) 92%, transparent);
  border: 1px solid color-mix(in srgb, var(--accent) 14%, var(--fg-muted));
  box-shadow:
    var(--shadow-md),
    0 0 0 1px color-mix(in srgb, var(--fg-primary) 4%, transparent);
}

:root.dark .navbar-inner--condensed {
  background-color: color-mix(in srgb, var(--shell-ui-bg) 94%, transparent);
  border-color: color-mix(in srgb, var(--accent) 20%, var(--fg-muted));
  box-shadow:
    var(--shadow-md),
    0 0 0 1px color-mix(in srgb, var(--ink) 10%, transparent);
}

.navbar-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem 1rem;
  width: 100%;
  min-height: 2.75rem;
  padding: 0.35rem 0;
  border-bottom: 1px solid color-mix(in srgb, var(--fg-muted) 22%, transparent);
}

.navbar--condensed .navbar-row {
  min-height: 2.35rem;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-shrink: 0;
  text-decoration: none;
  color: var(--fg-primary);
  transition: opacity 0.2s ease;
}

.navbar-brand:hover {
  opacity: 0.82;
}

.navbar-brand-avatar {
  height: 2rem;
  width: 2rem;
  border-radius: var(--radius-control, 0.35rem);
  object-fit: cover;
  flex-shrink: 0;
  border: 1px solid color-mix(in srgb, var(--accent) 25%, transparent);
}

.navbar--condensed .navbar-brand-avatar {
  height: 1.75rem;
  width: 1.75rem;
}

.navbar-brand-name {
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: var(--fg-primary);
  white-space: nowrap;
}

@media (max-width: 480px) {
  .navbar-brand-name {
    display: none;
  }
}

.navbar-nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 0.125rem;
  min-width: 0;
  flex: 1 1 auto;
}

@media (min-width: 640px) {
  .navbar-nav {
    gap: 0.35rem;
  }
}

.nav-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.75rem;
  padding: 0.45rem 0.5rem;
  border-radius: var(--radius-control, 0.35rem);
  font-family: var(--font-sans);
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--fg-muted);
  text-decoration: none;
  transition:
    color 0.2s ease,
    background-color 0.24s var(--motion-ease-standard, cubic-bezier(0.25, 0.46, 0.45, 0.94)),
    box-shadow 0.24s var(--motion-ease-standard, cubic-bezier(0.25, 0.46, 0.45, 0.94));
}

@media (min-width: 640px) {
  .nav-link {
    min-height: 0;
    padding: 0.45rem 0.85rem;
    font-size: 0.75rem;
  }
}

.nav-link:hover {
  color: var(--fg-primary);
  background-color: color-mix(in srgb, var(--accent) 8%, transparent);
}

.nav-link--active {
  color: var(--pastel-ink);
  font-weight: 600;
  background-color: var(--pastel-blush);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--pastel-ink) 14%, transparent);
}

.nav-link.nav-link--active:hover {
  color: var(--pastel-ink);
  background-color: color-mix(in srgb, var(--pastel-blush) 90%, var(--pastel-ink));
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--pastel-ink) 20%, transparent);
}

:root.dark .nav-link--active {
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--pastel-ink) 36%, transparent);
}

:root.dark .nav-link.nav-link--active:hover {
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--pastel-ink) 48%, transparent);
}

/* Homepage: no painted bar — hero green shows through; condensed stays transparent too */
.navbar--home-hero .navbar-inner:not(.navbar-inner--condensed) {
  background-color: transparent;
}

.navbar--home-hero .navbar-inner--condensed {
  background-color: transparent;
  border: 1px solid color-mix(in srgb, #ffffff 14%, transparent);
  box-shadow: none;
  backdrop-filter: blur(14px) saturate(1.2);
  -webkit-backdrop-filter: blur(14px) saturate(1.2);
}

:root.dark .navbar--home-hero .navbar-inner--condensed {
  background-color: transparent;
  border-color: color-mix(in srgb, #ffffff 18%, transparent);
  box-shadow: none;
}

.navbar--home-hero .navbar-row {
  border-bottom-color: color-mix(in srgb, #ffffff 16%, transparent);
}

.navbar--home-hero .navbar-brand {
  color: color-mix(in srgb, #ffffff 94%, transparent);
}

.navbar--home-hero .navbar-brand-name {
  color: color-mix(in srgb, #ffffff 94%, transparent);
}

.navbar--home-hero .navbar-brand-avatar {
  border-color: color-mix(in srgb, #ffffff 32%, transparent);
}

/* On dark bar: light labels; on light pills (active): keep dark ink */
.navbar--home-hero .nav-link:not(.nav-link--active) {
  color: color-mix(in srgb, #ffffff 62%, transparent);
}

.navbar--home-hero .nav-link:not(.nav-link--active):hover {
  color: #ffffff;
  background-color: color-mix(in srgb, #ffffff 10%, transparent);
}

.navbar--home-hero .nav-link.nav-link--active {
  color: var(--pastel-ink);
}

.navbar--home-hero .nav-link.nav-link--active:hover {
  color: var(--pastel-ink);
  background-color: color-mix(in srgb, var(--pastel-blush) 90%, var(--pastel-ink));
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--pastel-ink) 20%, transparent);
}

.navbar--home-hero :deep(.theme-toggle) {
  background-color: color-mix(in srgb, #ffffff 12%, transparent);
  border: 1px solid color-mix(in srgb, #ffffff 26%, transparent);
  box-shadow: none;
}

.navbar--home-hero :deep(.theme-toggle__rail--on) {
  color: color-mix(in srgb, #ffffff 95%, transparent);
}

.navbar--home-hero :deep(.theme-toggle__rail--muted) {
  color: color-mix(in srgb, #ffffff 42%, transparent);
}

.navbar--home-hero :deep(.theme-toggle__pill) {
  background-color: color-mix(in srgb, #ffffff 92%, transparent);
}

.navbar--home-hero :deep(.theme-toggle__orbit-icon) {
  color: #0e1e1d;
}

/* Scrolled past dark hero: default ink + shell chrome so nav reads on light sections */
.navbar--home-hero.navbar--home-on-light .navbar-brand,
.navbar--home-hero.navbar--home-on-light .navbar-brand-name {
  color: var(--fg-primary);
}

.navbar--home-hero.navbar--home-on-light .navbar-brand-avatar {
  border-color: color-mix(in srgb, var(--accent) 25%, transparent);
}

.navbar--home-hero.navbar--home-on-light .navbar-row {
  border-bottom-color: color-mix(in srgb, var(--fg-muted) 22%, transparent);
}

.navbar--home-hero.navbar--home-on-light .nav-link:not(.nav-link--active) {
  color: var(--fg-muted);
}

.navbar--home-hero.navbar--home-on-light .nav-link:not(.nav-link--active):hover {
  color: var(--fg-primary);
  background-color: color-mix(in srgb, var(--accent) 8%, transparent);
}

.navbar--home-hero.navbar--home-on-light :deep(.theme-toggle) {
  background-color: var(--bg-primary);
  border: var(--card-border);
  box-shadow: var(--card-ring);
  backdrop-filter: blur(15px) saturate(1.2);
  -webkit-backdrop-filter: blur(15px) saturate(1.2);
}

.navbar--home-hero.navbar--home-on-light :deep(.theme-toggle__rail--on) {
  color: var(--theme-toggle-rail-emphasis);
}

.navbar--home-hero.navbar--home-on-light :deep(.theme-toggle__rail--muted) {
  color: var(--theme-toggle-rail-muted);
}

.navbar--home-hero.navbar--home-on-light :deep(.theme-toggle__pill) {
  background-color: var(--theme-toggle-knob-bg);
}

.navbar--home-hero.navbar--home-on-light :deep(.theme-toggle__orbit-icon) {
  color: var(--theme-toggle-knob-fg);
}

.navbar--home-hero.navbar--home-on-light .navbar-inner--condensed {
  background-color: color-mix(in srgb, var(--shell-ui-bg) 92%, transparent);
  border: 1px solid color-mix(in srgb, var(--accent) 14%, var(--fg-muted));
  box-shadow:
    var(--shadow-md),
    0 0 0 1px color-mix(in srgb, var(--fg-primary) 4%, transparent);
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

:root.dark .navbar--home-hero.navbar--home-on-light .navbar-inner--condensed {
  background-color: color-mix(in srgb, var(--shell-ui-bg) 94%, transparent);
  border-color: color-mix(in srgb, var(--accent) 20%, var(--fg-muted));
  box-shadow:
    var(--shadow-md),
    0 0 0 1px color-mix(in srgb, var(--ink) 10%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  .navbar,
  .navbar-brand-avatar,
  .navbar-inner {
    transition: none;
  }
}
</style>
