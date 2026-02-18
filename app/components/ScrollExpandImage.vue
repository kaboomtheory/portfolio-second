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

const restRect = ref({ width: 0, left: 0, height: 0 })
const isLastExpandImage = ref(false)
let resizeObserver: ResizeObserver | null = null

function getExpandMetrics(originalWidth: number) {
  const isDesktop = window.matchMedia('(min-width: 768px)').matches
  const viewportW = window.innerWidth
  const sidebarW = isDesktop ? 256 : 0
  const availableWidth = viewportW - sidebarW

  return {
    isDesktop,
    sidebarW,
    availableWidth,
    maxScale: Math.max(1, availableWidth / originalWidth),
  }
}

function updateLastImageState() {
  const el = wrapperRef.value
  if (!el || !import.meta.client) {
    isLastExpandImage.value = false
    return
  }

  const wrappers = document.querySelectorAll<HTMLElement>('.scroll-expand-wrapper')
  isLastExpandImage.value = wrappers.length > 0 && wrappers[wrappers.length - 1] === el
}

function cacheRect() {
  const el = wrapperRef.value
  if (el) {
    const r = el.getBoundingClientRect()
    restRect.value = { width: r.width, left: r.left, height: r.height }
  }
}

onMounted(() => {
  cacheRect()
  updateLastImageState()
  requestAnimationFrame(updateLastImageState)

  window.addEventListener('resize', cacheRect, { passive: true })

  if ('ResizeObserver' in window && wrapperRef.value) {
    resizeObserver = new ResizeObserver(cacheRect)
    resizeObserver.observe(wrapperRef.value)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', cacheRect)
  resizeObserver?.disconnect()
  resizeObserver = null
})

const expandStyle = computed(() => {
  const p = progress.value
  if (p <= 0.001 || !restRect.value.width) return {}

  const originalWidth = restRect.value.width
  const originalLeft = restRect.value.left
  const motion = p * p * (3 - 2 * p)
  const { sidebarW, availableWidth, maxScale } = getExpandMetrics(originalWidth)

  const scaleX = 1 + (maxScale - 1) * motion

  const availableCenterX = sidebarW + availableWidth / 2
  const originalCenterX = originalLeft + originalWidth / 2
  const centerOffset = (availableCenterX - originalCenterX) * motion

  const borderRadius = Math.round(12 * (1 - motion))

  return {
    transform: `translate3d(${centerOffset.toFixed(1)}px, 0, 0) scale(${scaleX.toFixed(4)})`,
    borderRadius: `${borderRadius}px`,
  }
})

const wrapperStyle = computed(() => {
  const p = progress.value
  if (p <= 0.001 || !restRect.value.height || !restRect.value.width) return {}

  const originalWidth = restRect.value.width
  const motion = p * p * (3 - 2 * p)
  const { isDesktop, maxScale } = getExpandMetrics(originalWidth)
  const scaleX = 1 + (maxScale - 1) * motion

  const extraHeight = restRect.value.height * (scaleX - 1)
  const maxExtraHeight = restRect.value.height * Math.max(maxScale - 1, 0)
  const breathingRoom = (isDesktop ? 72 : 46) * motion
  let marginNeeded = extraHeight + breathingRoom

  if (isLastExpandImage.value) {
    const bottomGuard = maxExtraHeight * 0.92 + (isDesktop ? 58 : 40)
    marginNeeded = Math.max(marginNeeded, bottomGuard)
  }

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
  border-radius: 12px;
  object-fit: cover;
  will-change: transform, border-radius;
  transform-origin: top center;
  backface-visibility: hidden;
}
</style>
