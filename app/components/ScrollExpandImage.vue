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
  /**
   * When true and `caption` is empty, still reserves one caption line of vertical space
   * so paired gallery cells align (e.g. two-column project galleries).
   */
  reserveCaptionGutter?: boolean
  /**
   * `fillWidth` — default: image fills the block width (`w-full` + `object-cover`).
   * `fillBox` — image fits its parent cell (`max-w-100%`, `max-h-95vh`, aspect preserved, no crop).
   */
  fitMode?: 'fillWidth' | 'fillBox'
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  preExpanded: false,
  minScale: 0.92,
  maxScale: 1,
  caption: undefined,
  layout: 'medium',
  imgSizes: '(max-width: 1024px) 100vw, min(80rem, 92vw)',
  reserveCaptionGutter: false,
  fitMode: 'fillWidth',
})

const emit = defineEmits<{
  aspect: [ratio: number]
}>()

function emitAspectFromImg(img: HTMLImageElement | null) {
  if (!img) return
  const w = img.naturalWidth
  const h = img.naturalHeight
  if (w > 0 && h > 0) emit('aspect', w / h)
}

function onImageLoad(event: Event) {
  emitAspectFromImg(event.target as HTMLImageElement | null)
}

const elementRef = ref<HTMLElement | null>(null)
const frameRef = ref<HTMLElement | null>(null)
const captionRef = ref<HTMLElement | null>(null)

onMounted(() => {
  const img = elementRef.value?.querySelector('img') ?? null
  if (img?.complete) emitAspectFromImg(img)
})

const { scale, displayedOpacity } = useScrollExpandImage(elementRef, {
  minScale: props.minScale,
  maxScale: props.maxScale,
  preExpanded: props.preExpanded,
})

const scaleProgress = computed(() => {
  const range = props.maxScale - props.minScale
  if (Math.abs(range) < 0.0001) return 1
  return (scale.value - props.minScale) / range
})

const opacityProgress = computed(() => (displayedOpacity.value - 0.25) / 0.75)

usePausedProgressAnimation(frameRef, {
  keyframes: computed(() => [
    { transform: `scale(${props.minScale})` },
    { transform: `scale(${props.maxScale})` },
  ]),
  progress: scaleProgress,
})

usePausedProgressAnimation(frameRef, {
  keyframes: [
    { opacity: 0.25 },
    { opacity: 1 },
  ],
  progress: opacityProgress,
})

usePausedProgressAnimation(captionRef, {
  keyframes: [
    { opacity: 0.25 },
    { opacity: 1 },
  ],
  progress: opacityProgress,
})

const layoutClass = computed(() => {
  if (props.fitMode === 'fillBox') {
    return 'w-full min-w-0 max-w-full'
  }
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

const imageClass = computed(() => {
  if (props.fitMode === 'fillBox') {
    return 'block w-full h-auto'
  }
  return 'w-full object-cover'
})

const innerFrameClass = computed(() => {
  if (props.fitMode === 'fillBox') {
    return 'w-full overflow-hidden rounded-lg'
  }
  return 'overflow-hidden rounded-lg'
})
</script>

<template>
  <div
    ref="elementRef"
    :class="['scroll-expand-image', layoutClass]"
  >
    <div
      ref="frameRef"
      :class="['scroll-expand-image__frame', innerFrameClass]"
    >
      <SanityImage
        :src="src"
        :alt="alt"
        :sizes="imgSizes"
        :class="imageClass"
        loading="lazy"
        decoding="async"
        @load="onImageLoad"
      />
    </div>
    <p
      v-if="caption"
      ref="captionRef"
      class="scroll-expand-image__caption mt-3 text-center text-sm"
    >
      {{ caption }}
    </p>
    <p
      v-else-if="reserveCaptionGutter"
      class="scroll-expand-image__caption-gutter mt-3 text-center text-sm text-transparent"
      aria-hidden="true"
    >
      &nbsp;
    </p>
  </div>
</template>

<style scoped>
.scroll-expand-image {
  will-change: transform, opacity;
}

:global(html.firefox) .scroll-expand-image {
  will-change: auto;
}

.scroll-expand-image__frame {
  transition: transform 0.1s ease-out, opacity 0.15s ease-out;
}

.scroll-expand-image__caption {
  color: var(--fg-muted);
}

@media (prefers-reduced-motion: reduce) {
  .scroll-expand-image {
    transform: none !important;
    opacity: 1 !important;
    transition: none !important;
  }
}

/* Matches text-sm line box so the gutter matches real caption height. */
.scroll-expand-image__caption-gutter {
  min-height: 1.25em;
  margin: 0;
  user-select: none;
}
</style>
