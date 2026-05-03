<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCardTilt } from '~/composables/useCardTilt'
import { profile } from '~/data/site'
import type { HomeHeroTaglineLine } from '~/data/home'

function joinTaglineLine(line: HomeHeroTaglineLine | undefined) {
  return line?.segments?.map((s) => s.text).join('')?.trim() ?? ''
}

function startsWithWordChar(value: string) {
  return /^[\p{L}\p{N}]/u.test(value)
}

function endsWithWordChar(value: string) {
  return /[\p{L}\p{N}]$/u.test(value)
}

function normalizeTaglineSegments(line: HomeHeroTaglineLine): HomeHeroTaglineLine {
  const source = line?.segments ?? []
  const segments: { text: string; em?: boolean }[] = []

  for (const seg of source) {
    const prev = segments[segments.length - 1]
    let text = seg.text
    if (prev && text && endsWithWordChar(prev.text) && startsWithWordChar(text))
      text = ` ${text}`
    segments.push({ ...seg, text })
  }

  return { segments }
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
  /** Intro bento primary action — use `to` for in-app routes/hashes (same smooth scroll as nav). */
  introCtaTo: string
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
  return lines
    .filter((line) => !isLocationOnlyByline(joinTaglineLine(line), loc))
    .map(normalizeTaglineSegments)
})

const headlineTiltHostRef = ref<HTMLElement | null>(null)
const headlineTiltRef = ref<HTMLElement | null>(null)
useCardTilt(headlineTiltHostRef, headlineTiltRef, { maxDeg: 1.5, lerp: 0.12 })
</script>

<template>
  <RevealOnScroll
    id="intro"
    :delay="0"
    :threshold="0"
    root-margin="0px"
    class="page-section home-intro"
  >
    <div class="home-hero-band">
      <h1 class="hero-name" aria-label="Howdy! I'm Bryan.">
        <picture
          class="hero-name-anim"
          aria-hidden="true"
        >
          <source srcset="/images/layer_animation.webp" type="image/webp">
          <img
            src="/images/layer_animation.apng"
            width="356"
            height="456"
            alt=""
            decoding="async"
          >
        </picture>
        <span class="hero-name-text">
          <span class="hero-name-greeting">Howdy!</span>
          <span class="hero-name-main">I'm Bryan.</span>
        </span>
      </h1>
      <div class="intro-bento intro-grid grid-12">
        <div
          ref="headlineTiltHostRef"
          class="intro-bento__tile intro-bento__tile--headline pastel-grain-shadow hero-fade-in"
        >
          <div ref="headlineTiltRef" class="intro-headline-tilt">
            <div
              v-if="heroTaglinesDisplay.length"
              class="hero-tagline"
            >
              <p
                v-for="(line, lineIndex) in heroTaglinesDisplay"
                :key="lineIndex"
                class="hero-tagline-line"
              >
                <component
                  :is="seg.em ? 'strong' : 'span'"
                  v-for="(seg, segIndex) in line.segments"
                  :key="segIndex"
                  class="hero-tagline-segment"
                  :class="{ 'hero-tagline-em': seg.em }"
                >
                  {{ seg.text.trim() }}
                </component>
              </p>
            </div>
          </div>
        </div>

        <aside
          class="intro-bento__tile intro-bento__tile--rail intro-rail pastel-grain-shadow hero-fade-in hero-delay-1"
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
        </aside>

        <div class="intro-bento__tile intro-bento__tile--cta pastel-grain-shadow hero-fade-in hero-delay-1">
          <CtaButton
            :to="introCtaTo"
            :label="introCtaLabel"
            :download="introCtaDownload"
            attention
            preserve-case
            class="intro-bento__cta-fill"
          >
            <template #icon><AppIcon icon="lucide:book-open" class="text-sm" /></template>
          </CtaButton>
        </div>

        <a
          :href="linkedinHref"
          class="intro-bento__tile intro-bento__tile--linkedin intro-linkedin pastel-grain-shadow hero-fade-in hero-delay-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          <AppIcon icon="ri:linkedin-fill" class="intro-linkedin-icon" aria-hidden="true" />
          LinkedIn
          <span class="sr-only">(opens in new tab)</span>
        </a>
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
  --hero-title-size: clamp(1.75rem, 2.4vw + 0.85rem, 3.25rem);
  --hero-title-leading: 1.08;
  --hero-title-max: min(100%, 24em);
  --hero-accent-tracking: -0.032em;
  --hero-tagline-size: clamp(1.38rem, 1.05vw + 1.05rem, 2.05rem);
  --hero-tagline-leading: 1.36;
  --hero-tagline-gap: 0.45rem;
  --hero-tagline-max: 56ch;
  padding-top: 0;
  padding-bottom: 0;
}

.home-hero-band {
  position: relative;
  width: 100%;
  min-width: 0;
  padding-top: clamp(0.8rem, 1.6vw, 1.4rem);
  padding-bottom: clamp(0.45rem, 1.15vw, 0.95rem);
}

.intro-bento {
  --intro-bento-gap: clamp(0.65rem, 1.25vw, 1.05rem);
  --intro-bento-radius: var(--radius-card, 0);
  position: relative;
  width: 100%;
  min-width: 0;
  row-gap: var(--intro-bento-gap);
  column-gap: var(--intro-bento-gap);
  align-items: stretch;
  padding-inline: clamp(1.25rem, 5vw, 4rem);
  padding-top: clamp(1.25rem, 2.5vw, 2rem);
}

.intro-bento__tile--headline {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: var(--home-stack-gap-comfortable);
  align-self: stretch;
  min-width: 0;
  max-width: 100%;
  overflow: visible;
  background-color: var(--pastel-mint);
  border-radius: var(--intro-bento-radius);
  padding:
    clamp(1.05rem, 1.9vw, 1.55rem)
    clamp(1.2rem, 2.5vw, 2rem)
    clamp(1.05rem, 1.9vw, 1.55rem);
  box-sizing: border-box;
}

.intro-headline-tilt {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--home-stack-gap-comfortable);
  min-width: 0;
  width: 100%;
  flex: 1 1 auto;
  transform-origin: 50% 40%;
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
  min-height: 2.75rem;
  padding: 0;
  align-self: start;
}

.intro-bento__tile--linkedin {
  grid-column: 7 / 13;
  min-width: 0;
  min-height: 2.75rem;
  box-sizing: border-box;
  align-self: start;
}

.intro-bento__tile--cta :deep(.intro-bento__cta-fill) {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

@media (min-width: 768px) {
  .intro-bento__tile--cta :deep(.intro-bento__cta-fill) {
    flex: 1 1 auto;
    min-height: 100%;
  }
}

/* Bento CTAs sit flush on the grid — no hairline ring from global attention-pill */
.intro-bento__tile--cta :deep(.intro-bento__cta-fill.btn-attention.cta-attention-pill),
.intro-bento__tile--cta
  :deep(.intro-bento__cta-fill.btn-attention.cta-attention-pill:is(:hover, :focus-visible)),
.intro-bento__tile--cta :deep(.intro-bento__cta-fill.btn-attention.cta-attention-pill:active) {
  border: none;
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
  .home-intro {
    --hero-title-size: clamp(1.95rem, 2.05vw + 1rem, 3.1rem);
    --hero-title-leading: 1.07;
    --hero-title-max: min(100%, 23.5em);
    --hero-accent-tracking: -0.03em;
    --hero-tagline-size: clamp(1.75rem, 0.9vw + 1.35rem, 2.45rem);
    --hero-tagline-leading: 1.34;
    --hero-tagline-gap: 0.38rem;
    --hero-tagline-max: 54ch;
  }

  .hero-name-main {
    font-size: clamp(3rem, 4vw + 1rem, 5rem);
  }

  .intro-bento__tile--headline {
    grid-column: 1 / span 8;
    grid-row: 1;
  }

  .intro-bento.grid-12 {
    padding-inline: clamp(2.25rem, 5vw, 4rem);
  }

  .intro-bento__tile--rail {
    grid-column: 9 / span 4;
    grid-row: 1;
    height: 100%;
    align-self: stretch;
  }

  .intro-bento__tile--cta {
    grid-column: 1 / 7;
    grid-row: 2;
    align-self: start;
  }

  .intro-bento__tile--linkedin {
    grid-column: 7 / 13;
    grid-row: 2;
    align-self: start;
  }
}

@media (min-width: 1024px) {
  .home-intro {
    --hero-title-size: clamp(2.18rem, 1.7vw + 1.1rem, 3.3rem);
    --hero-title-leading: 1.06;
    --hero-title-max: min(100%, 23.2em);
    --hero-accent-tracking: -0.028em;
    --hero-tagline-size: clamp(2rem, 0.8vw + 1.5rem, 2.75rem);
    --hero-tagline-leading: 1.32;
    --hero-tagline-gap: 0.34rem;
    --hero-tagline-max: 52ch;
  }

  .hero-name-main {
    font-size: clamp(3.2rem, 3.5vw + 1.2rem, 5.5rem);
  }

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
  font-size: var(--hero-title-size);
  font-weight: 500;
  line-height: var(--hero-title-leading);
  letter-spacing: 0;
  color: var(--fg-primary);
  background: none;
  padding: 0;
  width: 100%;
  max-width: var(--hero-title-max);
  box-sizing: border-box;
  hyphens: none;
  -webkit-hyphens: none;
  overflow-wrap: normal;
  word-break: normal;
}

.hero-title-lead {
  display: inline;
  letter-spacing: -0.035em;
  transition: letter-spacing 140ms linear;
}

.hero-title-accent {
  font-family: var(--font-serif);
  font-style: italic;
  /* 400+ reads sharper on a tinted tile than 300 (less “mush” at color edges) */
  font-weight: 400;
  letter-spacing: var(--hero-accent-tracking);
  /* Solid ink: hue animation between green/brown smears through muddy sRGB midpoints on mint */
  color: var(--pastel-ink);
  position: relative;
  /* isolation creates stacking context so ::after { z-index: -1 } sits behind text */
  isolation: isolate;
}

.hero-title-accent::after {
  content: '';
  position: absolute;
  inset: -0.1em -0.05em;
  background: linear-gradient(
    90deg,
    transparent 0%,
    color-mix(in srgb, var(--signal-coral-ink) 55%, transparent) 50%,
    transparent 100%
  );
  transform: scaleX(0);
  transform-origin: left center;
  z-index: -1;
  pointer-events: none;
}

.hero-name {
  margin: 0 0 0.08em;
  padding-inline: clamp(2.25rem, 5vw, 4rem);
  font-family: var(--font-serif);
  font-weight: 400;
  line-height: 1.05;
  letter-spacing: -0.025em;
  color: var(--ink);
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: clamp(1rem, 3vw, 2rem);
  opacity: 0;
  filter: blur(12px);
  transform: scale(1.04);
}

.hero-name-text {
  display: flex;
  flex-direction: column;
}

.hero-name-anim {
  display: block;
  height: clamp(5rem, 12.3vw + 1.2rem, 11.1rem);
  width: auto;
  flex-shrink: 0;
  pointer-events: none;
  user-select: none;
}

.hero-name-anim img {
  display: block;
  width: auto;
  height: 100%;
}

@media (max-width: 640px) {
  .hero-name {
    flex-direction: row;
    align-items: flex-end;
    gap: clamp(0.5rem, 2.5vw, 1rem);
  }

  .hero-name-text {
    min-width: 0;
    flex: 1 1 0;
  }

  .hero-name-anim {
    width: clamp(5rem, 28vw, 7.5rem);
    height: auto;
    flex-shrink: 0;
  }

  .hero-name-anim img {
    width: 100%;
    height: auto;
  }
}

.hero-name-greeting {
  font-size: clamp(2rem, 3.5vw + 0.7rem, 3.5rem);
  line-height: 1.2;
}

.hero-name-main {
  font-size: clamp(3.5rem, 7vw + 1rem, 7rem);
  line-height: 1.05;
}

.reveal-on-scroll--visible .hero-name {
  animation: hero-name-focus 800ms var(--motion-ease-hero, cubic-bezier(0.16, 1, 0.3, 1)) both;
}

@keyframes hero-name-focus {
  0% {
    opacity: 0;
    filter: blur(12px);
    transform: scale(1.04);
  }
  100% {
    opacity: 1;
    filter: blur(0px);
    transform: scale(1);
  }
}

.hero-tagline {
  display: block;
  width: 100%;
  max-width: min(100%, 42rem);
  min-width: 0;
}

.hero-tagline-line {
  display: flex;
  flex-wrap: wrap;
  column-gap: 0.28em;
  row-gap: 0;
  margin: 0;
  font-size: var(--hero-tagline-size);
  font-weight: 400;
  line-height: var(--hero-tagline-leading);
  color: color-mix(in srgb, var(--fg-primary) 82%, transparent);
  letter-spacing: 0;
  font-family: var(--font-sans);
  text-wrap: pretty;
  text-rendering: optimizeLegibility;
  font-feature-settings: 'kern' 1, 'liga' 1;
  width: 100%;
  max-width: min(100%, var(--hero-tagline-max));
  overflow-wrap: break-word;
}

@media (max-width: 640px) {
  .hero-tagline-line {
    text-wrap: wrap;
  }
}

.hero-tagline-segment {
  min-width: 0;
  max-width: 100%;
  overflow-wrap: break-word;
}

.hero-tagline-line + .hero-tagline-line {
  margin-top: var(--hero-tagline-gap);
}

.hero-tagline-em {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 600;
  letter-spacing: 0;
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
  border: none;
  border-radius: var(--radius-control, 0);
  padding: 0.65rem 1.4rem;
  outline-offset: 4px;
  box-shadow: none;
  transform: translateZ(0);
  transition:
    transform 0.18s cubic-bezier(0.22, 1, 0.36, 1),
    background-color 0.18s cubic-bezier(0.25, 1, 0.5, 1),
    color 0.18s cubic-bezier(0.25, 1, 0.5, 1);
}

@media (max-width: 640px) {
  .intro-bento__tile--cta,
  .intro-bento__tile--linkedin {
    grid-column: 1 / -1;
  }

  .intro-linkedin {
    gap: 0.38rem;
    padding-inline: 0.55rem;
    font-size: 0.68rem;
    letter-spacing: 0.06em;
  }
}

/* Square corners for intro bento actions (overrides .intro-linkedin) */
.intro-bento__tile--linkedin.intro-linkedin {
  border-radius: 0;
}

.intro-linkedin:is(:hover, :focus-visible) {
  background: var(--pastel-ink);
  color: var(--pastel-sky);
  box-shadow: none;
}

.intro-linkedin:active {
  background: color-mix(in srgb, var(--pastel-ink) 88%, var(--pastel-sky));
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
      color 0.15s ease;
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
    box-shadow:
      0 0 0 0 color-mix(in srgb, var(--status-dot-color) 55%, var(--pastel-blush)),
      0 0 0 0 color-mix(in srgb, var(--status-dot-color) 28%, var(--pastel-blush));
  }
  50% {
    box-shadow:
      0 0 0 0.5rem color-mix(in srgb, var(--status-dot-color) 0%, var(--pastel-blush)),
      0 0 0 0 color-mix(in srgb, var(--status-dot-color) 20%, var(--pastel-blush));
  }
  70% {
    box-shadow:
      0 0 0 0.5rem color-mix(in srgb, var(--status-dot-color) 0%, var(--pastel-blush)),
      0 0 0 0.85rem color-mix(in srgb, var(--status-dot-color) 0%, var(--pastel-blush));
  }
  100% {
    box-shadow:
      0 0 0 0 color-mix(in srgb, var(--status-dot-color) 0%, var(--pastel-blush)),
      0 0 0 0 color-mix(in srgb, var(--status-dot-color) 0%, var(--pastel-blush));
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

/* B1: Accent = typography only (bloom in). No color keyframes — sRGB lerp between hues reads murky. */
@media (prefers-reduced-motion: no-preference) {
  .reveal-on-scroll--visible .hero-title-accent {
    animation: hero-accent-bloom 600ms var(--motion-ease-hero, cubic-bezier(0.16, 1, 0.3, 1)) both;
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

  .reveal-on-scroll--visible .hero-title-accent::after {
    animation: hero-ink-sweep 720ms var(--motion-ease-hero, cubic-bezier(0.16, 1, 0.3, 1)) both;
  }

  @keyframes hero-ink-sweep {
    0%   { transform: scaleX(0); opacity: 0; }
    20%  { opacity: 1; }
    70%  { transform: scaleX(1); opacity: 1; }
    100% { transform: scaleX(1); opacity: 0; }
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

  .hero-title-lead,
  .hero-title-accent {
    transition: none;
  }

  .hero-name {
    opacity: 1;
    filter: none;
    transform: none;
  }

  .reveal-on-scroll--visible .hero-name {
    animation: none;
  }

  .reveal-on-scroll--visible .hero-fade-in {
    animation: none;
  }
}
</style>
