<script setup lang="ts">
const props = defineProps<{
  src: string
  alt: string
}>()

const wrapperRef = ref<HTMLElement | null>(null)
const { progress } = useScrollExpand(wrapperRef)

/**
 * Cache the wrapper's rest geometry (before any expansion) to
 * avoid feedback loops where the expanded size feeds back into calcs.
 */
const restRect = ref({ width: 0, left: 0 })

onMounted(() => {
  const el = wrapperRef.value
  if (el) {
    const r = el.getBoundingClientRect()
    restRect.value = { width: r.width, left: r.left }
  }
})

const expandStyle = computed(() => {
  const p = progress.value
  if (p <= 0.001 || !restRect.value.width) return {}

  const viewportW = window.innerWidth
  const viewportH = window.innerHeight

  // On md+ screens the sidebar is fixed at 256px (md:w-64).
  const sidebarW = window.matchMedia('(min-width: 768px)').matches ? 256 : 0

  // Available content area the image can fill
  const availableWidth = viewportW - sidebarW
  const originalWidth = restRect.value.width
  const originalLeft = restRect.value.left

  // Interpolate width from original to full available
  const targetWidth = originalWidth + (availableWidth - originalWidth) * p

  // CSS width grows rightward from the element's left edge.
  // To keep the expansion centered, shift left by half the width delta,
  // then add any offset needed to center in the available area.
  const widthDelta = targetWidth - originalWidth
  const availableCenterX = sidebarW + availableWidth / 2
  const originalCenterX = originalLeft + originalWidth / 2
  const centerOffset = (availableCenterX - originalCenterX) * p
  const translateX = -widthDelta / 2 + centerOffset

  const borderRadius = `${(1 - p) * 12}px`

  // Scale height toward a viewport-proportional target
  const targetHeight = viewportH * 0.85
  const naturalHeight = targetWidth * (9 / 16)
  const height = naturalHeight + (targetHeight - naturalHeight) * p

  return {
    width: `${targetWidth}px`,
    maxWidth: 'none',
    height: `${Math.min(height, targetHeight)}px`,
    borderRadius,
    transform: `translateX(${translateX}px)`,
    objectFit: 'cover' as const,
    willChange: 'transform, width, height, border-radius',
  }
})
</script>

<template>
  <div ref="wrapperRef" class="scroll-expand-wrapper">
    <img
      :src="props.src"
      :alt="props.alt"
      class="scroll-expand-img"
      :style="expandStyle"
      loading="lazy"
    >
  </div>
</template>

<style scoped>
.scroll-expand-wrapper {
  position: relative;
  overflow: visible;
}

.scroll-expand-img {
  display: block;
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
  will-change: transform, width, height, border-radius;
  transition: width 0.15s ease-out, height 0.15s ease-out, border-radius 0.15s ease-out, transform 0.15s ease-out;
}
</style>
