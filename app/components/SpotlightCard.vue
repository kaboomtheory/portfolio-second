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
    class="spotlight-card group relative overflow-hidden rounded-lg text-[color:var(--pastel-ink)]"
    @mousemove="handleMouseMove"
    :style="{
      '--mouse-x': `${mouseX}px`,
      '--mouse-y': `${mouseY}px`
    }"
  >
    <!-- Spotlight Overlay -->
    <div
      class="spotlight-card__glow pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100"
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
.spotlight-card {
  background-color: var(--pastel-peach);
  transition:
    background-color 0.28s cubic-bezier(0.25, 1, 0.5, 1),
    box-shadow 0.28s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.24s cubic-bezier(0.22, 1, 0.36, 1);
}

.spotlight-card:hover {
  background-color: var(--pastel-mint);
  transform: translate3d(0, -2px, 0);
  box-shadow: var(--shadow-md);
}

.spotlight-card__glow {
  transition: opacity 0.32s cubic-bezier(0.25, 1, 0.5, 1);
}

@media (prefers-reduced-motion: reduce) {
  .spotlight-card {
    transition: background-color 0.01ms;
  }

  .spotlight-card:hover {
    transform: none;
    box-shadow: none;
  }

  .spotlight-card__glow {
    transition: none;
  }
}
</style>
