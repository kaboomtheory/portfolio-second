<script setup lang="ts">
defineProps<{
  experienceItems: {
    title: string
    company: string
    year: string
    description: string
    image?: string | null
  }[]
  groups: { category: string; items: string[] }[]
}>()
</script>

<template>
  <RevealOnScroll :delay="240" class="resume-section-outer">
    <hr class="section-rule" aria-hidden="true">
    <div class="resume-grid grid-12">
      <div class="resume-marker">
        <span class="section-marker">
          <span class="section-marker-num">03</span>
          <span class="section-marker-word">Experience</span>
        </span>
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

          <div v-if="experienceItems.length" class="experience-list">
            <article
              v-for="(item, index) in experienceItems"
              :key="`${item.company}-${item.year}-${index}`"
              class="experience-row"
            >
              <img
                v-if="item.image"
                :src="item.image"
                :alt="item.company"
                loading="lazy"
                class="experience-logo"
              >
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
              <h3 class="capability-group-title mono">{{ group.category }}</h3>
              <div class="capability-tags">
                <span v-for="item in group.items" :key="item" class="capability-tag">
                  {{ item }}
                </span>
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
  padding-top: clamp(4rem, 8vw, 7rem);
  padding-bottom: clamp(4rem, 8vw, 7rem);
}

.resume-grid {
  row-gap: clamp(1.5rem, 3vw, 2.5rem);
  align-items: start;
  padding-top: clamp(1.25rem, 2.5vw, 2rem);
}

.resume-marker {
  grid-column: 1 / -1;
}

.resume-cols {
  grid-column: 1 / -1;
  display: grid;
  gap: clamp(2rem, 5vw, 3.5rem);
}

@media (min-width: 768px) {
  .resume-marker {
    grid-column: 1 / span 3;
  }

  .resume-cols {
    grid-column: 4 / span 9;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
    align-items: start;
  }
}

@media (min-width: 1024px) {
  .resume-marker {
    position: sticky;
    top: 6.5rem;
    align-self: start;
  }
}

@media (max-width: 767px) {
  .resume-cols {
    grid-template-columns: 1fr;
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
  background: var(--bg-secondary);
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
  font-size: var(--label-size);
  font-weight: 500;
  letter-spacing: var(--label-tracking-mono);
  text-transform: uppercase;
  color: var(--signal);
}

.capability-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

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
}
</style>
