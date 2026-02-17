<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { ProjectItem } from '~/data/projects'

defineProps<{
  project: ProjectItem
}>()
</script>

<template>
  <NuxtLink
    class="group relative block aspect-[4/3] overflow-hidden rounded-lg"
    :to="`/projects/${project.slug}`"
  >
    <img
      :src="project.thumbnail"
      :alt="project.name"
      class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      loading="lazy"
    >
    <div
      class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90"
    />
    <div class="absolute inset-x-0 bottom-0 p-5">
      <div class="flex items-end justify-between gap-3">
        <div class="space-y-1">
          <p class="text-xs uppercase tracking-[0.08em] text-white/70">
            {{ project.category }} • {{ project.year }}
          </p>
          <h3 class="text-xl font-semibold text-white">
            {{ project.name }}
          </h3>
        </div>
        <span
          class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all duration-300 group-hover:bg-white group-hover:text-black"
        >
          <Icon icon="lucide:arrow-up-right" class="text-lg" />
        </span>
      </div>
    </div>
  </NuxtLink>
</template>
