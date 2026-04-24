<script setup lang="ts">
defineProps<{
  index: string
  word: string
}>()
</script>

<template>
  <span class="section-marker">
    <span class="section-marker-sigil" aria-hidden="true">§</span>
    <span class="section-marker-num">{{ index }}</span>
    <span class="section-marker-dash" aria-hidden="true">—</span>
    <span class="section-marker-word">{{ word }}</span>
  </span>
</template>

<style scoped>
.section-marker-sigil {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 400;
  font-size: 1.1rem;
  color: var(--signal-coral-ink, var(--accent));
  letter-spacing: 0;
  text-transform: none;
  line-height: 1;
  opacity: 0.7;
  transition: opacity 240ms ease;
}

.section-marker:hover .section-marker-sigil {
  opacity: 1;
}

.section-marker-dash {
  font-family: var(--font-mono);
  color: var(--fg-muted);
  font-size: var(--label-size);
  letter-spacing: 0;
  font-weight: 400;
}
</style>
