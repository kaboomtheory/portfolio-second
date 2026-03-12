<script setup lang="ts">
const props = withDefaults(defineProps<{
  src: string
  alt: string
  preExpanded?: boolean
  height?: string
}>(), {
  preExpanded: false,
  height: '95vh',
})

const wrapperRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLImageElement | null>(null)
const { progress, visibility } = useScrollExpand(wrapperRef, {
  preloadDistance: 420,
  centerHold: 96,
  influenceMultiplier: 1.8,
  edgeFadeStart: 0.56,
  edgeFadeEnd: 0.12,
})

function onImageLoad() {
  // Image loaded
}

const expandStyle = computed(() => {
  const motion = progress.value * progress.value * (3 - 2 * progress.value)
  const opacity = Math.max(0, Math.min(1, visibility.value))
  const borderRadius = Math.round(14 - 8 * motion)

  return {
    borderRadius: `${borderRadius}px`,
    opacity: opacity.toFixed(3),
  }
})
</script>

<template>
  <div ref="wrapperRef" class="scroll-expand-wrapper" :style="{ height: props.height }">
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
  height: 100%;
  border-radius: 14px;
  object-fit: cover;
  will-change: opacity, border-radius;
  backface-visibility: hidden;
  opacity: 0;
}
</style>