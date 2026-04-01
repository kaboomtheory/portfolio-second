<script setup lang="ts">
const { scrollTo } = useSmoothScroll()
const route = useRoute()

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
    <OrganicBackground />
    <div class="grain-overlay" aria-hidden="true" />
    <div class="gradient-overlay" aria-hidden="true" />
    <NuxtLoadingIndicator
      color="var(--emphasis)"
      :height="2"
      :duration="3000"
    />
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage :page-key="route => route.fullPath" :transition="{ name: 'page', mode: 'out-in' }" />
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
  > :not(.organic-background-root):not(.grain-overlay):not(.gradient-overlay) {
  position: relative;
  z-index: 1;
}

.grain-overlay {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image: url('/grain.gif');
  background-repeat: repeat;
  background-size: 100px 100px;
  opacity: 0.03;
  mix-blend-mode: screen;
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
