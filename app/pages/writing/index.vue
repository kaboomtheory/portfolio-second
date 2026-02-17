<script setup lang="ts">
const { writings } = useMockContent()

useHead({ title: 'Writing' })
</script>

<template>
  <div class="page-content">
    <PageHeader
      title="Writing"
      description="Placeholder essays, reflections, and process notes in the same route structure as the source portfolio."
    />

    <section class="grid gap-4 sm:grid-cols-2">
      <NuxtLink
        v-for="item in writings"
        :key="item.id"
        :to="`/writing/${item.id}`"
        class="card-surface block overflow-hidden transition-transform duration-200 hover:-translate-y-1"
      >
        <img :src="item.heroImage" :alt="item.title" class="aspect-video w-full object-cover">
        <div class="space-y-2 p-4">
          <p class="text-xs uppercase tracking-[0.08em] muted">{{ item.date }}</p>
          <h2 class="text-2xl">{{ item.title }}</h2>
          <p class="text-sm">{{ item.excerpt }}</p>
          <div class="flex flex-wrap gap-2 pt-1">
            <span v-for="tag in item.tags" :key="tag" class="tag-chip">{{ tag }}</span>
          </div>
        </div>
      </NuxtLink>
    </section>
  </div>
</template>
