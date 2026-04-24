<script setup lang="ts">
import { socialLinks, navItems, profile } from '~/data/site'
import { useInPageHashLink } from '~/composables/useInPageHashLink'

const { onInPageHashLinkClick } = useInPageHashLink()

function navTarget(path: string) {
  if (!path.includes('#')) return path
  const [pathname, frag] = path.split('#')
  return { path: pathname || '/', hash: `#${frag}` }
}
</script>

<template>
  <footer class="footer">
    <div class="footer-rule" aria-hidden="true" />
    <div class="footer-shell mx-auto max-w-[82rem] px-[clamp(1.25rem,3vw,2.5rem)]">
      <div class="footer-column footer-column--brand">
        <p class="footer-eyebrow">Bryan X. Mendez</p>
        <p class="footer-signoff">Independent visual designer building brand systems, packaging, and digital experiences.</p>
        <p class="footer-meta">{{ profile.location }} · Available for thoughtful collaborations.</p>
      </div>

      <nav class="footer-column" aria-label="Footer">
        <p class="footer-column-title">Explore</p>
        <div class="footer-link-list">
          <NuxtLink
            v-for="item in navItems"
            :key="item.path"
            :to="navTarget(item.path)"
            class="footer-link"
            @click="onInPageHashLinkClick($event, item.path)"
          >
            {{ item.title }}
          </NuxtLink>
        </div>
      </nav>

      <div class="footer-column">
        <p class="footer-column-title">Elsewhere</p>
        <div class="footer-link-list">
          <a
            v-for="item in socialLinks"
            :key="item.href"
            :href="item.href"
            class="footer-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ item.label }}
          </a>
        </div>
      </div>
    </div>
    <div class="footer-bottom mx-auto max-w-[82rem] px-[clamp(1.25rem,3vw,2.5rem)]">
      <span class="footer-brand">&copy;&nbsp;{{ new Date().getFullYear() }} {{ profile.name }}</span>
      <span class="footer-meta footer-meta--bottom">Geist · Averia Serif Libre · Geist Mono · Nuxt</span>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: clamp(2.5rem, 5vw, 4rem);
}

.footer-rule {
  height: 1px;
  width: 100%;
  background: var(--rule);
  margin-bottom: clamp(0.9rem, 2vw, 1.4rem);
}

.footer-shell {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr);
  gap: clamp(1.25rem, 3vw, 2.5rem);
}

@media (min-width: 768px) {
  .footer-shell {
    grid-template-columns: minmax(0, 1.75fr) minmax(0, 0.9fr) minmax(0, 0.9fr);
    align-items: start;
  }
}

.footer-column {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  min-width: 0;
}

.footer-column--brand {
  gap: 0.85rem;
}

.footer-eyebrow,
.footer-column-title {
  margin: 0;
  font-family: var(--font-mono);
  font-size: var(--label-size);
  font-weight: 500;
  letter-spacing: var(--label-tracking-mono);
  text-transform: uppercase;
  color: var(--fg-muted);
}

.footer-signoff {
  margin: 0;
  max-width: min(30rem, 68ch);
  font-family: var(--font-serif);
  font-size: clamp(1.2rem, 1vw + 0.95rem, 1.5rem);
  font-style: italic;
  line-height: 1.28;
  letter-spacing: -0.025em;
  color: var(--fg-primary);
}

.footer-meta {
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.5;
  color: var(--fg-secondary);
}

.footer-link-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-link {
  font-size: 0.95rem;
  line-height: 1.4;
  color: var(--fg-primary);
  text-decoration: none;
  transition:
    color 180ms ease,
    transform 180ms cubic-bezier(0.16, 1, 0.3, 1);
}

.footer-link:hover {
  color: var(--emphasis);
  transform: translate3d(0, -1px, 0);
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
  margin-top: clamp(1.1rem, 2.2vw, 1.75rem);
}

.footer-brand {
  font-weight: 500;
  color: color-mix(in srgb, var(--fg-primary) 72%, var(--fg-muted));
}

.footer-meta--bottom {
  line-height: 1.45;
  text-align: right;
  min-width: 0;
}

@media (max-width: 640px) {
  .footer-meta--bottom {
    text-align: left;
  }
}
</style>
