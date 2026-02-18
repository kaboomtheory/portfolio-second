<script setup lang="ts">
definePageMeta({
  middleware: ['project-protect'],
})

const route = useRoute()
const { projects } = useMockContent()

const slug = computed(() => {
  const source = route.params.slug
  return Array.isArray(source) ? source.join('/') : String(source || '')
})

const project = computed(() => projects.find((item) => item.slug === slug.value) || null)
const caseSections = computed(() => project.value?.sections || [])
const featuredSection = computed(() => caseSections.value[0] || null)

useHead(() => ({
  title: project.value?.name || 'Project',
}))
</script>

<template>
  <div class="page-content">
    <div class="page-section pb-0">
      <div class="flex justify-start">
        <NuxtLink to="/projects" class="eyebrow-link">← Back to Projects</NuxtLink>
      </div>
    </div>

    <template v-if="project">
      <section class="page-section reveal-up pt-2">
        <h1 class="text-4xl leading-tight md:text-5xl">{{ project.name }}</h1>
        <p class="mt-3 text-lg" :style="{ color: 'var(--fg-primary)' }">{{ project.summary }}</p>
        <p class="mt-5 text-xs uppercase tracking-[0.08em] muted">{{ project.category }} • {{ project.year }}</p>
        <div class="mt-4 flex flex-wrap gap-2">
          <span v-for="tag in project.tags" :key="tag" class="tag-chip">{{ tag }}</span>
        </div>
      </section>

      <section v-if="featuredSection" class="page-section pt-4 md:pt-6">
        <ScrollExpandImage
          :src="featuredSection.image"
          :alt="`${project.name} cover`"
          :pre-expanded="true"
        />
      </section>

      <section class="space-y-20 md:space-y-24">
        <article
          v-for="(section, index) in caseSections"
          :key="section.heading"
          class="space-y-10 md:space-y-12"
        >
          <div class="space-y-2">
           <span class="text-[11px] uppercase tracking-[0.11em] muted block mb-2">{{ String(index + 1).padStart(2, '0') }}</span>
           <h2 class="text-3xl md:text-5xl font-light">{{ section.heading }}</h2>
          </div>
          <p class="text-lg leading-relaxed text-[var(--fg-secondary)] max-w-3xl">{{ section.body }}</p>
          <ScrollExpandImage
            v-if="index > 0 || !featuredSection"
            :src="section.image"
            :alt="section.heading"
            :pre-expanded="index === 0 && !featuredSection"
            class="mt-10 md:mt-12"
          />
        </article>
      </section>
    </template>

    <section v-else class="card-surface p-5">
      <h2 class="text-2xl">Project Not Found</h2>
      <p class="mt-2">This placeholder route does not include the requested case study.</p>
    </section>
  </div>
</template>
