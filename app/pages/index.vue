<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { TrinketItem } from '~/data/trinkets'

const { homeHero, currentStatus, projects, trinkets } = useMockContent()

const featuredProjects = computed(() => projects.slice(0, 2))
const featuredTrinkets = computed(() => trinkets.filter((item) => item.featured).slice(0, 4))

const activeTrinket = ref<TrinketItem | null>(null)

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
      <h2 class="section-title">Current Status</h2>
      <div class="grid gap-4 md:grid-cols-3">
        <div v-for="item in currentStatus" :key="item.title" class="space-y-2">
          <p class="text-xs uppercase tracking-[0.08em] muted">{{ item.label }}</p>
          <article class="card-surface flex items-center gap-3 p-3">
            <div
              v-if="item.icon"
              class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md"
              :style="{ backgroundColor: 'var(--bg-tertiary)' }"
            >
              <Icon :icon="item.icon" class="text-lg" :style="{ color: 'var(--fg-muted)' }" />
            </div>
            <img
              v-else-if="item.images.length"
              :src="item.images[0]"
              :alt="item.title"
              loading="lazy"
              class="h-10 w-10 flex-shrink-0 rounded-md object-cover"
            >
            <div class="flex flex-col gap-0.5">
              <h3 class="text-sm font-semibold" :style="{ color: 'var(--fg-primary)' }">
                {{ item.title }}
              </h3>
              <p v-if="item.content" class="text-xs" :style="{ color: 'var(--fg-secondary)' }">{{ item.content }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="page-section reveal-up">
      <div class="mb-4 flex items-center justify-between gap-3">
        <h2 class="section-title mb-0">Latest Projects</h2>
        <NuxtLink to="/projects" class="eyebrow-link">View All</NuxtLink>
      </div>
      <div class="grid gap-4 md:grid-cols-2">
        <ProjectCard
          v-for="item in featuredProjects"
          :key="item.slug"
          :project="item"
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
