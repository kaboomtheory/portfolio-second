<script setup lang="ts">
const route = useRoute()
const { writings } = useMockContent()

const article = computed(() => writings.find((item) => item.id === route.params.id) || null)

useHead(() => ({
  title: article.value?.title || 'Writing',
}))
</script>

<template>
  <div class="page-content">
    <div class="page-section pb-0">
      <NuxtLink to="/writing" class="eyebrow-link">Back to Writing</NuxtLink>
    </div>

    <article v-if="article" class="space-y-5">
      <header class="space-y-3">
        <h1 class="text-4xl leading-tight md:text-5xl">{{ article.title }}</h1>
        <p class="text-lg" :style="{ color: 'var(--fg-primary)' }">{{ article.subtitle }}</p>
        <p class="text-xs uppercase tracking-[0.08em] muted">{{ article.date }}</p>
      </header>

      <img :src="article.heroImage" :alt="article.title" class="w-full rounded-xl border object-cover" :style="{ borderColor: 'var(--border)' }">

      <div class="flex flex-wrap gap-2">
        <span v-for="tag in article.tags" :key="tag" class="tag-chip">{{ tag }}</span>
      </div>

      <section class="card-surface space-y-4 p-5">
        <p v-for="paragraph in article.body" :key="paragraph" class="text-base leading-8">
          {{ paragraph }}
        </p>
      </section>
    </article>

    <section v-else class="card-surface p-5">
      <h2 class="text-2xl">Article Not Found</h2>
      <p class="mt-2">This placeholder entry does not exist.</p>
    </section>
  </div>
</template>
