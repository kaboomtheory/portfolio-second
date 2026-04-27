<script setup lang="ts">
import { activeSectionSignalKey } from '~/composables/useActiveSectionSignal'
import { useScrollLayoutSubscription, useSharedScrollMax, useSharedScrollY } from '~/composables/useScrollLayoutBus'

const scrollY = useSharedScrollY()
const maxScroll = useSharedScrollMax()
const hasMounted = ref(false)
const isReducedMotion = ref(false)
const isCoarsePointer = ref(false)

const activeSection = inject(activeSectionSignalKey)
if (!activeSection) {
  throw new Error('ScrollDriftLayer requires activeSectionSignalKey from default layout')
}
const blobAStyle = computed(() => buildBlobStyle(1))
const blobBStyle = computed(() => buildBlobStyle(-0.55))
const activeSectionClass = computed(() => `scroll-drift-root--${activeSection.activeSectionId.value}`)
const { styleAttr: blobAStyleAttr, styleId: blobAStyleId } = useCspTargetStyle(() => blobAStyle.value)
const { styleAttr: blobBStyleAttr, styleId: blobBStyleId } = useCspTargetStyle(() => blobBStyle.value)

function buildBlobStyle(direction: number) {
  if (isReducedMotion.value) return {}
  const max = Math.max(1, maxScroll.value)
  const t = Math.min(1, Math.max(0, scrollY.value / max))
  const x = (t - 0.5) * 2 * 14 * direction
  const y = t * 10 * direction
  return { transform: `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)` }
}

let mqMotion: MediaQueryList | null = null
let mqPointer: MediaQueryList | null = null

function syncMedia() {
  isReducedMotion.value = mqMotion?.matches ?? false
  isCoarsePointer.value = mqPointer?.matches ?? false
}

useScrollLayoutSubscription(() => {
  /* Keeps scroll layout bus + shared refs warm on every route (Grain is home-only). */
})

onMounted(() => {
  if (!import.meta.client) return
  mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  mqPointer = window.matchMedia('(pointer: coarse)')
  syncMedia()
  hasMounted.value = true
  mqMotion.addEventListener('change', syncMedia)
  mqPointer.addEventListener('change', syncMedia)
})

onUnmounted(() => {
  mqMotion?.removeEventListener('change', syncMedia)
  mqPointer?.removeEventListener('change', syncMedia)
})
</script>

<template>
  <div
    v-if="hasMounted && !isReducedMotion && !isCoarsePointer"
    class="scroll-drift-root pointer-events-none absolute inset-0 z-0 overflow-hidden"
    :class="activeSectionClass"
    aria-hidden="true"
  >
    <div
      class="scroll-drift-blob scroll-drift-blob--a"
      v-bind:[blobAStyleAttr]="blobAStyleId"
    />
    <div
      class="scroll-drift-blob scroll-drift-blob--b"
      v-bind:[blobBStyleAttr]="blobBStyleId"
    />
  </div>
</template>

<style scoped>
.scroll-drift-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(72px);
  will-change: transform;
  pointer-events: none;
}

.scroll-drift-root {
  /* smooth crossfade when section signal changes */
  transition: --blob-signal 800ms ease;
}

.scroll-drift-root--intro {
  --blob-signal: var(--signal-sky);
}

.scroll-drift-root--work,
.scroll-drift-root--experience,
.scroll-drift-root--contact {
  --blob-signal: var(--signal-mint);
}

.scroll-drift-root--story {
  --blob-signal: var(--signal-peach);
}

.scroll-drift-root--status {
  --blob-signal: var(--signal-blush);
}

.scroll-drift-blob--a {
  width: min(58vw, 42rem);
  height: min(48vw, 36rem);
  right: -8%;
  top: 6%;
  background: radial-gradient(
    circle at 40% 40%,
    color-mix(in srgb, var(--pastel-ink) 7%, var(--paper)) 0%,
    color-mix(in srgb, var(--blob-signal, var(--signal-sky)) 5%, transparent) 42%,
    transparent 70%
  );
  opacity: 0.55;
}

.scroll-drift-blob--b {
  width: min(52vw, 38rem);
  height: min(44vw, 32rem);
  left: -6%;
  bottom: 10%;
  background: radial-gradient(
    circle at 55% 55%,
    color-mix(in srgb, var(--emphasis) 5%, var(--paper)) 0%,
    color-mix(in srgb, var(--blob-signal, var(--pastel-ink)) 4%, transparent) 45%,
    transparent 72%
  );
  opacity: 0.4;
}

html.dark .scroll-drift-blob--a {
  background: radial-gradient(
    circle at 40% 40%,
    color-mix(in srgb, var(--pastel-ink) 10%, var(--paper)) 0%,
    color-mix(in srgb, var(--blob-signal, var(--fg-muted)) 5%, transparent) 48%,
    transparent 72%
  );
  opacity: 0.35;
}

html.dark .scroll-drift-blob--b {
  background: radial-gradient(
    circle at 55% 55%,
    color-mix(in srgb, var(--emphasis) 7%, var(--paper)) 0%,
    color-mix(in srgb, var(--blob-signal, var(--pastel-ink)) 5%, transparent) 50%,
    transparent 74%
  );
  opacity: 0.32;
}
</style>
