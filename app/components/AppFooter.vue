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
    <!-- Connect Section -->
    <div class="connect-content">
      <h2 class="connect-title">Let's Connect</h2>
      <p class="connect-subtitle">Have a project in mind? I'd love to hear about it.</p>
      <p class="connect-context">
        Based in {{ profile.location }} · Open to remote-friendly collaborations
      </p>

      <div class="connect-actions">
        <a :href="`mailto:${profile.email}`" class="connect-action-btn">
          <Icon icon="lucide:mail" class="connect-action-icon" aria-hidden="true" />
          <span class="connect-action-text">{{ profile.email }}</span>
        </a>
        <a
          :href="linkedinHref"
          target="_blank"
          rel="noopener noreferrer"
          class="connect-action-btn"
        >
          <Icon icon="ri:linkedin-fill" class="connect-action-icon" aria-hidden="true" />
          <span class="connect-action-text">LinkedIn</span>
          <span class="sr-only">(opens in new tab)</span>
        </a>
      </div>
    </div>

    <!-- Footer Bottom -->
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

.connect-content {
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-radius: var(--radius-card);
  padding: var(--space-xl);
  text-align: center;
}

:root.dark .connect-content {
  background: rgba(8, 15, 30, 0.75);
}

@media (min-width: 768px) {
  .connect-content {
    padding: var(--space-2xl);
  }
}

.connect-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--fg-primary);
}

.connect-subtitle {
  font-size: 1rem;
  color: var(--fg-muted);
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.connect-context {
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--fg-muted);
  margin-bottom: 2rem;
}

.connect-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  max-width: 36rem;
  margin-inline: auto;
}

@media (min-width: 480px) {
  .connect-actions {
    flex-direction: row;
    align-items: stretch;
  }
}

.connect-action-btn {
  flex: 1 1 0;
  min-height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: var(--fg-primary);
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  transition:
    background-color 0.2s ease,
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

:root.dark .connect-action-btn {
  background: rgba(10, 15, 30, 0.6);
}

.connect-action-btn:hover {
  background: rgba(255, 255, 255, 0.6);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px color-mix(in srgb, var(--emphasis) 12%, transparent);
}

:root.dark .connect-action-btn:hover {
  background: rgba(10, 15, 30, 0.6);
}

.connect-action-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
  color: var(--fg-secondary);
}

.connect-action-btn:hover .connect-action-icon {
  color: var(--emphasis);
}

.connect-action-text {
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
</style>
