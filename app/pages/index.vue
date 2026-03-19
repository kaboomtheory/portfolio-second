<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { socialLinks, profile } from '~/data/site'

const { homeHero } = useMockContent()
const { projects, loading } = useSanityProjects()

const featuredProjects = computed(() => projects.value)

// Calculate grid position for staggered animation
const getAnimationDelay = (index: number) => {
  const baseDelay = 0.15 // Base delay after hero section
  return baseDelay + (index * 0.1)
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
      <TextReveal
        tag="h1"
        :text="homeHero.title"
        class="max-w-3xl text-4xl leading-tight md:text-5xl"
      />
      <p class="mt-2 text-xl hero-fade-in" :style="{ color: 'var(--fg-primary)' }">{{ homeHero.subtitle }}</p>
      <p class="mt-5 max-w-2xl text-base hero-fade-in hero-delay-1">{{ homeHero.description }}</p>
      <div class="mt-6 flex flex-wrap items-center gap-3 hero-fade-in hero-delay-2">
        <CtaButton to="/resume" label="View Resume" attention>
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
      <div class="mb-4">
        <p class="text-xs uppercase tracking-[0.12em] text-[var(--fg-muted)] mb-1 section-eyebrow">Selected Work</p>
        <h2 class="section-title">Latest Projects</h2>
      </div>
      <!-- Skeleton Loading -->
      <div v-if="loading" class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="i in 6" :key="i" class="skeleton-card">
          <div class="skeleton-thumbnail" />
          <div class="skeleton-body">
            <div class="skeleton-line skeleton-line-short" />
            <div class="skeleton-line" />
          </div>
        </div>
      </div>

      <!-- Project Grid -->
      <TransitionGroup
        v-else
        tag="div"
        name="project-grid"
        class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        <ProjectCard
          v-for="(item, index) in featuredProjects"
          :key="item.slug"
          :project="item"
          :style="{ animationDelay: `${getAnimationDelay(index)}s` }"
          class="project-card-enter"
        />
      </TransitionGroup>
    </section>
  </div>
</template>

<style scoped>
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

/* Project grid transitions */
.project-grid-enter-active {
  transition: all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.project-grid-leave-active {
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: absolute;
}

.project-grid-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(24px);
}

.project-grid-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.project-grid-move {
  transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* Staggered card entry animation on page load */
.project-card-enter {
  opacity: 0;
  transform: translateY(24px) scale(0.97);
  animation: project-card-enter 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

@keyframes project-card-enter {
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
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
  color: var(--accent);
  border-color: var(--accent);
  box-shadow: 0 0 12px color-mix(in srgb, var(--accent) 20%, transparent);
}

/* Skeleton loading */
.skeleton-card {
  border-radius: 0.75rem;
  border: 1px solid var(--border);
  background: var(--bg-secondary);
  overflow: hidden;
}

.skeleton-thumbnail {
  aspect-ratio: 1;
  background: linear-gradient(90deg, var(--bg-tertiary) 25%, var(--bg-secondary) 50%, var(--bg-tertiary) 75%);
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
}

.skeleton-body {
  padding: 1rem;
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

  .skeleton-thumbnail,
  .skeleton-line {
    animation: none;
  }
}
</style>
