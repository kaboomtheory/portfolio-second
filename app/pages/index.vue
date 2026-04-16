<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { socialLinks, profile } from '~/data/site'

const { homeHero } = useMockContent()
const { orderedProjects, loading, homePage: cmsHome } = useSanityIndexBundle()

const heroTitle = computed(() => cmsHome.value?.hero.title || homeHero.title)
const heroTaglines = computed(() =>
  cmsHome.value?.hero.taglines?.length ? cmsHome.value.hero.taglines : homeHero.taglines,
)
const heroEmail = computed(() => cmsHome.value?.email || profile.email)

const linkedinHref = computed(() => {
  const list = cmsHome.value?.socialLinks?.length ? cmsHome.value.socialLinks : socialLinks
  const found = list.find((l) => /linkedin/i.test(l.label))
  return found?.href ?? 'https://www.linkedin.com/'
})

const filterTag = ref<string>('all')

const tagOptions = computed(() => {
  const set = new Set<string>()
  for (const p of orderedProjects.value) {
    for (const t of p.tags ?? []) {
      const s = t?.trim()
      if (s) set.add(s)
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b))
})

const filteredProjects = computed(() => {
  if (filterTag.value === 'all') return orderedProjects.value
  return orderedProjects.value.filter((p) => p.tags?.includes(filterTag.value))
})

const showFilters = computed(
  () => !loading.value && tagOptions.value.length > 0,
)

useHead({
  title: 'Selected work',
})
</script>

<template>
  <div class="page-content">
    <!-- Hero Section -->
    <section class="page-section">
      <h1 class="hero-statement hero-fade-in">
        <TextReveal tag="span" :text="heroTitle" class="hero-name" />
        <span class="hero-tagline">
          <p
            v-for="(line, lineIndex) in heroTaglines"
            :key="lineIndex"
            class="hero-tagline-line"
          >
            <template v-for="(seg, segIndex) in line.segments" :key="segIndex">
              <strong v-if="seg.em" class="hero-tagline-em">{{ seg.text }}</strong>
              <template v-else>{{ seg.text }}</template>
            </template>
          </p>
        </span>
      </h1>
      <div class="mt-6 flex flex-wrap items-center gap-3 hero-fade-in hero-delay-2">
        <CtaButton to="/about" label="VIEW RESUME" attention preserve-case>
          <template #icon><Icon icon="lucide:file-text" class="text-sm" /></template>
        </CtaButton>
        <CtaButton
          :href="`mailto:${heroEmail}`"
          label="OPEN TO WORK"
          secondary
          elevated-secondary
          with-dot
          preserve-case
        >
          <template #icon><Icon icon="lucide:mail" class="text-sm" /></template>
        </CtaButton>
        <CtaButton
          :href="linkedinHref"
          label="LINKEDIN"
          secondary
          elevated-secondary
          preserve-case
        >
          <template #icon><Icon icon="ri:linkedin-fill" class="text-sm" /></template>
        </CtaButton>
      </div>
    </section>

    <!-- Projects Section -->
    <section class="page-section projects-section">
      <div class="mb-5 md:mb-6">
        <h2 class="section-title">
          Selected work
        </h2>
        <p class="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          Case studies and client projects — filtered by tag when available.
        </p>
      </div>

      <div
        v-if="showFilters"
        class="mb-6 flex flex-wrap gap-2"
        role="tablist"
        aria-label="Filter projects by tag"
      >
        <button
          type="button"
          role="tab"
          :aria-selected="filterTag === 'all'"
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
          role="tab"
          :aria-selected="filterTag === tag"
          class="filter-pill"
          :class="{ 'filter-pill--active': filterTag === tag }"
          @click="filterTag = tag"
        >
          {{ tag }}
        </button>
      </div>

      <!-- Skeleton Loading -->
      <div v-if="loading" class="project-grid-skeleton">
        <div v-for="i in 6" :key="i" class="skeleton-card">
          <div class="skeleton-thumbnail" />
          <div class="skeleton-body">
            <div class="skeleton-line skeleton-line-short" />
            <div class="skeleton-line" />
            <div class="skeleton-line skeleton-line-mid" />
          </div>
        </div>
      </div>

      <div
        v-else-if="filteredProjects.length === 0"
        class="empty-projects rounded-xl bg-[var(--bg-primary)] px-6 py-14 text-center"
      >
        <Icon
          icon="lucide:folder-open"
          class="mx-auto mb-4 h-10 w-10 text-[var(--fg-muted)]"
          aria-hidden="true"
        />
        <p class="text-base font-medium text-[var(--fg-primary)]">No projects to show yet</p>
        <p class="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[var(--fg-muted)]">
          New work will appear here once it is published. Try a different filter or check back soon.
        </p>
      </div>

      <Transition v-else name="grid-fade" mode="out-in" appear>
        <div
          :key="filterTag"
          class="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-7"
        >
          <ProjectCard
            v-for="(item, idx) in filteredProjects"
            :key="item.slug"
            :project="item"
            :style="{ '--i': idx }"
          />
        </div>
      </Transition>
    </section>
  </div>
</template>

<style scoped>
/* Hero statement */
.hero-statement {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
}

.hero-name {
  display: inline-block;
  line-height: 1.08;
  font-size: clamp(2.5rem, 5vw + 0.5rem, 4.25rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--fg-primary);
}

.hero-tagline {
  display: block;
  max-width: 42rem;
}

.hero-tagline-line {
  margin: 0;
  font-size: clamp(1rem, 1.4vw + 0.4rem, 1.375rem);
  font-weight: 400;
  line-height: 1.55;
  color: var(--fg-secondary);
  letter-spacing: -0.01em;
}

.hero-tagline-line + .hero-tagline-line {
  margin-top: 0.5rem;
}

.hero-tagline-em {
  font-weight: 600;
  color: var(--fg-primary);
}

.hero-intro {
  color: var(--fg-secondary);
}

.projects-section {
  padding-top: var(--space-sm);
}

/* Hero fade-in animations */
.hero-fade-in {
  opacity: 0;
  animation: hero-fade-in 0.8s cubic-bezier(0.2, 0.65, 0.3, 0.9) forwards;
}

.hero-delay-2 {
  animation-delay: 0.55s;
}

@keyframes hero-fade-in {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Project grid: crossfade on filter change */
.grid-fade-enter-active {
  transition: opacity 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.grid-fade-leave-active {
  transition: opacity 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.grid-fade-enter-from,
.grid-fade-leave-to {
  opacity: 0;
}

/* Staggered card entry within the grid */
.grid-fade-enter-active :deep(.project-card) {
  animation: card-enter 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  animation-delay: calc(var(--i, 0) * 50ms);
}

@keyframes card-enter {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.project-grid-skeleton {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}

@media (min-width: 768px) {
  .project-grid-skeleton {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .project-grid-skeleton {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.75rem;
  }
}

/* Empty state card */
.empty-projects {
  border: var(--card-border);
  box-shadow: var(--card-ring);
  backdrop-filter: blur(15px) saturate(1.2);
  -webkit-backdrop-filter: blur(15px) saturate(1.2);
}

/* Skeleton loading */
.skeleton-card {
  border-radius: 0.75rem;
  background: var(--bg-secondary);
  border: var(--card-border);
  overflow: hidden;
}

.skeleton-thumbnail {
  aspect-ratio: 4 / 3;
  background: linear-gradient(90deg, var(--bg-tertiary) 25%, var(--bg-secondary) 50%, var(--bg-tertiary) 75%);
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
}

.skeleton-body {
  padding: 1rem 1rem 1.125rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skeleton-line {
  height: 0.75rem;
  border-radius: 0.25rem;
  background: linear-gradient(90deg, var(--bg-tertiary) 25%, var(--bg-secondary) 50%, var(--bg-tertiary) 75%);
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
}

.skeleton-line-short {
  width: 40%;
}

.skeleton-line-mid {
  width: 72%;
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
  .hero-fade-in {
    animation: none;
    opacity: 1;
  }

  .grid-fade-enter-active,
  .grid-fade-leave-active {
    transition: none;
  }

  .grid-fade-enter-from,
  .grid-fade-leave-to {
    opacity: 1;
  }

  .grid-fade-enter-active :deep(.project-card) {
    animation: none;
    opacity: 1;
    transform: none;
  }

  .skeleton-thumbnail,
  .skeleton-line {
    animation: none;
  }
}
</style>
