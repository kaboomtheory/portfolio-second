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
    if (!import.meta.client) return
    nextTick(() => {
      const main = document.getElementById('main-content')
      if (hash) {
        scrollToHashIfPresent()
      } else if (!prev) {
        // Initial load only — subsequent navigations scroll via
        // the @after-leave transition hook in default.vue.
        window.scrollTo(0, 0)
      }
      // Move focus for SR / focus order without drawing the global :focus-visible ring (e.g. Firefox).
      main?.focus({
        preventScroll: true,
        focusVisible: false,
      } as FocusOptions & { focusVisible?: boolean })
    })
  },
  { immediate: true, flush: 'post' },
)

onMounted(() => {
  if (!import.meta.client) return
  document.addEventListener('click', handleAnchorClick)
  printConsoleSignature()
})

let consoleSignaturePrinted = false
function printConsoleSignature() {
  if (consoleSignaturePrinted) return
  consoleSignaturePrinted = true
  const headline = 'color: #15120f; font: 600 14px/1.2 ui-monospace, monospace; padding: 6px 0;'
  const body = 'color: #6b6258; font: 400 12px/1.5 ui-monospace, monospace;'
  const link = 'color: #15120f; font: 500 12px/1.5 ui-monospace, monospace; text-decoration: underline;'
  /* eslint-disable no-console */
  console.log('%cBryan X. Mendez — designer, Los Angeles', headline)
  console.log(
    '%cPoking around? Likewise.\n'
      + 'Brand identity, packaging, and thoughtful digital things.\n'
      + 'If you\'re hiring or just want to swap notes, find me on LinkedIn ↘',
    body,
  )
  console.log('%cor say hi via the form at /#contact', link)
  /* eslint-enable no-console */
}

onUnmounted(() => {
  if (!import.meta.client) return
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
    <svg aria-hidden="true" focusable="false" class="grain-shadow-defs">
      <defs>
        <filter
          id="pastel-grain-shadow"
          x="-24%"
          y="-24%"
          width="148%"
          height="158%"
          color-interpolation-filters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.82"
            numOctaves="2"
            seed="17"
            result="grain"
          />
          <feColorMatrix
            in="grain"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .62 0"
            result="grain-alpha"
          />
          <feOffset in="SourceAlpha" dx="-5" dy="9" result="offset-alpha" />
          <feGaussianBlur in="offset-alpha" stdDeviation="1.15" result="soft-alpha" />
          <feComposite in="grain-alpha" in2="soft-alpha" operator="in" result="shadow-alpha" />
          <feFlood flood-color="#000000" flood-opacity="0.76" result="shadow-color" />
          <feComposite in="shadow-color" in2="shadow-alpha" operator="in" result="grain-shadow" />
          <feMerge>
            <feMergeNode in="grain-shadow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter
          id="pastel-grain-shadow-dark"
          x="-24%"
          y="-24%"
          width="148%"
          height="158%"
          color-interpolation-filters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.82"
            numOctaves="2"
            seed="17"
            result="grain"
          />
          <feColorMatrix
            in="grain"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .82 0"
            result="grain-alpha"
          />
          <feOffset in="SourceAlpha" dx="-5" dy="9" result="offset-alpha" />
          <feGaussianBlur in="offset-alpha" stdDeviation="0.9" result="soft-alpha" />
          <feComposite in="grain-alpha" in2="soft-alpha" operator="in" result="shadow-alpha" />
          <feFlood flood-color="#ffffff" flood-opacity="0.88" result="shadow-color" />
          <feComposite in="shadow-color" in2="shadow-alpha" operator="in" result="grain-shadow" />
          <feMerge>
            <feMergeNode in="grain-shadow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
    <div class="app-shell-ui">
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

.grain-shadow-defs {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
  pointer-events: none;
}

:global(html.dark) .app-shell-ui {
  background-color: var(--shell-ui-bg, var(--paper, #07060f));
}
</style>
