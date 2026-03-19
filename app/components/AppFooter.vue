<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { profile, socialLinks } from '~/data/site'
</script>

<template>
  <footer class="footer">
    <!-- Connect Section -->
    <div class="connect-content">
      <h2 class="connect-title">Let's Connect</h2>
      <p class="connect-subtitle">Have a project in mind? I'd love to hear about it.</p>

      <div class="connect-actions">
        <a :href="`mailto:${profile.email}`" class="connect-primary-btn">
          <Icon icon="lucide:mail" />
          <span>{{ profile.email }}</span>
          <Icon icon="lucide:arrow-up-right" class="btn-arrow" aria-hidden="true" />
        </a>

        <div class="connect-socials">
          <a v-for="link in socialLinks" :key="link.label" :href="link.href" target="_blank" rel="noopener" class="social-link">
            <Icon :icon="link.icon" />
            <span class="sr-only">{{ link.label }}</span>
          </a>
        </div>
      </div>

      <div class="connect-availability">
        <span class="availability-indicator" />
        <span>Currently accepting new projects</span>
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
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
  border-radius: 1rem;
  padding: 2.5rem;
  border: 1px solid var(--border);
  text-align: center;
}

@media (min-width: 768px) {
  .connect-content {
    padding: 3.5rem;
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
  margin-bottom: 2rem;
}

.connect-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.connect-primary-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: var(--fg-primary);
  color: var(--bg-primary);
  font-size: 1rem;
  font-weight: 600;
  border-radius: 9999px;
  transition: all 0.3s ease;
  width: fit-content;
}

.connect-primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.connect-primary-btn svg {
  width: 1.25rem;
  height: 1.25rem;
}

.btn-arrow {
  opacity: 0.5;
}

.connect-socials {
  display: flex;
  gap: 0.75rem;
}

.social-link {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: 9999px;
  color: var(--fg-secondary);
  transition: all 0.2s ease;
}

.social-link:hover {
  border-color: var(--accent);
  color: var(--accent);
  transform: translateY(-2px);
}

.social-link svg {
  width: 1.25rem;
  height: 1.25rem;
}

.connect-availability {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  font-size: 0.8rem;
  color: var(--fg-muted);
  padding: 0.5rem 1rem;
  background: var(--bg-primary);
  border-radius: 9999px;
}

.availability-indicator {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.2); }
}

.footer-bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 0;
  margin-top: 1.5rem;
  border-top: 1px solid var(--border);
  font-size: 0.75rem;
  color: var(--fg-muted);
}
</style>
