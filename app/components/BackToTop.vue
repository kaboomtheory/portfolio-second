<script setup lang="ts">
import { Icon } from '@iconify/vue'

const isVisible = ref(false)

const onScroll = () => {
  isVisible.value = window.scrollY > 280
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
      class="back-to-top shiny-cta"
      aria-label="Back to top"
      @click="scrollToTop"
    >
      <span class="shiny-cta-inner">
        <Icon icon="lucide:arrow-up" aria-hidden="true" />
      </span>
    </button>
  </Transition>
</template>

<style scoped>
.back-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 40;
  border-radius: 9999px;
  cursor: pointer;
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
  .fade-up-enter-active,
  .fade-up-leave-active {
    transition: none;
  }
}
</style>
