<script setup lang="ts">
import type { TrinketItem } from '~/data/trinkets'

const { homeHero, currentStatus, writings, trinkets } = useMockContent()

const featuredWritings = computed(() => writings.slice(0, 2))
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
        <CtaButton to="/resume" label="View Resume" />
        <CtaButton href="mailto:hello@example.com" label="Open for Freelance" secondary with-dot />
      </div>
    </section>

    <section class="page-section reveal-up">
      <h2 class="section-title">Current Status</h2>
      <div class="grid gap-4 md:grid-cols-3">
        <article
          v-for="item in currentStatus"
          :key="item.title"
          class="card-surface space-y-3 p-4"
        >
          <p class="text-xs uppercase tracking-[0.08em] muted">{{ item.label }}</p>
          <h3 class="text-xl">{{ item.title }}</h3>
          <p class="text-sm">{{ item.content }}</p>
          <div class="grid grid-cols-2 gap-2">
            <img
              v-for="image in item.images"
              :key="image"
              :src="image"
              :alt="item.title"
              class="aspect-[4/3] w-full rounded-md object-cover"
            >
          </div>
        </article>
      </div>
    </section>

    <section class="page-section reveal-up">
      <div class="mb-4 flex items-center justify-between gap-3">
        <h2 class="section-title mb-0">Latest Articles</h2>
        <NuxtLink to="/writing" class="eyebrow-link">View All</NuxtLink>
      </div>
      <div class="grid gap-4 md:grid-cols-2">
        <NuxtLink
          v-for="item in featuredWritings"
          :key="item.id"
          :to="`/writing/${item.id}`"
          class="card-surface block overflow-hidden transition-colors duration-300"
        >
          <img :src="item.heroImage" :alt="item.title" class="aspect-video w-full object-cover transition-opacity duration-500">
          <div class="space-y-2 p-4">
            <p class="text-xs uppercase tracking-[0.08em] muted">{{ item.date }}</p>
            <h3 class="text-xl">{{ item.title }}</h3>
            <p class="text-sm">{{ item.excerpt }}</p>
          </div>
        </NuxtLink>
      </div>
    </section>

    <section class="page-section reveal-up">
      <div class="mb-4 flex items-center justify-between gap-3">
        <h2 class="section-title mb-0">Trinkets</h2>
        <NuxtLink to="/trinkets" class="eyebrow-link">View All</NuxtLink>
      </div>
      <div class="grid grid-cols-2 gap-4 md:grid-cols-3">
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
