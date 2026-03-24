<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useSanityStatus } from '~/composables/useSanityStatus'

const { aboutMe, experiences } = useMockContent()
const { statusItems } = useSanityStatus()

useHead({ title: 'About' })

const skillIcons: Record<string, string> = {
  'Branding': 'lucide:badge',
  'Logo Design': 'lucide:pen-tool',
  'Print Design': 'lucide:printer',
  'Packaging Design': 'lucide:package',
  'Visual Design': 'lucide:palette',
  'Web Design': 'lucide:layout',
  'UX Design': 'lucide:users',
  'CSS/HTML': 'lucide:code-2',
  'Photo Manipulation': 'lucide:image',
  'Stable Diffusion': 'lucide:sparkles',
  'Figma': 'lucide:figma',
  'Framer': 'lucide:layers',
  'Adobe Creative Suite': 'lucide:wand-2',
  'Blender': 'lucide:box',
  'Easy Catalog': 'lucide:book-open',
}

const timeline = [
  { year: '2017', title: 'B.A. Graphic Design', desc: 'Graduated from Cal State Northridge' },
  { year: '2017', title: 'IntersectLA', desc: '20+ creatives, 10+ campaigns, 100% client satisfaction' },
  { year: '2018', title: 'Independent Work', desc: 'Branding, packaging, and print across industries' },
  { year: '2024', title: 'NAXA Electronics', desc: '90+ brand projects for Victor and Emerson, CES 2025' },
]
</script>

<template>
  <div class="page-content content-flow">
    <!-- Hero Section -->
    <section class="hero-section reveal-up">
      <div class="hero-grid">
        <div class="hero-content">
          <div class="hero-eyebrow">
            <span class="availability-dot" />
            <span>Available for freelance</span>
          </div>
          
          <TextReveal
            tag="h1"
            :text="aboutMe.name"
            :delay="0.1"
            class="hero-name"
          />
          
          <div class="hero-role-wrap">
            <TextReveal
              tag="p"
              :text="aboutMe.role"
              :delay="0.3"
              class="hero-role"
            />
            <span class="hero-location">
              <Icon icon="lucide:map-pin" class="inline w-4 h-4" />
              {{ aboutMe.location }}
            </span>
          </div>
          
          <p class="hero-intro">
            {{ aboutMe.intro }}
          </p>
        </div>
        
        <div class="hero-visual">
          <div class="avatar-container">
            <img
              :src="aboutMe.avatar"
              :alt="aboutMe.name"
              class="avatar-image"
              loading="eager"
            >
            <div class="avatar-ring" />
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

    <!-- Resume Download -->
    <section class="resume-download-section reveal-up">
      <CtaButton
        href="/Bryan_Mendez_resume_2025-1.pdf"
        label="Download Resume"
        attention
        download
      >
        <template #icon><Icon icon="lucide:download" class="text-sm" /></template>
      </CtaButton>
    </section>

    <!-- Timeline Section -->
    <section class="timeline-section reveal-up">
      <div class="section-header">
        <span class="section-number">01</span>
        <h2 class="section-title">Background</h2>
      </div>
      
      <div class="timeline-grid">
        <div class="timeline-story">
          <p v-for="(paragraph, index) in aboutMe.story" :key="index" class="story-paragraph">
            {{ paragraph }}
          </p>
        </div>
        
        <div class="timeline-track">
          <div v-for="(item, index) in timeline" :key="item.year" class="timeline-item" :style="{ '--delay': `${index * 0.15}s` }">
            <div class="timeline-marker">
              <span class="timeline-year">{{ item.year }}</span>
              <div class="timeline-dot" />
            </div>
            <div class="timeline-content">
              <h3 class="timeline-title">{{ item.title }}</h3>
              <p class="timeline-desc">{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Experience Section -->
    <section class="experience-section reveal-up">
      <div class="section-header">
        <span class="section-number">02</span>
        <h2 class="section-title">Experience</h2>
      </div>

      <div class="experience-list">
        <article
          v-for="(item, index) in experiences"
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
        <span class="section-number">03</span>
        <h2 class="section-title">Capabilities</h2>
      </div>
      
      <div class="capabilities-grid">
        <div v-for="skillGroup in aboutMe.skills" :key="skillGroup.category" class="skill-category">
          <h3 class="skill-category-title">
            <Icon :icon="skillGroup.category === 'Design' ? 'lucide:palette' : skillGroup.category === 'Development' ? 'lucide:code-2' : 'lucide:sparkles'" />
            {{ skillGroup.category }}
          </h3>
          <div class="skill-items">
            <SpotlightCard v-for="skill in skillGroup.items" :key="skill" class="skill-item">
              <Icon :icon="skillIcons[skill] || 'lucide:check'" class="skill-icon" />
              <span>{{ skill }}</span>
            </SpotlightCard>
          </div>
        </div>
      </div>
      
      <div class="tools-section">
        <h3 class="tools-title">
          <Icon icon="lucide:wrench" />
          Toolkit
        </h3>
        <div class="tools-grid">
          <div v-for="tool in aboutMe.tools" :key="tool" class="tool-item">
            {{ tool }}
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
/* Hero Section */
.hero-section {
  padding: 2rem 0 3rem;
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
  background: var(--bg-secondary);
  border-radius: 9999px;
  border: 1px solid var(--border);
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
  line-height: 0.95;
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
  font-weight: 300;
  color: var(--fg-secondary);
}

.hero-location {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.875rem;
  color: var(--fg-muted);
  padding: 0.35rem 0.75rem;
  background: var(--bg-tertiary);
  border-radius: 9999px;
}

.hero-intro {
  font-size: 1.25rem;
  line-height: 1.6;
  color: var(--fg-secondary);
  max-width: 32rem;
}

.hero-visual {
  position: relative;
  display: flex;
  justify-content: center;
}

.avatar-container {
  position: relative;
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
  position: relative;
  z-index: 1;
}

.avatar-ring {
  position: absolute;
  inset: -12px;
  border: 2px solid var(--accent);
  border-radius: 0.75rem;
  opacity: 0.3;
  transform: rotate(3deg);
}

/* Ticker Section */
.ticker-section {
  padding: 1.5rem 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
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
  border-radius: 0.375rem;
  border: 1px solid var(--border);
  transition: all 0.2s ease;
}

.ticker-item:hover {
  background: var(--bg-tertiary);
  border-color: var(--emphasis);
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
  font-size: 0.6rem;
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
  margin-bottom: 2rem;
}

.section-number {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: var(--accent);
  font-family: 'Geist Mono', monospace;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--fg-primary);
  margin-top: 0.25rem;
}

.section-subtitle {
  font-size: 1rem;
  color: var(--fg-muted);
  margin-top: 0.5rem;
}

/* Resume Download */
.resume-download-section {
  padding: 0.5rem 0 1.5rem;
  display: flex;
  justify-content: center;
}

/* Timeline Section */
.timeline-section {
  padding: 3rem 0;
}

.timeline-grid {
  display: grid;
  gap: 3rem;
}

@media (min-width: 768px) {
  .timeline-grid {
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
  }
}

.timeline-story {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.story-paragraph {
  font-size: 1.125rem;
  line-height: 1.7;
  color: var(--fg-secondary);
}

.timeline-track {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-left: 1rem;
  border-left: 2px solid var(--border);
}

.timeline-item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  animation: slide-in 0.5s ease-out backwards;
  animation-delay: var(--delay);
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

.timeline-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.timeline-year {
  font-size: 0.7rem;
  font-weight: 700;
  font-family: 'Geist Mono', monospace;
  color: var(--accent);
  white-space: nowrap;
}

.timeline-dot {
  width: 10px;
  height: 10px;
  background: var(--accent);
  border-radius: 50%;
  box-shadow: 0 0 0 4px var(--bg-primary);
}

.timeline-content {
  padding-bottom: 0.5rem;
}

.timeline-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--fg-primary);
  margin-bottom: 0.25rem;
}

.timeline-desc {
  font-size: 0.875rem;
  color: var(--fg-muted);
}

/* Capabilities Section */
.capabilities-section {
  padding: 3rem 0;
  background: var(--bg-secondary);
  margin: 0 -1rem;
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (min-width: 768px) {
  .capabilities-section {
    margin: 0 -2rem;
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

.capabilities-grid {
  display: grid;
  gap: 2rem;
}

@media (min-width: 768px) {
  .capabilities-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.skill-category {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skill-category-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--fg-muted);
}

.skill-category-title svg {
  width: 1rem;
  height: 1rem;
  color: var(--accent);
}

.skill-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skill-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.875rem;
  font-size: 0.875rem;
  color: var(--fg-secondary);
  cursor: default;
}

.skill-icon {
  width: 1rem;
  height: 1rem;
  color: var(--accent);
  opacity: 0.7;
  flex-shrink: 0;
}

.tools-section {
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border);
}

.tools-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--fg-muted);
  margin-bottom: 1rem;
}

.tools-title svg {
  width: 0.875rem;
  height: 0.875rem;
  color: var(--accent);
}

.tools-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tool-item {
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--fg-secondary);
  background: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: 9999px;
  transition: all 0.2s ease;
}

.tool-item:hover {
  border-color: var(--emphasis);
  color: var(--fg-primary);
}

/* Experience Section */
.experience-section {
  padding: 3rem 0;
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
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  transition: border-color 0.2s ease;
  animation: slide-in 0.5s ease-out backwards;
  animation-delay: var(--delay);
}

.experience-card:hover {
  border-color: var(--emphasis);
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
  object-fit: cover;
  border: 1px solid var(--border);
}

.experience-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.experience-company {
  font-size: 0.7rem;
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
  font-size: 0.7rem;
  font-weight: 700;
  font-family: 'Geist Mono', monospace;
  letter-spacing: 0.05em;
  color: var(--accent);
  white-space: nowrap;
}

</style>
