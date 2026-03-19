<script setup lang="ts">
import { Icon } from '@iconify/vue'

const isVisible = ref(false)

const onScroll = () => {
  isVisible.value = window.scrollY > 400
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <Transition name="fade-up">
    <button
      v-if="isVisible"
      type="button"
      class="back-to-top"
      aria-label="Back to top"
      @click="scrollToTop"
    >
      <Icon icon="lucide:arrow-up" />
    </button>
  </Transition>
</template>

<style scoped>
.back-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 40;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  border: 1px solid var(--border);
  background: color-mix(in srgb, var(--bg-primary) 85%, transparent);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  color: var(--fg-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-to-top:hover {
  color: var(--accent);
  border-color: var(--accent);
  transform: translateY(-2px);
}

.back-to-top:active {
  transform: translateY(0);
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.3s ease;
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (prefers-reduced-motion: reduce) {
  .back-to-top {
    transition: none;
  }

  .fade-up-enter-active,
  .fade-up-leave-active {
    transition: none;
  }
}
</style>
