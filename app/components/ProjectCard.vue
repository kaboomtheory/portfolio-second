<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { ProjectItem } from '~/types/project'

const props = withDefaults(
  defineProps<{
    project: ProjectItem
    class?: string
    /** `strip`: intrinsic card height (dashboard carousel). `default`: fill parent height. */
    layout?: 'default' | 'strip'
  }>(),
  { layout: 'default' },
)

const displayTags = computed(() => (props.project.tags ?? []).slice(0, 4))

const linkClass = computed(() => [
  'project-card-link flex flex-col bg-[var(--bg-primary)] p-3 shadow-sm transition-[box-shadow,transform] duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg-primary)]',
  props.layout === 'strip' ? 'project-card-link--strip' : 'h-full',
])

const bodyClass = computed(() =>
  props.layout === 'strip'
    ? 'flex shrink-0 flex-col gap-3 px-0.5 pb-1 pt-4'
    : 'flex min-h-0 flex-1 flex-col gap-3 px-0.5 pb-1 pt-4',
)

const summaryClass = computed(() =>
  props.layout === 'strip'
    ? 'line-clamp-3 text-sm leading-relaxed text-[var(--fg-secondary)]'
    : 'line-clamp-2 text-sm leading-relaxed text-[var(--fg-secondary)]',
)
</script>

<template>
  <div :class="['project-card group relative', props.class]">
    <NuxtLink :class="linkClass" :to="`/projects/${project.slug}`">
      <div class="project-card__media relative min-h-0 shrink-0 overflow-hidden aspect-[4/3]">
        <img
          :src="project.thumbnail"
          :alt="project.name"
          class="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          loading="lazy"
        >
        <span class="project-card__cue" aria-hidden="true">
          <span class="project-card__cue-label">View case study</span>
          <Icon icon="lucide:arrow-up-right" class="project-card__cue-icon" />
        </span>
      </div>

      <div :class="bodyClass">
        <h3 class="min-w-0 text-lg font-semibold leading-snug tracking-tight text-[var(--fg-primary)] transition-colors duration-300 group-hover:text-[var(--emphasis)] md:text-xl">
          {{ project.name }}
        </h3>

        <p
          v-if="project.summary"
          :class="summaryClass"
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
  border-radius: var(--radius-card);
  box-shadow: var(--card-ring);
  backdrop-filter: blur(15px) saturate(1.2);
  -webkit-backdrop-filter: blur(15px) saturate(1.2);
}

.project-card-link--strip {
  height: auto;
}

.project-card-link:hover {
  box-shadow: var(--card-ring), var(--shadow-lg);
  transform: translateY(-4px);
}

.project-card__media {
  border-radius: var(--radius-inner);
}

.project-card-link--strip:hover {
  transform: none;
  box-shadow: var(--card-ring), var(--shadow-md);
}

/* Hover cue pill in the top-right corner of the thumbnail */
.project-card__cue {
  position: absolute;
  top: 0.65rem;
  right: 0.65rem;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.6rem 0.3rem 0.7rem;
  border-radius: 9999px;
  background: color-mix(in srgb, var(--bg-primary) 88%, transparent);
  color: var(--fg-primary);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  backdrop-filter: blur(10px) saturate(1.15);
  -webkit-backdrop-filter: blur(10px) saturate(1.15);
  border: 1px solid color-mix(in srgb, var(--accent) 22%, transparent);
  box-shadow: 0 2px 8px rgba(0, 20, 60, 0.12);
  opacity: 0;
  transform: translateY(-4px);
  transition: opacity 200ms ease, transform 200ms ease;
  pointer-events: none;
}

.project-card:hover .project-card__cue,
.project-card-link:focus-visible .project-card__cue {
  opacity: 1;
  transform: translateY(0);
}

.project-card__cue-label {
  white-space: nowrap;
}

.project-card__cue-icon {
  width: 0.85rem;
  height: 0.85rem;
  flex-shrink: 0;
  color: var(--accent);
}

@media (prefers-reduced-motion: reduce) {
  .project-card-link:hover {
    transform: none;
  }

  .project-card-link img {
    transition: none;
  }

  .project-card__cue {
    transition: opacity 0ms;
    transform: none;
  }
}
</style>
