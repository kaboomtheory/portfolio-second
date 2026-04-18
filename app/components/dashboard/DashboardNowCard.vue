<script setup lang="ts">
import { Icon } from '@iconify/vue'

withDefaults(
  defineProps<{
    resumeHref: string
    linkedinHref: string
    email: string
    /** `navbar`: compact strip for AppNavbar. `tile`: dashboard bento cell. */
    variant?: 'tile' | 'navbar'
  }>(),
  { variant: 'tile' },
)
</script>

<template>
  <section
    v-if="variant === 'tile'"
    class="dashboard-tile bento-tile now-card now-card--tile reveal-up"
    aria-labelledby="dashboard-now-heading"
  >
    <h2 id="dashboard-now-heading" class="sr-only">Availability and contact</h2>

    <div class="now-status">
      <span class="now-dot" aria-hidden="true" />
      <span class="now-status-label">OPEN&nbsp;TO&nbsp;WORK</span>
    </div>
    <p class="now-meta">Remote&nbsp;· EST · available now</p>

    <div class="now-actions">
      <a
        class="now-action"
        :href="resumeHref"
        download
        aria-label="Download resume (PDF)"
      >
        <Icon icon="lucide:file-text" class="now-action__icon" />
        <span class="now-action__label">Resume</span>
      </a>
      <a
        class="now-action"
        :href="linkedinHref"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn profile (opens in new tab)"
      >
        <Icon icon="ri:linkedin-fill" class="now-action__icon" />
        <span class="now-action__label">LinkedIn</span>
      </a>
      <a
        class="now-action"
        :href="`mailto:${email}`"
        aria-label="Send email"
      >
        <Icon icon="lucide:mail" class="now-action__icon" />
        <span class="now-action__label">Email</span>
      </a>
    </div>
  </section>

  <div
    v-else
    class="now-card now-card--navbar"
    role="region"
    aria-label="Availability and contact"
  >
    <div class="now-navbar-cluster">
      <div class="now-navbar-main">
        <div class="now-status now-status--navbar">
          <span class="now-dot" aria-hidden="true" />
          <span class="now-status-label">Open to work</span>
        </div>
        <p class="now-meta now-meta--navbar">Remote · EST · available now</p>
      </div>

      <span class="now-navbar-sep" aria-hidden="true" />

      <div class="now-actions now-actions--navbar">
        <a
          class="now-action now-action--navbar"
          :href="resumeHref"
          download
          aria-label="Download resume (PDF)"
        >
          <Icon icon="lucide:file-text" class="now-action__icon" />
          <span class="now-action__label">Resume</span>
        </a>
        <a
          class="now-action now-action--navbar"
          :href="linkedinHref"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn profile (opens in new tab)"
        >
          <Icon icon="ri:linkedin-fill" class="now-action__icon" />
          <span class="now-action__label">LinkedIn</span>
        </a>
        <a
          class="now-action now-action--navbar"
          :href="`mailto:${email}`"
          aria-label="Send email"
        >
          <Icon icon="lucide:mail" class="now-action__icon" />
          <span class="now-action__label">Email</span>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.now-card--tile {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  justify-content: flex-start;
}

.now-card--navbar {
  display: block;
  width: auto;
  min-width: 0;
}

.now-navbar-cluster {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  gap: 0.375rem 0.5rem;
  min-width: 0;
}

.now-navbar-main {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  column-gap: 0.45rem;
  row-gap: 0.125rem;
  min-width: 0;
  flex: 1 1 auto;
}

.now-navbar-sep {
  flex: 0 0 auto;
  width: 1px;
  height: 1.125rem;
  border-radius: 1px;
  background: color-mix(in srgb, var(--fg-muted) 22%, transparent);
}

@media (max-width: 520px) {
  .now-navbar-sep {
    display: none;
  }

  .now-navbar-cluster {
    justify-content: flex-start;
  }
}

.now-status {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 0.6875rem;
  letter-spacing: 0.14em;
  font-weight: 600;
  color: var(--fg-primary);
}

.now-dot {
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background: var(--status-available);
  box-shadow: 0 0 0 0 color-mix(in srgb, var(--status-available) 45%, transparent);
  animation: now-dot-pulse 2s ease-in-out infinite;
}

@keyframes now-dot-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--status-available) 45%, transparent);
    transform: scale(1);
  }

  50% {
    box-shadow: 0 0 0 5px color-mix(in srgb, var(--status-available) 0%, transparent);
    transform: scale(1.1);
  }
}

.now-status-label {
  white-space: nowrap;
}

.now-status--navbar {
  font-size: 0.625rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

@media (min-width: 640px) {
  .now-status--navbar {
    font-size: 0.6875rem;
    letter-spacing: 0.12em;
  }
}

.now-meta {
  margin: 0;
  font-size: 0.6875rem;
  line-height: 1.35;
  color: var(--fg-muted);
}

@media (min-width: 640px) {
  .now-meta {
    font-size: 0.75rem;
  }
}

.now-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.now-actions--navbar {
  flex: 0 0 auto;
  flex-shrink: 1;
  gap: 0.25rem;
}

.now-meta--navbar {
  margin: 0;
  font-family: 'Geist Sans', system-ui, sans-serif;
  font-size: 0.625rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  text-transform: none;
  line-height: 1.3;
  color: var(--fg-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 11rem;
}

@media (min-width: 640px) {
  .now-meta--navbar {
    font-size: 0.6875rem;
    max-width: 16rem;
  }
}

@media (min-width: 900px) {
  .now-meta--navbar {
    max-width: none;
  }
}

.now-action--navbar {
  padding: 0.28rem 0.45rem;
  font-size: 0.625rem;
}

.now-action--navbar .now-action__icon {
  font-size: 0.75rem;
}

@media (min-width: 640px) {
  .now-action--navbar {
    padding: 0.35rem 0.55rem;
    font-size: 0.6875rem;
  }

  .now-action--navbar .now-action__icon {
    font-size: 0.8125rem;
  }
}

.now-action {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.625rem;
  border-radius: 9999px;
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--fg-secondary);
  background: var(--bg-secondary);
  border: 1px solid color-mix(in srgb, var(--fg-muted) 18%, transparent);
  backdrop-filter: blur(12px) saturate(1.2);
  -webkit-backdrop-filter: blur(12px) saturate(1.2);
  transition:
    color 180ms ease,
    background-color 180ms ease,
    border-color 180ms ease,
    transform 180ms ease;
}

.now-action:hover {
  color: var(--fg-primary);
  background-color: color-mix(in srgb, var(--accent) 8%, var(--bg-secondary));
  border-color: color-mix(in srgb, var(--accent) 32%, transparent);
  transform: translateY(-1px);
}

.now-action:active {
  transform: translateY(0);
}

.now-action__icon {
  font-size: 0.875rem;
}

@media (prefers-reduced-motion: reduce) {
  .now-dot {
    animation: none;
  }

  .now-action,
  .now-action:hover,
  .now-action:active {
    transform: none;
  }
}
</style>
