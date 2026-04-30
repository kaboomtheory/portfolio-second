<script setup lang="ts">
import { onUnmounted, watch } from 'vue'
import type { ProjectItem } from '~/types/project'

const props = defineProps<{
  projects: ProjectItem[]
  loading: boolean
}>()

const filterTag = ref<string>('all')

/* Rotating skeleton verb — small typographic personality during loading. */
const SKELETON_VERBS = ['composing', 'fetching pixels', 'arranging', 'developing'] as const
const skeletonVerb = ref(SKELETON_VERBS[0])
let skeletonTimer: ReturnType<typeof setInterval> | null = null

function startSkeletonRotation() {
  if (skeletonTimer || !import.meta.client) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  let i = 0
  skeletonTimer = setInterval(() => {
    i = (i + 1) % SKELETON_VERBS.length
    skeletonVerb.value = SKELETON_VERBS[i]!
  }, 1600)
}

function stopSkeletonRotation() {
  if (skeletonTimer) {
    clearInterval(skeletonTimer)
    skeletonTimer = null
  }
}

watch(
  () => props.loading,
  (loading) => {
    if (loading) startSkeletonRotation()
    else stopSkeletonRotation()
  },
  { immediate: true },
)

onUnmounted(stopSkeletonRotation)

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
        <SectionMarker index="02" word="Work" />
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
          <span class="work-filters-label mono" aria-hidden="true">Filter</span>
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
          <p class="work-skeleton-status" role="status" aria-live="polite">
            <Transition name="skeleton-verb" mode="out-in">
              <span :key="skeletonVerb" class="work-skeleton-verb">{{ skeletonVerb }}</span>
            </Transition>
            <span class="work-skeleton-ellipsis" aria-hidden="true">…</span>
          </p>
          <div v-for="i in 6" :key="i" class="work-skeleton-card" />
        </div>

        <div
          v-else-if="filteredProjects.length === 0"
          class="work-empty"
        >
          <AppIcon
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
  padding-bottom: var(--home-stack-gap-tight, 1rem);
}

.work-content {
  grid-column: 1 / -1;
  min-width: 0;
}

@media (min-width: 768px) {
  .work-marker {
    grid-column: 1 / -1;
  }

  .work-content {
    grid-column: 1 / -1;
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
  align-items: center;
  gap: 0.5rem 0.65rem;
  row-gap: 0.55rem;
  margin-bottom: var(--home-stack-gap-comfortable);
}

.work-filters-label {
  font-size: var(--label-size);
  font-weight: 500;
  letter-spacing: var(--label-tracking-mono);
  text-transform: uppercase;
  color: var(--fg-muted);
  margin-right: 0.25rem;
}

.work-list {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--home-card-stack-gap);
}

@media (min-width: 720px) {
  .work-list {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.work-list :deep(.project-card) {
  --fg-primary: var(--pastel-ink);
  --fg-secondary: var(--pastel-ink-muted);
  --fg-muted: color-mix(in srgb, var(--pastel-ink) 48%, var(--project-card-surface, var(--pastel-peach)));
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

/* Cards start hidden; transition into view when the section becomes visible */
.work-list > :deep(.project-card) {
  opacity: 0;
  transform: translateY(14px);
  transition:
    opacity 420ms var(--motion-ease-hero, cubic-bezier(0.16, 1, 0.3, 1)),
    transform 420ms var(--motion-ease-hero, cubic-bezier(0.16, 1, 0.3, 1));
  transition-delay: 0ms;
}

.work-list > :deep(.project-card:nth-child(2)) { transition-delay: 40ms; }
.work-list > :deep(.project-card:nth-child(3)) { transition-delay: 80ms; }
.work-list > :deep(.project-card:nth-child(4)) { transition-delay: 120ms; }
.work-list > :deep(.project-card:nth-child(5)) { transition-delay: 160ms; }
.work-list > :deep(.project-card:nth-child(6)) { transition-delay: 200ms; }
.work-list > :deep(.project-card:nth-child(7)) { transition-delay: 240ms; }
.work-list > :deep(.project-card:nth-child(8)) { transition-delay: 280ms; }
.work-list > :deep(.project-card:nth-child(9)) { transition-delay: 320ms; }

.reveal-on-scroll--visible .work-list > :deep(.project-card) {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .work-list > :deep(.project-card) {
    transform: none;
    transition: opacity 200ms linear;
    transition-delay: 0ms;
  }
}

.work-skeleton {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--home-card-stack-gap);
}

.work-skeleton-status {
  margin: 0 0 0.5rem;
  display: inline-flex;
  align-items: baseline;
  gap: 0.15rem;
  font-family: var(--font-mono);
  font-size: var(--label-size);
  font-weight: 500;
  letter-spacing: var(--label-tracking-mono);
  text-transform: lowercase;
  color: var(--fg-muted);
}

.work-skeleton-verb {
  display: inline-block;
  min-width: 8ch;
  font-style: italic;
  font-family: var(--font-serif);
  text-transform: none;
  letter-spacing: 0;
  color: var(--fg-secondary);
}

.work-skeleton-ellipsis {
  display: inline-block;
  margin-left: 0.05rem;
  font-family: var(--font-serif);
  font-style: italic;
  color: var(--fg-secondary);
}

.skeleton-verb-enter-active,
.skeleton-verb-leave-active {
  transition:
    opacity 220ms var(--motion-ease-hero, cubic-bezier(0.16, 1, 0.3, 1)),
    transform 220ms var(--motion-ease-hero, cubic-bezier(0.16, 1, 0.3, 1));
}

.skeleton-verb-enter-from {
  opacity: 0;
  transform: translateY(4px);
}

.skeleton-verb-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (prefers-reduced-motion: reduce) {
  .skeleton-verb-enter-active,
  .skeleton-verb-leave-active {
    transition: none;
  }
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
