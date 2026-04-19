<script setup lang="ts">
import type { HomeHeroTaglineLine } from '~/data/home'

withDefaults(
  defineProps<{
    heroTitle: string
    heroTaglines: HomeHeroTaglineLine[]
    story: string[]
    sectionNumber?: string
    cardTitle?: string
  }>(),
  {
    sectionNumber: '01',
    cardTitle: 'Introduction',
  },
)
</script>

<template>
  <section
    class="dashboard-tile bento-tile profile-tile reveal-up flex h-full min-h-0 flex-col overflow-hidden"
    aria-labelledby="dashboard-profile-heading"
  >
    <div
      class="dashboard-tile__content profile-tile__scroll bento-scroll order-1 flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden"
    >
      <h1 id="dashboard-profile-heading" class="hero-statement hero-fade-in">
        <TextReveal tag="span" :text="heroTitle" class="hero-name" />
        <span class="hero-tagline">
          <p
            v-for="(line, lineIndex) in heroTaglines"
            :key="lineIndex"
            class="hero-tagline-line"
          >
            <template v-for="(seg, segIndex) in line.segments" :key="segIndex">
              <strong v-if="seg.em" class="hero-tagline-em">{{ seg.text }}</strong>
              <template v-else>{{ seg.text }}</template>
            </template>
          </p>
        </span>
      </h1>

      <div v-if="story.length" class="hero-story mt-2 hero-fade-in hero-delay-2">
        <p v-for="(paragraph, index) in story" :key="index" class="story-paragraph">
          {{ paragraph }}
        </p>
      </div>
    </div>

    <div class="section-header profile-tile__chrome shrink-0">
      <span class="section-number">{{ sectionNumber }}</span>
      <h2 class="section-title">
        {{ cardTitle }}
      </h2>
    </div>
  </section>
</template>

<style scoped>
.profile-tile__chrome {
  order: -1;
}

.profile-tile__scroll {
  display: flex;
  flex-direction: column;
}

.hero-statement {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
  flex-shrink: 0;
}

.hero-name {
  display: inline-block;
  line-height: 1.08;
  font-size: clamp(1.375rem, 0.9vw + 0.85rem, 1.875rem);
  font-weight: 700;
  letter-spacing: -0.028em;
  color: var(--fg-primary);
}

.hero-tagline {
  display: block;
  max-width: 100%;
}

.hero-tagline-line {
  margin: 0;
  font-size: clamp(0.6875rem, 0.4vw + 0.45rem, 0.8125rem);
  font-weight: 400;
  line-height: 1.45;
  color: var(--fg-secondary);
  letter-spacing: -0.005em;
}

.hero-tagline-line + .hero-tagline-line {
  margin-top: 0.25rem;
}

.hero-tagline-em {
  font-weight: 600;
  color: var(--fg-primary);
}

.hero-fade-in {
  opacity: 0;
  animation: hero-fade-in 0.8s cubic-bezier(0.2, 0.65, 0.3, 0.9) forwards;
}

.hero-delay-2 {
  animation-delay: 0.55s;
}

@keyframes hero-fade-in {
  from {
    opacity: 0;
    transform: translateY(12px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-story {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
}

.story-paragraph {
  margin: 0;
  font-size: 0.75rem;
  line-height: 1.45;
  color: var(--fg-secondary);
  max-width: 100%;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

@media (prefers-reduced-motion: reduce) {
  .hero-fade-in {
    animation: none;
    opacity: 1;
  }
}
</style>
