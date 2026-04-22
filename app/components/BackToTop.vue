<script setup lang="ts">
import { Icon } from '@iconify/vue'

const isVisible = ref(false)

const onScroll = () => {
  isVisible.value = window.scrollY > 280
}

function prefersReducedMotion() {
  if (!import.meta.client) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
  })
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <Transition name="fade-up">
    <button
      v-if="isVisible"
      type="button"
      class="back-to-top cta-attention-pill"
      aria-label="Back to top"
      @click="scrollToTop"
    >
      <span class="cta-attention-pill__inner">
        <Icon icon="lucide:arrow-up" aria-hidden="true" />
      </span>
    </button>
  </Transition>
</template>

<style scoped>
.back-to-top {
  position: fixed;
  right: max(1rem, env(safe-area-inset-right, 0px));
  bottom: max(1rem, env(safe-area-inset-bottom, 0px));
  z-index: 40;
  border-radius: var(--radius-control, 0.35rem);
  cursor: pointer;
}

@media (min-width: 640px) {
  .back-to-top {
    right: max(1.5rem, env(safe-area-inset-right, 0px));
    bottom: max(1.5rem, env(safe-area-inset-bottom, 0px));
  }
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
}
</style>
