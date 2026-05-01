<script setup lang="ts">
import { navItems, type NavItem } from '~/data/site'
import { useInPageHashLink } from '~/composables/useInPageHashLink'
import { isInPageHashActive, parseInPageHash } from '~/utils/inPageHashNav'
import { useSharedScrollY, useScrollLayoutSubscription } from '~/composables/useScrollLayoutBus'

const route = useRoute()
const { onInPageHashLinkClick } = useInPageHashLink()
const { isDark } = useTheme()

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
  const currentHash = route.path === '/' ? effectiveHash.value : route.hash || ''
  return isInPageHashActive(route.path, currentHash, parsed.pathOnly, parsed.hash)
}

function navToneClass(item: NavItem) {
  if (item.path.includes('#work')) return 'nav-link--work'
  if (item.path.includes('#story')) return 'nav-link--about'
  return 'nav-link--home'
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

const pillEl = ref<HTMLElement | null>(null)
const pillReady = ref(false)
const isPillSquished = ref(false)
const isPillStretching = ref(false)
const pillLeft = ref('0px')
const pillWidth = ref('0px')
let stretchTimer: ReturnType<typeof setTimeout> | null = null
let pillTargetIdx = -1

const activePillToneClass = computed(() => {
  const item = navItems.find(i => isNavActive(i.path))
  return item ? navToneClass(item) : ''
})

function readActiveLink() {
  const pill = pillEl.value
  if (!pill) return null
  const links = pill.parentElement?.querySelectorAll<HTMLElement>('.nav-link')
  if (!links?.length) return null
  const idx = navItems.findIndex(i => isNavActive(i.path))
  if (idx < 0) return null
  const el = links[idx]
  return el?.offsetWidth ? el : null
}

function snapPill() {
  const el = readActiveLink()
  if (!el) return
  pillLeft.value = `${el.offsetLeft}px`
  pillWidth.value = `${el.offsetWidth}px`
  pillTargetIdx = navItems.findIndex(i => isNavActive(i.path))
  pillReady.value = true
}

function repositionPill() {
  nextTick(() => requestAnimationFrame(() => {
    if (!pillReady.value) return
    const links = pillEl.value?.parentElement?.querySelectorAll<HTMLElement>('.nav-link')
    if (!links?.length) return
    const newIdx = navItems.findIndex(i => isNavActive(i.path))
    if (newIdx < 0) return
    const el = links[newIdx]
    if (!el?.offsetWidth) return

    // Already animating toward this target — let it finish
    if (newIdx === pillTargetIdx) return
    pillTargetIdx = newIdx

    const oldLeft = parseFloat(pillLeft.value) || 0
    const oldWidth = parseFloat(pillWidth.value) || 0
    const newLeft = el.offsetLeft
    const newWidth = el.offsetWidth

    if (stretchTimer) { clearTimeout(stretchTimer); stretchTimer = null }

    // Phase 1: quickly stretch to span both positions
    const spanLeft = Math.min(oldLeft, newLeft)
    const spanRight = Math.max(oldLeft + oldWidth, newLeft + newWidth)
    isPillStretching.value = true
    pillLeft.value = `${spanLeft}px`
    pillWidth.value = `${spanRight - spanLeft}px`

    // Phase 2: spring-contract to target position
    stretchTimer = setTimeout(() => {
      isPillStretching.value = false
      pillLeft.value = `${newLeft}px`
      pillWidth.value = `${newWidth}px`
      stretchTimer = null
    }, 110)
  }))
}

function squishPill() {
  isPillSquished.value = true
  setTimeout(() => { isPillSquished.value = false }, 90)
}

// On mount: snap to position instantly (no transition), then reveal.
// Also watch for resize so the pill tracks clamp()-driven layout shifts.
let resizeOb: ResizeObserver | null = null

watch(pillEl, (el) => {
  if (!el) return
  el.style.transition = 'none'
  nextTick(() => {
    snapPill()
    requestAnimationFrame(() => { el.style.transition = '' })
  })

  const container = el.parentElement
  if (container && typeof ResizeObserver !== 'undefined') {
    resizeOb = new ResizeObserver(() => {
      const active = readActiveLink()
      if (!active) return
      pillLeft.value = `${active.offsetLeft}px`
      pillWidth.value = `${active.offsetWidth}px`
    })
    resizeOb.observe(container)
  }
}, { once: true })

onBeforeUnmount(() => {
  resizeOb?.disconnect()
})

watch(() => route.fullPath, repositionPill)
watch(effectiveHash, repositionPill)

</script>

<template>
  <header
    class="navbar"
    :class="{
      'navbar--condensed': isCondensed,
      'navbar--glass': isGlass,
      'navbar--home-hero': isHomeHero,
      'navbar--home-on-light': isHomeHero && isPastHomeIntro,
      'navbar--dark': isDark,
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
        <nav class="navbar-nav" aria-label="Primary">
          <div class="navbar-inpage">
            <div
              ref="pillEl"
              class="nav-pill"
              :class="[activePillToneClass, { 'nav-pill--squish': isPillSquished, 'nav-pill--stretching': isPillStretching, 'nav-pill--ready': pillReady }]"
              :style="{ left: pillLeft, width: pillWidth }"
              aria-hidden="true"
            />
            <NuxtLink
              v-for="item in navItems"
              :key="item.path"
              :to="navTarget(item.path)"
              class="nav-link"
              :class="[navToneClass(item), { 'nav-link--active': isNavActive(item.path) }]"
              :aria-current="isNavActive(item.path) ? 'location' : undefined"
              @click="(e) => { squishPill(); onInPageHashLinkClick(e, item.path) }"
            >
              {{ item.title }}
            </NuxtLink>
          </div>
          <ThemeToggle />
        </nav>
      </div>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  --navbar-surface: #fbfbf8;
  --navbar-ink: #10120f;
  --navbar-border: color-mix(in srgb, var(--navbar-surface) 78%, transparent);

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

.navbar--dark {
  --navbar-surface: #151515;
  --navbar-ink: var(--fg-primary);
  --navbar-border: color-mix(in srgb, var(--fg-primary) 46%, transparent);
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
  max-width: calc(100% - clamp(1rem, 6vw, 4rem));
  margin-inline: auto;
  padding: clamp(0.38rem, 1vw, 0.55rem);
  border: 1px solid var(--navbar-border);
  border-radius: 999px;
  background-color: color-mix(in srgb, var(--navbar-surface) 94%, transparent);
  box-shadow:
    0 1.15rem 2.1rem -1.3rem color-mix(in srgb, var(--ink) 26%, transparent),
    0 0.25rem 0.65rem -0.55rem color-mix(in srgb, var(--ink) 18%, transparent),
    inset 0 1px 0 color-mix(in srgb, #fff 82%, transparent);
  transition:
    background-color 0.3s var(--motion-ease-standard, cubic-bezier(0.25, 1, 0.5, 1)),
    backdrop-filter 0.3s var(--motion-ease-standard, cubic-bezier(0.25, 1, 0.5, 1)),
    box-shadow 0.3s var(--motion-ease-standard, cubic-bezier(0.25, 1, 0.5, 1)),
    border-color 0.28s var(--motion-ease-standard, cubic-bezier(0.25, 1, 0.5, 1));
}

.navbar-inner--glass {
  background-color: color-mix(in srgb, var(--navbar-surface) 86%, transparent);
  border-color: color-mix(in srgb, var(--navbar-ink) 9%, transparent);
  box-shadow:
    0 1.2rem 2.4rem -1.35rem color-mix(in srgb, var(--ink) 32%, transparent),
    inset 0 1px 0 color-mix(in srgb, #fff 76%, transparent),
    inset 0 -1px 0 color-mix(in srgb, var(--fg-primary) 5%, transparent);
  backdrop-filter: blur(18px) saturate(1.28);
  -webkit-backdrop-filter: blur(18px) saturate(1.28);
}

.navbar-inner--condensed {
  background-color: color-mix(in srgb, var(--navbar-surface) 82%, transparent);
  border-color: color-mix(in srgb, var(--navbar-ink) 10%, transparent);
  box-shadow:
    0 1.2rem 2.5rem -1.35rem color-mix(in srgb, var(--ink) 34%, transparent),
    inset 0 1px 0 color-mix(in srgb, #fff 72%, transparent),
    0 0 0 1px color-mix(in srgb, var(--fg-primary) 3%, transparent);
}

.navbar--dark .navbar-inner {
  background-color: color-mix(in srgb, var(--navbar-surface) 92%, transparent);
  border-color: var(--navbar-border);
  box-shadow:
    0 1.35rem 2.4rem -1.35rem color-mix(in srgb, #000 78%, transparent),
    inset 0 1px 0 color-mix(in srgb, var(--fg-primary) 22%, transparent),
    inset 0 -1px 0 color-mix(in srgb, #000 72%, transparent);
  backdrop-filter: blur(18px) saturate(1.12);
  -webkit-backdrop-filter: blur(18px) saturate(1.12);
}

:root.dark .navbar-inner--condensed {
  background-color: color-mix(in srgb, var(--navbar-surface) 90%, transparent);
  border-color: var(--navbar-border);
  backdrop-filter: blur(18px) saturate(1.28);
  -webkit-backdrop-filter: blur(18px) saturate(1.28);
  box-shadow:
    0 1.2rem 3rem -1.7rem color-mix(in srgb, #000 72%, transparent),
    inset 0 1px 0 color-mix(in srgb, var(--ink) 15%, transparent),
    0 0 0 1px color-mix(in srgb, var(--ink) 9%, transparent);
}

:global(html[data-theme='dark']) .navbar-inner--glass {
  background-color: color-mix(in srgb, var(--navbar-surface) 88%, transparent) !important;
  border-color: var(--navbar-border);
  backdrop-filter: blur(18px) saturate(1.28) !important;
  -webkit-backdrop-filter: blur(18px) saturate(1.28) !important;
}

:global(html[data-theme='dark']) .navbar-inner--condensed {
  background-image: none !important;
  border-color: var(--navbar-border);
  backdrop-filter: blur(18px) saturate(1.28) !important;
  -webkit-backdrop-filter: blur(18px) saturate(1.28) !important;
}

.navbar-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  width: 100%;
  min-height: 2.6rem;
  padding: 0;
}

.navbar--condensed .navbar-row {
  min-height: 2.35rem;
}

.navbar-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(0.3rem, 1vw, 0.6rem);
  width: auto;
  min-width: 0;
}

.navbar-inpage {
  position: relative;
  z-index: 0;
  display: flex;
  flex: 0 1 auto;
  align-items: center;
  justify-content: flex-start;
  gap: clamp(0.25rem, 0.85vw, 0.45rem);
  min-width: 0;
}

.nav-link {
  --nav-link-bg: var(--pastel-mint);
  --nav-link-shadow: var(--signal-mint);

  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.4rem;
  padding: 0.45rem clamp(0.72rem, 1.65vw, 1.1rem);
  border-radius: 999px;
  font-family: var(--font-sans);
  font-size: clamp(0.8rem, 1.35vw, 0.9rem);
  font-weight: 800;
  letter-spacing: 0;
  text-transform: none;
  color: var(--navbar-ink);
  text-decoration: none;
  transition:
    background-color 0.22s var(--motion-ease-standard, cubic-bezier(0.25, 1, 0.5, 1)),
    box-shadow 0.25s var(--motion-ease-standard, cubic-bezier(0.25, 1, 0.5, 1)),
    color 0.2s var(--motion-ease-standard, cubic-bezier(0.25, 1, 0.5, 1)),
    opacity 0.2s var(--motion-ease-standard, cubic-bezier(0.25, 1, 0.5, 1)),
    transform 0.28s var(--flourish-ease, cubic-bezier(0.22, 1, 0.36, 1));
}

/* Single sliding pill — elastic stretch morph between active states */
.nav-pill {
  position: absolute;
  top: 0;
  bottom: 0;
  border-radius: 999px;
  pointer-events: none;
  z-index: 0;
  background-color: var(--nav-link-bg);
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, #fff 48%, transparent),
    0 0.35rem 0.7rem -0.55rem color-mix(in srgb, var(--nav-link-shadow) 42%, transparent);
  opacity: 0;
  transform-origin: center;
  transition:
    left 0.55s var(--flourish-ease, cubic-bezier(0.22, 1, 0.36, 1)),
    width 0.55s var(--flourish-ease, cubic-bezier(0.22, 1, 0.36, 1)),
    background-color 0.4s var(--motion-ease-standard, cubic-bezier(0.25, 1, 0.5, 1)),
    box-shadow 0.4s var(--motion-ease-standard, cubic-bezier(0.25, 1, 0.5, 1)),
    transform 0.45s var(--flourish-ease, cubic-bezier(0.22, 1, 0.36, 1));
}

.nav-pill--ready {
  opacity: 1;
}

/* Stretch phase: snappy expansion to span both positions */
.nav-pill--stretching {
  transition:
    left 0.1s ease-out,
    width 0.1s ease-out,
    background-color 0.4s var(--motion-ease-standard, cubic-bezier(0.25, 1, 0.5, 1)),
    box-shadow 0.4s var(--motion-ease-standard, cubic-bezier(0.25, 1, 0.5, 1)),
    transform 0.45s var(--flourish-ease, cubic-bezier(0.22, 1, 0.36, 1));
}

.nav-pill--squish {
  transform: scaleY(0.78) scaleX(0.96);
  transition-duration: 0.07s;
}

.nav-link::after {
  display: none;
}

@media (min-width: 640px) {
  .nav-link::after {
    left: 0.85rem;
    right: 0.85rem;
  }
}

@media (min-width: 640px) {
  .nav-link {
    min-height: 0;
    padding-block: 0.48rem;
  }
}

.nav-link:hover {
  color: var(--navbar-ink);
  opacity: 0.96;
  transform: translate3d(0, -1.5px, 0);
  box-shadow: 0 0.25rem 0.6rem -0.35rem color-mix(in srgb, var(--nav-link-shadow) 28%, transparent);
}

.nav-link:hover:not(.nav-link--active) {
  background-color: color-mix(in srgb, var(--nav-link-bg) 36%, transparent);
}

.nav-link:active {
  transform: scale(0.95);
  transition-duration: 0.08s;
}

.nav-link--active {
  color: var(--pastel-ink);
  font-weight: 900;
}

.nav-link--home {
  --nav-link-bg: var(--pastel-mint);
  --nav-link-shadow: var(--signal-mint);
}

.nav-link--work {
  --nav-link-bg: var(--pastel-sky);
  --nav-link-shadow: var(--signal-sky);
}

.nav-link--about {
  --nav-link-bg: var(--pastel-blush);
  --nav-link-shadow: var(--signal-blush);
}

.navbar--dark .nav-link:not(.nav-link--active) {
  color: color-mix(in srgb, var(--navbar-ink) 94%, var(--pastel-sky));
}

:root.dark .nav-link--active,
:root.dark .nav-link.nav-link--active:hover {
  color: var(--pastel-ink);
}

/* Homepage: keep the pill light at rest; let the hero tint show only after glass engages. */
.navbar--home-hero .navbar-inner:not(.navbar-inner--condensed) {
  background-color: color-mix(in srgb, var(--navbar-surface) 94%, transparent);
  border-color: var(--navbar-border);
}

.navbar--home-hero .navbar-inner--glass {
  background-color: color-mix(in srgb, var(--navbar-surface) 86%, transparent);
  border-color: color-mix(in srgb, var(--navbar-ink) 9%, transparent);
}

:root.dark .navbar--home-hero .navbar-inner--condensed {
  background-color: color-mix(in srgb, var(--navbar-surface) 90%, transparent);
  border-color: var(--navbar-border);
}

.navbar--home-hero .nav-link:not(.nav-link--active) {
  color: var(--navbar-ink);
}

.navbar--home-hero .nav-link:not(.nav-link--active):hover {
  color: var(--navbar-ink);
}

.navbar--home-hero .nav-link.nav-link--active {
  color: var(--pastel-ink);
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
.navbar--home-hero.navbar--home-on-light .navbar-inner:not(.navbar-inner--condensed) {
  border-color: color-mix(in srgb, var(--navbar-ink) 9%, transparent);
}

.navbar--home-hero.navbar--home-on-light .nav-link:not(.nav-link--active) {
  color: var(--navbar-ink);
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
  background-color: color-mix(in srgb, var(--navbar-surface) 82%, transparent);
  border-color: color-mix(in srgb, var(--navbar-ink) 10%, transparent);
  box-shadow:
    0 1.2rem 2.5rem -1.35rem color-mix(in srgb, var(--ink) 34%, transparent),
    inset 0 1px 0 color-mix(in srgb, #fff 72%, transparent),
    0 0 0 1px color-mix(in srgb, var(--fg-primary) 3%, transparent);
  backdrop-filter: blur(18px) saturate(1.28);
  -webkit-backdrop-filter: blur(18px) saturate(1.28);
}

:root.firefox .navbar-inner--glass,
:root.firefox .navbar--dark .navbar-inner,
:root.firefox.dark .navbar-inner--condensed,
:root.firefox[data-theme='dark'] .navbar-inner--glass,
:root.firefox[data-theme='dark'] .navbar-inner--condensed,
:root.firefox .navbar--home-hero.navbar--home-on-light .navbar-inner--condensed {
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  background-color: color-mix(in srgb, var(--navbar-surface) 93%, transparent);
}

:root.dark .navbar--home-hero.navbar--home-on-light .navbar-inner--condensed {
  background-color: color-mix(in srgb, var(--navbar-surface) 90%, transparent);
  border-color: var(--navbar-border);
  box-shadow:
    0 1.2rem 3rem -1.7rem color-mix(in srgb, #000 72%, transparent),
    inset 0 1px 0 color-mix(in srgb, var(--ink) 15%, transparent),
    0 0 0 1px color-mix(in srgb, var(--ink) 9%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  .navbar,
  .navbar-inner,
  .nav-link,
  .nav-pill {
    transition: none;
  }

  .nav-link::after {
    transition: none;
  }

  .nav-link:hover,
  .nav-link:active {
    transform: none;
    box-shadow: none;
    filter: none;
  }

  .nav-pill--squish,
  .nav-pill--stretching {
    transform: none;
    transition: none;
  }
}
</style>
