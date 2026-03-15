<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { TrinketItem } from '~/data/trinkets'

const { homeHero, trinkets } = useMockContent()
const { projects } = useSanityProjects()

const featuredProjects = computed(() => projects.value)
const featuredTrinkets = computed(() => trinkets.filter((item) => item.featured).slice(0, 4))

const activeTrinket = ref<TrinketItem | null>(null)

const getProjectCardClass = (index: number, total: number) => {
  if (index === total - 1 && total > 1) {
    return 'md:col-span-2 lg:col-span-3 row-span-1'
  }

  const lastFew = index >= total - 3
  if (lastFew && index !== total - 1) {
    return 'md:col-span-1 lg:col-span-1 row-span-1'
  }

  const pattern = [
    'md:col-span-2 lg:col-span-2 row-span-2',
    'md:col-span-1 lg:col-span-1 row-span-1',
    'md:col-span-1 lg:col-span-1 row-span-1',
    'md:col-span-2 lg:col-span-2 row-span-1',
    'md:col-span-1 lg:col-span-1 row-span-2',
    'md:col-span-1 lg:col-span-1 row-span-1',
    'md:col-span-1 lg:col-span-1 row-span-1',
    'md:col-span-1 lg:col-span-1 row-span-1',
  ]
  return pattern[index % pattern.length]
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
      <div class="mb-4 flex items-center justify-between gap-3">
        <h2 class="section-title mb-0">Latest Projects</h2>
        <NuxtLink to="/projects" class="eyebrow-link">View All</NuxtLink>
      </div>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 auto-rows-[300px] grid-flow-dense">
        <ProjectCard
          v-for="(item, index) in featuredProjects"
          :key="item.slug"
          :project="item"
          :class="getProjectCardClass(index, featuredProjects.length)"
        />
      </div>
    </section>

    <section class="page-section reveal-up">
      <div class="mb-4 flex items-center justify-between gap-3">
        <h2 class="section-title mb-0">Trinkets</h2>
        <NuxtLink to="/trinkets" class="eyebrow-link">View All</NuxtLink>
      </div>
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <TrinketCard
          v-for="item in featuredTrinkets"
          :key="item.id"
          :trinket="item"
          @select="activeTrinket = item"
        />
      </div>
    </section>

    <TrinketModal :open="Boolean(activeTrinket)" :trinket="activeTrinket" @close="activeTrinket = null" />
  </div>
</template>
