<script setup lang="ts">
const { scrollTo } = useSmoothScroll()
const route = useRoute()

watch(() => route.path, () => {
  nextTick(() => {
    window.scrollTo(0, 0)
  })
})

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
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
