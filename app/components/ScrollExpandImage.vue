<script setup lang="ts">
interface Props {
  src: string
  alt?: string
  preExpanded?: boolean
  minScale?: number
  maxScale?: number
  caption?: string
  layout?: 'full' | 'large' | 'medium'
  /** Passed to `<NuxtImg sizes>` for responsive srcset */
  imgSizes?: string
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  preExpanded: false,
  minScale: 0.92,
  maxScale: 1,
  caption: undefined,
  layout: 'medium',
  imgSizes: '(max-width: 1024px) 100vw, min(80rem, 92vw)',
})

const elementRef = ref<HTMLElement | null>(null)

const { scale, displayedOpacity } = useScrollExpandImage(elementRef, {
  minScale: props.minScale,
  maxScale: props.maxScale,
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
      <SanityImage
        :src="src"
        :alt="alt"
        :sizes="imgSizes"
        class="w-full object-cover"
        loading="lazy"
        decoding="async"
      />
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
