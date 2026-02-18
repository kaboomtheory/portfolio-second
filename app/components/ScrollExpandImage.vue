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

  const viewportW = window.innerWidth
  const sidebarW = window.matchMedia('(min-width: 768px)').matches ? 256 : 0
  const availableWidth = viewportW - sidebarW

  const originalWidth = restRect.value.width
  const originalLeft = restRect.value.left

  const scaleX = 1 + ((availableWidth / originalWidth) - 1) * p

  const availableCenterX = sidebarW + availableWidth / 2
  const originalCenterX = originalLeft + originalWidth / 2
  const centerOffset = (availableCenterX - originalCenterX) * p

  const borderRadius = Math.round((1 - p) * 12)

  return {
    transform: `translateX(${centerOffset.toFixed(1)}px) scale(${scaleX.toFixed(4)})`,
    borderRadius: `${borderRadius}px`,
  }
})

const wrapperStyle = computed(() => {
  const p = progress.value
  if (p <= 0.001 || !restRect.value.height) return {}

  const viewportW = window.innerWidth
  const sidebarW = window.matchMedia('(min-width: 768px)').matches ? 256 : 0
  const availableWidth = viewportW - sidebarW

  const originalWidth = restRect.value.width
  const scaleX = 1 + ((availableWidth / originalWidth) - 1) * p

  const extraHeight = restRect.value.height * (scaleX - 1)
  const maxExtraHeight = restRect.value.height * ((availableWidth / originalWidth) - 1)
  const breathingRoom = (window.matchMedia('(min-width: 768px)').matches ? 88 : 56) * p
  let marginNeeded = extraHeight + breathingRoom

  if (isLastExpandImage.value) {
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
    const remaining = Math.max(0, maxScroll - window.scrollY)
    const nearBottomRatio = 1 - Math.min(remaining / (window.innerHeight * 0.9), 1)
    const bottomGuard = maxExtraHeight * nearBottomRatio + breathingRoom

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
  will-change: transform;
  transform-origin: top center;
  backface-visibility: hidden;
}
</style>
