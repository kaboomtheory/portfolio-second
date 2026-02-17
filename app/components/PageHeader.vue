<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  subtitle?: string
}>()
</script>

<template>
  <section class="page-section reveal-up">
    <h1 class="text-4xl leading-tight md:text-5xl">{{ title }}</h1>
    <p v-if="subtitle" class="mt-3 text-lg" :style="{ color: 'var(--fg-primary)' }">{{ subtitle }}</p>
    <p v-if="description" class="mt-4 max-w-3xl text-base">{{ description }}</p>
  </section>
</template>
