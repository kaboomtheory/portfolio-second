<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { profile, socialLinks } from '~/data/site'

const linkedinHref = computed(() => {
  const found = socialLinks.find((l) => /linkedin/i.test(l.label))
  return found?.href ?? 'https://www.linkedin.com/'
})
</script>

<template>
  <footer class="footer">
    <div class="connect-band" aria-label="Contact">
      <div class="connect-band__inner w-full">
        <NeonMetricCardShell compact fluid-width heading-id="connect-card-heading">
        <div class="connect-card__main">
          <h2 id="connect-card-heading" class="connect-card__title">Let's Connect</h2>
          <p class="connect-card__subtitle">
            Have a project in mind? I'd love to hear about it.
          </p>
          <p class="connect-card__context">
            Based in {{ profile.location }} · Open to remote-friendly collaborations
          </p>
        </div>

        <div class="connect-card__actions">
          <a :href="`mailto:${profile.email}`" class="connect-card__action">
            <Icon icon="lucide:mail" class="connect-card__action-icon" aria-hidden="true" />
            <span class="connect-card__action-text">{{ profile.email }}</span>
          </a>
          <a
            :href="linkedinHref"
            target="_blank"
            rel="noopener noreferrer"
            class="connect-card__action"
          >
            <Icon icon="ri:linkedin-fill" class="connect-card__action-icon" aria-hidden="true" />
            <span class="connect-card__action-text">LinkedIn</span>
            <span class="sr-only">(opens in new tab)</span>
          </a>
        </div>
      </NeonMetricCardShell>
      </div>
    </div>

    <div class="footer-bottom">
      <span>&copy; {{ new Date().getFullYear() }} {{ profile.name }}</span>
      <span>Designed &amp; built with Vue + Nuxt</span>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: 3rem;
}

.connect-band {
  position: relative;
  z-index: 0;
  padding-top: var(--space-xl);
  padding-bottom: var(--space-xl);
}

.connect-band__inner {
  position: relative;
  z-index: 1;
  box-sizing: border-box;
}

.connect-band__inner :deep(.metric-card-shell) {
  position: relative;
  z-index: 1;
}

.connect-card__main {
  flex: 1;
  text-align: center;
  padding: 0 0 clamp(1rem, 3vw, 1.25rem);
  font-family: 'Geist Sans', system-ui, sans-serif;
  width: 100%;
  max-width: 42rem;
  margin-inline: auto;
}

.connect-card__title {
  margin: 0 0 0.5rem;
  font-size: clamp(1.875rem, 8vw, 2.75rem);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.035em;
  color: var(--neon-frost, #d4eaff);
}

.connect-card__subtitle {
  margin: 0 0 0.5rem;
  font-size: clamp(0.8125rem, 1.6vw, 0.9375rem);
  font-weight: 500;
  line-height: 1.45;
  color: var(--neon-soft, #a8d4ff);
}

.connect-card__context {
  margin: 0;
  font-size: clamp(0.6875rem, 1.4vw, 0.8125rem);
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: 0.01em;
  color: var(--muted-neon, rgba(168, 212, 255, 0.62));
}

.connect-card__actions {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  width: 100%;
  max-width: 36rem;
  margin-inline: auto;
  margin-top: auto;
  padding-top: 0.25rem;
}

@media (min-width: 480px) {
  .connect-card__actions {
    flex-direction: row;
    align-items: stretch;
    gap: 0.75rem;
  }
}

@media (min-width: 1024px) {
  .connect-card__actions {
    max-width: 38rem;
  }
}

.connect-card__action {
  flex: 1 1 0;
  min-height: 2.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  padding: 0.5rem 0.85rem;
  border-radius: 9999px;
  border: 1px solid color-mix(in srgb, var(--neon-mid) 28%, transparent);
  background: color-mix(in srgb, var(--neon-mid) 8%, transparent);
  color: var(--neon-frost, #0a1628);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  text-decoration: none;
  font-family: 'Geist Sans', system-ui, sans-serif;
  transition: background 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
}

.connect-card__action:hover {
  background: color-mix(in srgb, var(--neon-mid) 14%, transparent);
  border-color: color-mix(in srgb, var(--neon-mid) 48%, transparent);
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--neon-mid) 18%, transparent),
    0 0 20px color-mix(in srgb, var(--neon-mid) 10%, transparent);
}

.connect-card__action:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--neon-mid) 65%, transparent);
  outline-offset: 2px;
}

.connect-card__action-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  opacity: 0.95;
  color: var(--neon-mid, #3d7dba);
}

.connect-card__action:hover .connect-card__action-icon {
  color: var(--neon, #2a5fa0);
}

:root.dark .connect-card__action {
  border-color: color-mix(in srgb, var(--neon) 22%, transparent);
  background: color-mix(in srgb, var(--neon) 8%, transparent);
  color: var(--neon-frost, #d4eaff);
}

:root.dark .connect-card__action:hover {
  background: color-mix(in srgb, var(--neon) 14%, transparent);
  border-color: color-mix(in srgb, var(--neon) 42%, transparent);
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--neon) 18%, transparent),
    0 0 20px color-mix(in srgb, var(--neon) 12%, transparent);
}

:root.dark .connect-card__action:focus-visible {
  outline-color: color-mix(in srgb, var(--neon) 65%, transparent);
}

:root.dark .connect-card__action-icon {
  color: var(--neon-mid, #7ab8ff);
}

:root.dark .connect-card__action:hover .connect-card__action-icon {
  color: var(--neon, #57a6ff);
}

.connect-card__action-text {
  min-width: 0;
  text-align: center;
  word-break: break-word;
}

.footer-bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 0;
  margin-top: 1.5rem;
  font-size: 0.75rem;
  color: var(--fg-muted);
}

@media (prefers-reduced-motion: reduce) {
  .connect-card__action {
    transition: none;
  }
}
</style>
