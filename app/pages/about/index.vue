<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useSanityStatus } from '~/composables/useSanityStatus'
import { useSanityAbout } from '~/composables/useSanityAbout'

const { aboutMe: fallbackAboutMe, experiences: fallbackExperiences } = useMockContent()
const { statusItems } = useSanityStatus()
const { aboutPage } = useSanityAbout()

useHead({ title: 'About' })

// CMS data with fallback to hardcoded content
const hero = computed(() => aboutPage.value?.hero || {
  name: fallbackAboutMe.name,
  role: fallbackAboutMe.role,
  location: fallbackAboutMe.location,
  avatar: fallbackAboutMe.avatar,
  availabilityText: 'Available for freelance',
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
</script>

<template>
  <div class="page-content content-flow">
    <!-- Hero Section -->
    <section class="hero-section reveal-up">
      <div class="hero-grid">
        <div class="hero-content">
          <div class="hero-eyebrow">
            <span class="availability-dot" />
            <span>{{ hero.availabilityText || 'Available for freelance' }}</span>
          </div>

          <TextReveal
            tag="h1"
            :text="hero.name"
            :delay="0.1"
            class="hero-name"
          />

          <div class="hero-role-wrap">
            <TextReveal
              tag="p"
              :text="hero.role"
              :delay="0.3"
              class="hero-role"
            />
            <span class="hero-location">
              <Icon icon="lucide:map-pin" class="inline w-4 h-4" />
              {{ hero.location }}
            </span>
          </div>

          <div class="hero-story">
            <p v-for="(paragraph, index) in story" :key="index" class="story-paragraph">
              {{ paragraph }}
            </p>
          </div>
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
        <div class="ticker-track">
          <div class="ticker-content">
            <div v-for="item in [...statusItems, ...statusItems]" :key="`${item.title}-${Math.random()}`" class="ticker-item">
              <div class="ticker-image">
                <img v-if="item.images?.length" :src="item.images[0]" :alt="item.title" />
                <Icon v-else-if="item.icon" :icon="item.icon" class="w-5 h-5 text-[var(--fg-muted)]" />
              </div>
              <div class="ticker-info">
                <span class="ticker-label">{{ item.label }}</span>
                <span class="ticker-title">{{ item.title }}</span>
              </div>
            </div>
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
          <img :src="item.image" :alt="item.company" loading="lazy" class="experience-logo" />
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
/* Hero Section */
.hero-section {
  padding: var(--space-xl) 0;
  min-height: 70vh;
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
  space-y: 1.5rem;
}

.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--emphasis);
  margin-bottom: 1.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 9999px;
}

:root.dark .hero-eyebrow {
  background: rgba(10, 15, 30, 0.6);
}

.availability-dot {
  width: 8px;
  height: 8px;
  background: var(--status-available);
  border-radius: 50%;
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.2); }
}

.hero-name {
  font-size: clamp(3rem, 8vw, 5.5rem);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.03em;
  color: var(--fg-primary);
  margin-bottom: 1rem;
}

.hero-role-wrap {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.hero-role {
  font-size: 1.5rem;
  font-weight: 400;
  color: var(--fg-secondary);
}

.hero-location {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.875rem;
  color: var(--fg-muted);
  padding: 0.35rem 0.75rem;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 9999px;
}

:root.dark .hero-location {
  background: rgba(10, 15, 30, 0.6);
}

.hero-story {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.story-paragraph {
  font-size: 1.125rem;
  line-height: 1.7;
  color: var(--fg-secondary);
  max-width: 36rem;
}

.hero-about-ctas {
  margin-top: 1.5rem;
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
  padding: 1.5rem 0;
  overflow: hidden;
}

.ticker-wrapper {
  position: relative;
}

.ticker-track {
  display: flex;
  width: max-content;
  animation: ticker-scroll 30s linear infinite;
}

@keyframes ticker-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.ticker-content {
  display: flex;
  gap: 2rem;
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
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--fg-muted);
}

.ticker-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--fg-primary);
  white-space: nowrap;
}

/* Section Headers */
.section-header {
  margin-bottom: var(--space-xl);
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
  padding: var(--space-2xl) 0 var(--space-xl);
}

.capabilities-grid {
  display: grid;
  gap: 2rem;
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
  padding: var(--space-2xl) 0 var(--space-xl);
}

.experience-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
