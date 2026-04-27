<script setup lang="ts">
import { computed } from 'vue'
import {
  useSharedScrollY,
  useSharedScrollMax,
  useScrollLayoutSubscription,
} from '~/composables/useScrollLayoutBus'

const scrollY = useSharedScrollY()
const maxScroll = useSharedScrollMax()

useScrollLayoutSubscription(() => {})

const progress = computed(() => Math.min(1, Math.max(0, scrollY.value / maxScroll.value)))
const visible = computed(() => progress.value > 0.03)
const { styleAttr, styleId } = useCspTargetStyle(() => ({
  transform: `scaleX(${progress.value})`,
}))
</script>

<template>
  <div
    class="scroll-progress"
    :class="{ 'scroll-progress--visible': visible }"
    v-bind:[styleAttr]="styleId"
    aria-hidden="true"
  />
</template>

<style scoped>
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 200;
  width: 100%;
  height: 2px;
  background: var(--signal);
  transform-origin: left;
  transform: scaleX(0);
  opacity: 0;
  pointer-events: none;
  transition: opacity 300ms var(--motion-ease-standard, cubic-bezier(0.25, 0.46, 0.45, 0.94));
}

.scroll-progress--visible {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .scroll-progress {
    transition: none;
  }
}
</style>
