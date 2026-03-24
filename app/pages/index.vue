<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { socialLinks, profile } from '~/data/site'

const { homeHero, aboutMe } = useMockContent()
const { orderedProjects, loading } = useSanityProjects()

const filterCategory = ref<string>('all')

const categoryOptions = computed(() => {
  const set = new Set<string>()
  for (const p of orderedProjects.value) {
    const c = p.category?.trim()
    if (c) set.add(c)
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b))
})

const filteredProjects = computed(() => {
  if (filterCategory.value === 'all') return orderedProjects.value
  return orderedProjects.value.filter((p) => p.category === filterCategory.value)
})

const showFilters = computed(
  () => !loading.value && categoryOptions.value.length > 0,
)

const getAnimationDelay = (index: number) => {
  const baseDelay = 0.12
  return baseDelay + index * 0.08
}

useHead({
  title: 'Selected work',
})
</script>

<template>
  <div class="page-content">
    <!-- Hero Section -->
    <section class="page-section">
      <h1 class="hero-statement hero-fade-in">
        <span class="hero-name-row">
          <span class="hero-name-divider" aria-hidden="true">✦</span>
          <TextReveal tag="span" :text="homeHero.title" class="hero-name" />
        </span>
        <span class="hero-tagline">
          <p
            v-for="(line, lineIndex) in homeHero.taglines"
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
        <CtaButton to="/about" label="View Resume" attention>
          <template #icon><Icon icon="lucide:file-text" class="text-sm" /></template>
        </CtaButton>
        <CtaButton :href="`mailto:${profile.email}`" label="Open for Work" secondary with-dot>
          <template #icon><Icon icon="lucide:mail" class="text-sm" /></template>
        </CtaButton>
        <span class="hero-divider" aria-hidden="true" />
        <div class="hero-socials">
          <a
            v-for="link in socialLinks"
            :key="link.label"
            :href="link.href"
            target="_blank"
            rel="noopener noreferrer"
            class="hero-social-link"
            :aria-label="link.label"
          >
            <Icon :icon="link.icon" aria-hidden="true" />
          </a>
        </div>
      </div>
      <p class="hero-intro mt-8 max-w-2xl text-base leading-relaxed hero-fade-in hero-delay-2">
        {{ aboutMe.intro }}
      </p>
    </section>

    <!-- Projects Section -->
    <section class="page-section projects-section">
      <div class="mb-5 md:mb-6">
        <h2 class="section-title text-2xl font-semibold tracking-tight md:text-3xl">
          Selected work
        </h2>
        <p class="mt-2 max-w-xl text-sm leading-relaxed text-[var(--fg-muted)]">
          Case studies and client projects — filtered by type when available.
        </p>
      </div>

      <div
        v-if="showFilters"
        class="mb-6 flex flex-wrap gap-2"
        role="tablist"
        aria-label="Filter projects by category"
      >
        <button
          type="button"
          role="tab"
          :aria-selected="filterCategory === 'all'"
          class="filter-pill"
          :class="{ 'filter-pill--active': filterCategory === 'all' }"
          @click="filterCategory = 'all'"
        >
          All
        </button>
        <button
          v-for="cat in categoryOptions"
          :key="cat"
          type="button"
          role="tab"
          :aria-selected="filterCategory === cat"
          class="filter-pill"
          :class="{ 'filter-pill--active': filterCategory === cat }"
          @click="filterCategory = cat"
        >
          {{ cat }}
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
        class="empty-projects rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] px-6 py-14 text-center"
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

      <div
        v-else
        class="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-7"
      >
        <ProjectCard
          v-for="(item, index) in filteredProjects"
          :key="item.slug"
          :project="item"
          :style="{ animationDelay: `${getAnimationDelay(index)}s` }"
          class="project-card-enter"
        />
      </div>
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

.hero-name-row {
  display: flex;
  align-items: center;
  gap: 0.4em;
  line-height: 1.05;
}

.hero-name {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--fg-primary);
}

.hero-name-divider {
  display: inline-block;
  flex-shrink: 0;
  font-size: clamp(1.5rem, 3.5vw, 2.75rem);
  color: var(--emphasis);
  font-weight: 400;
  line-height: 1;
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

.filter-pill {
  border-radius: 9999px;
  border: 1px solid var(--border);
  background: var(--bg-secondary);
  padding: 0.4rem 0.9rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--fg-secondary);
  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    background-color 0.2s ease;
}

.filter-pill:hover {
  border-color: var(--emphasis);
  color: var(--fg-primary);
}

.filter-pill--active {
  border-color: var(--emphasis);
  background: color-mix(in srgb, var(--emphasis) 12%, var(--bg-secondary));
  color: var(--fg-primary);
}

.projects-section {
  padding-top: 0.5rem;
}

.section-title {
  color: var(--fg-primary);
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

/* Staggered card entry */
.project-card-enter {
  opacity: 0;
  transform: translateY(16px);
  animation: project-card-enter 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

@keyframes project-card-enter {
  to {
    opacity: 1;
    transform: translateY(0);
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

.hero-divider {
  display: inline-block;
  width: 1px;
  height: 1.5rem;
  background-color: var(--border);
  align-self: center;
  flex-shrink: 0;
}

.hero-socials {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.hero-social-link {
  display: inline-flex;
  height: 2rem;
  width: 2rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  border: 1px solid var(--border);
  font-size: 1rem;
  color: var(--fg-muted);
  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.hero-social-link:hover {
  color: var(--emphasis);
  border-color: var(--emphasis);
  box-shadow: 0 0 12px color-mix(in srgb, var(--emphasis) 20%, transparent);
}

/* Skeleton loading */
.skeleton-card {
  border-radius: 0.75rem;
  border: 1px solid var(--border);
  background: var(--bg-secondary);
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
  .hero-fade-in,
  .project-card-enter {
    animation: none;
    opacity: 1;
  }

  .project-card-enter {
    transform: none;
  }

  .skeleton-thumbnail,
  .skeleton-line {
    animation: none;
  }
}
</style>
