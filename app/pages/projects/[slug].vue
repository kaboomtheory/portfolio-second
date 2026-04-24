<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useScrollRevealGroup } from '~/composables/useScrollReveal'
import { projectItemsFromSanityRaw, useSanityProjects } from '~/composables/useSanityProjects'
import type { ProjectItem, ProjectStorySection, SanityProjectItem } from '~/types/project'
import { useInPageHashLink } from '~/composables/useInPageHashLink'
import { sanitizeEmbedUrl } from '~/utils/embed'
import { normalizeProjectSlug } from '~/utils/projectSlug'

const backToWorkHref = '/#work'
const { onInPageHashLinkClick } = useInPageHashLink()

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

const { siteUrl, siteDescription } = useRuntimeConfig().public

const defaultOgImage = `${String(siteUrl).replace(/\/$/, '')}/og-default.png`

const projectCanonicalUrl = computed(() =>
  `${String(siteUrl).replace(/\/$/, '')}/projects/${slug.value}`,
)

const pageDescription = computed(() => {
  const s = project.value?.summary?.trim()
  return s || String(siteDescription)
})

const pageOgImage = computed(() => {
  const t = project.value?.thumbnail?.trim()
  if (!t) return defaultOgImage
  return t.startsWith('http') ? t : `${String(siteUrl).replace(/\/$/, '')}${t}`
})

const creativeWorkJsonLd = computed(() => {
  const p = project.value
  if (!p) return null
  const base = String(siteUrl).replace(/\/$/, '')
  const thumb = p.thumbnail?.trim()
  const imageUrl = thumb
    ? (thumb.startsWith('http') ? thumb : `${base}${thumb}`)
    : defaultOgImage
  const desc = p.summary?.trim() || String(siteDescription)
  const work: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: p.name,
    description: desc,
    image: imageUrl,
    url: `${base}/projects/${slug.value}`,
    author: {
      '@type': 'Person',
      name: 'Bryan X. Mendez',
      url: `${base}/`,
    },
  }
  if (p.tags?.length) {
    work.keywords = p.tags.join(', ')
  }
  if (p.client?.trim()) {
    work.publisher = {
      '@type': 'Organization',
      name: p.client.trim(),
    }
  }
  return work
})

useSeoMeta({
  title: () => project.value?.name || 'Project',
  description: () => pageDescription.value,
  ogTitle: () => (project.value?.name ? `${project.value.name} — Bryan X. Mendez` : 'Bryan X. Mendez'),
  ogDescription: () => pageDescription.value,
  ogUrl: () => projectCanonicalUrl.value,
  ogImage: () => pageOgImage.value,
  twitterCard: 'summary_large_image',
  twitterTitle: () => (project.value?.name ? `${project.value.name} — Bryan X. Mendez` : 'Bryan X. Mendez'),
  twitterDescription: () => pageDescription.value,
  twitterImage: () => pageOgImage.value,
})

useHead(() => {
  const json = creativeWorkJsonLd.value
  return {
    link: [{ rel: 'canonical', href: projectCanonicalUrl.value }],
    script: json
      ? [
          {
            key: 'ldjson-creative-work',
            type: 'application/ld+json',
            children: JSON.stringify(json),
          },
        ]
      : [],
  }
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

/** `sizes` for half-width two-column images (phone / tablet / desktop). */
const twoColImageSizes
  = '(max-width: 639px) 100vw, (max-width: 1023px) 50vw, min(50vw, 48rem)'

function chunkImagePairs<T>(items: T[]): T[][] {
  const rows: T[][] = []
  for (let i = 0; i < items.length; i += 2) {
    rows.push(items.slice(i, i + 2))
  }
  return rows
}

const twoColAspects = ref<Record<string, number>>({})

function twoColKey(sectionIndex: number, rowIndex: number, itemIndex: number) {
  return `${sectionIndex}:${rowIndex}:${itemIndex}`
}

function setTwoColAspect(sectionIndex: number, rowIndex: number, itemIndex: number, ratio: number) {
  if (!Number.isFinite(ratio) || ratio <= 0) return
  twoColAspects.value[twoColKey(sectionIndex, rowIndex, itemIndex)] = ratio
}

function twoColItemStyle(sectionIndex: number, rowIndex: number, itemIndex: number) {
  const ratio = twoColAspects.value[twoColKey(sectionIndex, rowIndex, itemIndex)] ?? 1
  return {
    flexGrow: String(ratio),
    flexShrink: '1',
    flexBasis: '0',
  }
}

function twoColRowStyle(sectionIndex: number, rowIndex: number) {
  const a0 = twoColAspects.value[twoColKey(sectionIndex, rowIndex, 0)] ?? 1
  const a1 = twoColAspects.value[twoColKey(sectionIndex, rowIndex, 1)] ?? 1
  const sum = a0 + a1
  return { maxWidth: `calc(95vh * ${sum})` }
}
</script>

<template>
  <div
    v-if="loading"
    class="page-content content-flow min-w-0 py-16 [overflow-x:clip]"
  >
    <div class="project-viewport-frame mx-auto w-full min-w-0 max-w-full px-4 sm:px-[clamp(1.1rem,3.2vw,2.5rem)]">
      <div
        class="project-detail-skeleton animate-pulse space-y-6"
        aria-busy="true"
        aria-label="Loading project"
      >
        <div class="h-4 w-32 rounded bg-[var(--bg-tertiary)]" />
        <div class="h-10 max-w-md rounded bg-[var(--bg-tertiary)]" />
        <div class="h-20 max-w-2xl rounded bg-[var(--bg-tertiary)]" />
        <div class="mt-10 aspect-[4/3] max-w-4xl rounded-xl bg-[var(--bg-tertiary)]" />
      </div>
    </div>
  </div>
  <div
    v-else-if="project"
    class="page-content content-flow min-w-0 [overflow-x:clip]"
  >
    <div class="project-viewport-frame project-detail-page mx-auto w-full min-w-0 max-w-full px-4 sm:px-[clamp(1.1rem,3.2vw,2.5rem)]">
    <section class="page-section">
      <NuxtLink
        :to="backToWorkHref"
        class="back-link mb-8 inline-flex items-center gap-2 text-sm transition-colors"
        @click="(e) => onInPageHashLinkClick(e, backToWorkHref)"
      >
        <span>← Back to work</span>
      </NuxtLink>

      <div class="hero-header">
        <h1 class="project-hero-title font-display">
          {{ project.name }}
        </h1>
        <p class="mt-4 max-w-3xl text-base leading-relaxed sm:text-lg">
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

          <!-- Image Gallery (two-col: sm+ pairs; &lt;sm stacked) -->
          <div
            v-else-if="section.type === 'imageGallery' && section.layout === 'two-col' && section.images?.length"
            class="project-two-col-gallery flex w-full min-w-0 max-w-full flex-col gap-4 sm:gap-6 md:gap-7"
          >
            <div
              v-for="(row, rowIndex) in chunkImagePairs(section.images)"
              :key="`tc-${rowIndex}`"
              class="gallery-two-col-row mx-auto flex w-full min-w-0 flex-col items-stretch gap-4 sm:flex-row sm:flex-nowrap sm:items-start sm:gap-2.5 md:gap-4"
              :style="row.length === 2 ? twoColRowStyle(index, rowIndex) : undefined"
            >
              <div
                v-for="(img, j) in row"
                :key="`tc-${rowIndex}-${j}-${String(img.image)}`"
                :class="{
                  'gallery-item--two-col min-w-0 flex flex-col': true,
                  'w-full': row.length === 1,
                }"
                :style="row.length === 2 ? twoColItemStyle(index, rowIndex, j) : undefined"
              >
                <ScrollExpandImage
                  :src="img.image"
                  :alt="img.alt || `Gallery image ${rowIndex * 2 + j + 1}`"
                  :caption="img.caption"
                  fit-mode="fillBox"
                  :img-sizes="twoColImageSizes"
                  :reserve-caption-gutter="row.length === 2"
                  :pre-expanded="index === firstImageSectionIndex && rowIndex === 0 && j === 0"
                  @aspect="(ratio) => setTwoColAspect(index, rowIndex, j, ratio)"
                />
              </div>
            </div>
          </div>

          <div
            v-else-if="section.type === 'imageGallery'"
            :class="{
              'columns-1 gap-4 space-y-4 sm:columns-2 lg:columns-3': section.layout === 'masonry',
              'gallery-grid grid gap-3 sm:gap-4': section.layout !== 'masonry',
              'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3': section.layout === 'three-col',
              'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4': section.layout === 'four-col',
            }"
          >
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
          <div v-else-if="section.type === 'imageTextBlock'" class="flex min-w-0 flex-col gap-8 md:flex-row" :class="{ 'md:flex-row-reverse': section.position === 'right' }">
            <div class="min-w-0 flex-1">
              <ScrollExpandImage
                :src="section.image || ''"
                :alt="section.heading || `Image ${index + 1}`"
                :pre-expanded="index === firstImageSectionIndex"
              />
            </div>
            <div class="min-w-0 flex-1 max-w-xl">
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
            <div v-if="sanitizeEmbedUrl(section.url)" class="aspect-video w-full max-w-full overflow-hidden rounded-lg">
              <iframe
                :title="section.caption || `Video: ${project.name}`"
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
            <blockquote class="project-quote pl-4 text-xl sm:pl-6 sm:text-2xl">
              <q>{{ section.body }}</q>
            </blockquote>
            <div v-if="section.author" class="mt-4 pl-4 sm:pl-6">
              <p class="font-semibold section-body">{{ section.author }}</p>
              <p v-if="section.role" class="text-sm text-muted">{{ section.role }}</p>
            </div>
          </div>

          <!-- Stats Row -->
          <div v-else-if="section.type === 'statsRow'" class="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-16">
            <div v-for="(stat, statIndex) in section.stats" :key="statIndex" class="min-w-0 max-w-[min(100%,14rem)] text-center">
              <p class="stat-value text-3xl font-bold sm:text-4xl">{{ stat.value }}</p>
              <p class="stat-label mt-1 text-sm uppercase text-muted">{{ stat.label }}</p>
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
          class="pager-link inline-flex min-w-0 max-w-full items-center gap-2 break-words text-sm font-medium transition-colors"
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
          class="pager-link inline-flex min-w-0 max-w-full items-center gap-2 break-words text-right text-sm font-medium transition-colors md:ml-auto"
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
  </div>
</template>

<style scoped>
.project-detail-page {
  --signal: var(--signal-peach);
  position: relative;
}

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

.project-hero-title {
  font-size: clamp(2.25rem, 4vw + 1rem, 3.25rem);
  font-weight: 600;
  line-height: 1.08;
  letter-spacing: -0.02em;
  color: var(--fg-primary);
  overflow-wrap: anywhere;
}

.section-heading {
  font-size: clamp(1.25rem, 0.6vw + 1.1rem, 1.5rem);
  font-weight: 650;
  color: var(--fg-primary);
  overflow-wrap: anywhere;
  hyphens: none;
}

.section-body {
  color: var(--fg-secondary);
}

.project-quote {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 400;
  color: var(--fg-primary);
}

.project-quote :deep(q) {
  font-style: inherit;
  quotes: auto;
}

.stat-label {
  letter-spacing: 0.08em;
  font-weight: 500;
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
  min-width: 0;
  max-width: 100%;
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

/* Two-col: flex row groups (see template); item stacks caption under image. */
.gallery-item--two-col {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

/* Side-by-side pair: equal-height justified row. Each cell's
   flex-grow is its image's aspect ratio; images are w-full / h-auto
   so all images land at the same rendered height (row width / sum of
   aspects). The row's max-width caps that height at 95vh. On &lt;sm,
   images stack one-per-row at natural height. */
@media (min-width: 640px) {
  .gallery-two-col-row {
    width: 100%;
  }
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
