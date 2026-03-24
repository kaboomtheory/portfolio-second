<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { socialLinks, profile } from '~/data/site'

const { homeHero } = useMockContent()
const { projects, loading } = useSanityProjects()

const featuredProjects = computed(() => projects.value)

const getAnimationDelay = (index: number) => {
  const baseDelay = 0.12
  return baseDelay + index * 0.08
}

useHead({
  title: 'Selected Works',
  titleTemplate: '%s / Placeholder Portfolio',
})
</script>

<template>
  <div class="page-content">
    <!-- Hero Section -->
    <section class="page-section">
      <h1 class="hero-statement hero-fade-in">
        <span class="hero-name-row">
          <TextReveal tag="span" :text="homeHero.title" class="hero-name" />
          <span class="hero-name-divider" aria-hidden="true">✦</span>
        </span>
        <span class="hero-tagline">
          {{ homeHero.taglineStart }}<span class="sym sym-pen" aria-hidden="true">☻</span>{{ homeHero.taglineMid }}<span class="sym sym-star" aria-hidden="true">¶</span>{{ homeHero.taglineEnd }}<span class="sym sym-cloud" aria-hidden="true">★</span>
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
    </section>

    <!-- Projects Section -->
    <section class="page-section">
      <div class="mb-5 md:mb-6">
        <p class="text-xs uppercase tracking-[0.12em] text-[var(--accent-soft)] mb-1 section-eyebrow">Selected Work</p>
        <h2 class="section-title">Latest Projects</h2>
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

      <!-- Project Grid: single enter animation on cards (no TransitionGroup double-fade) -->
      <div
        v-else
        class="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-7"
      >
        <ProjectCard
          v-for="(item, index) in featuredProjects"
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
  animation: sym-spin 8s linear infinite;
}

.hero-tagline {
  display: block;
  font-size: clamp(1rem, 1.4vw + 0.4rem, 1.375rem);
  font-weight: 400;
  line-height: 1.6;
  color: var(--fg-secondary);
  letter-spacing: -0.01em;
  max-width: 42rem;
}

.sym {
  display: inline-block;
  color: var(--emphasis);
  vertical-align: middle;
  margin: 0 0.2em;
  line-height: 1;
}

.sym-pen {
  animation: sym-wiggle 3s ease-in-out infinite;
  transform-origin: bottom center;
}

.sym-star {
  animation: sym-spin 6s linear infinite;
}

.sym-cloud {
  animation: sym-float 4s ease-in-out infinite;
}

@keyframes sym-wiggle {
  0%, 100% { transform: rotate(-8deg); }
  50% { transform: rotate(8deg); }
}

@keyframes sym-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes sym-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

/* Hero fade-in animations */
.hero-fade-in {
  opacity: 0;
  animation: hero-fade-in 0.8s cubic-bezier(0.2, 0.65, 0.3, 0.9) forwards;
}

.hero-delay-1 {
  animation-delay: 0.4s;
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

/* Section eyebrow animation */
.section-eyebrow {
  opacity: 0;
  animation: hero-fade-in 0.6s cubic-bezier(0.2, 0.65, 0.3, 0.9) 0.6s forwards;
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
  transition: color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
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
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@media (prefers-reduced-motion: reduce) {
  .hero-fade-in,
  .project-card-enter,
  .section-eyebrow {
    animation: none;
    opacity: 1;
  }

  .hero-name-divider,
  .sym-pen,
  .sym-star,
  .sym-cloud {
    animation: none;
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
