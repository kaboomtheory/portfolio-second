<script setup lang="ts">
import { useScrollLayoutSubscription, useSharedScrollY } from '~/composables/useScrollLayoutBus'

const filterId = 'grain-filter'
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
const { styleAttr: animStyleAttr, styleId: animStyleId } = useCspTargetStyle(() => animStyle.value)

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
            baseFrequency="0.68"
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
          <!-- Bias noise toward mid-gray so multiply / overlay read as texture, not soot or snow. -->
          <feColorMatrix
            in="mono"
            type="matrix"
            values="0.4 0 0 0 0.3
                    0 0.4 0 0 0.3
                    0 0 0.4 0 0.3
                    0 0 0 1 0"
          />
        </filter>
      </defs>
    </svg>
    <div
      class="grain-anim"
      :class="{ 'grain-anim--reduced': isReducedMotion }"
      v-bind:[animStyleAttr]="animStyleId"
    >
      <div class="grain-surface" />
    </div>
  </div>
</template>

<style scoped>
.grain-root {
  position: fixed;
  inset: 0;
  /* Below in-flow page content — see `.page-content--home` (z-index: 0) in main.css. */
  z-index: -1;
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
  opacity: 0.07;
}

.grain-surface {
  position: absolute;
  inset: -25%;
  width: 150%;
  height: 150%;
  filter: url(#grain-filter);
  /* Tint toward theme ink so multiply tints pastels gently instead of a gray wash */
  background: color-mix(in srgb, var(--ink) 14%, var(--paper));
  mix-blend-mode: multiply;
}

@keyframes grain-breathe {
  0%,
  100% {
    opacity: 0.045;
  }

  50% {
    opacity: 0.125;
  }
}

@media (prefers-reduced-motion: reduce) {
  .grain-anim {
    animation: none;
    opacity: 0.06;
  }

}
</style>

<style>
/**
 * Unscoped: Vue scopes @keyframes names; `html.dark` rules here reference these globals.
 * Dark mode avoids mix-blend on the grain plane: inside `.page-content--home`’s
 * `isolation: isolate`, blend backdrops are effectively empty, so overlay/multiply
 * turns into a flat veil and hides pastel section fills.
 */
@keyframes grain-breathe-dark {
  0%,
  100% {
    opacity: 0.07;
  }

  50% {
    opacity: 0.14;
  }
}

html.dark .grain-surface {
  mix-blend-mode: normal;
  /* Slightly lifted from shell so filtered noise reads; alpha comes from `.grain-anim` opacity. */
  background: color-mix(in srgb, var(--ink) 12%, var(--paper));
}

html.dark .grain-anim:not(.grain-anim--reduced) {
  animation-name: grain-breathe-dark;
}

html.dark .grain-anim--reduced {
  opacity: 0.09;
}

@media (prefers-reduced-motion: reduce) {
  html.dark .grain-anim {
    opacity: 0.075;
  }
}
</style>
