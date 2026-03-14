<script setup lang="ts">
const { projects, loading } = useSanityProjects()

const selectedCategory = ref('all')

const categories = computed(() => {
  const cats = projects.value.map((item) => item.category)
  return ['all', ...new Set(cats)]
})

const filteredProjects = computed(() => {
  if (selectedCategory.value === 'all') {
    return projects.value
  }

  return projects.value.filter((item) => item.category === selectedCategory.value)
})

useHead({ title: 'Projects' })
</script>

<template>
  <div class="page-content">
    <PageHeader
      title="Projects"
      description="Placeholder project archive with category filtering and case study routes."
    />

    <section class="page-section pt-0">
      <!-- Loading state -->
      <div v-if="loading && projects.length === 0" class="text-center text-gray-500 py-12">
        Loading projects...
      </div>

      <!-- Empty state -->
      <div v-else-if="!loading && projects.length === 0" class="text-center text-gray-500 py-12">
        No projects found. Check Sanity Studio configuration.
      </div>

      <!-- Projects grid -->
      <template v-else>
        <ul class="filter-row">
          <li v-for="category in categories" :key="category">
            <button
              type="button"
              class="filter-pill"
              :class="{ 'filter-pill-active': selectedCategory === category }"
              :style="{
                opacity: selectedCategory === category ? '1' : '0.78',
              }"
              @click="selectedCategory = category"
            >
              {{ category === 'all' ? 'All' : category }}
            </button>
          </li>
        </ul>

        <div class="grid gap-5 sm:grid-cols-2 md:gap-6">
          <ProjectCard v-for="project in filteredProjects" :key="project.slug" :project="project" />
        </div>
      </template>
    </section>
  </div>
</template>
