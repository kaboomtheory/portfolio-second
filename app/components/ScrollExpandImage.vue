<script setup lang="ts">
const props = withDefaults(defineProps<{
  src: string
  alt: string
  preExpanded?: boolean
}>(), {
  preExpanded: false,
})

const wrapperRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLImageElement | null>(null)
const { progress, visibility } = useScrollExpand(wrapperRef, {
  preExpanded: props.preExpanded,
  preloadDistance: 420,
  centerHold: 96,
  influenceMultiplier: 1.8,
  edgeFadeStart: 0.56,
  edgeFadeEnd: 0.12,
})

const metrics = ref({
  maxScale: 1,
  centerShiftX: 0,
  reservedBottom: 64,
})
const imageRatio = ref(9 / 16)

let resizeObserver: ResizeObserver | null = null

function getExpandMetrics(originalWidth: number) {
  const isDesktop = window.matchMedia('(min-width: 768px)').matches
  const viewportW = window.innerWidth
  const sidebarW = isDesktop ? 256 : 0
  const availableWidth = Math.max(1, viewportW - sidebarW)
  const maxScale = Math.max(1, availableWidth / originalWidth)

  return {
    isDesktop,
    sidebarW,
    availableWidth,
    maxScale,
  }
}

function measure() {
  const el = wrapperRef.value
  if (!el) {
    return
  }

  const rect = el.getBoundingClientRect()
  if (rect.width <= 0) {
    return
  }

  const { isDesktop, sidebarW, availableWidth, maxScale } = getExpandMetrics(rect.width)
  const targetCenterX = sidebarW + availableWidth / 2
  const originalCenterX = rect.left + rect.width / 2
  const baseHeight = rect.width * imageRatio.value
  const extraHeight = baseHeight * (maxScale - 1)
  const reserve = Math.max(
    isDesktop ? 84 : 56,
    Math.min(isDesktop ? 520 : 320, extraHeight * 0.9 + (isDesktop ? 36 : 24)),
  )

  metrics.value = {
    maxScale,
    centerShiftX: targetCenterX - originalCenterX,
    reservedBottom: reserve,
  }
}

function onImageLoad() {
  const img = imageRef.value
  if (img && img.naturalWidth > 0 && img.naturalHeight > 0) {
    imageRatio.value = img.naturalHeight / img.naturalWidth
  }

  measure()
}

onMounted(() => {
  measure()
  requestAnimationFrame(measure)

  window.addEventListener('resize', measure, { passive: true })

  if ('ResizeObserver' in window && wrapperRef.value) {
    resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(wrapperRef.value)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', measure)
  resizeObserver?.disconnect()
  resizeObserver = null
})

const expandStyle = computed(() => {
  const p = Math.max(0, Math.min(1, progress.value))
  const rampStart = 0.22
  const t = p <= rampStart ? 0 : (p - rampStart) / (1 - rampStart)
  const clampedT = Math.max(0, Math.min(1, t))
  const motion = clampedT * clampedT * (3 - 2 * clampedT)

  const scale = 1 + (metrics.value.maxScale - 1) * motion
  const centerOffset = metrics.value.centerShiftX * motion

  const opacity = Math.max(0, Math.min(1, visibility.value))

  const borderRadius = Math.round(14 - 8 * motion)

  return {
    transform: `translate3d(${centerOffset.toFixed(1)}px, 0, 0) scale(${scale.toFixed(4)})`,
    borderRadius: `${borderRadius}px`,
    opacity: opacity.toFixed(3),
  }
})

const wrapperStyle = computed(() => {
  return {
    paddingBottom: `${metrics.value.reservedBottom.toFixed(1)}px`,
  }
})
</script>

<template>
  <div ref="wrapperRef" class="scroll-expand-wrapper" :style="wrapperStyle">
    <img
      ref="imageRef"
      :src="props.src"
      :alt="props.alt"
      class="scroll-expand-img"
      :style="expandStyle"
      :loading="props.preExpanded ? 'eager' : 'lazy'"
      :fetchpriority="props.preExpanded ? 'high' : 'auto'"
      decoding="async"
      @load="onImageLoad"
    >
  </div>
</template>

<style scoped>
.scroll-expand-wrapper {
  position: relative;
  overflow: visible;
  isolation: isolate;
  contain: layout style;
}

.scroll-expand-img {
  display: block;
  width: 100%;
  border-radius: 14px;
  object-fit: cover;
  will-change: transform, opacity, border-radius;
  transform-origin: top center;
  backface-visibility: hidden;
  opacity: 0;
}
</style>
