<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { profile } from '~/data/site'
import type { HomeHeroTaglineLine } from '~/data/home'

function joinTaglineLine(line: HomeHeroTaglineLine | undefined) {
  return line?.segments?.map((s) => s.text).join('')?.trim() ?? ''
}

/** True when the line is only a location byline (already shown under Location). */
function isLocationOnlyByline(text: string, location: string) {
  const t = text.trim().toLowerCase().replace(/\.+$/, '').replace(/,$/, '').replace(/\u2026$/, '')
  const loc = location.trim().toLowerCase()
  if (!t || !loc) return false
  if (t === loc) return true
  const based = `based in ${loc}`.replace(/\s+/g, ' ')
  return t === based || t === `${based}.`
}

function stripLeadingLocationByline(text: string, location: string) {
  if (!location) return text
  const esc = location.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return text.replace(new RegExp(`^\\s*Based in\\s+${esc}\\.?\\s*`, 'i'), '').trim()
}

const props = defineProps<{
  heroTitle: string
  heroTaglines: HomeHeroTaglineLine[]
  linkedinHref: string
  availabilityMailto: string
  availabilityCtaLabel: string
  availabilityLine?: string
  taglineOneLine?: string
  role?: string
  location?: string
}>()

const heroTitleParts = computed(() => {
  const trimmed = (props.heroTitle ?? '').trim()
  if (!trimmed) return { lead: '', accent: '' }
  const idx = trimmed.lastIndexOf(' ')
  if (idx === -1) return { lead: '', accent: trimmed }
  return { lead: trimmed.slice(0, idx), accent: trimmed.slice(idx + 1) }
})

const roleLabel = computed(() => props.role ?? profile.role)
const locationLabel = computed(() => props.location ?? profile.location)
const statusLine = computed(() => (props.availabilityLine ?? '').trim() || 'Open to new projects')
const isAvailable = computed(() => /\b(open|available|accepting|hiring)\b/i.test(statusLine.value))

/** Hero paragraphs: drop lines that only repeat the Location rail. */
const heroTaglinesDisplay = computed(() => {
  const lines = props.heroTaglines ?? []
  const loc = locationLabel.value
  return lines.filter((line) => !isLocationOnlyByline(joinTaglineLine(line), loc))
})

/**
 * Rail "Focus": prefer the second tagline (specialties) so we do not repeat line 1 or Location.
 * With a single tagline, omit the row unless the parent one-liner adds non-location detail.
 */
const focusRailValue = computed(() => {
  const lines = props.heroTaglines ?? []
  const loc = locationLabel.value

  if (lines.length >= 2) {
    const second = joinTaglineLine(lines[1])
    if (!second) return ''
    return second.length > 200 ? `${second.slice(0, 197)}\u2026` : second
  }

  const parentOne = props.taglineOneLine?.trim()
  if (!parentOne) return ''

  if (isLocationOnlyByline(parentOne, loc)) return ''

  const stripped = stripLeadingLocationByline(parentOne, loc)
  if (stripped && stripped !== parentOne)
    return stripped.length > 140 ? `${stripped.slice(0, 137)}\u2026` : stripped

  const first = joinTaglineLine(lines[0])
  if (first && parentOne === first) return ''

  return parentOne.length > 140 ? `${parentOne.slice(0, 137)}\u2026` : parentOne
})
</script>

<template>
  <RevealOnScroll id="intro" :delay="0" class="page-section home-intro">
    <div class="intro-grid grid-12">
      <div class="intro-main">
        <h1 class="hero-title hero-fade-in">
          <span v-if="heroTitleParts.lead" class="hero-title-lead">{{ heroTitleParts.lead }}</span><span class="hero-title-accent">{{ heroTitleParts.accent }}</span>
        </h1>

        <div class="hero-tagline hero-fade-in hero-delay-1">
          <p
            v-for="(line, lineIndex) in heroTaglinesDisplay"
            :key="lineIndex"
            class="hero-tagline-line"
          >
            <template v-for="(seg, segIndex) in line.segments" :key="segIndex">
              <strong v-if="seg.em" class="hero-tagline-em">{{ seg.text }}</strong>
              <template v-else>{{ seg.text }}</template>
            </template>
          </p>
        </div>

        <div class="hero-cta-row hero-fade-in hero-delay-2">
          <CtaButton
            :href="availabilityMailto"
            :label="availabilityCtaLabel"
            attention
            preserve-case
          >
            <template #icon><Icon icon="lucide:mail" class="text-sm" /></template>
          </CtaButton>
          <a
            :href="linkedinHref"
            class="intro-linkedin"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon icon="ri:linkedin-fill" class="intro-linkedin-icon" aria-hidden="true" />
            LinkedIn
            <span class="sr-only">(opens in new tab)</span>
          </a>
        </div>
      </div>

      <aside class="intro-rail" aria-label="Profile">
        <p class="intro-rail-line">
          <span class="intro-rail-key">Role</span>
          <span class="intro-rail-val">{{ roleLabel }}</span>
        </p>
        <p class="intro-rail-line">
          <span class="intro-rail-key">Location</span>
          <span class="intro-rail-val">{{ locationLabel }}</span>
        </p>
        <p class="intro-rail-line">
          <span class="intro-rail-key">Status</span>
          <span class="intro-rail-val intro-rail-val--status">
            <span
              v-if="isAvailable"
              class="status-dot"
              aria-hidden="true"
            />
            {{ statusLine }}
          </span>
        </p>
        <p v-if="focusRailValue" class="intro-rail-line">
          <span class="intro-rail-key">Focus</span>
          <span class="intro-rail-val">{{ focusRailValue }}</span>
        </p>
      </aside>
    </div>
  </RevealOnScroll>
</template>

<style scoped>
.home-intro {
  padding-top: clamp(2rem, 4vw, 3.5rem);
  padding-bottom: clamp(3rem, 6vw, 5rem);
}

.intro-grid {
  row-gap: clamp(2rem, 4vw, 3rem);
  align-items: start;
  padding-top: clamp(1.25rem, 2.5vw, 2rem);
}

.intro-main {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: clamp(1.25rem, 2.5vw, 2rem);
  min-width: 0;
}

.intro-rail {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  border-top: 1px solid var(--rule);
  padding-top: 0.85rem;
}

@media (min-width: 768px) {
  .intro-rail {
    grid-column: 9 / span 4;
    grid-row: 1;
    grid-template-columns: 1fr;
    border-top: none;
    padding-top: 0;
    align-self: start;
  }

  .intro-main {
    grid-column: 1 / span 8;
    grid-row: 1;
  }
}

.hero-title {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--text-h1);
  font-weight: 500;
  line-height: 1.06;
  letter-spacing: 0;
  color: var(--fg-primary);
}

.hero-title-lead {
  display: inline;
  letter-spacing: -0.035em;
}

/*
  Physical gap between sans lead and serif accent: a real space inside a span can disappear
  (Vue whitespace condense / letter-spacing on the lead span still tightens a trailing space).
*/
.hero-title-lead + .hero-title-accent {
  margin-inline-start: 0.22em;
}

.hero-title-accent {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 300;
  letter-spacing: -0.04em;
  font-variation-settings: 'opsz' 144;
  color: var(--fg-primary);
}

.hero-tagline {
  display: block;
  max-width: 42rem;
}

.hero-tagline-line {
  margin: 0;
  font-size: var(--text-body-lg);
  font-weight: 400;
  line-height: 1.55;
  color: var(--fg-secondary);
  letter-spacing: 0;
  font-family: var(--font-sans);
  max-width: 68ch;
}

.hero-tagline-line + .hero-tagline-line {
  margin-top: 0.45rem;
}

.hero-tagline-em {
  font-weight: 500;
  color: var(--fg-primary);
}

.hero-cta-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
}

.intro-linkedin {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-family: var(--font-mono);
  font-size: var(--label-size);
  font-weight: 500;
  letter-spacing: var(--label-tracking-mono);
  text-transform: uppercase;
  color: var(--signal);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  padding-bottom: 0.1rem;
  transition:
    color 120ms var(--motion-ease-reveal, cubic-bezier(0.2, 0.6, 0.2, 1)),
    border-color 120ms var(--motion-ease-reveal, cubic-bezier(0.2, 0.6, 0.2, 1));
}

.intro-linkedin:hover {
  color: var(--fg-primary);
  border-bottom-color: var(--signal);
}

.intro-linkedin:focus-visible {
  outline: 2px solid var(--emphasis);
  outline-offset: 4px;
}

.intro-linkedin-icon {
  width: 1rem;
  height: 1rem;
}

.intro-rail-line {
  display: grid;
  grid-template-columns: 5.5rem minmax(0, 1fr);
  gap: 0.75rem;
  align-items: baseline;
  margin: 0;
  padding: 0.7rem 0;
  border-bottom: 1px solid var(--rule-soft);
}

@media (min-width: 768px) {
  .intro-rail-line {
    grid-template-columns: minmax(0, 1fr);
    gap: 0.25rem;
    align-items: stretch;
  }
}

.intro-rail-line:first-child {
  padding-top: 0;
}

.intro-rail-line:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

@media (min-width: 768px) {
  .intro-rail-line:first-child {
    padding-top: 0.7rem;
    border-top: 1px solid var(--rule);
  }
}

.intro-rail-key {
  font-family: var(--font-mono);
  font-size: var(--label-size);
  font-weight: 500;
  letter-spacing: var(--label-tracking-mono);
  text-transform: uppercase;
  color: var(--fg-muted);
}

.intro-rail-val {
  font-family: var(--font-sans);
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--fg-primary);
  letter-spacing: -0.005em;
}

.intro-rail-val--status {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
}

.status-dot {
  --status-dot-color: #22c55e;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 999px;
  background: var(--status-dot-color);
  box-shadow: 0 0 0 0 color-mix(in srgb, var(--status-dot-color) 55%, transparent);
  animation: status-dot-pulse 2.2s var(--motion-ease-reveal, cubic-bezier(0.2, 0.6, 0.2, 1)) infinite;
  flex-shrink: 0;
  position: relative;
  top: -1px;
}

@keyframes status-dot-pulse {
  0% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--status-dot-color) 55%, transparent);
  }
  70% {
    box-shadow: 0 0 0 0.5rem color-mix(in srgb, var(--status-dot-color) 0%, transparent);
  }
  100% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--status-dot-color) 0%, transparent);
  }
}

@media (prefers-reduced-motion: reduce) {
  .status-dot {
    animation: none;
  }
}

.hero-fade-in {
  opacity: 0;
  animation: hero-fade-in 320ms var(--motion-ease-reveal, cubic-bezier(0.2, 0.6, 0.2, 1)) forwards;
}

.hero-delay-1 { animation-delay: 0.08s; }
.hero-delay-2 { animation-delay: 0.16s; }

@keyframes hero-fade-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-fade-in {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
</style>
