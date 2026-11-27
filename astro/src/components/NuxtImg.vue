<script setup lang="ts">
/** Plain <img> stand-in for NuxtImg (local assets are already WebP-optimized). */
defineProps<{ src: string }>()
</script>

<template>
  <img :src="src">
</template>
