<script setup lang="ts">
/** GPU-cheap fallback when prefers-reduced-motion or before WebGL chunk loads */
const { isDark } = useTheme()
</script>

<template>
  <div
    class="organic-background-static"
    :class="{ 'organic-background-static--dark': isDark }"
    aria-hidden="true"
  />
</template>

<style scoped>
.organic-background-static {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  transform: scale(1.09);
  transform-origin: center center;
  filter: blur(5px);
  background: radial-gradient(
      120% 80% at 50% 20%,
      #e8f0f8 0%,
      #d0e4f4 35%,
      #b8d4e8 70%,
      #ffffff 100%
    );
}

.organic-background-static--dark {
  filter: blur(4px);
  background: radial-gradient(
      100% 90% at 50% 85%,
      #80abe6 0%,
      #0a1628 45%,
      #000000 100%
    );
}
</style>
