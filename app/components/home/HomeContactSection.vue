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
    <div class="closing-grid grid-12">
      <div class="closing-marker">
        <span class="section-marker">
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
  --signal: var(--ink);
  --rule: color-mix(in srgb, var(--fg-primary) 16%, var(--bg-primary));
  --btn-attention-bg: var(--pastel-sky);
  background-color: transparent;
  padding-top: 0;
  /* Final band: settle the eye after dense resume columns */
  padding-bottom: clamp(1.25rem, 3vw, 2.25rem);
}

.closing-grid {
  row-gap: var(--home-grid-gap-editorial);
  align-items: start;
  padding-top: clamp(0.65rem, 1.5vw, 1.15rem);
  padding-bottom: clamp(0.65rem, 1.5vw, 1.15rem);
}

.closing-marker {
  grid-column: 1 / -1;
}

.closing-main {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--home-stack-gap-comfortable);
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
  word-break: break-word;
  position: relative;
  display: inline-block;
  transition:
    color 240ms var(--motion-ease-hero, cubic-bezier(0.16, 1, 0.3, 1)),
    transform 240ms var(--motion-ease-hero, cubic-bezier(0.16, 1, 0.3, 1));
}

.closing-email::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--signal);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 320ms var(--motion-ease-hero, cubic-bezier(0.16, 1, 0.3, 1));
}

.closing-email:hover {
  color: var(--fg-primary);
  transform: translateY(-2px);
}

.closing-email:hover::after {
  transform: scaleX(1);
}

@media (prefers-reduced-motion: reduce) {
  .closing-email {
    transition: color 150ms ease;
  }

  .closing-email::after {
    transition: none;
  }

  .closing-email:hover {
    transform: none;
  }
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
  padding-bottom: 0.1rem;
  position: relative;
  transition:
    color 200ms var(--motion-ease-hero, cubic-bezier(0.16, 1, 0.3, 1)),
    transform 200ms var(--motion-ease-hero, cubic-bezier(0.16, 1, 0.3, 1));
}

.closing-linkedin::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: var(--signal);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 240ms var(--motion-ease-hero, cubic-bezier(0.16, 1, 0.3, 1));
}

.closing-linkedin:hover {
  color: var(--fg-primary);
  transform: translateY(-1px);
}

.closing-linkedin:hover::after {
  transform: scaleX(1);
}

@media (prefers-reduced-motion: reduce) {
  .closing-linkedin {
    transition: color 150ms ease;
  }

  .closing-linkedin::after {
    transition: none;
  }

  .closing-linkedin:hover {
    transform: none;
  }
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
