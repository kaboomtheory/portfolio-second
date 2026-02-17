<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { ProjectItem } from '~/data/projects'

defineProps<{
  project: ProjectItem
}>()
</script>

<template>
  <NuxtLink
    class="group block overflow-hidden rounded-xl border transition-transform duration-200 hover:-translate-y-1"
    :style="{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-secondary)' }"
    :to="`/projects/${project.slug}`"
  >
    <div class="aspect-video overflow-hidden">
      <img
        :src="project.thumbnail"
        :alt="project.name"
        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
      >
    </div>
    <div class="space-y-2 p-4">
      <h3 class="text-xl">{{ project.name }}</h3>
      <p class="text-sm">{{ project.summary }}</p>
      <div class="flex items-center justify-between text-xs uppercase tracking-[0.08em]" :style="{ color: 'var(--fg-muted)' }">
        <span>{{ project.category }} • {{ project.year }}</span>
        <span class="inline-flex items-center gap-1">
          Open <Icon icon="lucide:arrow-right" class="text-sm" />
        </span>
      </div>
    </div>
  </NuxtLink>
</template>
