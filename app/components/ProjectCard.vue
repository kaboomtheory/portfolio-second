<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { CSSProperties } from 'vue'
import type { ProjectItem } from '~/types/project'

const props = defineProps<{
  project: ProjectItem
  projectIndex?: number
}>()

const projectHref = computed(() => `/projects/${props.project.slug}`)

const hasThumbnail = computed(() => Boolean(props.project.thumbnail))
const visibleTags = computed(() => (props.project.tags ?? []).slice(0, 4))
const summaryText = computed(() => props.project.summary?.trim())
const projectIndexLabel = computed(() => {
  if (!props.projectIndex || props.projectIndex < 1) return null
  return String(props.projectIndex).padStart(2, '0')
})

const accentStyle = computed<CSSProperties>(() => {
  if (!props.project.color?.trim()) return {}
  return { '--project-accent': props.project.color.trim() }
})
</script>

<template>
  <div class="project-card group relative" :style="accentStyle">
    <NuxtLink
      :to="projectHref"
      class="project-card-link"
    >
      <div class="project-card__media work-media-frame">
        <SanityImage
          v-if="hasThumbnail"
          :src="project.thumbnail"
          :alt="project.name"
          sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw"
          loading="lazy"
          decoding="async"
          class="project-card__image"
        />
        <div v-else class="project-card__media-fallback">
          <Icon icon="lucide:image-off" class="project-card__media-fallback-icon" aria-hidden="true" />
          <span class="project-card__media-fallback-copy">Preview coming soon</span>
        </div>
        <div
          v-if="projectIndexLabel"
          class="project-card__media-meta"
          aria-hidden="true"
        >
          <span class="project-card__index">{{ projectIndexLabel }}</span>
        </div>
      </div>

      <div class="project-card__body">
        <h3 class="project-card__title">
          {{ project.name }}
        </h3>
        <p
          v-if="summaryText"
          class="project-card__summary text-muted"
        >
          {{ summaryText }}
        </p>

        <ul v-if="visibleTags.length" class="project-card__tags" aria-label="Project tags">
          <li v-for="tag in visibleTags" :key="tag">
            <span class="tag-chip">{{ tag }}</span>
          </li>
        </ul>
        <span class="project-card__cta" aria-hidden="true">
          <span class="project-card__cta-label">View project</span>
          <Icon icon="lucide:arrow-up-right" class="project-card__cta-icon" />
        </span>
      </div>
    </NuxtLink>
  </div>
</template>

<style scoped>
.project-card {
  position: relative;
  transform: translateY(0);
}

.project-card-link {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 100%;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  background: var(--project-card-surface, var(--bg-primary));
  border: 1px solid var(--project-card-border, color-mix(in srgb, var(--rule) 58%, transparent));
  border-radius: var(--radius-card);
  box-shadow: var(--project-card-shadow-idle, var(--shadow-sm));
  transition:
    background-color 240ms ease,
    box-shadow 280ms ease,
    transform 280ms ease,
    border-color 220ms ease;
}

.project-card-link:hover {
  background: var(--project-card-surface-hover, color-mix(in srgb, var(--bg-primary) 84%, var(--bg-secondary)));
  border-color: color-mix(in srgb, var(--project-accent, var(--accent)) 42%, var(--rule));
  box-shadow: var(--project-card-shadow-hover, var(--shadow-md));
  transform: translateY(-3px);
}

.project-card-link:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--project-accent, var(--accent)) 55%, white);
  outline-offset: 3px;
}

.project-card-link * {
  text-decoration: none;
}

.project-card__media {
  position: relative;
  aspect-ratio: 3 / 2;
  overflow: hidden;
  isolation: isolate;
}

.project-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1);
  transition: transform 420ms cubic-bezier(0.2, 0.6, 0.2, 1);
}

.project-card:hover .project-card__image {
  transform: scale(1.06);
}

.project-card__media-fallback {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  gap: 0.4rem;
  color: var(--fg-muted);
  background:
    radial-gradient(circle at 22% 24%, color-mix(in srgb, var(--project-accent, var(--accent)) 16%, transparent), transparent 40%),
    linear-gradient(
      140deg,
      var(--project-card-surface, var(--pastel-peach)),
      color-mix(in srgb, var(--project-card-surface, var(--pastel-peach)) 88%, var(--bg-primary))
    );
}

.project-card__media-meta {
  position: absolute;
  top: 0.72rem;
  left: 0.72rem;
  z-index: 1;
}

.project-card__index {
  display: inline-flex;
  align-items: center;
  padding: 0.26rem 0.52rem;
  border-radius: 9999px;
  font-family: var(--font-mono);
  font-size: 0.625rem;
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--fg-primary) 88%, var(--fg-muted));
  background: color-mix(in srgb, var(--bg-primary) 78%, transparent);
  border: 1px solid color-mix(in srgb, var(--fg-muted) 30%, transparent);
}

.project-card__media-fallback-icon {
  width: 1.2rem;
  height: 1.2rem;
}

.project-card__media-fallback-copy {
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  font-family: var(--font-mono);
}

.project-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.78rem;
  padding: 1.05rem 1rem 0.95rem;
}

.project-card__title {
  margin: 0;
  font-size: clamp(1.08rem, 1.15vw + 0.72rem, 1.28rem);
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.016em;
  color: var(--fg-primary);
  text-decoration: none;
  transition: color 220ms ease;
}

.project-card:hover .project-card__title {
  color: var(--emphasis);
}

.project-card__tags {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.42rem;
}

.project-card__summary {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.48;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: var(--fg-secondary);
  text-decoration: none;
}

.project-card__cta {
  margin-top: auto;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.69rem;
  font-family: var(--font-mono);
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--fg-primary);
  transition: color 220ms ease;
}

.project-card__cta-label {
  white-space: nowrap;
}

.project-card__cta-icon {
  width: 0.82rem;
  height: 0.82rem;
  flex-shrink: 0;
  transform: translateY(0);
  transition: transform 220ms ease;
}

.project-card:hover .project-card__cta {
  color: var(--fg-primary);
}

.project-card:hover .project-card__cta-icon,
.project-card-link:focus-visible .project-card__cta-icon {
  transform: translate3d(2px, -1px, 0);
}

@media (max-width: 520px) {
  .project-card__body {
    padding: 0.92rem 0.86rem 0.85rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .project-card-link,
  .project-card__image,
  .project-card__title,
  .project-card__cta,
  .project-card__cta-icon {
    transition: none;
  }

  .project-card-link:hover,
  .project-card:hover .project-card__cta-icon {
    transform: none;
  }
}
</style>
