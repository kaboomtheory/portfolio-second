<script setup lang="ts">
import { profile } from '~/data/site'
</script>

<template>
  <footer class="footer">
    <div class="footer-rule" aria-hidden="true" />
    <div class="footer-bottom mx-auto max-w-[82rem] px-[clamp(1.25rem,3vw,2.5rem)]">
      <span class="footer-brand">&copy;&nbsp;{{ new Date().getFullYear() }} {{ profile.name }}</span>
      <span class="footer-meta">Geist · Fraunces · Geist Mono · Nuxt · {{ profile.location }}</span>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: var(--space-xl);
}

.footer-rule {
  height: 1px;
  width: 100%;
  background: var(--rule);
  margin-bottom: var(--space-xs);
}

.footer-bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-md) var(--space-lg);
  padding: var(--space-md) 0;
  font-size: var(--label-size);
  letter-spacing: 0.02em;
  color: var(--fg-muted);
}

.footer-brand {
  font-weight: 500;
  color: color-mix(in srgb, var(--fg-primary) 72%, var(--fg-muted));
}

.footer-meta {
  max-width: 28rem;
  line-height: 1.45;
  text-align: right;
}

@media (max-width: 640px) {
  .footer-meta {
    text-align: left;
  }
}
</style>
