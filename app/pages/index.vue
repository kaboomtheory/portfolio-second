<script setup lang="ts">
const { homeHero } = useMockContent()
const { projects } = useSanityProjects()

const featuredProjects = computed(() => projects.value)

const gridPatterns = [
  'md:col-span-2 lg:col-span-2 row-span-2',
  'md:col-span-1 lg:col-span-1 row-span-1',
  'md:col-span-1 lg:col-span-1 row-span-1',
  'md:col-span-2 lg:col-span-2 row-span-1',
  'md:col-span-1 lg:col-span-1 row-span-2',
  'md:col-span-1 lg:col-span-1 row-span-1',
  'md:col-span-1 lg:col-span-1 row-span-1',
  'md:col-span-1 lg:col-span-1 row-span-1',
]

function getStablePatternIndex(slug: string): number {
  let hash = 0
  for (let i = 0; i < slug.length; i++) {
    hash = ((hash << 5) - hash + slug.charCodeAt(i)) | 0
  }
  return Math.abs(hash) % gridPatterns.length
}

const getProjectCardClass = (slug: string) => {
  return gridPatterns[getStablePatternIndex(slug)]
}

useHead({
  title: 'Selected Works',
  titleTemplate: '%s / Placeholder Portfolio',
})
</script>

<template>
  <div class="page-content">
    <section class="page-section reveal-up">
      <h1 class="max-w-3xl text-4xl leading-tight md:text-5xl">{{ homeHero.title }}</h1>
      <p class="mt-2 text-xl" :style="{ color: 'var(--fg-primary)' }">{{ homeHero.subtitle }}</p>
      <p class="mt-5 max-w-2xl text-base">{{ homeHero.description }}</p>
      <div class="mt-6 flex flex-wrap gap-3">
        <CtaButton to="/resume" label="View Resume" attention />
        <CtaButton href="mailto:hello@example.com" label="Open for Freelance" secondary with-dot />
      </div>
    </section>

    <section class="page-section reveal-up">
      <h2 class="section-title">Latest Projects</h2>
      <TransitionGroup
        tag="div"
        name="project-grid"
        class="grid grid-cols-1 gap-4 gap-y-6 md:grid-cols-2 lg:grid-cols-3 auto-rows-[300px] grid-flow-dense"
      >
        <ProjectCard
          v-for="item in featuredProjects"
          :key="item.slug"
          :project="item"
          :class="getProjectCardClass(item.slug)"
        />
      </TransitionGroup>
    </section>
  </div>
</template>

<style scoped>
.project-grid-enter-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.project-grid-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
}

.project-grid-enter-from {
  opacity: 0;
  transform: scale(0.92) translateY(20px);
}

.project-grid-leave-to {
  opacity: 0;
  transform: scale(0.92);
}

.project-grid-move {
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
