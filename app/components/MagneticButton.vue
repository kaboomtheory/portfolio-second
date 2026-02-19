<script setup lang="ts">
const root = ref<HTMLElement | null>(null)
const x = ref(0)
const y = ref(0)

const handleMouseMove = (e: MouseEvent) => {
  if (!root.value) return
  const { left, top, width, height } = root.value.getBoundingClientRect()
  const centerX = left + width / 2
  const centerY = top + height / 2
  
  // Calculate distance from center
  const deltaX = e.clientX - centerX
  const deltaY = e.clientY - centerY
  
  // Apply magnetic pull (adjust divisor to change strength)
  x.value = deltaX / 4
  y.value = deltaY / 4
}

const handleMouseLeave = () => {
  x.value = 0
  y.value = 0
}
</script>

<template>
  <div
    ref="root"
    class="magnetic-button inline-block transition-transform duration-200 ease-out hover:duration-0"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
    :style="{ transform: `translate(${x}px, ${y}px)` }"
  >
    <slot />
  </div>
</template>
