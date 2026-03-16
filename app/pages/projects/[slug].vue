<script setup lang="ts">
definePageMeta({
  middleware: 'project-protect'
})

const route = useRoute()
const router = useRouter()
const { projects } = useSanityProjects()

const slug = computed(() => {
  const source = route.params.slug
  return Array.isArray(source) ? source[0] : String(source || '')
})

const project = computed(() => 
  projects.value.find(p => p.slug === slug.value)
)

if (!project.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Project Not Found'
  })
}

useHead({
  title: project.value.name,
})
</script>

<template>
  <div v-if="project" class="page-content">
    <section class="page-section">
      <button
        type="button"
        class="mb-8 flex items-center gap-2 text-sm transition-colors hover:text-[var(--accent)]"
        :style="{ color: 'var(--fg-muted)' }"
        @click="router.back()"
      >
        <span>← Back</span>
      </button>

      <div class="mb-8">
        <p class="text-xs uppercase tracking-[0.12em]" :style="{ color: 'var(--fg-muted)' }">
          {{ project.category }} • {{ project.year }}
        </p>
        <h1 class="mt-2 text-4xl font-bold md:text-5xl" :style="{ color: 'var(--fg-primary)' }">
          {{ project.name }}
        </h1>
        <p class="mt-4 max-w-3xl text-lg" :style="{ color: 'var(--fg-secondary)' }">
          {{ project.summary }}
        </p>
        <div v-if="project.tags" class="mt-4 flex flex-wrap gap-2">
          <span
            v-for="tag in project.tags"
            :key="tag"
            class="rounded-full px-3 py-1 text-xs"
            :style="{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--fg-muted)' }"
          >
            {{ tag }}
          </span>
        </div>
      </div>

      <div class="space-y-16">
        <section
          v-for="(section, index) in project.sections"
          :key="index"
          class="reveal-up"
        >
          <div v-if="section.heading || section.body" class="mb-6 max-w-3xl">
            <h2 v-if="section.heading" class="text-2xl font-semibold" :style="{ color: 'var(--fg-primary)' }">
              {{ section.heading }}
            </h2>
            <p v-if="section.body" class="mt-3" :style="{ color: 'var(--fg-secondary)' }">
              {{ section.body }}
            </p>
          </div>
          <div v-if="section.image" class="overflow-hidden rounded-lg">
            <img
              :src="section.image"
              :alt="section.heading || `Section ${index + 1}`"
              class="w-full object-cover"
              loading="lazy"
            >
          </div>
        </section>
      </div>
    </section>
  </div>
</template>
