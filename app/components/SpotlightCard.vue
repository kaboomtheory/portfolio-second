<script setup lang="ts">
import { ref } from 'vue'

const cardRef = ref<HTMLElement | null>(null)
const mouseX = ref(0)
const mouseY = ref(0)

const handleMouseMove = (e: MouseEvent) => {
  if (!cardRef.value) return
  const rect = cardRef.value.getBoundingClientRect()
  mouseX.value = e.clientX - rect.left
  mouseY.value = e.clientY - rect.top
}
</script>

<template>
  <div
    ref="cardRef"
    class="spotlight-card group relative overflow-hidden rounded-sm border border-[var(--border)] bg-[var(--bg-secondary)] transition-colors hover:bg-[var(--bg-tertiary)]"
    @mousemove="handleMouseMove"
    :style="{
      '--mouse-x': `${mouseX}px`,
      '--mouse-y': `${mouseY}px`
    }"
  >
    <!-- Spotlight Overlay -->
    <div
      class="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      :style="{
        background: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), var(--accent-soft), transparent 40%)`,
        opacity: 0.15
      }"
    />
    
    <!-- Content -->
    <div class="relative z-10 h-full">
      <slot />
    </div>
  </div>
</template>

<style scoped>
/* Scoped styles if needed */
</style>
