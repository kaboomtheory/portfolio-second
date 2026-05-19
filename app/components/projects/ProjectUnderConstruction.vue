<script setup lang="ts">
import type { ProjectItem } from '~/types/project'
import { useInPageHashLink } from '~/composables/useInPageHashLink'

const props = defineProps<{
  project: ProjectItem
  prevProject?: ProjectItem | null
  nextProject?: ProjectItem | null
}>()

const backToWorkHref = '/#work'
const contactHref = '/#contact'
const { onInPageHashLinkClick } = useInPageHashLink()

const heroMediaSrc = computed(() => {
  const hero = props.project.heroImage?.trim()
  if (hero) return hero
  return props.project.thumbnail?.trim() || ''
})

const hasHeroMedia = computed(() => Boolean(heroMediaSrc.value))

const heroMediaSizes = '(max-width: 1024px) 100vw, min(90vw, 72rem)'

const metaLine = computed(() => {
  const client = props.project.client?.trim()
  const role = props.project.role?.trim()
  if (client && role) return `${client} · ${role}`
  return client || role || ''
})

const constructionMessage = computed(() => {
  const summary = props.project.summary?.trim()
  if (summary) return summary
  return 'This case study is still being built — check back soon.'
})

const accentStyle = computed<Record<string, string>>(() => ({
  '--project-accent': props.project.color?.trim() || 'var(--accent)',
}))
const { styleAttr, styleId } = useCspTargetStyle(() => accentStyle.value)
</script>

<template>
  <div
    class="project-under-construction project-detail-page"
    v-bind:[styleAttr]="styleId"
  >
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

    <div
      class="hero-stage"
      :class="{ 'hero-stage--has-image': hasHeroMedia }"
    >
      <div class="hero-stage__media">
        <SanityImage
          v-if="hasHeroMedia"
          :src="heroMediaSrc"
          :alt="project.name"
          :sizes="heroMediaSizes"
          loading="eager"
          decoding="async"
          class="hero-stage__image"
        />
        <div v-else class="hero-stage__fallback">
          <AppIcon icon="lucide:image-off" class="hero-stage__fallback-icon" aria-hidden="true" />
          <span class="hero-stage__fallback-copy">Preview coming soon</span>
        </div>
      </div>

      <div class="hero-stage__veil" aria-hidden="true" />
      <span class="hero-stage__badge">In progress</span>

      <div class="hero-stage__stack">
        <div
          class="construction-panel pastel-grain-shadow"
          role="status"
          aria-live="polite"
        >
        <p
          v-if="metaLine"
          class="construction-meta"
        >
          {{ metaLine }}
        </p>
        <div class="construction-icon-wrap" aria-hidden="true">
          <AppIcon icon="lucide:hammer" class="construction-icon" />
        </div>
        <p class="construction-eyebrow">
          Under construction
        </p>
        <p class="construction-message">
          {{ constructionMessage }}
        </p>
        </div>

        <div class="construction-actions">
          <div class="construction-actions__btn-wrap pastel-grain-shadow">
            <CtaButton
              :to="backToWorkHref"
              label="Browse all work"
              preserve-case
              pill
              attention
              class="construction-actions__primary"
            />
          </div>
          <div class="construction-actions__btn-wrap pastel-grain-shadow">
            <CtaButton
              :to="contactHref"
              label="Get in touch"
              secondary
              preserve-case
              pill
              class="construction-actions__secondary"
            />
          </div>
        </div>
      </div>
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
        <AppIcon icon="lucide:arrow-left" class="h-4 w-4 shrink-0" aria-hidden="true" />
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
        <AppIcon icon="lucide:arrow-right" class="h-4 w-4 shrink-0" aria-hidden="true" />
      </NuxtLink>
    </nav>
  </div>
</template>

<style scoped>
.project-under-construction {
  --signal: var(--signal-peach);
}

.back-link {
  color: var(--fg-muted);
}
.back-link:hover {
  color: var(--emphasis);
}

.hero-header {
  animation: hero-reveal 0.6s ease-out forwards;
  margin-bottom: var(--space-lg);
}

.project-hero-title {
  font-size: clamp(2.25rem, 4vw + 1rem, 3.25rem);
  font-weight: 600;
  line-height: 1.08;
  letter-spacing: -0.02em;
  color: var(--fg-primary);
  overflow-wrap: anywhere;
}

.hero-stage {
  position: relative;
  width: 100%;
  max-width: 56rem;
  margin-inline: auto;
  margin-bottom: clamp(5.5rem, 18vw, 9rem);
  aspect-ratio: 4 / 3;
  min-height: clamp(16rem, 52vw, 28rem);
  padding-bottom: clamp(3rem, 10vw, 5rem);
  overflow: visible;
  background: transparent;
  border: none;
  box-shadow: none;
  animation: stage-reveal 0.7s ease-out 0.1s both;
}

.hero-stage__media {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: var(--radius-card, 1rem);
  border: none;
  box-shadow: none;
}

.hero-stage__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.hero-stage--has-image .hero-stage__image {
  filter: saturate(0.38) brightness(0.78) contrast(0.92);
  opacity: 0.88;
}

.hero-stage__veil {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  border-radius: inherit;
  background:
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--bg-primary) 18%, transparent) 0%,
      color-mix(in srgb, var(--bg-primary) 42%, transparent) 42%,
      color-mix(in srgb, var(--bg-primary) 78%, transparent) 100%
    ),
    color-mix(in srgb, var(--bg-primary) 22%, transparent);
}

.hero-stage--has-image .hero-stage__veil {
  background:
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--bg-primary) 28%, transparent) 0%,
      color-mix(in srgb, var(--bg-primary) 55%, transparent) 50%,
      color-mix(in srgb, var(--bg-primary) 88%, transparent) 100%
    ),
    color-mix(in srgb, var(--bg-primary) 35%, transparent);
}

.hero-stage__badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 2;
  padding: 0.35rem 0.75rem;
  font-size: var(--label-size);
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--fg-primary);
  background: color-mix(in srgb, var(--bg-primary) 88%, transparent);
  border: 1px solid color-mix(in srgb, var(--project-accent, var(--accent)) 35%, transparent);
  border-radius: 999px;
  backdrop-filter: blur(6px);
}

.hero-stage__fallback {
  width: 100%;
  height: 100%;
  display: grid;
  place-content: center;
  gap: 0.65rem;
  color: var(--fg-muted);
  background: color-mix(in srgb, var(--bg-secondary) 92%, var(--project-accent, var(--accent)) 8%);
}

.hero-stage__fallback-icon {
  width: 1.5rem;
  height: 1.5rem;
  justify-self: center;
  opacity: 0.65;
}

.hero-stage__fallback-copy {
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  font-family: var(--font-mono);
}

.hero-stage__stack {
  position: absolute;
  z-index: 3;
  inset-inline: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: clamp(0.65rem, 1.25vw, 1.05rem);
  width: min(92%, 32rem);
  margin-inline: auto;
  transform: translateY(38%);
  overflow: visible;
  animation: stack-reveal 0.7s ease-out 0.2s both;
}

/* Matches home intro bento tiles (mint headline / grain shadow) */
.construction-panel {
  --fg-primary: var(--pastel-ink);
  --fg-secondary: var(--pastel-ink-muted);
  --fg-muted: color-mix(in srgb, var(--pastel-ink) 48%, var(--pastel-blush));
  --rule-soft: color-mix(in srgb, var(--pastel-ink) 12%, var(--pastel-mint));
  --btn-attention-bg: var(--pastel-peach);
  width: 100%;
  padding:
    clamp(1.05rem, 1.9vw, 1.55rem)
    clamp(1.2rem, 2.5vw, 2rem);
  text-align: center;
  background-color: var(--pastel-mint);
  border: none;
  border-radius: var(--radius-card, 0);
  box-shadow: none;
  box-sizing: border-box;
}

.construction-meta {
  margin: 0 0 0.85rem;
  padding-bottom: 0.85rem;
  border-bottom: 1px solid var(--rule-soft);
  font-family: var(--font-sans);
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: -0.005em;
  color: var(--fg-primary);
}

.construction-icon-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 0.65rem;
}

.construction-icon {
  width: 2rem;
  height: 2rem;
  color: color-mix(in srgb, var(--pastel-ink) 55%, var(--pastel-mint));
  animation: icon-bob 2.4s ease-in-out infinite;
}

.construction-eyebrow {
  margin: 0;
  font-family: var(--font-mono);
  font-size: var(--label-size);
  font-weight: 500;
  letter-spacing: var(--label-tracking-mono);
  text-transform: uppercase;
  color: var(--fg-muted);
}

.construction-message {
  margin: 0.45rem auto 0;
  max-width: 36ch;
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 600;
  font-size: clamp(1.15rem, 0.6vw + 1rem, 1.45rem);
  line-height: 1.36;
  color: var(--fg-primary);
  text-wrap: pretty;
}

.construction-actions {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: stretch;
  gap: clamp(0.85rem, 1.5vw, 1.15rem);
  width: 100%;
  overflow: visible;
}

.construction-actions__btn-wrap {
  position: relative;
  width: 100%;
  overflow: visible;
  border-radius: var(--radius-control, 0.35rem);
}

.construction-actions__btn-wrap :deep(.cta-button) {
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
}

/* Intro bento CTA: flush attention pill, no hairline ring */
.construction-actions :deep(.construction-actions__primary.btn-attention.cta-attention-pill),
.construction-actions :deep(.construction-actions__primary.btn-attention.cta-attention-pill:is(:hover, :focus-visible)),
.construction-actions :deep(.construction-actions__primary.btn-attention.cta-attention-pill:active) {
  border: none;
}

/* Secondary: pastel pink fill — override CtaButton secondary transparent !important */
.construction-actions :deep(.construction-actions__secondary.cta-button-secondary),
.construction-actions :deep(.construction-actions__secondary.cta-button-secondary:not(.cta-button-secondary--elevated)) {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--pastel-ink) !important;
  background-color: var(--pastel-pink) !important;
  border: none !important;
}

.construction-actions :deep(.construction-actions__secondary.cta-button-secondary:is(:hover, :focus-visible)),
.construction-actions :deep(.construction-actions__secondary.cta-button-secondary:active) {
  background-color: var(--pastel-ink) !important;
  color: var(--pastel-pink) !important;
}

@media (min-width: 480px) {
  .construction-actions {
    flex-direction: row;
    justify-content: center;
  }

  .construction-actions__btn-wrap {
    width: auto;
    flex: 1 1 auto;
    min-width: min(100%, 10.5rem);
  }
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

@keyframes stage-reveal {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes stack-reveal {
  from {
    opacity: 0;
    transform: translateY(42%) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(38%) scale(1);
  }
}

@keyframes icon-bob {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

@media (min-width: 640px) {
  .hero-stage__stack {
    width: min(88%, 34rem);
    transform: translateY(42%);
  }

  @keyframes stack-reveal {
    from {
      opacity: 0;
      transform: translateY(46%) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(42%) scale(1);
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-header,
  .hero-stage,
  .hero-stage__stack {
    animation: none !important;
  }

  .hero-stage__stack {
    transform: translateY(38%);
  }

  @media (min-width: 640px) {
    .hero-stage__stack {
      transform: translateY(42%);
    }
  }

  .construction-icon {
    animation: none !important;
  }
}
</style>
