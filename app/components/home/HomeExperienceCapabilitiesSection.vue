<script setup lang="ts">
import { useScrollRevealGroup } from '~/composables/useScrollReveal'

const props = defineProps<{
  experienceItems: {
    title: string
    company: string
    year: string
    description: string
    image?: string | null
  }[]
  groups: { category: string; items: string[] }[]
}>()

const { containerRef: xpListRef, visibleItems: xpVisible } = useScrollRevealGroup(props.experienceItems.length, {
  staggerDelay: 80,
  threshold: 0.08,
  rootMargin: '0px 0px -40px 0px',
})
</script>

<template>
  <RevealOnScroll :delay="240" class="resume-section-outer">
    <div class="resume-grid grid-12">
      <div class="resume-marker">
        <SectionMarker index="05" word="Background" />
      </div>

      <div class="resume-cols">
        <section
          id="experience"
          class="resume-block"
          aria-labelledby="experience-heading"
        >
          <h2 id="experience-heading" class="resume-block-heading">
            Experience
          </h2>

          <div v-if="experienceItems.length" ref="xpListRef" class="experience-list">
            <article
              v-for="(item, index) in experienceItems"
              :key="`${item.company}-${item.year}-${index}`"
              class="experience-row"
              :class="{ 'xp-row--visible': xpVisible[index] }"
            >
              <SanityImage
                v-if="item.image"
                :src="item.image"
                :alt="item.company"
                width="48"
                height="48"
                sizes="48px"
                loading="lazy"
                decoding="async"
                class="experience-logo"
              />
              <div class="experience-copy">
                <p class="experience-meta">
                  <span class="experience-company">{{ item.company }}</span>
                  <span class="experience-meta-sep" aria-hidden="true">·</span>
                  <span class="experience-year mono">{{ item.year }}</span>
                </p>
                <h3 class="experience-title">{{ item.title }}</h3>
                <p class="experience-desc">{{ item.description }}</p>
              </div>
            </article>
          </div>
          <p v-else class="resume-empty text-muted text-sm">
            Experience will appear here when it is available.
          </p>
        </section>

        <section
          id="capabilities"
          class="resume-block resume-block--capabilities"
          aria-labelledby="capabilities-heading"
        >
          <h2 id="capabilities-heading" class="resume-block-heading">
            Capabilities
          </h2>
          <p class="resume-block-lede text-muted">
            Disciplines I practice day-to-day, plus the software I use to ship work.
          </p>

          <div v-if="groups.length" class="capabilities-grid">
            <div v-for="group in groups" :key="group.category" class="capability-group">
              <h3 class="capability-group-title">{{ group.category }}</h3>
              <div class="capability-tags">
                <span
                  v-for="(item, tagIndex) in group.items"
                  :key="item"
                  class="capability-tag"
                  :style="{ '--tag-i': tagIndex }"
                >{{ item }}</span>
              </div>
            </div>
          </div>
          <p v-else class="resume-empty text-muted text-sm">
            Capabilities will appear here when they are available.
          </p>
        </section>
      </div>
    </div>
  </RevealOnScroll>
</template>

<style scoped>
.resume-section-outer {
  --signal: var(--signal-mint);
  --rule: color-mix(in srgb, var(--fg-primary) 16%, var(--bg-primary));
  --rule-soft: color-mix(in srgb, var(--fg-primary) 12%, var(--bg-primary));
  --btn-attention-bg: var(--pastel-blush);
  padding-top: 0;
  padding-bottom: 0;
}

.resume-grid {
  row-gap: var(--home-grid-gap-resume);
  align-items: start;
  padding-top: clamp(1.35rem, 3vw, 2.65rem);
  padding-bottom: clamp(1.35rem, 3vw, 2.65rem);
}

.resume-marker {
  grid-column: 1 / -1;
}

.resume-cols {
  grid-column: 1 / -1;
  display: grid;
  gap: var(--home-resume-cols-gap);
}

@media (min-width: 768px) {
  .resume-marker {
    grid-column: 1 / span 3;
  }

  .resume-cols {
    grid-column: 4 / span 9;
    grid-template-columns: minmax(0, 1fr);
    row-gap: clamp(2rem, 4vw, 3.25rem);
  }
}

@media (min-width: 1024px) {
  .resume-marker {
    position: sticky;
    top: 6.5rem;
    align-self: start;
  }
}

.resume-block-heading {
  margin: 0 0 1rem;
  font-family: var(--font-display);
  font-size: var(--text-h3);
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--fg-primary);
}

.resume-block-lede {
  margin: -0.25rem 0 1.25rem;
  font-size: var(--text-body);
  line-height: 1.55;
  max-width: 36rem;
}

.resume-empty {
  margin: 0;
}

.experience-list {
  display: flex;
  flex-direction: column;
}

.experience-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-md);
  padding: var(--space-lg) 0;
  border-bottom: 1px solid var(--rule);
}

.experience-row:first-of-type {
  border-top: 1px solid var(--rule);
}

@media (min-width: 640px) {
  .experience-row {
    grid-template-columns: auto 1fr;
    align-items: baseline;
  }
}

.experience-logo {
  width: 48px;
  height: 48px;
  object-fit: contain;
  padding: 4px;
  background: color-mix(in srgb, var(--paper) 84%, var(--pastel-peach));
  border: 1px solid var(--rule-soft);
  align-self: start;
  position: relative;
  top: 0.15rem;
}

.experience-copy {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.experience-meta {
  margin: 0;
  display: inline-flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.4rem;
  font-size: var(--label-size);
  font-family: var(--font-mono);
  font-weight: 500;
  letter-spacing: var(--label-tracking-mono);
  text-transform: uppercase;
  color: var(--fg-muted);
  line-height: 1.2;
}

.experience-company {
  color: var(--fg-muted);
}

.experience-meta-sep {
  color: var(--fg-muted);
  opacity: 0.55;
  user-select: none;
}

.experience-year {
  color: var(--fg-secondary);
  white-space: nowrap;
  transition: color 220ms var(--flourish-ease, cubic-bezier(0.22, 1, 0.36, 1));
}

.experience-title {
  margin: 0;
  font-size: var(--text-body-lg);
  font-weight: 500;
  color: var(--fg-primary);
}

.experience-desc {
  margin: 0.35rem 0 0;
  font-size: var(--text-body);
  line-height: 1.55;
  color: var(--fg-secondary);
}

.capabilities-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.capability-group {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.capability-group-title {
  margin: 0;
  font-family: var(--font-serif);
  font-size: clamp(1.05rem, 0.45vw + 0.95rem, 1.2rem);
  font-style: italic;
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--fg-primary);
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
}

/* Mini sparkline ticks after each capability category label */
.capability-group-title::after {
  content: '';
  display: inline-block;
  flex-shrink: 0;
  width: 2.2rem;
  height: 0.7em;
  background-image:
    linear-gradient(to top, var(--signal) 100%, transparent 0%),
    linear-gradient(to top, var(--signal) 70%, transparent 0%),
    linear-gradient(to top, var(--signal) 45%, transparent 0%),
    linear-gradient(to top, var(--signal) 88%, transparent 0%),
    linear-gradient(to top, var(--signal) 55%, transparent 0%);
  background-size: 3px 100%, 3px 100%, 3px 100%, 3px 100%, 3px 100%;
  background-position: 0 0, 6px 0, 12px 0, 18px 0, 24px 0;
  background-repeat: no-repeat;
  opacity: 0.3;
  align-self: center;
}

.capability-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

/* ── A1: Experience row stagger reveal ───────────────────────────────── */
.experience-row {
  opacity: 0;
  transform: translateY(8px);
  transition:
    opacity 360ms var(--motion-ease-hero, cubic-bezier(0.16, 1, 0.3, 1)),
    transform 360ms var(--motion-ease-hero, cubic-bezier(0.16, 1, 0.3, 1)),
    background-color 200ms var(--motion-ease-standard, cubic-bezier(0.25, 0.46, 0.45, 0.94)),
    border-color 200ms var(--motion-ease-standard, cubic-bezier(0.25, 0.46, 0.45, 0.94));
}

.experience-row.xp-row--visible {
  opacity: 1;
  transform: none;
}

.experience-row:hover {
  background-color: color-mix(in srgb, var(--signal) 5%, var(--bg-primary));
  border-top-color: color-mix(in srgb, var(--signal) 26%, var(--bg-primary));
  border-bottom-color: color-mix(in srgb, var(--signal) 26%, var(--bg-primary));
}

.experience-row:hover .experience-year {
  color: var(--signal);
}

@media (prefers-reduced-motion: reduce) {
  .experience-row {
    opacity: 1;
    transform: none;
    transition: background-color 200ms ease, border-color 200ms ease;
  }
}

/* ── A2: Capability tag hover + stagger ──────────────────────────────── */
.capability-tag {
  padding: 0.35rem 0.65rem;
  font-family: var(--font-mono);
  font-size: var(--label-size);
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--fg-secondary);
  border: 1px solid var(--rule-soft);
  background: var(--bg-primary);
  cursor: default;
  opacity: 0;
  transition:
    transform 180ms var(--motion-ease-hero, cubic-bezier(0.16, 1, 0.3, 1)),
    border-color 180ms var(--motion-ease-hero, cubic-bezier(0.16, 1, 0.3, 1)),
    background-color 180ms var(--motion-ease-hero, cubic-bezier(0.16, 1, 0.3, 1)),
    color 180ms var(--motion-ease-hero, cubic-bezier(0.16, 1, 0.3, 1));
}

.reveal-on-scroll--visible .capability-tag {
  animation: capability-tag-enter 360ms var(--motion-ease-hero, cubic-bezier(0.16, 1, 0.3, 1)) both;
  animation-delay: calc(min(var(--tag-i, 0), 16) * 28ms);
}

@keyframes capability-tag-enter {
  from {
    opacity: 0;
    transform: translate3d(0, 4px, 0) scale(0.96);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

.capability-tag:hover {
  transform: translateY(-2px) scale(1.06);
  border-color: var(--signal);
  background-color: color-mix(in srgb, var(--signal) 8%, var(--bg-primary));
  color: var(--fg-primary);
  box-shadow: 0 2px 8px -2px color-mix(in srgb, var(--signal) 22%, transparent);
}

/* Subtle neighbor pull — sibling tags shift slightly toward the hovered tag */
@supports selector(:has(*)) {
  .capability-tags:has(.capability-tag:hover) .capability-tag:not(:hover) {
    transform: translateY(-0.5px) scale(1.02);
    border-color: color-mix(in srgb, var(--signal) 28%, var(--rule-soft));
  }
}

.capability-tag:active {
  transform: scale(0.97);
  transition-duration: 100ms;
}

@media (prefers-reduced-motion: reduce) {
  .capability-tag {
    opacity: 1;
    transition: border-color 150ms ease, background-color 150ms ease, color 150ms ease;
  }

  .capability-tag:hover {
    transform: none;
  }

  .capability-tag:active {
    transform: none;
  }
}
</style>
