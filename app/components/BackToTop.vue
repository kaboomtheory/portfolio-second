<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import {
  useSharedScrollY,
  useScrollLayoutSubscription,
} from '~/composables/useScrollLayoutBus'

const isVisible = ref(false)
const docHeight = ref(0)
const innerHeight = ref(0)

const scrollY = useSharedScrollY()

useScrollLayoutSubscription((source) => {
  if (!import.meta.client) return
  if (source === 'resize' || source === 'init') {
    docHeight.value = document.documentElement.scrollHeight
    innerHeight.value = window.innerHeight
  }
  isVisible.value = scrollY.value > 280
})

const max = computed(() => Math.max(1, docHeight.value - innerHeight.value))
const progress = computed(() => Math.min(1, Math.max(0, scrollY.value / max.value)))

const RADIUS = 22
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const dashOffset = computed(() => CIRCUMFERENCE * (1 - progress.value))

function prefersReducedMotion() {
  if (!import.meta.client) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}
</script>

<template>
  <Transition name="fade-up">
    <div v-if="isVisible" class="back-to-top-shell">
      <!-- SVG progress ring -->
      <svg
        class="btt-ring"
        viewBox="0 0 52 52"
        aria-hidden="true"
        focusable="false"
      >
        <circle
          class="btt-ring-track"
          cx="26"
          cy="26"
          :r="RADIUS"
        />
        <circle
          class="btt-ring-fill"
          cx="26"
          cy="26"
          :r="RADIUS"
          :stroke-dasharray="CIRCUMFERENCE"
          :stroke-dashoffset="dashOffset"
        />
      </svg>

      <button
        type="button"
        class="back-to-top cta-attention-pill"
        aria-label="Back to top"
        @click="scrollToTop"
      >
        <span class="cta-attention-pill__inner">
          <Icon icon="lucide:arrow-up" aria-hidden="true" />
        </span>
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.back-to-top-shell {
  position: fixed;
  right: max(1rem, env(safe-area-inset-right, 0px));
  bottom: max(1rem, env(safe-area-inset-bottom, 0px));
  z-index: 40;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

@media (min-width: 640px) {
  .back-to-top-shell {
    right: max(1.5rem, env(safe-area-inset-right, 0px));
    bottom: max(1.5rem, env(safe-area-inset-bottom, 0px));
  }
}

/* Make the button compact and circular for the ring to fit */
.back-to-top {
  position: relative;
  border-radius: 999px !important;
  padding: 0.6rem !important;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* SVG ring positioned around the button */
.btt-ring {
  position: absolute;
  inset: -5px;
  width: calc(100% + 10px);
  height: calc(100% + 10px);
  pointer-events: none;
  overflow: visible;
  transform: rotate(-90deg);
}

.btt-ring-track {
  fill: none;
  stroke: color-mix(in srgb, var(--signal) 20%, transparent);
  stroke-width: 2;
}

.btt-ring-fill {
  fill: none;
  stroke: var(--signal);
  stroke-width: 2;
  stroke-linecap: round;
}

.fade-up-enter-active {
  transition:
    opacity 0.26s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.26s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-up-leave-active {
  transition:
    opacity 0.18s cubic-bezier(0.7, 0, 0.84, 0),
    transform 0.18s cubic-bezier(0.7, 0, 0.84, 0);
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translate3d(0, 10px, 0);
}

@media (prefers-reduced-motion: reduce) {
  .fade-up-enter-active,
  .fade-up-leave-active {
    transition: none;
  }

  .btt-ring {
    display: none;
  }
}
</style>
