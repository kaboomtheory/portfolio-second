<script setup lang="ts">
import { ref, computed } from 'vue'
import { useScrollExpandImage } from '~/composables/useScrollExpand'
import { useScrollRevealGroup } from '~/composables/useScrollReveal'

const props = defineProps<{
  name: string
  avatar: string
  story: string[]
  resumeHref: string
}>()

const avatarRef = ref<HTMLElement | null>(null)
const { scale: avatarScale, displayedOpacity: avatarOpacity } = useScrollExpandImage(avatarRef, {
  minScale: 0.9,
  maxScale: 1.04,
})
const avatarStyle = computed(() => ({
  transform: `scale(${avatarScale.value})`,
  opacity: avatarOpacity.value,
}))
const { styleAttr: avatarStyleAttr, styleId: avatarStyleId } = useCspTargetStyle(() => avatarStyle.value)

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
          <SectionMarker index="03" word="Story" />
        </div>
      </div>

      <!-- One `4 / span 9` block so the split matches Work + Background (marker 1–3, main 4–12) -->
      <div class="story-main">
        <div class="story-aside">
          <figure class="story-avatar">
            <div
              ref="avatarRef"
              class="story-avatar-frame"
              v-bind:[avatarStyleAttr]="avatarStyleId"
            >
              <SanityImage
                :src="avatar"
                :alt="name"
                sizes="(max-width: 767px) 40vw, 22rem"
                class="story-avatar-image"
                loading="lazy"
                decoding="async"
              />
            </div>
          </figure>
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
              <template #icon><AppIcon icon="lucide:download" class="text-sm" /></template>
            </CtaButton>
          </div>
        </div>
      </div>
    </div>
  </RevealOnScroll>
</template>

<style scoped>
.story-section-outer {
  --signal: var(--signal-peach);
  --rule: color-mix(in srgb, var(--fg-primary) 16%, var(--paper));
  --rule-soft: color-mix(in srgb, var(--fg-primary) 12%, var(--paper));
  --btn-attention-bg: var(--pastel-blush);
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

.story-main {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: minmax(5.75rem, 34vw) minmax(0, 1fr);
  column-gap: clamp(0.75rem, 3vw, 1.25rem);
  align-items: start;
  min-width: 0;
}

.story-body {
  display: flex;
  flex-direction: column;
  gap: var(--home-stack-gap-comfortable);
  min-width: 0;
  width: 100%;
}

.story-body-prose {
  padding: clamp(0.75rem, 2vw, 1.25rem) clamp(0.65rem, 2vw, 1rem);
  display: flex;
  flex-direction: column;
  gap: var(--home-stack-gap-tight);
  min-width: 0;
  border-radius: 0.25rem;
  max-width: none;
  width: 100%;
  box-sizing: border-box;
}

.story-aside {
  display: flex;
  flex-direction: column;
  gap: var(--home-stack-gap-comfortable);
  min-width: 0;
  width: 100%;
}

.story-avatar-frame {
  transition: transform 0.1s ease-out, opacity 0.15s ease-out;
  will-change: transform, opacity;
}

@media (min-width: 768px) {
  .story-marker {
    grid-column: 1 / span 3;
    grid-row: 1;
  }

  /* Match `.work-content` / `.resume-cols`: main block starts on column 4 and spans 9. */
  .story-main {
    grid-column: 4 / span 9;
    grid-row: 1;
    grid-template-columns: minmax(0, 0.88fr) minmax(0, 1.12fr);
    column-gap: clamp(1.25rem, 2.5vw, 2.25rem);
    row-gap: 0;
  }

  .story-body-prose {
    max-width: none;
    padding: 0;
  }

  .story-aside {
    justify-self: start;
    width: 100%;
    max-width: 22rem;
  }

  .story-cta-row {
    margin-top: clamp(0.75rem, 1.5vw, 1.25rem);
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
  margin-top: 0;
}

.story-avatar {
  margin: 0;
}

.story-avatar-frame {
  position: relative;
  aspect-ratio: 1 / 1;
  width: 100%;
  max-width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}

.story-avatar-image {
  display: block;
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  box-sizing: border-box;
  border: clamp(0.45rem, 1.35vw, 0.8rem) solid var(--pastel-sky);
}
</style>
