<script setup lang="ts">
const { experiences, clients } = useMockContent()

useHead({ title: 'Resume' })
</script>

<template>
  <div class="page-content">
    <PageHeader
      title="Resume"
      description="Placeholder resume page with role history and selected client engagements."
    />

    <section class="space-y-4">
      <h2 class="section-title">Work Experience</h2>
      <article
        v-for="item in experiences"
        :key="`${item.company}-${item.year}`"
        class="card-surface grid gap-4 p-4 md:grid-cols-[auto_1fr_auto] md:items-start"
      >
        <img :src="item.image" :alt="item.company" loading="lazy" class="h-12 w-12 rounded-md object-cover">
        <div class="space-y-1">
          <p class="text-xs uppercase tracking-[0.08em] muted">{{ item.company }}</p>
          <h3 class="text-xl">{{ item.title }}</h3>
          <p class="text-sm">{{ item.description }}</p>
        </div>
        <p class="text-xs uppercase tracking-[0.08em] muted">{{ item.year }}</p>
      </article>
    </section>

    <section class="mt-6 space-y-4">
      <h2 class="section-title">Selected Clients</h2>
      <article v-for="client in clients" :key="client.name" class="card-surface grid gap-3 p-4 md:grid-cols-[1fr_2fr_auto] md:items-center">
        <h3 class="text-lg">{{ client.name }}</h3>
        <div class="flex flex-wrap gap-2">
          <span v-for="tag in client.tags" :key="tag" class="tag-chip">{{ tag }}</span>
        </div>
        <p class="text-xs uppercase tracking-[0.08em] muted">{{ client.year }}</p>
      </article>
    </section>
  </div>
</template>
