<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineProps<{
  name: string
  avatar: string
  story: string[]
  resumeHref: string
  availabilityMailto: string
  availabilityCtaLabel: string
}>()
</script>

<template>
  <RevealOnScroll id="story" :delay="160" class="story-section-outer content-flow">
    <hr class="section-rule" aria-hidden="true">
    <div class="story-grid grid-12">
      <div class="story-marker">
        <div class="story-marker-sticky">
          <span class="section-marker">
            <span class="section-marker-num">02</span>
            <span class="section-marker-word">Story</span>
          </span>
        </div>
      </div>

      <div class="story-body">
        <p
          v-for="(paragraph, index) in story"
          :key="index"
          class="story-paragraph"
        >
          {{ paragraph }}
        </p>

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
          <div class="story-avatar-frame">
            <img
              :src="avatar"
              :alt="name"
              class="story-avatar-image"
              loading="lazy"
            >
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
  padding-top: clamp(4rem, 8vw, 7rem);
  padding-bottom: clamp(4rem, 8vw, 7rem);
}

.story-grid {
  row-gap: clamp(2rem, 4vw, 3rem);
  align-items: start;
  padding-top: clamp(1.25rem, 2.5vw, 2rem);
}

.story-marker {
  grid-column: 1 / -1;
}

.story-body {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: clamp(1.25rem, 2vw, 1.75rem);
  min-width: 0;
}

.story-aside {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: clamp(1.25rem, 2vw, 1.75rem);
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
  .story-marker-sticky {
    position: sticky;
    top: 6.5rem;
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
  color: var(--fg-secondary);
  margin: 0;
  letter-spacing: 0;
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
  background: var(--bg-secondary);
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
