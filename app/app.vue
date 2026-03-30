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
    <AmbientOrbs />
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

.app-shell > :not(.ambient-orbs) {
  position: relative;
  z-index: 1;
}
</style>
