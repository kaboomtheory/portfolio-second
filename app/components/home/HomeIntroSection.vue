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

const NBSP = '\u00a0'

function countWordRuns(s: string): number {
  const m = s.match(/\S+/gu)
  return m?.length ?? 0
}

/** Collapse the gap between the last two word runs into NBSP (does not rewrite inner spaces). */
function glueLastTwoWordRuns(t: string, minWords: number): string {
  if (countWordRuns(t) < minWords) return t
  const ranges: { start: number; end: number }[] = []
  const re = /\S+/gu
  let m: RegExpExecArray | null
  while ((m = re.exec(t)) != null)
    ranges.push({ start: m.index, end: m.index + m[0].length })

  const a = ranges[ranges.length - 2]!
  const b = ranges[ranges.length - 1]!
  return `${t.slice(0, a.end)}${NBSP}${t.slice(b.start)}`
}

/**
 * Non-breaking glue so short words (e.g. "and") and lead/accent pairs do not wrap awkwardly.
 * Pairs with fluid font-size so breakpoints stay similar.
 */
function withHeroTitleTypographicGlue(raw: string): string {
  let t = raw.trim()
  if (!t) return t

  // "packaging, and …" → avoid a line with only "and"
  t = t.replace(/,\s+and\s+/gi, `,${NBSP}and${NBSP}`)

  // Long titles: keep the last two words together (e.g. "digital experiences.")
  t = glueLastTwoWordRuns(t, 6)

  // First line: keep the first two words together
  const firstSpace = t.indexOf(' ')
  if (firstSpace !== -1)
    t = `${t.slice(0, firstSpace)}${NBSP}${t.slice(firstSpace + 1)}`

  return t
}

const props = defineProps<{
  heroTitle: string
  heroTaglines: HomeHeroTaglineLine[]
  linkedinHref: string
  /** Intro bento primary action (e.g. resume PDF or contact). */
  introCtaHref: string
  introCtaLabel: string
  introCtaDownload?: boolean
  availabilityLine?: string
  taglineOneLine?: string
  role?: string
  location?: string
}>()

const heroTitleDisplay = computed(() => withHeroTitleTypographicGlue((props.heroTitle ?? '').trim()))

const heroTitleParts = computed(() => {
  const trimmed = heroTitleDisplay.value
  if (!trimmed) return { lead: '', accent: '' }
  const idx = Math.max(trimmed.lastIndexOf(' '), trimmed.lastIndexOf(NBSP))
  if (idx === -1) return { lead: '', accent: trimmed.replace(/\.+$/u, '') }
  const accent = trimmed.slice(idx + 1).replace(/^[\s\u00a0]+/u, '').replace(/\.+$/u, '')
  const lead = trimmed.slice(0, idx).replace(/[\s\u00a0]+$/u, '')
  return { lead, accent }
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
  <RevealOnScroll
    id="intro"
    :delay="0"
    :threshold="0"
    root-margin="0px"
    class="page-section home-intro"
  >
    <div class="home-hero-band full-bleed">
      <div class="intro-bento intro-grid grid-12">
        <div class="intro-bento__tile intro-bento__tile--headline hero-fade-in">
          <h1 class="hero-title" lang="en">
            <span v-if="heroTitleParts.lead" class="hero-title-lead">{{ heroTitleParts.lead }}</span>
            <span
              v-if="heroTitleParts.lead && heroTitleParts.accent"
              class="hero-title-sep"
              aria-hidden="true"
            >{{ ' ' }}</span>
            <span
              v-if="heroTitleParts.accent"
              class="hero-title-accent"
              :class="{ 'hero-title-accent--after-lead': !!heroTitleParts.lead }"
            >{{ heroTitleParts.accent }}</span>
          </h1>
          <div
            v-if="heroTaglinesDisplay.length"
            class="hero-tagline"
          >
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
        </div>

        <div class="intro-bento__tile intro-bento__tile--cta hero-fade-in hero-delay-1">
          <CtaButton
            :href="introCtaHref"
            :label="introCtaLabel"
            :download="introCtaDownload"
            attention
            preserve-case
            class="intro-bento__cta-fill"
          >
            <template #icon><Icon icon="lucide:book-open" class="text-sm" /></template>
          </CtaButton>
        </div>

        <a
          :href="linkedinHref"
          class="intro-bento__tile intro-bento__tile--linkedin intro-linkedin hero-fade-in hero-delay-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon icon="ri:linkedin-fill" class="intro-linkedin-icon" aria-hidden="true" />
          LinkedIn
          <span class="sr-only">(opens in new tab)</span>
        </a>

        <aside
          class="intro-bento__tile intro-bento__tile--rail intro-rail hero-fade-in hero-delay-2"
          aria-label="Profile"
        >
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
    </div>
  </RevealOnScroll>
</template>

<style scoped>
.home-intro {
  --signal: var(--signal-sky);
  --fg-primary: var(--pastel-ink);
  --fg-secondary: var(--pastel-ink-muted);
  --fg-muted: color-mix(in srgb, var(--pastel-ink) 48%, var(--pastel-blush));
  --rule: color-mix(in srgb, var(--pastel-ink) 16%, var(--pastel-blush));
  --rule-soft: color-mix(in srgb, var(--pastel-ink) 12%, var(--pastel-blush));
  --btn-attention-bg: var(--pastel-peach);
  padding-top: 0;
  padding-bottom: 0;
}

.home-hero-band {
  padding-top: clamp(0.8rem, 1.6vw, 1.4rem);
  /* Extra exhale before Work — hero reads as a complete “spread” */
  padding-bottom: clamp(1rem, 2.2vw, 1.85rem);
}

/* Bento: four tiles on a 12-col grid; rail spans two rows on md+ */
.intro-bento {
  --intro-bento-gap: clamp(0.65rem, 1.25vw, 1.05rem);
  --intro-bento-radius: clamp(0.85rem, 1.4vw, 1.2rem);
  row-gap: var(--intro-bento-gap);
  column-gap: var(--intro-bento-gap);
  align-items: stretch;
  padding-top: clamp(1.25rem, 2.5vw, 2rem);
}

.intro-bento__tile--headline {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: var(--home-stack-gap-comfortable);
  min-width: 0;
  background-color: var(--pastel-mint);
  border-radius: var(--intro-bento-radius);
  padding: clamp(1.1rem, 2.1vw, 1.85rem) clamp(1.2rem, 2.5vw, 2rem);
  box-sizing: border-box;
}

.intro-bento__tile--rail {
  /* aside.intro-rail: layout + color below */
  grid-column: 1 / -1;
  min-width: 0;
  border-radius: var(--intro-bento-radius);
}

.intro-bento__tile--cta {
  grid-column: 1 / 7;
  display: flex;
  min-width: 0;
  min-height: 3.35rem;
  padding: 0;
  align-self: stretch;
}

.intro-bento__tile--linkedin {
  grid-column: 7 / 13;
  min-width: 0;
  min-height: 3.35rem;
  height: 100%;
  box-sizing: border-box;
  align-self: stretch;
}

.intro-bento__tile--cta :deep(.intro-bento__cta-fill) {
  flex: 1 1 auto;
  width: 100%;
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0 !important;
  box-sizing: border-box;
}

.intro-bento__tile--cta :deep(.intro-bento__cta-fill.btn-attention) {
  align-self: stretch;
  height: 100%;
}

/*
 * Inverted CTA/LinkedIn fill (main.css :is(:hover, :focus-visible)) sets box-shadow: none; use
 * a double ring (paper + emphasis) with !important so the ring stays visible on ink, and
 * a light outline so the edge reads even when the signal sits on the dark fill.
 */
.intro-bento__tile--cta :deep(.intro-bento__cta-fill.btn-attention:focus-visible) {
  position: relative;
  z-index: 1;
  outline: 2px solid var(--paper) !important;
  outline-offset: 2px;
  box-shadow: 0 0 0 1px var(--paper), 0 0 0 3px var(--emphasis) !important;
}

:root.dark .intro-bento__tile--cta :deep(.intro-bento__cta-fill.btn-attention:focus-visible) {
  outline: 2px solid color-mix(in srgb, var(--signal) 50%, var(--ink)) !important;
  box-shadow: 0 0 0 1px var(--ink), 0 0 0 3px color-mix(in srgb, var(--signal) 45%, var(--ink)) !important;
}

@media (min-width: 768px) {
  .intro-bento__tile--headline {
    grid-column: 1 / span 8;
    grid-row: 1;
  }

  .intro-bento__tile--rail {
    grid-column: 9 / span 4;
    grid-row: 1 / span 2;
    height: 100%;
    align-self: stretch;
  }

  .intro-bento__tile--cta {
    grid-column: 1 / span 4;
    grid-row: 2;
  }

  .intro-bento__tile--linkedin {
    grid-column: 5 / span 4;
    grid-row: 2;
  }
}

@media (min-width: 1024px) {
  .intro-bento {
    --intro-bento-gap: clamp(0.75rem, 1.4vw, 1.2rem);
  }
}

.intro-rail {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  background-color: var(--pastel-blush);
  padding: clamp(1.15rem, 2.2vw, 1.7rem) clamp(1.15rem, 2.8vw, 1.85rem);
  min-width: 0;
}

.hero-title {
  margin: 0;
  font-family: var(--font-display);
  /* Slightly under global H1 scale; still fluid so line breaks track across breakpoints */
  font-size: clamp(1.75rem, 2.4vw + 0.85rem, 3.25rem);
  font-weight: 500;
  line-height: 1.08;
  letter-spacing: 0;
  color: var(--fg-primary);
  background: none;
  padding: 0;
  width: 100%;
  max-width: min(100%, 24em);
  box-sizing: border-box;
  hyphens: none;
  -webkit-hyphens: none;
  overflow-wrap: normal;
  word-break: normal;
}

.hero-title-lead {
  display: inline;
  letter-spacing: -0.035em;
}

.hero-title-sep {
  white-space: pre;
  user-select: none;
}

.hero-title-accent--after-lead {
  margin-inline-start: 0.08em;
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
  font-weight: 600;
  color: var(--fg-primary);
}

.intro-linkedin {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  isolation: isolate;
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  line-height: 1.2;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--pastel-ink);
  background: var(--pastel-sky);
  border: 1px solid color-mix(in srgb, var(--pastel-ink) 22%, var(--pastel-sky)) !important;
  border-radius: var(--radius-control, 0.35rem);
  padding: 0.65rem 1.4rem;
  outline-offset: 4px;
  box-shadow: none;
  transform: translateZ(0);
  transition:
    transform 0.18s cubic-bezier(0.22, 1, 0.36, 1),
    background-color 0.18s cubic-bezier(0.25, 1, 0.5, 1),
    color 0.18s cubic-bezier(0.25, 1, 0.5, 1),
    border-color 0.18s cubic-bezier(0.25, 1, 0.5, 1);
}

/* Square corners for intro bento actions (overrides .intro-linkedin) */
.intro-bento__tile--linkedin.intro-linkedin {
  border-radius: 0;
}

.intro-linkedin:is(:hover, :focus-visible) {
  background: var(--pastel-ink);
  border-color: var(--pastel-ink) !important;
  color: var(--pastel-sky);
  box-shadow: none;
}

.intro-linkedin:active {
  background: color-mix(in srgb, var(--pastel-ink) 88%, var(--pastel-sky));
  border-color: var(--pastel-ink) !important;
  color: var(--pastel-sky);
  transform: scale(0.98);
  box-shadow: none;
  transition-duration: 0.1s;
}

.intro-bento__tile--linkedin.intro-linkedin:focus-visible {
  position: relative;
  z-index: 1;
  outline: 2px solid var(--paper) !important;
  outline-offset: 2px;
  box-shadow: 0 0 0 1px var(--paper), 0 0 0 3px var(--emphasis) !important;
}

:root.dark .intro-bento__tile--linkedin.intro-linkedin:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--signal) 50%, var(--ink)) !important;
  box-shadow: 0 0 0 1px var(--ink), 0 0 0 3px color-mix(in srgb, var(--signal) 45%, var(--ink)) !important;
}

.intro-linkedin-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  color: currentColor;
}

@media (prefers-reduced-motion: reduce) {
  .intro-linkedin {
    transition:
      background-color 0.15s ease,
      color 0.15s ease,
      border-color 0.15s ease;
  }

  .intro-linkedin:active {
    transform: none;
  }
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
  --status-dot-color: var(--status-online);
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 999px;
  background: var(--status-dot-color);
  box-shadow: 0 0 0 0 color-mix(in srgb, var(--status-dot-color) 55%, var(--pastel-blush));
  animation: status-dot-pulse 2.2s var(--motion-ease-reveal, cubic-bezier(0.2, 0.6, 0.2, 1)) infinite;
  flex-shrink: 0;
  position: relative;
  top: -1px;
}

@keyframes status-dot-pulse {
  0% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--status-dot-color) 55%, var(--pastel-blush));
  }
  70% {
    box-shadow: 0 0 0 0.5rem color-mix(in srgb, var(--status-dot-color) 0%, var(--pastel-blush));
  }
  100% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--status-dot-color) 0%, var(--pastel-blush));
  }
}

@media (prefers-reduced-motion: reduce) {
  .status-dot {
    animation: none;
  }
}

/**
 * Choreograph with `.reveal-on-scroll--visible` so keyframes do not run while the
 * section is still scroll-hidden (opacity 0).
 */
.hero-fade-in {
  opacity: 0;
  transform: translate3d(0, 10px, 0);
}

.reveal-on-scroll--visible .hero-fade-in {
  animation: hero-fade-in 520ms var(--motion-ease-hero, cubic-bezier(0.16, 1, 0.3, 1)) both;
}

.reveal-on-scroll--visible .hero-delay-1 {
  animation-delay: 0.1s;
}

.reveal-on-scroll--visible .hero-delay-2 {
  animation-delay: 0.2s;
}

@keyframes hero-fade-in {
  from {
    opacity: 0;
    transform: translate3d(0, 10px, 0) scale(0.992);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }
}

/*
 * One motion layer: outer snaps opacity so the mint band reads immediately; lift + hero
 * keyframes carry the choreography (avoids nested opacity fades fighting each other).
 */
:deep(section.page-section.home-intro.reveal-on-scroll),
:deep(section.page-section.home-intro.reveal-on-scroll--visible) {
  transition-property: transform;
  transition-duration: 480ms;
  transition-timing-function: var(--motion-ease-hero, cubic-bezier(0.16, 1, 0.3, 1));
}

/* B1: Hero accent word secondary reveal — blooms in after the block fade */
@media (prefers-reduced-motion: no-preference) {
  .reveal-on-scroll--visible .hero-title-accent {
    animation: hero-accent-bloom 600ms var(--motion-ease-hero, cubic-bezier(0.16, 1, 0.3, 1)) both;
    animation-delay: 0.2s;
  }

  @keyframes hero-accent-bloom {
    from {
      opacity: 0;
      transform: translateX(6px) skewX(-4deg);
    }
    to {
      opacity: 1;
      transform: translateX(0) skewX(0deg);
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  :deep(section.page-section.home-intro.reveal-on-scroll),
  :deep(section.page-section.home-intro.reveal-on-scroll--visible) {
    transition: none;
  }

  .hero-fade-in {
    opacity: 1;
    transform: none;
  }

  .reveal-on-scroll--visible .hero-fade-in {
    animation: none;
  }
}
</style>
