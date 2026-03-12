<script setup lang="ts">
definePageMeta({
  middleware: ['project-protect'],
})

const route = useRoute()
const { projects } = useSanityProjects()

const slug = computed(() => {
  const source = route.params.slug
  return Array.isArray(source) ? source.join('/') : String(source || '')
})

const project = computed(() => projects.value.find((item) => item.slug === slug.value) || null)
const caseSections = computed(() => project.value?.sections || [])
const featuredSection = computed(() => {
  const first = caseSections.value[0]
  if (!first) return null
  if (first.type === 'section' || first.type === 'singleImage' || first.type === 'imageGallery') {
    return first
  }
  return null
})

useHead(() => ({
  title: project.value?.name || 'Project',
}))

function getSectionNumber(sections: typeof caseSections.value, currentIndex: number): string {
  let count = 0
  for (let i = 0; i <= currentIndex; i++) {
    if (sections[i]?.heading || sections[i]?.type === 'textSection') {
      count++
    }
  }
  return String(count).padStart(2, '0')
}

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/)
  return match ? match[1] : null
}

function getVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/)
  return match ? match[1] : null
}

function getGalleryClass(layout?: string): string {
  return 'gallery-grid'
}

function getGalleryStyle(layout?: string): Record<string, string> {
  switch (layout) {
    case 'two-col':
      return { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }
    case 'three-col':
      return { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }
    case 'four-col':
      return { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }
    case 'masonry':
      return { columnCount: '2', columnGap: '1rem' }
    default:
      return { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }
  }
}
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

      <!-- Featured/First Image -->
      <section v-if="featuredSection" class="page-section pt-4 md:pt-6">
        <ScrollExpandImage
          v-if="featuredSection.type === 'section' || featuredSection.type === 'singleImage'"
          :src="featuredSection.image"
          :alt="`${project.name} cover`"
          :pre-expanded="true"
        />
        <div
          v-else-if="featuredSection.type === 'imageGallery'"
          :style="getGalleryStyle(featuredSection.layout)"
        >
          <ScrollExpandImage
            v-for="(img, imgIndex) in featuredSection.images"
            :key="imgIndex"
            :src="img.image"
            :alt="img.alt || `${project.name} image ${imgIndex + 1}`"
            :pre-expanded="true"
          />
        </div>
      </section>

      <!-- Content Sections -->
      <section class="space-y-24 md:space-y-32">
        <template v-for="(section, index) in caseSections" :key="index">
          <!-- Skip first section if it was used as featured -->
          <template v-if="index > 0 || !featuredSection">
            
            <!-- Text Section -->
            <article
              v-if="section.type === 'textSection' || section.type === 'section' || (!section.type && (section.heading || section.body))"
              class="space-y-10 md:space-y-12"
            >
              <div v-if="section.heading" class="space-y-2">
                <span class="text-[11px] uppercase tracking-[0.11em] muted block mb-2">{{ getSectionNumber(caseSections, index) }}</span>
                <h2 class="text-3xl md:text-5xl font-light">{{ section.heading }}</h2>
              </div>
              <p v-if="section.body" class="text-lg leading-relaxed text-[var(--fg-secondary)] max-w-3xl">{{ section.body }}</p>
              <ScrollExpandImage
                v-if="section.image"
                :src="section.image"
                :alt="section.heading || `${project.name} image ${index + 1}`"
                class="mt-10 md:mt-12"
              />
            </article>

            <!-- Single Image -->
            <article v-else-if="section.type === 'singleImage'" class="page-section">
              <ScrollExpandImage
                :src="section.image"
                :alt="section.caption || `${project.name} image`"
                :class="{
                  'w-full': section.layout === 'full',
                }"
              />
              <p v-if="section.caption" class="mt-4 text-sm text-center muted">{{ section.caption }}</p>
            </article>

            <!-- Image Gallery -->
            <article v-else-if="section.type === 'imageGallery'" class="page-section">
              <div :style="getGalleryStyle(section.layout)">
                <ScrollExpandImage
                  v-for="(img, imgIndex) in section.images"
                  :key="imgIndex"
                  :src="img.image"
                  :alt="img.alt || `${project.name} image ${imgIndex + 1}`"
                  :style="section.layout === 'masonry' ? { breakInside: 'avoid', marginBottom: '1rem' } : {}"
                />
              </div>
            </article>

            <!-- Image + Text Block -->
            <article v-else-if="section.type === 'imageTextBlock'" class="page-section">
              <div
                class="flex flex-col md:flex-row gap-8 md:gap-12 items-center"
                :class="{ 'md:flex-row-reverse': section.position === 'right' }"
              >
                <div class="flex-1">
                  <ScrollExpandImage
                    :src="section.image"
                    :alt="section.heading || `${project.name} image`"
                  />
                </div>
                <div class="flex-1 space-y-4">
                  <h2 v-if="section.heading" class="text-2xl md:text-3xl font-light">{{ section.heading }}</h2>
                  <p v-if="section.body" class="text-lg leading-relaxed text-[var(--fg-secondary)]">{{ section.body }}</p>
                </div>
              </div>
            </article>

            <!-- Video Embed -->
            <article v-else-if="section.type === 'videoEmbed'" class="page-section">
        <div
          v-else-if="featuredSection.type === 'imageGallery'"
          :class="getGalleryClass(featuredSection.layout)"
        >
          <ScrollExpandImage
            v-for="(img, imgIndex) in featuredSection.images"
            :key="imgIndex"
            :src="img.image"
            :alt="img.alt || `${project.name} image ${imgIndex + 1}`"
            :pre-expanded="true"
          />
        </div>
              <p v-if="section.caption" class="mt-4 text-sm text-center muted">{{ section.caption }}</p>
            </article>

            <!-- Quote -->
            <article v-else-if="section.type === 'quote'" class="page-section max-w-3xl mx-auto text-center">
              <blockquote class="text-2xl md:text-3xl font-light italic leading-relaxed">
                "{{ section.body }}"
              </blockquote>
              <p v-if="section.author" class="mt-6 text-sm uppercase tracking-wider muted">
                — {{ section.author }}<span v-if="section.role">, {{ section.role }}</span>
              </p>
            </article>

            <!-- Stats Row -->
            <article v-else-if="section.type === 'statsRow'" class="page-section">
              <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div v-for="(stat, statIndex) in section.stats" :key="statIndex">
                  <div class="text-3xl md:text-4xl font-light">{{ stat.value }}</div>
                  <div class="mt-2 text-sm uppercase tracking-wider muted">{{ stat.label }}</div>
                </div>
              </div>
            </article>

            <!-- Spacer -->
            <div v-else-if="section.type === 'spacer'" :class="{
              'h-8': section.size === 'small',
              'h-16': section.size === 'medium' || !section.size,
              'h-32': section.size === 'large',
            }" />

          </template>
        </template>
      </section>
    </template>

    <section v-else class="card-surface p-5">
      <h2 class="text-2xl">Project Not Found</h2>
      <p class="mt-2">This placeholder route does not include the requested case study.</p>
    </section>
  </div>
</template>
