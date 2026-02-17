<script setup lang="ts">
const { projects } = useMockContent()

const selectedCategory = ref('all')

const categories = computed(() => ['all', ...new Set(projects.map((item) => item.category))])

const filteredProjects = computed(() => {
  if (selectedCategory.value === 'all') {
    return projects
  }

  return projects.filter((item) => item.category === selectedCategory.value)
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

      <div class="grid gap-4 sm:grid-cols-2">
        <ProjectCard v-for="project in filteredProjects" :key="project.slug" :project="project" />
      </div>
    </section>
  </div>
</template>
