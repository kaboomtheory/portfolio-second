<script setup lang="ts">
import { Icon } from '@iconify/vue'

const { homeHero } = useMockContent()
const { projects } = useSanityProjects()

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
      <div class="mt-6 flex flex-wrap gap-3 hero-fade-in hero-delay-2">
        <CtaButton to="/resume" label="View Resume" attention>
          <template #icon><Icon icon="lucide:file-text" class="text-sm" /></template>
        </CtaButton>
        <CtaButton href="mailto:hello@example.com" label="Open for Freelance" secondary with-dot>
          <template #icon><Icon icon="lucide:mail" class="text-sm" /></template>
        </CtaButton>
      </div>
    </section>

    <!-- Projects Section -->
    <section class="page-section">
      <div class="mb-4">
        <p class="text-xs uppercase tracking-[0.12em] text-[var(--fg-muted)] mb-1 section-eyebrow">Selected Work</p>
        <h2 class="section-title">Latest Projects</h2>
      </div>
      <TransitionGroup
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

@media (prefers-reduced-motion: reduce) {
  .hero-fade-in,
  .project-card-enter,
  .section-eyebrow {
    animation: none;
    opacity: 1;
  }
}
</style>
