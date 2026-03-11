<script setup lang="ts">
const props = withDefaults(defineProps<{
  src: string
  alt: string
  preExpanded?: boolean
}>(), {
  preExpanded: false,
})

const wrapperRef = ref<HTMLElement | null>(null)
const { progress } = useScrollExpand(wrapperRef, {
  initialHoldScroll: props.preExpanded ? 420 : 0,
})

const restRect = ref({ width: 0, left: 0, height: 0, top: 0 })
let resizeObserver: ResizeObserver | null = null

const opacityProgress = ref(0)
const needsInitialMeasure = computed(() => {
  return props.preExpanded && progress.value > 0.001 && !restRect.value.width
})

function getExpandMetrics(originalWidth: number, originalHeight: number) {
  const isDesktop = window.matchMedia('(min-width: 768px)').matches
  const viewportW = window.innerWidth
  const viewportH = window.innerHeight
  const sidebarW = isDesktop ? 256 : 0
  const availableWidth = viewportW - sidebarW
  
  const maxAvailableHeight = viewportH * 0.99
  const scaleByWidth = availableWidth / originalWidth
  const scaleByHeight = originalHeight > 0 ? maxAvailableHeight / originalHeight : scaleByWidth

  return {
    isDesktop,
    sidebarW,
    availableWidth,
    maxScale: Math.max(1, Math.min(scaleByWidth, scaleByHeight)),
  }
}


function cacheRect() {
  const el = wrapperRef.value
  if (el) {
    const r = el.getBoundingClientRect()
    restRect.value = { width: r.width, left: r.left, height: r.height, top: r.top }
  }
}

function calculateOpacity() {
  const el = wrapperRef.value
  if (!el) {
    opacityProgress.value = 0
    return
  }

  const rect = el.getBoundingClientRect()
  const viewportH = window.innerHeight
  const elCenter = rect.top + rect.height / 2
  const viewportCenter = viewportH / 2

  const distanceToCenter = Math.abs(elCenter - viewportCenter)
  const holdZone = viewportH * 0.25
  const fadeZone = viewportH * 0.55

  let opacity: number
  if (distanceToCenter <= holdZone) {
    opacity = 1
  } else {
    const fadeProgress = (distanceToCenter - holdZone) / fadeZone
    opacity = Math.max(0, 1 - fadeProgress)
  }

  opacityProgress.value = opacity
}

onMounted(() => {
  cacheRect()
  calculateOpacity()
  requestAnimationFrame(cacheRect)

  window.addEventListener('resize', cacheRect, { passive: true })
  window.addEventListener('scroll', calculateOpacity, { passive: true })

  if ('ResizeObserver' in window && wrapperRef.value) {
    resizeObserver = new ResizeObserver(cacheRect)
    resizeObserver.observe(wrapperRef.value)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', cacheRect)
  window.removeEventListener('scroll', calculateOpacity)
  resizeObserver?.disconnect()
  resizeObserver = null
})

const expandStyle = computed(() => {
  const p = props.preExpanded ? 1 : progress.value
  const motion = p * p * (3 - 2 * p)
  const opacity = opacityProgress.value

  if (needsInitialMeasure.value) {
    return { opacity: '0' }
  }

  if (p <= 0.001 || !restRect.value.width) {
    return { opacity: opacity.toFixed(3) }
  }

  const originalWidth = restRect.value.width
  const originalLeft = restRect.value.left
  const originalHeight = restRect.value.height
  const { sidebarW, availableWidth, maxScale } = getExpandMetrics(originalWidth, originalHeight)

  const scaleX = 1 + (maxScale - 1) * motion

  const availableCenterX = sidebarW + availableWidth / 2
  const originalCenterX = originalLeft + originalWidth / 2
  const centerOffset = (availableCenterX - originalCenterX) * motion

  const borderRadius = Math.round(12 * (1 - motion))

  return {
    transform: `translate3d(${centerOffset.toFixed(1)}px, 0, 0) scale(${scaleX.toFixed(4)})`,
    borderRadius: `${borderRadius}px`,
    opacity: opacity.toFixed(3),
  }
})

const wrapperStyle = computed(() => {
  if (!restRect.value.height || !restRect.value.width) return {}

  const originalWidth = restRect.value.width
  const originalHeight = restRect.value.height
  const { isDesktop, maxScale } = getExpandMetrics(originalWidth, originalHeight)

  // Always reserve the full max expansion space so the page height stays
  // constant. Dynamic margin caused a scroll ↔ progress feedback loop
  // that made scrolling feel "stuck".
  const maxExtraHeight = restRect.value.height * Math.max(maxScale - 1, 0)
  const breathingRoom = isDesktop ? 72 : 46
  const marginNeeded = maxExtraHeight + breathingRoom

  return {
    marginBottom: `${marginNeeded.toFixed(1)}px`,
  }
})
</script>

<template>
  <div ref="wrapperRef" class="scroll-expand-wrapper" :style="wrapperStyle">
    <img
      :src="props.src"
      :alt="props.alt"
      class="scroll-expand-img"
      :style="expandStyle"
      loading="lazy"
      @load="cacheRect"
    >
  </div>
</template>

<style scoped>
.scroll-expand-wrapper {
  position: relative;
  overflow: visible;
  contain: layout style;
  overflow-anchor: none;
}

.scroll-expand-img {
  display: block;
  width: 100%;
  max-height: 99vh;
  border-radius: 12px;
  object-fit: contain;
  object-position: center top;
  will-change: transform, border-radius, opacity;
  transform-origin: top center;
  backface-visibility: hidden;
  opacity: 0;
}
</style>
