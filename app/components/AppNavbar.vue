<script setup lang="ts">
import { navItems, profile } from '~/data/site'
import { useInPageHashLink } from '~/composables/useInPageHashLink'
import { isInPageHashActive, parseInPageHash } from '~/utils/inPageHashNav'
import { useSharedScrollY, useScrollLayoutSubscription } from '~/composables/useScrollLayoutBus'

const route = useRoute()
const { onInPageHashLinkClick } = useInPageHashLink()

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
  const parsed = parseInPageHash(path)
  if (!parsed) return false
  return isInPageHashActive(route.path, route.hash || '', parsed.pathOnly, parsed.hash)
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

/** Sliding accent under Home / Work / About — measured so it never fights border-radius. */
const inPageTrackRef = ref<HTMLElement | null>(null)
const inPageMarkerStyle = ref<Record<string, string>>({
  left: '0px',
  top: '0px',
  width: '0px',
  height: '2px',
  opacity: '0',
})

function updateInPageMarker() {
  if (!import.meta.client) return
  const track = inPageTrackRef.value
  if (!track) return
  const active = track.querySelector<HTMLElement>('.nav-link--active')
  if (!active) {
    inPageMarkerStyle.value = {
      left: '0px',
      top: '0px',
      width: '0px',
      height: '2px',
      opacity: '0',
    }
    return
  }
  const t = track.getBoundingClientRect()
  const a = active.getBoundingClientRect()
  const h = 2
  inPageMarkerStyle.value = {
    left: `${a.left - t.left}px`,
    top: `${a.top - t.top + a.height - h}px`,
    width: `${a.width}px`,
    height: `${h}px`,
    opacity: '1',
  }
}

let inPageTrackResize: ResizeObserver | null = null

onMounted(() => {
  if (!import.meta.client) return
  nextTick(() => {
    requestAnimationFrame(() => {
      updateInPageMarker()
      if (inPageTrackRef.value) {
        inPageTrackResize = new ResizeObserver(() => updateInPageMarker())
        inPageTrackResize.observe(inPageTrackRef.value)
      }
    })
  })
  window.addEventListener('resize', updateInPageMarker)
  if ('fonts' in document) {
    void document.fonts.ready.then(() => {
      nextTick(() => requestAnimationFrame(updateInPageMarker))
    })
  }
})

onUnmounted(() => {
  inPageTrackResize?.disconnect()
  inPageTrackResize = null
  if (import.meta.client) {
    window.removeEventListener('resize', updateInPageMarker)
  }
})

watch(
  [effectiveHash, isCondensed, isHomeHero, () => route.path],
  () => {
    nextTick(() => {
      requestAnimationFrame(updateInPageMarker)
    })
  },
  { flush: 'post' },
)
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
          @click="onInPageHashLinkClick($event, '/#intro')"
        >
          <img :src="profile.photo" :alt="profile.name" class="navbar-brand-avatar">
          <span class="navbar-brand-name eyebrow-sans">{{ profile.name }}</span>
        </NuxtLink>

        <nav class="navbar-nav" aria-label="Primary">
          <div ref="inPageTrackRef" class="navbar-inpage">
            <NuxtLink
              v-for="item in navItems"
              :key="item.path"
              :to="navTarget(item.path)"
              class="nav-link"
              :class="{ 'nav-link--active': isNavActive(item.path) }"
              :aria-current="isNavActive(item.path) ? 'location' : undefined"
              @click="onInPageHashLinkClick($event, item.path)"
            >
              {{ item.title }}
            </NuxtLink>
            <span class="navbar-inpage__marker" :style="inPageMarkerStyle" aria-hidden="true" />
          </div>
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
  transition: padding 0.25s var(--motion-ease-standard, cubic-bezier(0.25, 1, 0.5, 1));
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
  border-bottom: 1px solid var(--rule);
  transition:
    background-color 0.3s var(--motion-ease-standard, cubic-bezier(0.25, 1, 0.5, 1)),
    box-shadow 0.3s var(--motion-ease-standard, cubic-bezier(0.25, 1, 0.5, 1)),
    border-color 0.28s var(--motion-ease-standard, cubic-bezier(0.25, 1, 0.5, 1));
}

.navbar-inner--condensed {
  background-color: color-mix(in srgb, var(--shell-ui-bg) 92%, var(--paper));
  border: 1px solid color-mix(in srgb, var(--accent) 14%, var(--fg-muted));
  box-shadow:
    var(--shadow-md),
    0 0 0 1px color-mix(in srgb, var(--fg-primary) 4%, var(--paper));
}

:root.dark .navbar-inner--condensed {
  background-color: color-mix(in srgb, var(--shell-ui-bg) 94%, var(--paper));
  border-color: color-mix(in srgb, var(--accent) 20%, var(--fg-muted));
  box-shadow:
    var(--shadow-md),
    0 0 0 1px color-mix(in srgb, var(--ink) 10%, var(--paper));
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
  transition: transform 0.22s var(--motion-ease-reveal, cubic-bezier(0.16, 1, 0.3, 1));
}

.navbar-brand:hover {
  transform: translate3d(0, -1px, 0);
}

.navbar-brand:active {
  transform: translate3d(0, 0, 0) scale(0.99);
  transition-duration: 0.1s;
}

.navbar-brand-avatar {
  height: 2rem;
  width: 2rem;
  border-radius: var(--radius-control, 0.35rem);
  object-fit: cover;
  flex-shrink: 0;
  border: 1px solid color-mix(in srgb, var(--accent) 25%, var(--paper));
  transition:
    border-color 0.22s var(--motion-ease-standard, cubic-bezier(0.25, 1, 0.5, 1)),
    box-shadow 0.24s var(--motion-ease-reveal, cubic-bezier(0.16, 1, 0.3, 1));
}

.navbar-brand:hover .navbar-brand-avatar {
  border-color: color-mix(in srgb, var(--accent) 42%, var(--paper));
  box-shadow: 0 0.35rem 1rem color-mix(in srgb, var(--fg-primary) 8%, transparent);
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
  gap: 0.5rem;
  min-width: 0;
  flex: 1 1 auto;
}

@media (min-width: 640px) {
  .navbar-nav {
    gap: 0.65rem;
  }
}

.navbar-inpage {
  position: relative;
  z-index: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 0.125rem;
  min-width: 0;
}

@media (min-width: 640px) {
  .navbar-inpage {
    gap: 0.35rem;
  }
}

.navbar-inpage__marker {
  position: absolute;
  left: 0;
  top: 0;
  width: 0;
  z-index: 0;
  box-sizing: border-box;
  border-radius: 1px;
  background-color: var(--fg-primary);
  pointer-events: none;
  transition:
    left 0.46s var(--motion-ease-standard, cubic-bezier(0.25, 1, 0.5, 1)),
    top 0.46s var(--motion-ease-standard, cubic-bezier(0.25, 1, 0.5, 1)),
    width 0.46s var(--motion-ease-standard, cubic-bezier(0.25, 1, 0.5, 1)),
    opacity 0.26s var(--motion-ease-standard, cubic-bezier(0.25, 1, 0.5, 1));
}

.nav-link {
  position: relative;
  z-index: 1;
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
    color 0.2s var(--motion-ease-standard, cubic-bezier(0.25, 1, 0.5, 1)),
    opacity 0.2s var(--motion-ease-standard, cubic-bezier(0.25, 1, 0.5, 1));
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
  opacity: 0.96;
}

.nav-link:active {
  filter: brightness(0.95);
  transition-duration: 0.1s;
}

.nav-link--active {
  color: var(--fg-primary);
  font-weight: 500;
}

:root.dark .nav-link--active,
:root.dark .nav-link.nav-link--active:hover {
  color: var(--fg-primary);
}

/* Homepage: no painted bar — hero green shows through; condensed stays transparent too */
.navbar--home-hero .navbar-inner:not(.navbar-inner--condensed) {
  background-color: transparent;
  border-bottom-color: color-mix(in srgb, var(--pastel-ink) 34%, var(--pastel-mint));
}

.navbar--home-hero .navbar-inner--condensed {
  background-color: transparent;
  border: 1px solid color-mix(in srgb, var(--accent) 14%, var(--fg-muted));
  box-shadow: none;
  backdrop-filter: blur(14px) saturate(1.2);
  -webkit-backdrop-filter: blur(14px) saturate(1.2);
}

:root.dark .navbar--home-hero .navbar-inner--condensed {
  background-color: transparent;
  border-color: color-mix(in srgb, var(--ink) 18%, var(--paper));
  box-shadow: none;
}

.navbar--home-hero .navbar-brand,
.navbar--home-hero .navbar-brand-name {
  color: var(--fg-primary);
}

.navbar--home-hero .navbar-brand-avatar {
  border-color: color-mix(in srgb, var(--accent) 25%, var(--paper));
}

.navbar--home-hero .nav-link:not(.nav-link--active) {
  color: var(--fg-secondary);
}

.navbar--home-hero .nav-link:not(.nav-link--active):hover {
  color: var(--fg-primary);
}

.navbar--home-hero .nav-link.nav-link--active {
  color: var(--fg-primary);
}

.navbar--home-hero :deep(.theme-toggle) {
  background-color: var(--bg-primary);
  border: var(--card-border);
  box-shadow: var(--card-ring);
  backdrop-filter: blur(15px) saturate(1.2);
  -webkit-backdrop-filter: blur(15px) saturate(1.2);
}

.navbar--home-hero :deep(.theme-toggle__rail--on) {
  color: var(--theme-toggle-rail-emphasis);
}

.navbar--home-hero :deep(.theme-toggle__rail--muted) {
  color: var(--theme-toggle-rail-muted);
}

.navbar--home-hero :deep(.theme-toggle__pill) {
  background-color: var(--theme-toggle-knob-bg);
}

.navbar--home-hero :deep(.theme-toggle__orbit-icon) {
  color: var(--theme-toggle-knob-fg);
}

/* Scrolled past dark hero: default ink + shell chrome so nav reads on light sections */
.navbar--home-hero.navbar--home-on-light .navbar-brand,
.navbar--home-hero.navbar--home-on-light .navbar-brand-name {
  color: var(--fg-primary);
}

.navbar--home-hero.navbar--home-on-light .navbar-brand-avatar {
  border-color: color-mix(in srgb, var(--accent) 25%, var(--paper));
}

.navbar--home-hero.navbar--home-on-light .navbar-inner:not(.navbar-inner--condensed) {
  border-bottom-color: var(--rule);
}

.navbar--home-hero.navbar--home-on-light .nav-link:not(.nav-link--active) {
  color: var(--fg-muted);
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
  background-color: color-mix(in srgb, var(--shell-ui-bg) 92%, var(--paper));
  border: 1px solid color-mix(in srgb, var(--accent) 14%, var(--fg-muted));
  box-shadow:
    var(--shadow-md),
    0 0 0 1px color-mix(in srgb, var(--fg-primary) 4%, var(--paper));
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

:root.dark .navbar--home-hero.navbar--home-on-light .navbar-inner--condensed {
  background-color: color-mix(in srgb, var(--shell-ui-bg) 94%, var(--paper));
  border-color: color-mix(in srgb, var(--accent) 20%, var(--fg-muted));
  box-shadow:
    var(--shadow-md),
    0 0 0 1px color-mix(in srgb, var(--ink) 10%, var(--paper));
}

@media (prefers-reduced-motion: reduce) {
  .navbar,
  .navbar-brand,
  .navbar-brand-avatar,
  .navbar-inner,
  .nav-link,
  .navbar-inpage__marker {
    transition: none;
  }

  .navbar-brand:hover,
  .navbar-brand:active,
  .nav-link:hover,
  .nav-link:active {
    transform: none;
    box-shadow: none;
    filter: none;
  }

  .navbar-brand:hover .navbar-brand-avatar {
    box-shadow: none;
  }
}
</style>
