<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { ProjectItem } from '~/data/projects'

const props = defineProps<{
  project: ProjectItem
  class?: string
}>()

const displayTags = computed(() => props.project.tags.slice(0, 4))
</script>

<template>
  <div :class="['project-card group relative', props.class]">
    <NuxtLink
      class="project-card-link flex h-full flex-col rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-3 shadow-sm transition-[border-color,box-shadow,transform] duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--emphasis)]"
      :to="`/projects/${project.slug}`"
    >
      <div class="relative min-h-0 shrink-0 overflow-hidden rounded-lg aspect-[4/3]">
        <img
          :src="project.thumbnail"
          :alt="project.name"
          class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          loading="lazy"
        >
      </div>

      <div class="mt-4 flex min-h-0 flex-1 flex-col gap-2.5 px-0.5 pb-0.5">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 flex-1 space-y-1">
            <p
              v-if="project.category || project.year"
              class="project-card-meta font-medium uppercase tracking-[0.1em] text-[var(--accent-soft)]"
            >
              <template v-if="project.category">{{ project.category }}</template>
              <template v-if="project.category && project.year"> · </template>
              <template v-if="project.year">{{ project.year }}</template>
            </p>
            <h3 class="text-lg font-semibold leading-snug tracking-tight text-[var(--fg-primary)] transition-colors duration-300 group-hover:text-[var(--emphasis)] md:text-xl">
              {{ project.name }}
            </h3>
          </div>
        </div>

        <p
          v-if="project.summary"
          class="line-clamp-2 text-sm leading-relaxed text-[var(--fg-secondary)]"
        >
          {{ project.summary }}
        </p>

        <ul
          v-if="displayTags.length"
          class="mt-auto flex list-none flex-wrap gap-1.5 p-0"
          aria-label="Project tags"
        >
          <li v-for="tag in displayTags" :key="tag">
            <span class="project-card-tag">{{ tag }}</span>
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
}

.project-card-meta {
  font-size: 0.6875rem;
  line-height: 1.25;
}

.project-card-link:hover {
  border-color: color-mix(in srgb, var(--emphasis) 35%, var(--border));
  box-shadow:
    0 12px 28px -16px color-mix(in srgb, var(--fg-primary) 18%, transparent),
    0 0 0 1px color-mix(in srgb, var(--emphasis) 12%, transparent),
    0 0 32px -12px color-mix(in srgb, var(--accent-2) 14%, transparent);
  transform: translateY(-4px);
}

.project-card-tag {
  display: inline-block;
  border-radius: 9999px;
  border: 1px solid var(--border);
  background: var(--bg-primary);
  padding: 0.2rem 0.55rem;
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--fg-secondary);
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
