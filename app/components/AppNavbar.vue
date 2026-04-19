<script setup lang="ts">
import { navItems, profile, socialLinks } from '~/data/site'
import { useSharedScrollY, useScrollLayoutSubscription } from '~/composables/useScrollLayoutBus'

const route = useRoute()
/** Matches home + project detail: wide pill bar aligned with 108rem content column. */
const isWideShell = computed(
  () => route.path === '/' || /^\/projects\//.test(route.path),
)
const isHome = computed(() => route.path === '/')

const { homePage } = useSanityIndexBundle()
const { aboutPage } = useSanityAbout()

const heroEmail = computed(() => homePage.value?.email || profile.email)
const resumeHref = computed(
  () => aboutPage.value?.resumeUrl || '/Bryan_Mendez_resume_2025-1.pdf',
)
const linkedinHref = computed(() => {
  const list = homePage.value?.socialLinks?.length ? homePage.value.socialLinks : socialLinks
  const found = list.find((l) => /linkedin/i.test(l.label))
  return found?.href ?? 'https://www.linkedin.com/'
})
const navbarEl = ref<HTMLElement | null>(null)
const pillNav = ref<HTMLElement | null>(null)
const blob = ref<HTMLElement | null>(null)
const BLOB_TRANSITION = 'left 0.35s cubic-bezier(0.4, 0, 0.2, 1), width 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease'
let initialized = false

const updateBlob = () => {
  if (!pillNav.value || !blob.value) return
  const el = blob.value
  const active = pillNav.value.querySelector('.router-link-exact-active') as HTMLElement | null
  if (active) {
    if (!initialized) {
      el.style.transition = 'none'
      el.style.left = `${active.offsetLeft}px`
      el.style.width = `${active.offsetWidth}px`
      el.style.opacity = '1'
      void el.offsetHeight
      el.style.transition = BLOB_TRANSITION
      initialized = true
    } else {
      el.style.left = `${active.offsetLeft}px`
      el.style.width = `${active.offsetWidth}px`
      el.style.opacity = '1'
    }
  } else {
    el.style.opacity = '0'
  }
}

watch(() => route.path, () => {
  nextTick(() => setTimeout(updateBlob, 50))
})

const CONDENSE_THRESHOLD = 80
const scrollY = useSharedScrollY()
const isCondensed = computed(() => scrollY.value > CONDENSE_THRESHOLD)

useScrollLayoutSubscription((source) => {
  if (source === 'resize' || source === 'init') {
    updateBlob()
  }
})

const publishNavbarHeight = () => {
  if (!import.meta.client || !navbarEl.value) return
  const h = Math.ceil(navbarEl.value.offsetHeight)
  document.documentElement.style.setProperty('--navbar-h', `${h}px`)
}

let navbarResizeObserver: ResizeObserver | null = null

onMounted(() => {
  if (!import.meta.client) return
  publishNavbarHeight()
  // ResizeObserver for live reflows when pill wraps without a window resize
  if (typeof ResizeObserver !== 'undefined' && navbarEl.value) {
    navbarResizeObserver = new ResizeObserver(publishNavbarHeight)
    navbarResizeObserver.observe(navbarEl.value)
  }
  window.addEventListener('resize', publishNavbarHeight, { passive: true })
})

watch(isCondensed, () => nextTick(publishNavbarHeight))

onUnmounted(() => {
  if (!import.meta.client) return
  navbarResizeObserver?.disconnect()
  navbarResizeObserver = null
  window.removeEventListener('resize', publishNavbarHeight)
})
</script>

<template>
  <header ref="navbarEl" class="navbar" :class="{ 'navbar-condensed': isCondensed }">
    <div
      class="navbar-inner mx-auto w-full"
      :class="
        isWideShell
          ? 'navbar-inner--gutter-wide max-w-[108rem]'
          : 'navbar-inner--gutter-narrow container md:max-w-[72rem]'
      "
    >
      <div class="pill" :class="{ 'pill--with-now': isHome }">
        <NuxtLink to="/" class="navbar-brand">
          <img :src="profile.photo" :alt="profile.name" class="navbar-brand-avatar">
          <span class="navbar-brand-name mono">{{ profile.name }}</span>
        </NuxtLink>

        <div v-if="isHome" class="pill-now">
          <div class="pill-now-inner">
            <DashboardNowCard
              variant="navbar"
              :resume-href="resumeHref"
              :linkedin-href="linkedinHref"
              :email="heroEmail"
            />
          </div>
        </div>

        <div class="pill-trailing" :class="{ 'pill-trailing--home': isHome }">
          <nav ref="pillNav" class="pill-nav">
            <span ref="blob" class="nav-blob" />
            <NuxtLink
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="nav-link mono"
            >
              {{ item.title }}
            </NuxtLink>
          </nav>

          <ThemeToggle />
        </div>
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
  padding: 1.5rem 0;
  pointer-events: none;
  transition: padding 0.3s cubic-bezier(0.2, 0.65, 0.3, 0.9);
}

.navbar.navbar-condensed {
  padding: 0.75rem 0;
}

.navbar-inner {
  pointer-events: auto;
}

.navbar-inner--gutter-wide {
  padding-inline-start: max(1rem, env(safe-area-inset-left, 0px));
  padding-inline-end: max(1rem, env(safe-area-inset-right, 0px));
}

@media (min-width: 640px) {
  .navbar-inner--gutter-wide {
    padding-inline-start: max(1.25rem, env(safe-area-inset-left, 0px));
    padding-inline-end: max(1.25rem, env(safe-area-inset-right, 0px));
  }
}

@media (min-width: 768px) {
  .navbar-inner--gutter-wide {
    padding-inline-start: max(1.5rem, env(safe-area-inset-left, 0px));
    padding-inline-end: max(1.5rem, env(safe-area-inset-right, 0px));
  }
}

.navbar-inner--gutter-narrow {
  padding-inline-start: max(1.25rem, env(safe-area-inset-left, 0px));
  padding-inline-end: max(1.25rem, env(safe-area-inset-right, 0px));
}

@media (min-width: 640px) {
  .navbar-inner--gutter-narrow {
    padding-inline-start: max(1.5rem, env(safe-area-inset-left, 0px));
    padding-inline-end: max(1.5rem, env(safe-area-inset-right, 0px));
  }
}

@media (min-width: 768px) {
  .navbar-inner--gutter-narrow {
    padding-inline-start: max(2rem, env(safe-area-inset-left, 0px));
    padding-inline-end: max(2rem, env(safe-area-inset-right, 0px));
  }
}

@keyframes navbar-pill-glow {
  from {
    box-shadow: 0 0 14px color-mix(in srgb, var(--accent) 12%, transparent);
  }

  to {
    box-shadow: 0 0 22px color-mix(in srgb, var(--accent) 22%, transparent);
  }
}

@keyframes navbar-pill-glow-dark {
  from {
    box-shadow: 0 0 16px color-mix(in srgb, var(--accent-soft) 14%, transparent);
  }

  to {
    box-shadow: 0 0 26px color-mix(in srgb, var(--accent-soft) 24%, transparent);
  }
}

/* Full-width bar aligned with layout container */
.pill {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
  min-width: 0;
  border-radius: 1rem;
  padding: 0.5rem 0.75rem;
  background-color: var(--bg-primary);
  border: var(--card-border);
  box-shadow: var(--card-ring);
  backdrop-filter: blur(15px) saturate(1.2);
  -webkit-backdrop-filter: blur(15px) saturate(1.2);
  animation: navbar-pill-glow 6s ease-in-out infinite alternate;
  transition:
    padding 0.3s cubic-bezier(0.2, 0.65, 0.3, 0.9),
    gap 0.3s cubic-bezier(0.2, 0.65, 0.3, 0.9),
    border-radius 0.3s cubic-bezier(0.2, 0.65, 0.3, 0.9);
}

@media (min-width: 640px) {
  .pill {
    padding: 0.5rem 1rem;
    gap: 1rem;
  }
}

.navbar-condensed .pill {
  padding: 0.375rem 0.6rem;
  border-radius: 0.875rem;
}

@media (min-width: 640px) {
  .navbar-condensed .pill {
    padding: 0.375rem 0.75rem;
    gap: 0.75rem;
  }
}

:root.dark .pill {
  background-color: var(--bg-primary);
  animation-name: navbar-pill-glow-dark;
}

/* Home: brand | availability cluster | nav + theme */
.pill--with-now {
  justify-content: flex-start;
  gap: 0.5rem;
  flex-wrap: nowrap;
}

@media (min-width: 640px) {
  .pill--with-now {
    gap: 0.625rem;
  }
}

.pill--with-now .navbar-brand {
  padding-right: 0.5rem;
  margin-right: 0.125rem;
  border-right: 1px solid color-mix(in srgb, var(--fg-muted) 16%, transparent);
}

@media (min-width: 640px) {
  .pill--with-now .navbar-brand {
    padding-right: 0.75rem;
  }
}

.pill-now {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pill-now-inner {
  width: 100%;
  max-width: min(100%, 58rem);
  border-radius: 0.625rem;
  padding: 0.125rem 0.35rem 0.125rem 0.45rem;
  background: color-mix(in srgb, var(--bg-secondary) 92%, transparent);
  border: 1px solid color-mix(in srgb, var(--fg-muted) 14%, transparent);
  box-shadow: 0 1px 0 color-mix(in srgb, var(--fg-primary) 4%, transparent);
}

@media (min-width: 640px) {
  .pill-now-inner {
    padding: 0.15rem 0.45rem 0.15rem 0.55rem;
    border-radius: 0.6875rem;
  }
}

.pill-now :deep(.now-card--navbar) {
  margin-top: 0;
  width: auto;
  max-width: 100%;
  padding: 0;
  border: none;
  box-shadow: none;
  background: transparent;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  border-radius: 0;
}

.pill--with-now .pill-trailing {
  margin-left: auto;
}

.pill-trailing--home {
  padding-left: 0.5rem;
  margin-left: 0.125rem;
  border-left: 1px solid color-mix(in srgb, var(--fg-muted) 16%, transparent);
}

@media (min-width: 640px) {
  .pill-trailing--home {
    padding-left: 0.75rem;
  }
}

/* Brand */
.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
  transition: opacity 0.2s ease;
}

.navbar-brand:hover {
  opacity: 0.8;
}

.navbar-brand-avatar {
  height: 2.25rem;
  width: 2.25rem;
  border-radius: 0.625rem;
  object-fit: cover;
  flex-shrink: 0;
  transition:
    height 0.3s cubic-bezier(0.2, 0.65, 0.3, 0.9),
    width 0.3s cubic-bezier(0.2, 0.65, 0.3, 0.9);
}

.navbar-condensed .navbar-brand-avatar {
  height: 1.875rem;
  width: 1.875rem;
}

.navbar-brand-name {
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: var(--fg-primary);
  white-space: nowrap;
  transition:
    max-width 0.3s cubic-bezier(0.2, 0.65, 0.3, 0.9),
    opacity 0.25s ease,
    margin-left 0.3s cubic-bezier(0.2, 0.65, 0.3, 0.9);
}

/* Hide name on small screens */
@media (max-width: 480px) {
  .navbar-brand-name {
    display: none;
  }
}

/* On narrow viewports below sm, collapse the brand name when condensed */
@media (max-width: 639px) {
  .navbar-condensed .navbar-brand-name {
    max-width: 0;
    opacity: 0;
    margin-left: -0.75rem;
    overflow: hidden;
  }
}

.pill-trailing {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 1;
  min-width: 0;
}

@media (min-width: 640px) {
  .pill-trailing {
    gap: 0.75rem;
  }
}

/* Nav links */
.pill-nav {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  position: relative;
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: none;
}

.pill-nav::-webkit-scrollbar {
  display: none;
}

@media (min-width: 640px) {
  .pill-nav {
    gap: 0.5rem;
  }
}

.nav-blob {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 0;
  opacity: 0;
  border-radius: 0.5rem;
  background-color: var(--bg-secondary);
  box-shadow: 0 2px 8px color-mix(in srgb, var(--fg-primary) 5%, transparent);
  transition: left 0.35s cubic-bezier(0.4, 0, 0.2, 1),
              width 0.35s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.25s ease;
  z-index: 0;
  pointer-events: none;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  padding: 0.4rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 400;
  letter-spacing: 0.01em;
  color: var(--fg-secondary);
  white-space: nowrap;
  transition: color 0.2s ease, background-color 0.2s ease;
  position: relative;
  z-index: 1;
}

@media (min-width: 640px) {
  .nav-link {
    padding: 0.5rem 1.125rem;
    font-size: 0.875rem;
  }
}

.nav-link:hover {
  color: var(--fg-primary);
  background-color: var(--bg-tertiary);
}

.nav-link.router-link-exact-active {
  color: var(--fg-primary);
  font-weight: 600;
}

:root:not(.dark) .pill .nav-link:not(.router-link-exact-active) {
  color: color-mix(in srgb, var(--fg-primary) 78%, var(--fg-secondary) 22%);
  font-weight: 500;
}

@media (prefers-reduced-motion: reduce) {
  .nav-blob {
    transition: none;
  }

  .navbar,
  .pill,
  .navbar-brand-avatar,
  .navbar-brand-name {
    transition: none;
  }

  .pill {
    animation: none;
    box-shadow: 0 0 18px color-mix(in srgb, var(--accent) 16%, transparent);
  }

  :root.dark .pill {
    box-shadow: 0 0 20px color-mix(in srgb, var(--accent-soft) 18%, transparent);
  }
}

@media (max-width: 1180px) {
  .pill--with-now {
    flex-wrap: wrap;
    row-gap: 0.375rem;
    align-items: center;
  }

  .pill--with-now .navbar-brand {
    order: 1;
  }

  .pill--with-now .pill-trailing {
    order: 2;
  }

  .pill-now {
    order: 3;
    flex: 1 1 100%;
    justify-content: flex-start;
  }

  .pill-now-inner {
    max-width: 100%;
  }
}

@media (max-width: 900px) {
  .pill-trailing {
    gap: 0.4rem;
  }

  .pill-nav {
    gap: 0.3rem;
  }

  .nav-link {
    padding: 0.35rem 0.65rem;
    font-size: 0.75rem;
  }
}

@media (max-width: 760px) {
  .pill--with-now .navbar-brand {
    order: 1;
    border-right: none;
    margin-right: 0;
    padding-right: 0;
  }

  .pill-now {
    order: 2;
  }

  .pill--with-now .pill-trailing {
    order: 3;
    width: 100%;
    margin-left: 0;
    justify-content: space-between;
  }

  .pill-nav {
    flex: 1 1 auto;
  }

  .pill-trailing--home {
    border-left: none;
    padding-left: 0;
    margin-left: 0;
    padding-top: 0.25rem;
    border-top: 1px solid color-mix(in srgb, var(--fg-muted) 16%, transparent);
  }
}

</style>
