<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useScrollRevealGroup } from '~/composables/useScrollReveal'
import type { ProjectItem, ProjectStorySection } from '~/types/project'

definePageMeta({
  middleware: 'project-protect'
})

const route = useRoute()
const { orderedProjects, loading } = useSanityProjects()

const slug = computed(() => {
  const source = route.params.slug
  return Array.isArray(source) ? source[0] : String(source || '')
})

const project = computed(() => orderedProjects.value.find((p) => p.slug === slug.value))

const projectIndex = computed(() =>
  orderedProjects.value.findIndex((p) => p.slug === slug.value),
)

const prevProject = computed((): ProjectItem | null => {
  const i = projectIndex.value
  if (i <= 0) return null
  return orderedProjects.value[i - 1] ?? null
})

const nextProject = computed((): ProjectItem | null => {
  const i = projectIndex.value
  if (i < 0 || i >= orderedProjects.value.length - 1) return null
  return orderedProjects.value[i + 1] ?? null
})

watchEffect(() => {
  if (!loading.value && !project.value) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Project Not Found',
    })
  }
})

useHead({
  title: () => project.value?.name || 'Project',
})

/** Upper bound for scroll-reveal slots (Sanity sections vary). */
const revealSlotCount = 48
const { containerRef: sectionsContainerRef, visibleItems } = useScrollRevealGroup(revealSlotCount, {
  threshold: 0.1,
  rootMargin: '0px 0px -80px 0px',
  staggerDelay: 80,
})

const firstImageSectionIndex = computed(() => {
  if (!project.value?.sections) return -1
  return project.value.sections.findIndex((section) =>
    section.type === 'singleImage' ||
    section.type === 'imageGallery' ||
    section.type === 'imageTextBlock' ||
    ((section.type === 'section' || !section.type) && section.image),
  )
})

function isMediaSection(section: ProjectStorySection): boolean {
  if (section.type === 'singleImage' || section.type === 'imageGallery' || section.type === 'imageTextBlock') {
    return true
  }
  if (section.type === 'videoEmbed') return true
  if (section.type === 'statsRow') return true
  if (section.type === 'section' || !section.type) return Boolean(section.image)
  return false
}
</script>

<template>
  <div v-if="loading" class="page-content py-16">
    <div class="project-detail-skeleton animate-pulse space-y-6" aria-busy="true" aria-label="Loading project">
      <div class="h-4 w-32 rounded bg-[var(--bg-tertiary)]" />
      <div class="h-10 max-w-md rounded bg-[var(--bg-tertiary)]" />
      <div class="h-20 max-w-2xl rounded bg-[var(--bg-tertiary)]" />
      <div class="mt-10 aspect-[4/3] max-w-4xl rounded-xl bg-[var(--bg-tertiary)]" />
    </div>
  </div>
  <div v-else-if="project" class="page-content">
    <section class="page-section">
      <NuxtLink
        to="/"
        class="mb-8 inline-flex items-center gap-2 text-sm transition-colors hover:text-[var(--emphasis)]"
        :style="{ color: 'var(--fg-muted)' }"
      >
        <span>← Back to Projects</span>
      </NuxtLink>

      <div class="hero-header">
        <p class="text-xs uppercase tracking-[0.12em]" :style="{ color: 'var(--accent-soft)' }">
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

      <div ref="sectionsContainerRef" class="project-sections-stack content-flow">
        <section
          v-for="(section, index) in project.sections"
          :key="index"
          class="project-section"
          :class="{
            'is-visible': visibleItems[index],
            'project-section--media': isMediaSection(section),
          }"
        >
          <!-- Text Section -->
          <div v-if="section.type === 'textSection' || (!section.type && (section.heading || section.body))" class="max-w-3xl">
            <h2 v-if="section.heading" class="text-2xl font-semibold" :style="{ color: 'var(--fg-primary)' }">
              {{ section.heading }}
            </h2>
            <p v-if="section.body" class="mt-3" :style="{ color: 'var(--fg-secondary)' }">
              {{ section.body }}
            </p>
          </div>

          <!-- Single Image -->
          <ScrollExpandImage
            v-else-if="section.type === 'singleImage'"
            :src="section.image || ''"
            :alt="section.caption || `Image ${index + 1}`"
            :caption="section.caption"
            :layout="section.layout as 'full' | 'large' | 'medium'"
            :pre-expanded="index === firstImageSectionIndex"
          />

          <!-- Image Gallery -->
          <div v-else-if="section.type === 'imageGallery'" :class="{
            'gallery-grid grid gap-4': section.layout !== 'masonry',
            'grid-cols-2': section.layout === 'two-col',
            'grid-cols-3': section.layout === 'three-col',
            'grid-cols-4': section.layout === 'four-col',
            'columns-2 md:columns-3 gap-4 space-y-4': section.layout === 'masonry',
          }">
            <div
              v-for="(img, imgIndex) in section.images"
              :key="imgIndex"
              :class="{ 'break-inside-avoid': section.layout === 'masonry' }"
            >
              <ScrollExpandImage
                :src="img.image"
                :alt="img.alt || `Gallery image ${imgIndex + 1}`"
                :caption="img.caption"
                :pre-expanded="index === firstImageSectionIndex && imgIndex === 0"
              />
            </div>
          </div>

          <!-- Image + Text Block -->
          <div v-else-if="section.type === 'imageTextBlock'" class="flex flex-col gap-8 md:flex-row" :class="{ 'md:flex-row-reverse': section.position === 'right' }">
            <div class="flex-1">
              <ScrollExpandImage
                :src="section.image || ''"
                :alt="section.heading || `Image ${index + 1}`"
                :pre-expanded="index === firstImageSectionIndex"
              />
            </div>
            <div class="flex-1 max-w-xl">
              <h2 v-if="section.heading" class="text-2xl font-semibold" :style="{ color: 'var(--fg-primary)' }">
                {{ section.heading }}
              </h2>
              <p v-if="section.body" class="mt-3" :style="{ color: 'var(--fg-secondary)' }">
                {{ section.body }}
              </p>
            </div>
          </div>

          <!-- Video Embed -->
          <div v-else-if="section.type === 'videoEmbed'" :class="{
            'max-w-full': section.layout === 'full',
            'max-w-5xl mx-auto': section.layout === 'large',
            'max-w-3xl mx-auto': section.layout === 'medium' || !section.layout,
          }">
            <div class="aspect-video overflow-hidden rounded-lg">
              <iframe
                :src="section.url"
                class="h-full w-full"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              />
            </div>
            <p v-if="section.caption" class="mt-3 text-center text-sm" :style="{ color: 'var(--fg-muted)' }">
              {{ section.caption }}
            </p>
          </div>

          <!-- Quote -->
          <div v-else-if="section.type === 'quote'" class="mx-auto max-w-3xl">
            <blockquote class="border-l-4 pl-6 text-2xl italic" :style="{ borderColor: 'var(--emphasis)', color: 'var(--fg-primary)' }">
              "{{ section.body }}"
            </blockquote>
            <div v-if="section.author" class="mt-4 pl-6">
              <p class="font-semibold" :style="{ color: 'var(--fg-secondary)' }">{{ section.author }}</p>
              <p v-if="section.role" class="text-sm" :style="{ color: 'var(--fg-muted)' }">{{ section.role }}</p>
            </div>
          </div>

          <!-- Stats Row -->
          <div v-else-if="section.type === 'statsRow'" class="flex flex-wrap justify-center gap-8 md:gap-16">
            <div v-for="(stat, statIndex) in section.stats" :key="statIndex" class="text-center">
              <p class="text-4xl font-bold" :style="{ color: 'var(--emphasis)' }">{{ stat.value }}</p>
              <p class="mt-1 text-sm uppercase tracking-wide" :style="{ color: 'var(--fg-muted)' }">{{ stat.label }}</p>
            </div>
          </div>

          <!-- Spacer -->
          <div v-else-if="section.type === 'spacer'" :class="{
            'h-8': section.size === 'small',
            'h-16': section.size === 'medium' || !section.size,
            'h-24': section.size === 'large',
          }" />

          <!-- Legacy Section (fallback) -->
          <div v-else-if="section.type === 'section' || !section.type">
            <div v-if="section.heading || section.body" class="mb-6 max-w-3xl">
              <h2 v-if="section.heading" class="text-2xl font-semibold" :style="{ color: 'var(--fg-primary)' }">
                {{ section.heading }}
              </h2>
              <p v-if="section.body" class="mt-3" :style="{ color: 'var(--fg-secondary)' }">
                {{ section.body }}
              </p>
            </div>
            <ScrollExpandImage
              v-if="section.image"
              :src="section.image"
              :alt="section.heading || `Section ${index + 1}`"
              :pre-expanded="index === firstImageSectionIndex"
            />
          </div>
        </section>
      </div>

      <nav
        class="project-pager mt-14 flex flex-col gap-4 border-t border-[var(--border)] pt-10 md:flex-row md:items-center md:justify-between"
        aria-label="Project navigation"
      >
        <NuxtLink
          v-if="prevProject"
          :to="`/projects/${prevProject.slug}`"
          class="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-[var(--emphasis)]"
          :style="{ color: 'var(--fg-secondary)' }"
        >
          <Icon icon="lucide:arrow-left" class="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            <span class="block text-xs uppercase tracking-[0.1em] text-[var(--fg-muted)]">Previous</span>
            {{ prevProject.name }}
          </span>
        </NuxtLink>
        <span v-else class="hidden md:block md:w-40" />

        <NuxtLink
          v-if="nextProject"
          :to="`/projects/${nextProject.slug}`"
          class="inline-flex items-center gap-2 text-right text-sm font-medium transition-colors hover:text-[var(--emphasis)] md:ml-auto"
          :style="{ color: 'var(--fg-secondary)' }"
        >
          <span>
            <span class="block text-xs uppercase tracking-[0.1em] text-[var(--fg-muted)]">Next</span>
            {{ nextProject.name }}
          </span>
          <Icon icon="lucide:arrow-right" class="h-4 w-4 shrink-0" aria-hidden="true" />
        </NuxtLink>
      </nav>
    </section>
  </div>
</template>

<style scoped>
.hero-header {
  animation: hero-reveal 0.6s ease-out forwards;
  margin-bottom: 2rem;
}

@keyframes hero-reveal {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.project-section {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
}

.project-section.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.gallery-grid {
  display: grid;
}

.project-sections-stack {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

@media (min-width: 768px) {
  .project-sections-stack {
    gap: 3rem;
  }
}

.project-section--media + .project-section--media {
  margin-top: 0.5rem;
}

@media (min-width: 768px) {
  .project-section--media + .project-section--media {
    margin-top: 1rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-header,
  .project-section {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}
</style>
