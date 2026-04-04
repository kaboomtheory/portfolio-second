<script setup lang="ts">
import type { ProjectItem } from '~/types/project'

const props = defineProps<{
  project: ProjectItem
  class?: string
}>()

const displayTags = computed(() => (props.project.tags ?? []).slice(0, 4))
</script>

<template>
  <div :class="['project-card group relative', props.class]">
    <NuxtLink
      class="project-card-link flex h-full flex-col rounded-lg bg-[var(--bg-primary)] p-3 shadow-sm transition-[box-shadow,transform] duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg-primary)]"
      :to="`/projects/${project.slug}`"
    >
      <div class="relative min-h-0 shrink-0 overflow-hidden rounded-lg aspect-[4/3]">
        <img
          :src="project.thumbnail"
          :alt="project.name"
          class="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          loading="lazy"
        >
      </div>

      <div class="flex min-h-0 flex-1 flex-col gap-3 px-0.5 pb-1 pt-4">
        <h3 class="min-w-0 text-lg font-semibold leading-snug tracking-tight text-[var(--fg-primary)] transition-colors duration-300 group-hover:text-[var(--emphasis)] md:text-xl">
          {{ project.name }}
        </h3>

        <p
          v-if="project.summary"
          class="line-clamp-2 text-sm leading-relaxed text-[var(--fg-secondary)]"
        >
          {{ project.summary }}
        </p>

        <ul
          v-if="displayTags.length"
          class="flex list-none flex-wrap gap-1.5 p-0"
          aria-label="Project tags"
        >
          <li v-for="tag in displayTags" :key="tag">
            <span class="tag-chip">{{ tag }}</span>
          </li>
        </ul>
      </div>
    </NuxtLink>
  </div>
</template>

<style scoped>
.project-card {
  transform: translateY(0);
}

.project-card-link {
  height: 100%;
  border: var(--card-border);
  box-shadow: var(--card-ring);
  backdrop-filter: blur(15px) saturate(1.2);
  -webkit-backdrop-filter: blur(15px) saturate(1.2);
}

.project-card-link:hover {
  box-shadow: var(--card-ring), var(--shadow-lg);
  transform: translateY(-4px);
}

@media (prefers-reduced-motion: reduce) {
  .project-card-link:hover {
    transform: none;
  }

  .project-card-link img {
    transition: none;
  }
}
</style>
