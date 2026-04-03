<script setup lang="ts">
const { scrollTo } = useSmoothScroll()
const route = useRoute()

const prefersReducedMotion = ref(false)
const showWebGlBackground = ref(false)

const OrganicBackgroundAsync = defineAsyncComponent({
  loader: () => import('~/components/OrganicBackground.vue'),
  delay: 0,
  timeout: 30000,
})

function scheduleWebGlBackground() {
  if (prefersReducedMotion.value) return
  const run = () => {
    showWebGlBackground.value = true
  }
  requestAnimationFrame(() => {
    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(run, { timeout: 2500 })
    } else {
      setTimeout(run, 200)
    }
  })
}

watch(
  () => route.path,
  () => {
    nextTick(() => {
      window.scrollTo(0, 0)
      const main = document.getElementById('main-content')
      main?.focus({ preventScroll: true })
    })
  },
)

onMounted(() => {
  prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  scheduleWebGlBackground()
  document.addEventListener('click', handleAnchorClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleAnchorClick)
})

const handleAnchorClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement | null
  if (!anchor) return

  const href = anchor.getAttribute('href')
  if (!href || href === '#') return

  e.preventDefault()
  scrollTo(href, { duration: 1400, offset: -20 })
}
</script>

<template>
  <div class="app-shell">
    <OrganicBackgroundStatic v-if="prefersReducedMotion" />
    <OrganicBackgroundAsync v-else-if="showWebGlBackground" />
    <OrganicBackgroundStatic v-else />
    <div class="grain-overlay" aria-hidden="true" />
    <div class="gradient-overlay" aria-hidden="true" />
    <NuxtLoadingIndicator
      color="var(--emphasis)"
      :height="2"
      :duration="3000"
    />
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage :page-key="route => route.fullPath" :transition="{ name: 'page', mode: 'default' }" />
    </NuxtLayout>
  </div>
</template>

<style scoped>
.app-shell {
  position: relative;
  isolation: isolate;
  min-height: 100%;
}

.app-shell
  > :not(.organic-background-root):not(.organic-background-static):not(.grain-overlay):not(
    .gradient-overlay
  ) {
  position: relative;
  z-index: 1;
}

/* CSS-only grain: avoids decoding/repainting an animated GIF every frame */
.grain-overlay {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.04;
  mix-blend-mode: overlay;
  background-image:
    repeating-linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.04) 0 1px,
      transparent 1px 2px
    ),
    repeating-linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.03) 0 1px,
      transparent 1px 3px
    );
  background-size: 100% 100%;
}

.gradient-overlay {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: linear-gradient(to bottom, transparent 0%, white 100%);
}

@media (prefers-reduced-motion: no-preference) {
  .gradient-overlay {
    transition: background 0.65s ease;
  }
}

:global(html.dark .gradient-overlay) {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 65%);
}
</style>
