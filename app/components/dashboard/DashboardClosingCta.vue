<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineProps<{
  resumeHref: string
  availabilityMailto: string
}>()
</script>

<template>
  <section
    class="dashboard-tile reveal-up closing-cta"
    aria-labelledby="closing-cta-heading"
  >
    <p class="closing-eyebrow">
      Next
    </p>
    <h2 id="closing-cta-heading" class="closing-title">
      Have a project in mind?
    </h2>
    <p class="closing-lede">
      I'm open to freelance and full-time collaborations. The fastest way to start is a quick email — happy to share full case studies on request.
    </p>
    <div class="closing-actions">
      <CtaButton
        :href="resumeHref"
        label="Download Resume"
        attention
      >
        <template #icon><Icon icon="lucide:download" class="text-sm" /></template>
      </CtaButton>
      <CtaButton
        :href="availabilityMailto"
        label="SAY HELLO"
        secondary
        elevated-secondary
        preserve-case
      >
        <template #icon><Icon icon="lucide:mail" class="text-sm" /></template>
      </CtaButton>
    </div>
  </section>
</template>

<style scoped>
.closing-cta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-md);
  margin-top: var(--space-sm);
}

.closing-eyebrow {
  margin: 0;
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--accent);
}

.closing-title {
  margin: 0;
  font-size: clamp(1.75rem, 3.5vw + 0.5rem, 2.75rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--fg-primary);
}

.closing-lede {
  margin: 0;
  max-width: 36rem;
  font-size: 1.0625rem;
  line-height: 1.6;
  color: var(--fg-secondary);
}

.closing-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: var(--space-sm);
}
</style>
