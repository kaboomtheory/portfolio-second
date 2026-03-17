<script setup lang="ts">
interface Props {
  src: string
  alt?: string
  preExpanded?: boolean
  minScale?: number
  maxScale?: number
  caption?: string
  layout?: 'full' | 'large' | 'medium'
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  preExpanded: false,
  minScale: 0.92,
  maxScale: 1,
  caption: undefined,
  layout: 'medium',
})

const elementRef = ref<HTMLElement | null>(null)

const { scale, progress } = useScrollExpand(elementRef, {
  minScale: props.minScale,
  maxScale: props.maxScale,
  preExpanded: props.preExpanded,
})

const { displayedOpacity } = useScrollOpacity(elementRef, {
  preExpanded: props.preExpanded,
})

const containerStyle = computed(() => ({
  opacity: displayedOpacity.value,
  transform: `scale(${scale.value})`,
  transition: 'transform 0.1s ease-out, opacity 0.15s ease-out',
}))

const layoutClass = computed(() => {
  switch (props.layout) {
    case 'full':
      return 'max-w-full'
    case 'large':
      return 'max-w-5xl mx-auto'
    case 'medium':
    default:
      return 'max-w-3xl mx-auto'
  }
})
</script>

<template>
  <div
    ref="elementRef"
    :class="['scroll-expand-image', layoutClass]"
  >
    <div
      class="overflow-hidden rounded-lg"
      :style="containerStyle"
    >
      <img
        :src="src"
        :alt="alt"
        class="w-full object-cover"
        loading="lazy"
      >
    </div>
    <p
      v-if="caption"
      class="mt-3 text-center text-sm"
      :style="{ color: 'var(--fg-muted)', opacity: displayedOpacity }"
    >
      {{ caption }}
    </p>
  </div>
</template>

<style scoped>
.scroll-expand-image {
  will-change: transform, opacity;
}

@media (prefers-reduced-motion: reduce) {
  .scroll-expand-image {
    transform: none !important;
    opacity: 1 !important;
    transition: none !important;
  }
}
</style>
