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

const GLASS_THRESHOLD = 12
const CONDENSE_THRESHOLD = 72
/** When intro bottom rises above this (viewport px), content behind the fixed nav is mostly light. */
const HOME_INTRO_NAV_THRESHOLD_PX = 88

const scrollY = useSharedScrollY()
const isGlass = computed(() => scrollY.value > GLASS_THRESHOLD)
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

const { styleAttr: markerStyleAttr, styleId: markerStyleId } = useCspTargetStyle(() => inPageMarkerStyle.value)

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

/**
 * Cursor-driven hover underline: each nav link's underline grows from where the
 * pointer entered, and retracts toward where it left. Pure CSS var pass-through.
 */
function onNavPointerMove(e: PointerEvent) {
  const target = (e.currentTarget as HTMLElement | null)
  if (!target) return
  const r = target.getBoundingClientRect()
  if (r.width < 1) return
  const pct = Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100))
  target.style.setProperty('--nav-hover-origin', `${pct.toFixed(1)}%`)
}

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
      'navbar--glass': isGlass,
      'navbar--home-hero': isHomeHero,
      'navbar--home-on-light': isHomeHero && isPastHomeIntro,
    }"
  >
    <div
      class="navbar-inner min-w-0"
      :class="{
        'navbar-inner--glass': isGlass,
        'navbar-inner--condensed': isCondensed,
      }"
    >
      <div class="navbar-row">
        <NuxtLink
          :to="navTarget('/#intro')"
          class="navbar-brand"
          @click="onInPageHashLinkClick($event, '/#intro')"
        >
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
              @pointermove="onNavPointerMove"
            >
              {{ item.title }}
            </NuxtLink>
            <span
              class="navbar-inpage__marker"
              v-bind:[markerStyleAttr]="markerStyleId"
              aria-hidden="true"
            />
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
  top: 0.85rem;
  left: 0;
  right: 0;
  z-index: 50;
  width: 100%;
  padding: 0;
  pointer-events: none;
  transition: top 0.25s var(--motion-ease-standard, cubic-bezier(0.25, 1, 0.5, 1));
}

.navbar--home-hero {
  background-color: transparent;
}

.navbar--condensed {
  top: 0.55rem;
}

@media (max-width: 767px) {
  .navbar {
    top: 0.55rem;
  }

  .navbar--condensed {
    top: 0.45rem;
  }
}

.navbar-inner {
  pointer-events: auto;
  width: fit-content;
  max-width: calc(100% - clamp(1rem, 4vw, 2.5rem));
  margin-inline: auto;
  padding: 0 clamp(0.45rem, 1vw, 0.7rem);
  border: 1px solid color-mix(in srgb, var(--fg-primary) 12%, transparent);
  border-radius: 999px;
  background-color: color-mix(in srgb, var(--shell-ui-bg) 86%, transparent);
  box-shadow:
    0 0.45rem 1.3rem -1.05rem color-mix(in srgb, var(--ink) 28%, transparent),
    inset 0 1px 0 color-mix(in srgb, var(--paper) 52%, transparent);
  transition:
    background-color 0.3s var(--motion-ease-standard, cubic-bezier(0.25, 1, 0.5, 1)),
    backdrop-filter 0.3s var(--motion-ease-standard, cubic-bezier(0.25, 1, 0.5, 1)),
    box-shadow 0.3s var(--motion-ease-standard, cubic-bezier(0.25, 1, 0.5, 1)),
    border-color 0.28s var(--motion-ease-standard, cubic-bezier(0.25, 1, 0.5, 1));
}

.navbar-inner--glass {
  background-color: color-mix(in srgb, var(--shell-ui-bg) 58%, transparent);
  border-color: color-mix(in srgb, var(--fg-primary) 16%, transparent);
  box-shadow:
    0 1rem 2.6rem -1.7rem color-mix(in srgb, var(--ink) 34%, transparent),
    inset 0 1px 0 color-mix(in srgb, var(--paper) 58%, transparent),
    inset 0 -1px 0 color-mix(in srgb, var(--fg-primary) 7%, transparent);
  backdrop-filter: blur(18px) saturate(1.28);
  -webkit-backdrop-filter: blur(18px) saturate(1.28);
}

.navbar-inner--condensed {
  background-color: color-mix(in srgb, var(--shell-ui-bg) 52%, transparent);
  border-color: color-mix(in srgb, var(--accent) 18%, var(--fg-muted));
  box-shadow:
    0 1.1rem 2.8rem -1.65rem color-mix(in srgb, var(--ink) 38%, transparent),
    inset 0 1px 0 color-mix(in srgb, var(--paper) 62%, transparent),
    0 0 0 1px color-mix(in srgb, var(--fg-primary) 4%, transparent);
}

:root.dark .navbar-inner--condensed {
  background-color: color-mix(in srgb, var(--shell-ui-bg) 50%, transparent);
  border-color: color-mix(in srgb, var(--accent) 20%, var(--fg-muted));
  backdrop-filter: blur(18px) saturate(1.28);
  -webkit-backdrop-filter: blur(18px) saturate(1.28);
  box-shadow:
    0 1.2rem 3rem -1.7rem color-mix(in srgb, #000 72%, transparent),
    inset 0 1px 0 color-mix(in srgb, var(--ink) 15%, transparent),
    0 0 0 1px color-mix(in srgb, var(--ink) 9%, transparent);
}

:global(html[data-theme='dark']) .navbar-inner--glass {
  background-color: color-mix(in srgb, var(--shell-ui-bg) 46%, transparent) !important;
  backdrop-filter: blur(18px) saturate(1.28) !important;
  -webkit-backdrop-filter: blur(18px) saturate(1.28) !important;
}

:global(html[data-theme='dark']) .navbar-inner--condensed {
  background-image: none !important;
  border-color: color-mix(in srgb, var(--accent) 20%, var(--fg-muted));
  backdrop-filter: blur(18px) saturate(1.28) !important;
  -webkit-backdrop-filter: blur(18px) saturate(1.28) !important;
}

.navbar-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem 1rem;
  width: 100%;
  min-height: 2.75rem;
  padding: 0.3rem 0;
}

.navbar--condensed .navbar-row {
  min-height: 2.35rem;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-shrink: 0;
  padding: 0 1rem;
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

.navbar-brand-icon {
  font-size: 1.1rem;
  color: var(--accent);
  flex-shrink: 0;
  transition: color 0.22s var(--motion-ease-standard, cubic-bezier(0.25, 1, 0.5, 1));
}

.navbar-brand:hover .navbar-brand-icon {
  color: var(--fg-primary);
}

.navbar-brand-name {
  font-family: var(--font-brand);
  font-size: 1rem;
  font-weight: 900;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--fg-primary);
  white-space: nowrap;
}

@media (max-width: 480px) {
  .navbar-brand-icon,
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

/* Cursor-driven ink underline: grows from where the pointer entered. */
.nav-link::after {
  content: '';
  position: absolute;
  left: 0.5rem;
  right: 0.5rem;
  bottom: 0.32rem;
  height: 1px;
  background: currentColor;
  opacity: 0.55;
  transform: scaleX(0);
  transform-origin: var(--nav-hover-origin, 50%) center;
  transition:
    transform 320ms var(--motion-ease-hero, cubic-bezier(0.16, 1, 0.3, 1)),
    opacity 200ms var(--motion-ease-standard, cubic-bezier(0.25, 1, 0.5, 1));
  pointer-events: none;
}

@media (min-width: 640px) {
  .nav-link::after {
    left: 0.85rem;
    right: 0.85rem;
  }
}

.nav-link:hover::after,
.nav-link:focus-visible::after {
  transform: scaleX(1);
}

/* Active link already has a marker bar — suppress hover underline overlap. */
.nav-link--active::after {
  display: none;
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

/* Homepage: keep the pill light at rest; let the hero tint show only after glass engages. */
.navbar--home-hero .navbar-inner:not(.navbar-inner--condensed) {
  background-color: color-mix(in srgb, var(--shell-ui-bg) 78%, transparent);
  border-color: color-mix(in srgb, var(--pastel-ink) 16%, var(--pastel-mint));
}

.navbar--home-hero .navbar-inner--glass {
  background-color: color-mix(in srgb, var(--shell-ui-bg) 42%, transparent);
  border-color: color-mix(in srgb, var(--pastel-ink) 14%, var(--pastel-mint));
}

:root.dark .navbar--home-hero .navbar-inner--condensed {
  background-color: color-mix(in srgb, var(--shell-ui-bg) 50%, transparent);
  border-color: color-mix(in srgb, var(--ink) 18%, var(--paper));
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
  border: 1px solid var(--pastel-sky);
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
  border-color: color-mix(in srgb, var(--rule) 60%, transparent);
}

.navbar--home-hero.navbar--home-on-light .nav-link:not(.nav-link--active) {
  color: var(--fg-muted);
}

.navbar--home-hero.navbar--home-on-light :deep(.theme-toggle) {
  background-color: var(--bg-primary);
  border: 1px solid var(--pastel-sky);
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
  background-color: color-mix(in srgb, var(--shell-ui-bg) 52%, transparent);
  border-color: color-mix(in srgb, var(--accent) 18%, var(--fg-muted));
  box-shadow:
    0 1.1rem 2.8rem -1.65rem color-mix(in srgb, var(--ink) 38%, transparent),
    inset 0 1px 0 color-mix(in srgb, var(--paper) 62%, transparent),
    0 0 0 1px color-mix(in srgb, var(--fg-primary) 4%, transparent);
  backdrop-filter: blur(18px) saturate(1.28);
  -webkit-backdrop-filter: blur(18px) saturate(1.28);
}

:root.dark .navbar--home-hero.navbar--home-on-light .navbar-inner--condensed {
  background-color: color-mix(in srgb, var(--shell-ui-bg) 50%, transparent);
  border-color: color-mix(in srgb, var(--accent) 20%, var(--fg-muted));
  box-shadow:
    0 1.2rem 3rem -1.7rem color-mix(in srgb, #000 72%, transparent),
    inset 0 1px 0 color-mix(in srgb, var(--ink) 15%, transparent),
    0 0 0 1px color-mix(in srgb, var(--ink) 9%, transparent);
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

  .nav-link::after {
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
