<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useScrollRevealGroup } from '~/composables/useScrollReveal'
import { projectItemsFromSanityRaw, useSanityProjects } from '~/composables/useSanityProjects'
import type { ProjectItem, ProjectStorySection, SanityProjectItem } from '~/types/project'
import { sanitizeEmbedUrl } from '~/utils/embed'
import { normalizeProjectSlug } from '~/utils/projectSlug'

definePageMeta({
  middleware: 'project-protect'
})

const route = useRoute()
const { orderedProjects, loading: loadingList } = useSanityProjects()

const slug = computed(() => normalizeProjectSlug(route.params.slug))

const listProject = computed(() => orderedProjects.value.find((p) => p.slug === slug.value))

// Protected projects have their `sections` stripped from the public
// list, so fetch the authenticated per-slug endpoint when the listing
// marks this slug as protected. The server enforces the unlock
// cookie; if it rejects us, the protect middleware redirects to
// /password/<slug> on the next nav.
const protectedRaw = ref<SanityProjectItem | null>(null)
const loadingProtected = ref(false)

async function fetchProtected(targetSlug: string) {
  if (!targetSlug) return
  loadingProtected.value = true
  try {
    protectedRaw.value = await $fetch<SanityProjectItem>(
      `/api/project/${encodeURIComponent(targetSlug)}`,
    )
  } catch {
    protectedRaw.value = null
  } finally {
    loadingProtected.value = false
  }
}

watch(
  [() => listProject.value?.protected, slug],
  ([isProtected, currentSlug]) => {
    if (isProtected && currentSlug && protectedRaw.value?.slug?.current !== currentSlug) {
      fetchProtected(currentSlug)
    }
  },
  { immediate: true },
)

const protectedProject = computed<ProjectItem | undefined>(() => {
  if (!protectedRaw.value) return undefined
  return projectItemsFromSanityRaw([protectedRaw.value])[0]
})

const project = computed<ProjectItem | undefined>(() =>
  listProject.value?.protected ? protectedProject.value : listProject.value,
)

const loading = computed(
  () =>
    loadingList.value
    || (Boolean(listProject.value?.protected) && !protectedProject.value && loadingProtected.value),
)

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
        class="back-link mb-8 inline-flex items-center gap-2 text-sm transition-colors"
      >
        <span>← Back to Projects</span>
      </NuxtLink>

      <div class="hero-header">
        <h1 class="text-4xl font-bold md:text-5xl">
          {{ project.name }}
        </h1>
        <p class="mt-4 max-w-3xl text-lg">
          {{ project.summary }}
        </p>
        <div v-if="project.tags?.length" class="mt-4 flex flex-wrap gap-2">
          <span
            v-for="tag in project.tags"
            :key="tag"
            class="tag-chip"
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
            <h2 v-if="section.heading" class="section-heading">
              {{ section.heading }}
            </h2>
            <p v-if="section.body" class="section-body mt-3">
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
              <h2 v-if="section.heading" class="section-heading">
                {{ section.heading }}
              </h2>
              <p v-if="section.body" class="section-body mt-3">
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
            <div v-if="sanitizeEmbedUrl(section.url)" class="aspect-video overflow-hidden rounded-lg">
              <iframe
                :src="sanitizeEmbedUrl(section.url) || ''"
                class="h-full w-full"
                frameborder="0"
                loading="lazy"
                referrerpolicy="no-referrer"
                sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              />
            </div>
            <p v-else class="rounded-md border border-dashed p-4 text-sm text-muted">
              Embed blocked: only YouTube and Vimeo URLs are allowed.
            </p>
            <p v-if="section.caption" class="mt-3 text-center text-sm text-muted">
              {{ section.caption }}
            </p>
          </div>

          <!-- Quote -->
          <div v-else-if="section.type === 'quote'" class="mx-auto max-w-3xl">
            <blockquote class="project-quote pl-6 text-2xl italic">
              "{{ section.body }}"
            </blockquote>
            <div v-if="section.author" class="mt-4 pl-6">
              <p class="font-semibold section-body">{{ section.author }}</p>
              <p v-if="section.role" class="text-sm text-muted">{{ section.role }}</p>
            </div>
          </div>

          <!-- Stats Row -->
          <div v-else-if="section.type === 'statsRow'" class="flex flex-wrap justify-center gap-8 md:gap-16">
            <div v-for="(stat, statIndex) in section.stats" :key="statIndex" class="text-center">
              <p class="stat-value text-4xl font-bold">{{ stat.value }}</p>
              <p class="mt-1 text-sm uppercase tracking-wide text-muted">{{ stat.label }}</p>
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
              <h2 v-if="section.heading" class="section-heading">
                {{ section.heading }}
              </h2>
              <p v-if="section.body" class="section-body mt-3">
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
        class="project-pager mt-14 flex flex-col gap-4 pt-10 md:flex-row md:items-center md:justify-between"
        aria-label="Project navigation"
      >
        <NuxtLink
          v-if="prevProject"
          :to="`/projects/${prevProject.slug}`"
          class="pager-link inline-flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <Icon icon="lucide:arrow-left" class="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            <span class="pager-label block text-meta">Previous</span>
            {{ prevProject.name }}
          </span>
        </NuxtLink>
        <span v-else class="hidden md:block md:w-40" />

        <NuxtLink
          v-if="nextProject"
          :to="`/projects/${nextProject.slug}`"
          class="pager-link inline-flex items-center gap-2 text-right text-sm font-medium transition-colors md:ml-auto"
        >
          <span>
            <span class="pager-label block text-meta">Next</span>
            {{ nextProject.name }}
          </span>
          <Icon icon="lucide:arrow-right" class="h-4 w-4 shrink-0" aria-hidden="true" />
        </NuxtLink>
      </nav>
    </section>
  </div>
</template>

<style scoped>
.back-link {
  color: var(--fg-muted);
}
.back-link:hover {
  color: var(--emphasis);
}

.hero-header {
  animation: hero-reveal 0.6s ease-out forwards;
  margin-bottom: var(--space-xl);
}

.section-heading {
  font-size: 1.5rem;
  font-weight: 650;
  color: var(--fg-primary);
}

.section-body {
  color: var(--fg-secondary);
}

.project-quote {
  color: var(--fg-primary);
}

.stat-value {
  color: var(--accent);
}

.pager-link {
  color: var(--fg-secondary);
}
.pager-link:hover {
  color: var(--emphasis);
}

.pager-label {
  color: var(--fg-muted);
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
  gap: var(--space-xl);
}

@media (min-width: 768px) {
  .project-sections-stack {
    gap: var(--space-2xl);
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
