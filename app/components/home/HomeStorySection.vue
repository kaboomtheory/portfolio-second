<script setup lang="ts">
import { ref, computed } from 'vue'
import { useScrollExpandImage } from '~/composables/useScrollExpand'
import { useScrollRevealGroup } from '~/composables/useScrollReveal'
import type { PortableTextBlock } from '@portabletext/types'
import type { AboutStory } from '~/utils/aboutStory'
import { isPortableTextStory, portableTextBlockKey } from '~/utils/aboutStory'

const props = defineProps<{
  name: string
  avatar: string
  story: AboutStory
  resumeHref: string
}>()

const isRichStory = computed(() => isPortableTextStory(props.story))
const legacyParagraphs = computed(() => (isRichStory.value ? [] : (props.story as string[])))
const portableBlocks = computed(() =>
  isRichStory.value ? (props.story as PortableTextBlock[]) : [],
)

const avatarRef = ref<HTMLElement | null>(null)
const { scale: avatarScale, displayedOpacity: avatarOpacity } = useScrollExpandImage(avatarRef, {
  minScale: 0.9,
  maxScale: 1.04,
})

const avatarScaleProgress = computed(() => (avatarScale.value - 0.9) / 0.14)
const avatarOpacityProgress = computed(() => (avatarOpacity.value - 0.25) / 0.75)

usePausedProgressAnimation(avatarRef, {
  keyframes: [
    { transform: 'scale(0.9)' },
    { transform: 'scale(1.04)' },
  ],
  progress: avatarScaleProgress,
})

usePausedProgressAnimation(avatarRef, {
  keyframes: [
    { opacity: 0.25 },
    { opacity: 1 },
  ],
  progress: avatarOpacityProgress,
})

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

      <!-- Portrait aside + prose: fixed first column from md up, reading measure on prose -->
      <div class="story-main">
        <div class="story-aside">
          <figure class="story-avatar">
            <div
              ref="avatarRef"
              class="story-avatar-frame"
            >
              <div class="story-avatar-surface pastel-grain-shadow">
                <SanityImage
                  :src="avatar"
                  :alt="name"
                  sizes="(max-width: 767px) 40vw, 22rem"
                  class="story-avatar-image"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </figure>

          <div class="story-cta-row">
            <CtaButton
              :href="resumeHref"
              label="Download résumé"
              attention
              preserve-case
              target="_blank"
              class="pastel-grain-shadow"
            >
              <template #icon><AppIcon icon="lucide:download" class="text-sm" /></template>
            </CtaButton>
          </div>
        </div>

        <div class="story-body">
          <div ref="storyProseRef" class="story-body-prose">
            <template v-if="isRichStory">
              <div
                v-for="(block, index) in portableBlocks"
                :key="portableTextBlockKey(block, index)"
                class="story-paragraph"
                :class="{ 'para--visible': paraVisible[index] }"
              >
                <StoryPortableText :value="[block]" />
              </div>
            </template>
            <template v-else>
              <p
                v-for="(paragraph, index) in legacyParagraphs"
                :key="index"
                class="story-paragraph"
                :class="{ 'para--visible': paraVisible[index] }"
              >
                {{ paragraph }}
              </p>
            </template>
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
  padding-bottom: var(--home-stack-gap-tight, 1rem);
}

.story-main {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  row-gap: clamp(1.35rem, 5vw, 2rem);
  align-items: start;
  min-width: 0;
}

.story-body {
  display: flex;
  flex-direction: column;
  gap: 0;
  min-width: 0;
  width: 100%;
}

.story-body-prose {
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
  align-items: center;
  gap: var(--home-stack-gap-comfortable);
  min-width: 0;
  width: 100%;
  max-width: min(13rem, 48vw);
  margin-inline: auto;
  align-self: start;
}

.story-avatar-frame {
  transition: transform 0.1s ease-out, opacity 0.15s ease-out;
  will-change: transform, opacity;
}

:global(html.firefox) .story-avatar-frame {
  will-change: auto;
}

@media (min-width: 768px) {
  .story-marker {
    grid-column: 1 / -1;
  }

  .story-main {
    grid-column: 1 / -1;
    grid-template-columns: clamp(10rem, 24vw, 13rem) minmax(0, 1fr);
    column-gap: clamp(1.25rem, 2vw, 1.75rem);
    row-gap: 0;
    align-items: start;
  }

  .story-body-prose {
    max-width: min(58ch, 100%);
    padding: 0;
  }

  .story-aside {
    width: 100%;
    max-width: none;
    margin-inline: 0;
    align-items: stretch;
  }

  .story-cta-row {
    margin-top: clamp(0.75rem, 2vw, 1rem);
    padding-top: clamp(1rem, 2vw, 1.25rem);
    border-top: 1px solid var(--rule-soft);
    justify-content: flex-start;
  }
}

@media (min-width: 1024px) {
  .story-main {
    grid-template-columns: clamp(11rem, 18vw, 15rem) minmax(0, 1fr);
    column-gap: clamp(1.5rem, 2.5vw, 2.5rem);
  }
}


.story-marker-sticky {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.story-paragraph {
  opacity: 0;
  transform: translateY(6px);
  transition:
    opacity 360ms var(--motion-ease-hero, cubic-bezier(0.16, 1, 0.3, 1)),
    transform 360ms var(--motion-ease-hero, cubic-bezier(0.16, 1, 0.3, 1));
}

.story-paragraph,
.story-paragraph :deep(p),
.story-paragraph :deep(ul),
.story-paragraph :deep(ol),
.story-paragraph :deep(blockquote) {
  font-family: var(--font-sans);
  font-size: var(--text-body);
  line-height: 1.55;
  color: var(--fg-primary);
  letter-spacing: 0;
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
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
}

.story-avatar {
  margin: 0;
  width: 100%;
}

.story-avatar-frame {
  position: relative;
  aspect-ratio: 4 / 5;
  width: 100%;
  max-width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}

.story-avatar-surface {
  width: 100%;
  max-width: 100%;
  background: var(--pastel-sky);
  padding: clamp(0.45rem, 1.35vw, 0.8rem);
  box-sizing: border-box;
}

.story-avatar-image {
  display: block;
  width: 100%;
  height: auto;
  box-sizing: border-box;
}
</style>
