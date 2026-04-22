<script setup lang="ts">
import { useScrollLayoutSubscription, useSharedScrollY } from '~/composables/useScrollLayoutBus'

const filterId = useId().replace(/:/g, '')
const sharedScrollY = useSharedScrollY()
const scrollPhaseS = ref(0)
const isReducedMotion = ref(false)

let mq: MediaQueryList | null = null

function updatePhase() {
  const maxY = Math.max(
    1,
    document.documentElement.scrollHeight - window.innerHeight,
  )
  const t = (sharedScrollY.value / maxY) * 18
  scrollPhaseS.value = t % 18
}

useScrollLayoutSubscription(() => {
  updatePhase()
})

const animStyle = computed(() => {
  if (isReducedMotion.value) return {}
  return { animationDelay: `${-scrollPhaseS.value}s` }
})

function onMqChange() {
  isReducedMotion.value = mq?.matches ?? false
}

onMounted(() => {
  if (!import.meta.client) return
  mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  isReducedMotion.value = mq.matches
  mq.addEventListener('change', onMqChange)
})

onUnmounted(() => {
  mq?.removeEventListener('change', onMqChange)
})
</script>

<template>
  <div class="grain-root" aria-hidden="true">
    <svg class="grain-svg-defs" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter
          :id="filterId"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          color-interpolation-filters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.78"
            numOctaves="3"
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix
            in="noise"
            type="saturate"
            values="0"
            result="mono"
          />
        </filter>
      </defs>
    </svg>
    <div
      class="grain-anim"
      :class="{ 'grain-anim--reduced': isReducedMotion }"
      :style="animStyle"
    >
      <div class="grain-surface" :style="{ filter: `url(#${filterId})` }" />
    </div>
  </div>
</template>

<style scoped>
.grain-root {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.grain-svg-defs {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
}

.grain-anim {
  position: absolute;
  inset: 0;
  animation: grain-breathe 18s ease-in-out infinite;
}

.grain-anim--reduced {
  animation: none;
  opacity: 0.055;
}

.grain-surface {
  position: absolute;
  inset: -25%;
  width: 150%;
  height: 150%;
  background: #0a0a0a;
  mix-blend-mode: multiply;
}

:global(html.dark) .grain-surface {
  mix-blend-mode: overlay;
  background: #888;
}

@keyframes grain-breathe {
  0%,
  100% {
    opacity: 0.032;
  }

  50% {
    opacity: 0.11;
  }
}

:global(html.dark) .grain-anim:not(.grain-anim--reduced) {
  animation-name: grain-breathe-dark;
}

@keyframes grain-breathe-dark {
  0%,
  100% {
    opacity: 0.05;
  }

  50% {
    opacity: 0.16;
  }
}

@media (prefers-reduced-motion: reduce) {
  .grain-anim {
    animation: none;
    opacity: 0.06;
  }

  :global(html.dark) .grain-anim {
    opacity: 0.08;
  }
}
</style>
