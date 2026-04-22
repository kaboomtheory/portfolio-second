<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { ProjectItem } from '~/types/project'

const props = defineProps<{
  projects: ProjectItem[]
  loading: boolean
}>()

const filterTag = ref<string>('all')

const tagOptions = computed(() => {
  const set = new Set<string>()
  for (const p of props.projects) {
    for (const t of p.tags ?? []) {
      const s = t?.trim()
      if (s) set.add(s)
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b))
})

const filteredProjects = computed(() => {
  if (filterTag.value === 'all') return props.projects
  return props.projects.filter((p) => p.tags?.includes(filterTag.value))
})

const showFilters = computed(
  () => !props.loading && tagOptions.value.length > 0,
)

const filterAnnouncement = computed(() => {
  if (props.loading) return ''
  const n = filteredProjects.value.length
  const noun = n === 1 ? 'project' : 'projects'
  const suffix
    = filterTag.value === 'all' ? '.' : ` tagged ${filterTag.value}.`
  return `Showing ${n} ${noun}${suffix}`
})
</script>

<template>
  <RevealOnScroll
    id="work"
    :delay="80"
    :threshold="0.06"
    root-margin="0px 0px 0px 0px"
    class="page-section work-section-outer"
  >
    <p id="work-filter-status" class="sr-only" aria-live="polite">
      {{ filterAnnouncement }}
    </p>
    <div class="work-grid grid-12">
      <div class="work-marker">
        <span class="section-marker">
          <span class="section-marker-word">Work</span>
        </span>
      </div>

      <div class="work-content">
        <p class="work-lede">
          Case studies and client projects—filtered by tag when available.
        </p>

        <div
          v-if="showFilters"
          class="work-filters"
          role="group"
          aria-label="Filter projects by tag"
        >
          <button
            type="button"
            :aria-pressed="filterTag === 'all'"
            class="filter-pill"
            :class="{ 'filter-pill--active': filterTag === 'all' }"
            @click="filterTag = 'all'"
          >
            All
          </button>
          <button
            v-for="tag in tagOptions"
            :key="tag"
            type="button"
            :aria-pressed="filterTag === tag"
            class="filter-pill"
            :class="{ 'filter-pill--active': filterTag === tag }"
            @click="filterTag = tag"
          >
            {{ tag }}
          </button>
        </div>

        <div
          v-if="loading"
          class="work-skeleton"
          aria-busy="true"
          aria-label="Loading projects"
        >
          <div v-for="i in 6" :key="i" class="work-skeleton-card" />
        </div>

        <div
          v-else-if="filteredProjects.length === 0"
          class="work-empty"
        >
          <Icon
            icon="lucide:folder-open"
            class="work-empty-icon"
            aria-hidden="true"
          />
          <p class="work-empty-title">No projects to show yet</p>
          <p class="work-empty-copy text-muted">
            New work will appear here once it is published. Try a different filter or check back soon.
          </p>
        </div>

        <Transition v-else name="grid-fade" mode="out-in" appear>
          <div :key="filterTag" class="work-list">
            <ProjectCard
              v-for="(item, idx) in filteredProjects"
              :key="item.slug"
              :project="item"
              :project-index="idx + 1"
              :style="{ '--i': idx }"
            />
          </div>
        </Transition>
      </div>
    </div>
  </RevealOnScroll>
</template>

<style scoped>
.work-section-outer {
  --signal: var(--signal-mint);
  padding-top: 0;
  padding-bottom: 0;
}

.work-grid {
  row-gap: var(--home-grid-gap-dense);
  align-items: start;
  padding-top: 0;
}

.work-marker {
  grid-column: 1 / -1;
}

.work-content {
  grid-column: 1 / -1;
  min-width: 0;
}

@media (min-width: 768px) {
  .work-marker {
    grid-column: 1 / span 3;
  }

  .work-content {
    grid-column: 4 / span 9;
  }
}

@media (min-width: 1024px) {
  .work-marker {
    position: sticky;
    top: 6.5rem;
    align-self: start;
  }
}

.work-lede {
  margin: 0 0 var(--home-stack-gap-tight);
  font-size: var(--text-body);
  line-height: 1.55;
  max-width: min(42rem, 68ch);
  color: var(--fg-secondary);
}

.work-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 0.5rem 0.65rem;
  row-gap: 0.55rem;
  margin-bottom: var(--home-stack-gap-comfortable);
}

.work-list {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--home-card-stack-gap);
}

.work-list :deep(.project-card) {
  --fg-primary: var(--pastel-ink);
  --fg-secondary: var(--pastel-ink-muted);
  --fg-muted: color-mix(in srgb, var(--pastel-ink) 48%, var(--project-card-surface, var(--pastel-peach)));
}

.work-list :deep(.project-card:nth-child(4n + 1)) {
  --project-card-surface: var(--pastel-peach);
  --project-card-surface-hover: color-mix(in srgb, var(--pastel-peach) 86%, var(--pastel-ink));
  --project-card-media-bg: color-mix(in srgb, var(--bg-secondary) 86%, var(--pastel-peach) 14%);
}

.work-list :deep(.project-card:nth-child(4n + 2)) {
  --project-card-surface: var(--pastel-mint);
  --project-card-surface-hover: color-mix(in srgb, var(--pastel-mint) 86%, var(--pastel-ink));
  --project-card-media-bg: color-mix(in srgb, var(--bg-secondary) 86%, var(--pastel-mint) 14%);
}

.work-list :deep(.project-card:nth-child(4n + 3)) {
  --project-card-surface: var(--pastel-sky);
  --project-card-surface-hover: color-mix(in srgb, var(--pastel-sky) 86%, var(--pastel-ink));
  --project-card-media-bg: color-mix(in srgb, var(--bg-secondary) 86%, var(--pastel-sky) 14%);
}

.work-list :deep(.project-card:nth-child(4n + 4)) {
  --project-card-surface: var(--pastel-blush);
  --project-card-surface-hover: color-mix(in srgb, var(--pastel-blush) 86%, var(--pastel-ink));
  --project-card-media-bg: color-mix(in srgb, var(--bg-secondary) 86%, var(--pastel-blush) 14%);
}

.work-list :deep(.project-card:hover .project-card__title),
.work-list :deep(.project-card-link:focus-visible .project-card__title) {
  color: var(--pastel-ink);
}

.work-list :deep(.project-card:hover .project-card__cta),
.work-list :deep(.project-card-link:focus-visible .project-card__cta) {
  color: var(--pastel-ink);
}

/* Easing: decisive ease-out (motion-design) — not generic ease */
.grid-fade-enter-active {
  transition: opacity 0.32s cubic-bezier(0.16, 1, 0.3, 1);
}

.grid-fade-leave-active {
  transition: opacity 0.2s cubic-bezier(0.7, 0, 0.84, 0);
}

.grid-fade-enter-from,
.grid-fade-leave-to {
  opacity: 0;
}

/* Staggered cards whenever the work block is in view (scroll + filter remount) */
.reveal-on-scroll--visible .work-list > :deep(.project-card) {
  animation: work-card-enter 0.52s cubic-bezier(0.16, 1, 0.3, 1) both;
  /* Cap index so long lists do not stretch choreography past ~0.5s */
  animation-delay: calc(min(var(--i, 0), 8) * 52ms);
}

@keyframes work-card-enter {
  from {
    opacity: 0;
    transform: translate3d(0, 14px, 0) scale(0.985);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }
}

.work-skeleton {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--home-card-stack-gap);
}

.work-skeleton-card {
  min-height: clamp(11rem, 26vw, 15rem);
  border: 1px solid var(--rule-soft);
  border-radius: var(--radius-card);
  background: linear-gradient(
    90deg,
    var(--bg-secondary) 25%,
    var(--bg-primary) 50%,
    var(--bg-secondary) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
}

.work-empty {
  padding: clamp(2rem, 4vw, 3rem) 0;
  border-top: 1px solid var(--rule);
  border-bottom: 1px solid var(--rule);
  text-align: center;
}

.work-empty-icon {
  margin: 0 auto 1rem;
  width: 2.5rem;
  height: 2.5rem;
  color: var(--fg-muted);
}

.work-empty-title {
  margin: 0;
  font-size: var(--text-body-lg);
  font-weight: 500;
  color: var(--fg-primary);
}

.work-empty-copy {
  margin: 0.75rem auto 0;
  max-width: 24rem;
  font-size: var(--text-body);
  line-height: 1.55;
}

@keyframes skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .grid-fade-enter-active,
  .grid-fade-leave-active {
    transition: none;
  }

  .grid-fade-enter-from,
  .grid-fade-leave-to {
    opacity: 1;
  }

  .reveal-on-scroll--visible .work-list > :deep(.project-card) {
    animation: none;
    opacity: 1;
    transform: none;
  }

  .work-skeleton-card {
    animation: none;
  }
}
</style>
