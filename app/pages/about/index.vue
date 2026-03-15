<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useSanityStatus } from '~/composables/useSanityStatus'

const { aboutMe } = useMockContent()
const { statusItems } = useSanityStatus()

useHead({ title: 'About' })

const socialLinks = [
  { label: 'Email', href: 'mailto:hello@example.com', icon: 'lucide:mail' },
  { label: 'LinkedIn', href: 'https://linkedin.com/', icon: 'lucide:linkedin' },
  { label: 'Twitter', href: 'https://twitter.com/', icon: 'lucide:twitter' },
  { label: 'GitHub', href: 'https://github.com/', icon: 'lucide:github' },
]

const skillIcons: Record<string, string> = {
  'Product Strategy': 'lucide:target',
  'Design Systems': 'lucide:layers',
  'Prototyping': 'lucide:play',
  'User Research': 'lucide:users',
  'Visual Design': 'lucide:palette',
  'Vue/Nuxt': 'lucide:hexagon',
  'React': 'lucide:atom',
  'TypeScript': 'lucide:file-code',
  'Tailwind CSS': 'lucide:wind',
  'Motion Design': 'lucide:sparkles',
  'Figma Wizardry': 'lucide:wand-2',
  'Presentation Design': 'lucide:presentation',
  'Workshop Facilitation': 'lucide:users-2',
  'Coffee Making': 'lucide:coffee',
}

const timeline = [
  { year: '2017', title: 'Started in Architecture', desc: 'Thinking about how people move through spaces' },
  { year: '2019', title: 'Shifted to Digital', desc: 'Discovered the same principles apply to screens' },
  { year: '2021', title: 'Design + Engineering', desc: 'Building products at the intersection' },
  { year: 'Now', title: 'Crafting Experiences', desc: 'Making digital products feel human' },
]
</script>

<template>
  <div class="page-content">
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
          
          <div class="floating-stats">
            <div v-for="(fact, i) in aboutMe.facts.slice(0, 2)" :key="fact.label" class="floating-stat" :style="{ '--delay': `${i * 0.2}s` }">
              <span class="floating-stat-value">{{ fact.value }}</span>
              <span class="floating-stat-label">{{ fact.label }}</span>
            </div>
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

    <!-- Capabilities Section -->
    <section class="capabilities-section reveal-up">
      <div class="section-header">
        <span class="section-number">02</span>
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

    <!-- Stats Row -->
    <section class="stats-section reveal-up">
      <div class="stats-grid">
        <div v-for="fact in aboutMe.facts" :key="fact.label" class="stat-item">
          <span class="stat-value">{{ fact.value }}</span>
          <span class="stat-label">{{ fact.label }}</span>
        </div>
      </div>
    </section>

    <!-- Connect Section -->
    <section class="connect-section reveal-up">
      <div class="connect-content">
        <div class="connect-header">
          <span class="section-number">03</span>
          <h2 class="connect-title">Let's Connect</h2>
          <p class="connect-subtitle">Have a project in mind? I'd love to hear about it.</p>
        </div>
        
        <div class="connect-actions">
          <a href="mailto:hello@example.com" class="connect-primary-btn">
            <Icon icon="lucide:mail" />
            <span>hello@example.com</span>
            <Icon icon="lucide:arrow-up-right" class="ml-auto opacity-50" />
          </a>
          
          <div class="connect-socials">
            <a v-for="link in socialLinks" :key="link.label" :href="link.href" target="_blank" rel="noopener" class="social-link">
              <Icon :icon="link.icon" />
              <span class="sr-only">{{ link.label }}</span>
            </a>
          </div>
        </div>
        
        <div class="connect-availability">
          <span class="availability-indicator" />
          <span>Currently accepting new projects starting April 2025</span>
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
  color: var(--fg-muted);
  margin-bottom: 1.5rem;
  padding: 0.5rem 1rem;
  background: var(--bg-secondary);
  border-radius: 9999px;
  border: 1px solid var(--border);
}

.availability-dot {
  width: 8px;
  height: 8px;
  background: #22c55e;
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

.floating-stats {
  position: absolute;
  right: -1rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  z-index: 2;
}

.floating-stat {
  background: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: float-in 0.6s ease-out backwards;
  animation-delay: var(--delay);
}

@keyframes float-in {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.floating-stat-value {
  display: block;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--accent);
}

.floating-stat-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--fg-muted);
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
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 0.375rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  transition: all 0.2s ease;
}

.ticker-item:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.2);
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
  border-color: var(--accent);
  color: var(--fg-primary);
}

/* Stats Section */
.stats-section {
  padding: 2.5rem 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.stat-item {
  text-align: center;
  padding: 1.5rem 1rem;
  background: var(--bg-secondary);
  border-radius: 0.5rem;
  border: 1px solid var(--border);
}

.stat-value {
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--accent);
  line-height: 1;
  font-family: 'Geist Mono', monospace;
}

.stat-label {
  display: block;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--fg-muted);
  margin-top: 0.5rem;
}

/* Connect Section */
.connect-section {
  padding: 3rem 0 4rem;
}

.connect-content {
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
  border-radius: 1rem;
  padding: 2.5rem;
  border: 1px solid var(--border);
  text-align: center;
}

@media (min-width: 768px) {
  .connect-content {
    padding: 3.5rem;
  }
}

.connect-header {
  margin-bottom: 2rem;
}

.connect-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--fg-primary);
  margin-top: 0.25rem;
}

.connect-subtitle {
  font-size: 1rem;
  color: var(--fg-muted);
  margin-top: 0.5rem;
}

.connect-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.connect-primary-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: var(--fg-primary);
  color: var(--bg-primary);
  font-size: 1rem;
  font-weight: 600;
  border-radius: 9999px;
  transition: all 0.3s ease;
  width: fit-content;
}

.connect-primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.connect-primary-btn svg {
  width: 1.25rem;
  height: 1.25rem;
}

.connect-socials {
  display: flex;
  gap: 0.75rem;
}

.social-link {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: 9999px;
  color: var(--fg-secondary);
  transition: all 0.2s ease;
}

.social-link:hover {
  border-color: var(--accent);
  color: var(--accent);
  transform: translateY(-2px);
}

.social-link svg {
  width: 1.25rem;
  height: 1.25rem;
}

.connect-availability {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  font-size: 0.8rem;
  color: var(--fg-muted);
  padding: 0.5rem 1rem;
  background: var(--bg-primary);
  border-radius: 9999px;
}

.availability-indicator {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  animation: pulse-dot 2s ease-in-out infinite;
}
</style>
