<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { StatusItem } from '~/data/home'
import { profile } from '~/data/site'
import { useSanityStatus } from '~/composables/useSanityStatus'
import { useSanityAbout } from '~/composables/useSanityAbout'

const { aboutMe: fallbackAboutMe, experiences: fallbackExperiences } = useMockContent()
const { homePage: cmsHome } = useSanityHome()
const { statusItems } = useSanityStatus()
const { aboutPage } = useSanityAbout()

useHead({ title: 'About' })

/** After mount, may switch to one loop for prefers-reduced-motion (SSR stays doubled for hydration match). */
const reduceTickerMotion = ref(false)

let motionPreferenceQuery: MediaQueryList | null = null

function syncReduceTickerMotion() {
  if (!import.meta.client || !motionPreferenceQuery) return
  reduceTickerMotion.value = motionPreferenceQuery.matches
}

onMounted(() => {
  motionPreferenceQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  syncReduceTickerMotion()
  motionPreferenceQuery.addEventListener('change', syncReduceTickerMotion)
})

onUnmounted(() => {
  motionPreferenceQuery?.removeEventListener('change', syncReduceTickerMotion)
})

const tickerCells = computed(() => {
  const items = statusItems.value
  const repeats = reduceTickerMotion.value ? 1 : 2
  const out: { item: StatusItem; key: string; showSep: boolean }[] = []
  for (let r = 0; r < repeats; r++) {
    for (let i = 0; i < items.length; i++) {
      const isLast = r === repeats - 1 && i === items.length - 1
      out.push({
        item: items[i]!,
        key: `ticker-${r}-${i}`,
        showSep: !isLast,
      })
    }
  }
  return out
})

// CMS data with fallback to hardcoded content
const hero = computed(() => {
  const fromCms = aboutPage.value?.hero
  if (fromCms) {
    return {
      name: fromCms.name,
      avatar: fromCms.avatar ?? fallbackAboutMe.avatar,
      availabilityText: fromCms.availabilityText || 'Available for freelance',
    }
  }
  return {
    name: fallbackAboutMe.name,
    avatar: fallbackAboutMe.avatar,
    availabilityText: 'Available for freelance',
  }
})

const story = computed(() =>
  aboutPage.value?.story?.length ? aboutPage.value.story : fallbackAboutMe.story,
)

const experienceItems = computed(() =>
  aboutPage.value?.experiences?.length ? aboutPage.value.experiences : fallbackExperiences,
)

const capabilities = computed(() => {
  if (aboutPage.value?.capabilities?.length) return aboutPage.value.capabilities
  // Fallback: merge old skills + tools into flat shape
  return [
    ...fallbackAboutMe.skills.flatMap((g) =>
      g.items.map((name) => ({ name, category: g.category })),
    ),
    ...fallbackAboutMe.tools.map((name) => ({ name, category: 'Software' })),
  ]
})

const groupedCapabilities = computed(() => {
  const groups: Record<string, string[]> = {}
  for (const cap of capabilities.value) {
    (groups[cap.category] ??= []).push(cap.name)
  }
  return Object.entries(groups).map(([category, items]) => ({ category, items }))
})

const resumeHref = computed(() =>
  aboutPage.value?.resumeUrl || '/Bryan_Mendez_resume_2025-1.pdf',
)

const heroEmail = computed(() => cmsHome.value?.email || profile.email)

const availabilityMailto = computed(() => `mailto:${heroEmail.value}`)

/** Match home hero OPEN TO WORK: all-caps label with preserve-case typography */
const availabilityCtaLabel = computed(() =>
  (hero.value.availabilityText || 'Available for freelance').toLocaleUpperCase('en-US'),
)
</script>

<template>
  <div class="page-content content-flow about-page">
    <!-- Hero Section -->
    <section class="hero-section reveal-up">
      <div class="hero-grid">
        <div class="hero-content">
          <div class="hero-about-ctas">
            <CtaButton
              :href="resumeHref"
              label="Download Resume"
              attention
              target="_blank"
            >
              <template #icon><Icon icon="lucide:download" class="text-sm" /></template>
            </CtaButton>
          </div>

          <TextReveal
            tag="h1"
            :text="hero.name"
            :delay="0.1"
            class="hero-name"
          />

          <div class="hero-role-wrap">
            <CtaButton
              :href="availabilityMailto"
              :label="availabilityCtaLabel"
              secondary
              elevated-secondary
              with-dot
              preserve-case
            >
              <template #icon><Icon icon="lucide:mail" class="text-sm" /></template>
            </CtaButton>
          </div>

          <div class="hero-story">
            <p v-for="(paragraph, index) in story" :key="index" class="story-paragraph">
              {{ paragraph }}
            </p>
          </div>
        </div>

        <div class="hero-visual">
          <div class="avatar-container">
            <img
              :src="hero.avatar"
              :alt="hero.name"
              class="avatar-image"
              loading="eager"
            >
          </div>
        </div>
      </div>
    </section>

    <!-- Status Ticker -->
    <section v-if="statusItems?.length" class="ticker-section reveal-up">
      <div class="ticker-wrapper">
        <div
          class="ticker-track"
          :class="{ 'ticker-track--marquee': !reduceTickerMotion }"
        >
          <div class="ticker-content">
            <template v-for="cell in tickerCells" :key="cell.key">
              <div class="ticker-item">
                <div class="ticker-image">
                  <img v-if="cell.item.images?.length" :src="cell.item.images[0]" :alt="cell.item.title" />
                  <Icon v-else-if="cell.item.icon" :icon="cell.item.icon" class="w-5 h-5 text-[var(--fg-muted)]" />
                </div>
                <div class="ticker-info">
                  <span class="ticker-label">{{ cell.item.label }}</span>
                  <span class="ticker-title">{{ cell.item.title }}</span>
                </div>
              </div>
              <span v-if="cell.showSep" class="ticker-sep" aria-hidden="true">·</span>
            </template>
          </div>
        </div>
      </div>
    </section>

    <!-- Experience Section -->
    <section class="experience-section reveal-up">
      <div class="section-header">
        <span class="section-number">01</span>
        <h2 class="section-title">Experience</h2>
      </div>

      <div class="experience-list">
        <article
          v-for="(item, index) in experienceItems"
          :key="`${item.company}-${item.year}`"
          class="experience-card"
          :style="{ '--delay': `${index * 0.1}s` }"
        >
          <img
            v-if="item.image"
            :src="item.image"
            :alt="item.company"
            loading="lazy"
            class="experience-logo"
          >
          <div class="experience-info">
            <p class="experience-company">{{ item.company }}</p>
            <h3 class="experience-title">{{ item.title }}</h3>
            <p class="experience-desc">{{ item.description }}</p>
          </div>
          <span class="experience-year">{{ item.year }}</span>
        </article>
      </div>
    </section>

    <!-- Capabilities Section -->
    <section class="capabilities-section reveal-up">
      <div class="section-header">
        <span class="section-number">02</span>
        <h2 class="section-title">Capabilities</h2>
        <p class="section-lede">
          Disciplines I practice day to day, plus the software I use to ship work.
        </p>
      </div>

      <div class="capabilities-grid">
        <div v-for="group in groupedCapabilities" :key="group.category" class="capability-group">
          <h3 class="capability-group-title">{{ group.category }}</h3>
          <div class="capability-tags">
            <span v-for="item in group.items" :key="item" class="capability-tag">
              {{ item }}
            </span>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
/* Page stack: section padding + consistent gap (avoid piling 2xl + gap + 2xl) */
.about-page {
  gap: var(--space-2xl);
}

/* Hero Section */
.hero-section {
  padding: var(--space-lg) 0 var(--space-xl);
  min-height: min(70vh, 52rem);
  display: flex;
  align-items: center;
}

.hero-grid {
  display: grid;
  gap: 3rem;
  align-items: center;
}

@media (min-width: 1024px) {
  .hero-grid {
    grid-template-columns: 1.2fr 1fr;
    gap: 4rem;
  }
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-lg);
}

.hero-name {
  font-size: clamp(3rem, 8vw, 5.5rem);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.03em;
  color: var(--fg-primary);
  margin: 0;
}

.hero-role-wrap {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-md);
  margin: 0;
}

.hero-story {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  margin-top: var(--space-sm);
}

.story-paragraph {
  font-size: 1.125rem;
  line-height: 1.7;
  color: var(--fg-secondary);
  max-width: 36rem;
}

.hero-about-ctas {
  margin: 0;
}

.hero-visual {
  position: relative;
  display: flex;
  justify-content: center;
}

.avatar-container {
  width: 280px;
  height: 340px;
}

@media (min-width: 768px) {
  .avatar-container {
    width: 320px;
    height: 400px;
  }
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.5rem;
}

/* Ticker Section */
.ticker-section {
  padding: var(--space-md) var(--space-md);
  overflow: hidden;
  border-radius: var(--radius-card);
  border: 1px solid color-mix(in srgb, var(--border) 12%, transparent);
  box-shadow: var(--shadow-sm);
  background: color-mix(in srgb, var(--bg-secondary) 55%, transparent);
}

.ticker-wrapper {
  position: relative;
  -webkit-mask-image: linear-gradient(
    to right,
    transparent,
    #000 2.5rem,
    #000 calc(100% - 2.5rem),
    transparent
  );
  mask-image: linear-gradient(
    to right,
    transparent,
    #000 2.5rem,
    #000 calc(100% - 2.5rem),
    transparent
  );
}

.ticker-wrapper:hover .ticker-track--marquee {
  animation-play-state: paused;
}

.ticker-track {
  display: flex;
  --ticker-duration: 40s;
}

.ticker-track--marquee {
  width: max-content;
  animation: ticker-scroll var(--ticker-duration) linear infinite;
}

@media (max-width: 640px) {
  .ticker-track {
    --ticker-duration: 56s;
  }
}

.ticker-track:not(.ticker-track--marquee) {
  width: 100%;
  max-width: 100%;
}

@keyframes ticker-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.ticker-content {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: var(--space-lg);
}

.ticker-track:not(.ticker-track--marquee) .ticker-content {
  flex-wrap: wrap;
  justify-content: center;
  row-gap: var(--space-md);
  width: 100%;
}

.ticker-sep {
  flex-shrink: 0;
  align-self: center;
  font-size: 1.25rem;
  line-height: 1;
  font-weight: 300;
  color: var(--fg-muted);
  opacity: 0.45;
  user-select: none;
}

.ticker-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  background: var(--bg-secondary);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: var(--radius-card);
  transition: background-color 200ms ease;
}

.ticker-item:hover {
  background: var(--bg-tertiary);
}

.ticker-image {
  width: 32px;
  height: 32px;
  border-radius: 0.25rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-tertiary);
}

.ticker-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ticker-info {
  display: flex;
  flex-direction: column;
}

.ticker-label {
  font-size: 0.75rem;
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--accent);
}

.ticker-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--fg-primary);
  white-space: nowrap;
}

/* Section Headers */
.section-header {
  margin-bottom: var(--space-lg);
}

.section-number {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: var(--accent);
  font-family: 'Geist Mono', monospace;
}

.section-title {
  margin-top: 0.25rem;
}

.section-lede {
  font-size: 0.9375rem;
  line-height: 1.55;
  color: var(--fg-muted);
  margin-top: 0.75rem;
  max-width: 36rem;
}

.section-subtitle {
  font-size: 1rem;
  color: var(--fg-muted);
  margin-top: 0.5rem;
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.capabilities-section {
  padding: 0 0 var(--space-2xl);
}

.capabilities-grid {
  display: grid;
  gap: var(--space-xl);
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
}

.capability-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.capability-group-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--fg-muted);
}

.capability-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.capability-tag {
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--fg-secondary);
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 9999px;
  transition:
    color 200ms ease,
    background-color 200ms ease;
}

:root.dark .capability-tag {
  background: rgba(10, 15, 30, 0.6);
}

.capability-tag:hover {
  color: var(--fg-primary);
  background-color: color-mix(in srgb, var(--fg-primary) 6%, rgba(255, 255, 255, 0.6));
}

:root.dark .capability-tag:hover {
  background-color: color-mix(in srgb, white 8%, rgba(10, 15, 30, 0.6));
}

/* Experience Section */
.experience-section {
  padding: 0 0 var(--space-xl);
}

.experience-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.experience-card {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--bg-secondary);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: var(--radius-card);
  animation: slide-in 0.5s ease-out backwards;
  animation-delay: var(--delay);
}

@media (min-width: 768px) {
  .experience-card {
    grid-template-columns: auto 1fr auto;
    align-items: start;
    padding: 1.5rem;
  }
}

.experience-logo {
  width: 48px;
  height: 48px;
  border-radius: 0.375rem;
  object-fit: contain;
  padding: 4px;
  background: var(--bg-primary);
}

.experience-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.experience-company {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--fg-muted);
}

.experience-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--fg-primary);
}

.experience-desc {
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--fg-secondary);
  margin-top: 0.25rem;
}

.experience-year {
  font-size: 0.75rem;
  font-weight: 700;
  font-family: 'Geist Mono', monospace;
  letter-spacing: 0.05em;
  color: var(--accent);
  white-space: nowrap;
}

</style>
