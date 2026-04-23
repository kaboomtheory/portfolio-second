<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useScrollExpandImage } from '~/composables/useScrollExpand'
import { useScrollRevealGroup } from '~/composables/useScrollReveal'

const props = defineProps<{
  name: string
  avatar: string
  story: string[]
  resumeHref: string
  availabilityMailto: string
  availabilityCtaLabel: string
}>()

const avatarRef = ref<HTMLElement | null>(null)
const { scale: avatarScale, displayedOpacity: avatarOpacity } = useScrollExpandImage(avatarRef, {
  minScale: 0.94,
})
const avatarStyle = computed(() => ({
  transform: `scale(${avatarScale.value})`,
  opacity: avatarOpacity.value,
  transition: 'transform 0.1s ease-out, opacity 0.15s ease-out',
  willChange: 'transform, opacity',
}))

const { containerRef: storyProseRef, visibleItems: paraVisible } = useScrollRevealGroup(
  props.story.length,
  { staggerDelay: 60, threshold: 0.05, rootMargin: '0px 0px -30px 0px' },
)
</script>

<template>
  <RevealOnScroll id="story" :delay="160" class="story-section-outer content-flow">
    <div class="story-grid grid-12">
      <div class="story-marker">
        <div class="story-marker-sticky">
          <span class="section-marker">
            <span class="section-marker-word">Story</span>
          </span>
        </div>
      </div>

      <div class="story-body">
        <div ref="storyProseRef" class="story-body-prose">
          <p
            v-for="(paragraph, index) in story"
            :key="index"
            class="story-paragraph"
            :class="{ 'para--visible': paraVisible[index] }"
          >
            {{ paragraph }}
          </p>
        </div>

        <div class="story-cta-row">
          <CtaButton
            :href="resumeHref"
            label="Download résumé"
            attention
            preserve-case
            target="_blank"
          >
            <template #icon><Icon icon="lucide:download" class="text-sm" /></template>
          </CtaButton>
        </div>
      </div>

      <div class="story-aside">
        <figure class="story-avatar">
          <div ref="avatarRef" class="story-avatar-frame" :style="avatarStyle">
            <SanityImage
              :src="avatar"
              :alt="name"
              sizes="(max-width: 767px) 100vw, 22rem"
              class="story-avatar-image"
              loading="lazy"
              decoding="async"
            />
          </div>
          <figcaption class="story-avatar-caption">
            <span class="story-avatar-key">Fig.&nbsp;01</span>
            <span class="story-avatar-val">{{ name }}, Los Angeles</span>
          </figcaption>
        </figure>
      </div>
    </div>
  </RevealOnScroll>
</template>

<style scoped>
.story-section-outer {
  --signal: var(--signal-peach);
  --rule: color-mix(in srgb, var(--fg-primary) 16%, var(--paper));
  --rule-soft: color-mix(in srgb, var(--fg-primary) 12%, var(--paper));
  --btn-attention-bg: var(--pastel-sky);
  padding-top: 0;
  padding-bottom: 0;
}

.story-grid {
  row-gap: var(--home-grid-gap-editorial);
  align-items: start;
  padding-top: 0;
}

.story-marker {
  grid-column: 1 / -1;
}

.story-body {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: var(--home-stack-gap-comfortable);
  min-width: 0;
}

.story-body-prose {
  padding: clamp(1.25rem, 2.5vw, 1.75rem) clamp(1.25rem, 3vw, 2rem);
  display: flex;
  flex-direction: column;
  gap: var(--home-stack-gap-tight);
  min-width: 0;
  border-radius: 0.25rem;
}

.story-aside {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: var(--home-stack-gap-comfortable);
}

@media (min-width: 768px) {
  .story-marker {
    grid-column: 1 / span 3;
    grid-row: 1;
  }

  .story-body {
    grid-column: 4 / span 5;
    grid-row: 1;
    max-width: 68ch;
  }

  .story-aside {
    grid-column: 9 / span 4;
    grid-row: 1;
    max-width: 22rem;
    justify-self: end;
    width: 100%;
  }
}

@media (min-width: 1024px) {
  .story-marker {
    position: sticky;
    top: 6.5rem;
    align-self: start;
  }
}

.story-marker-sticky {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.story-paragraph {
  font-family: var(--font-sans);
  font-size: var(--text-body);
  line-height: 1.55;
  color: var(--fg-primary);
  margin: 0;
  letter-spacing: 0;
  opacity: 0;
  transform: translateY(6px);
  transition:
    opacity 360ms var(--motion-ease-hero, cubic-bezier(0.16, 1, 0.3, 1)),
    transform 360ms var(--motion-ease-hero, cubic-bezier(0.16, 1, 0.3, 1));
}

.story-paragraph.para--visible {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .story-paragraph {
    opacity: 1;
    transform: none;
    transition: none;
  }
}

.story-cta-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  margin-top: clamp(0.75rem, 1.5vw, 1.25rem);
}

.story-avatar {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.story-avatar-frame {
  aspect-ratio: 1 / 1;
  width: 100%;
  max-width: 100%;
  border: 1px solid var(--rule);
  background: var(--pastel-sky);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.story-avatar-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.story-avatar-caption {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding-top: 0.55rem;
  border-top: 1px solid var(--rule-soft);
}

.story-avatar-key {
  font-family: var(--font-mono);
  font-size: var(--label-size);
  font-weight: 500;
  letter-spacing: var(--label-tracking-mono);
  text-transform: uppercase;
  color: var(--signal);
}

.story-avatar-val {
  font-family: var(--font-sans);
  font-size: 0.85rem;
  color: var(--fg-secondary);
  letter-spacing: -0.005em;
}
</style>
