<script setup lang="ts">
import { useHomeSectionScroll } from '~/composables/useHomeSectionScroll'

const { scrollToHomeHash } = useHomeSectionScroll()
const route = useRoute()

function scrollToHashIfPresent() {
  if (!import.meta.client || !route.hash) return
  nextTick(() => {
    requestAnimationFrame(() => {
      scrollToHomeHash(route.hash)
    })
  })
}

watch(
  () => [route.path, route.hash] as const,
  ([path, hash], prev) => {
    nextTick(() => {
      const main = document.getElementById('main-content')
      if (hash) {
        scrollToHashIfPresent()
      } else if (!prev || path !== prev[0]) {
        window.scrollTo(0, 0)
      }
      main?.focus({ preventScroll: true })
    })
  },
  { immediate: true },
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
  scrollToHomeHash(href)
}
</script>

<template>
  <div class="app-shell">
    <div class="app-shell-ui">
      <NuxtLoadingIndicator
        color="var(--emphasis)"
        :height="2"
        :duration="3000"
      />
      <NuxtRouteAnnouncer />
      <NuxtLayout>
        <NuxtPage :page-key="route => route.path" />
      </NuxtLayout>
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  position: relative;
  isolation: isolate;
  min-height: 100%;
}

.app-shell-ui {
  position: relative;
  z-index: 1;
  min-height: 100%;
  min-width: 0;
  max-width: 100%;
  background-color: var(--shell-ui-bg, var(--paper, #f4efe4));
}

:global(html.dark) .app-shell-ui {
  background-color: var(--shell-ui-bg, var(--paper, #07060f));
}
</style>
