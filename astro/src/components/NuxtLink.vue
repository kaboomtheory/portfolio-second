<script setup lang="ts">
import { computed } from 'vue'

/** Plain anchor stand-in for NuxtLink: Astro pages are separate documents. */
const props = defineProps<{ to: string | { path?: string; hash?: string } }>()

const href = computed(() =>
  typeof props.to === 'string' ? props.to : `${props.to.path || '/'}${props.to.hash || ''}`,
)
</script>

<template>
  <a :href="href"><slot /></a>
</template>
