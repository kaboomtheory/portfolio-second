<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { profile, socialLinks } from '~/data/site'

const props = defineProps<{
  availabilityMailto: string
  linkedinHref?: string
}>()

const resolvedLinkedin = computed(() => {
  if (props.linkedinHref) return props.linkedinHref
  const found = socialLinks.find((l) => /linkedin/i.test(l.label))
  return found?.href ?? 'https://www.linkedin.com/'
})

const emailAddress = computed(() => {
  const raw = props.availabilityMailto.replace(/^mailto:/i, '')
  return raw.trim()
})
</script>

<template>
  <RevealOnScroll
    id="contact"
    :delay="320"
    class="closing-cta-section content-flow"
    aria-labelledby="closing-cta-heading"
  >
    <hr class="section-rule" aria-hidden="true">
    <div class="closing-grid grid-12">
      <div class="closing-marker">
        <span class="section-marker">
          <span class="section-marker-num">04</span>
          <span class="section-marker-word">Contact</span>
        </span>
      </div>

      <div class="closing-main">
        <h2 id="closing-cta-heading" class="closing-kicker">
          Next
        </h2>
        <p class="closing-lede">
          For new work, send a short brief: goals, timeline, audience, and links. I usually reply within a few business days and can share additional case studies under NDA when that helps your review.
        </p>
        <p class="closing-meta">
          Based in {{ profile.location }} · Open to remote-friendly collaborations
        </p>
        <a class="closing-email" :href="availabilityMailto">{{ emailAddress }}</a>
        <div class="closing-actions">
          <CtaButton
            :href="availabilityMailto"
            label="Say hello"
            attention
            preserve-case
          >
            <template #icon><Icon icon="lucide:mail" class="text-sm" /></template>
          </CtaButton>
          <a
            :href="resolvedLinkedin"
            class="closing-linkedin"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon icon="ri:linkedin-fill" class="closing-linkedin-icon" aria-hidden="true" />
            LinkedIn
            <span class="sr-only">(opens in new tab)</span>
          </a>
        </div>
      </div>
    </div>
  </RevealOnScroll>
</template>

<style scoped>
.closing-cta-section {
  padding-top: clamp(4rem, 8vw, 7rem);
  padding-bottom: clamp(4rem, 8vw, 7rem);
}

.closing-grid {
  row-gap: clamp(1.25rem, 2.5vw, 2rem);
  align-items: start;
  padding-top: clamp(1.25rem, 2.5vw, 2rem);
}

.closing-marker {
  grid-column: 1 / -1;
}

.closing-main {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-md);
  min-width: 0;
}

@media (min-width: 768px) {
  .closing-marker {
    grid-column: 1 / span 3;
  }

  .closing-main {
    grid-column: 4 / span 9;
  }
}

@media (min-width: 1024px) {
  .closing-marker {
    position: sticky;
    top: 6.5rem;
    align-self: start;
  }
}

.closing-kicker {
  margin: 0;
  font-family: var(--font-mono);
  font-size: var(--label-size);
  font-weight: 500;
  letter-spacing: var(--label-tracking-mono);
  text-transform: uppercase;
  color: var(--fg-muted);
}

.closing-lede {
  margin: 0;
  max-width: min(42rem, 68ch);
  font-size: var(--text-body);
  line-height: 1.55;
  color: var(--fg-secondary);
}

.closing-meta {
  margin: 0;
  font-size: var(--text-body);
  line-height: 1.55;
  color: var(--fg-secondary);
}

.closing-email {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 300;
  font-size: clamp(1.75rem, 3vw + 1rem, 3rem);
  letter-spacing: -0.02em;
  line-height: 1.15;
  color: var(--signal);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  word-break: break-word;
  transition:
    color 120ms var(--motion-ease-reveal, cubic-bezier(0.2, 0.6, 0.2, 1)),
    border-color 120ms var(--motion-ease-reveal, cubic-bezier(0.2, 0.6, 0.2, 1));
}

.closing-email:hover {
  color: var(--fg-primary);
  border-bottom-color: var(--signal);
}

.closing-email:focus-visible {
  outline: 2px solid var(--emphasis);
  outline-offset: 4px;
}

.closing-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  margin-top: 0.25rem;
}

.closing-linkedin {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-family: var(--font-mono);
  font-size: var(--label-size);
  font-weight: 500;
  letter-spacing: var(--label-tracking-mono);
  text-transform: uppercase;
  color: var(--signal);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  padding-bottom: 0.1rem;
  transition:
    color 120ms var(--motion-ease-reveal, cubic-bezier(0.2, 0.6, 0.2, 1)),
    border-color 120ms var(--motion-ease-reveal, cubic-bezier(0.2, 0.6, 0.2, 1));
}

.closing-linkedin:hover {
  color: var(--fg-primary);
  border-bottom-color: var(--signal);
}

.closing-linkedin:focus-visible {
  outline: 2px solid var(--emphasis);
  outline-offset: 4px;
}

.closing-linkedin-icon {
  width: 1rem;
  height: 1rem;
}
</style>
