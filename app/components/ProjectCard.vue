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
const clientLine = computed(() => props.project.client?.trim() ?? '')
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
      <div class="project-card__body">
        <p
          v-if="clientLine"
          class="project-card__client"
        >
          {{ clientLine }}
        </p>
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

      <div class="project-card__media work-media-frame">
        <SanityImage
          v-if="hasThumbnail"
          :src="project.thumbnail"
          :alt="project.name"
          sizes="(max-width: 719px) 100vw, 50vw"
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
    </NuxtLink>
  </div>
</template>

<style scoped>
.project-card {
  position: relative;
  transform: translateY(0);
  --project-card-media-aspect: 4 / 3;
}

@media (min-width: 720px) {
  .project-card {
    --project-card-media-aspect: 16 / 10;
  }
}

.project-card-link {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  height: 100%;
  min-height: 100%;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  background: var(--bg-primary);
  border: 1px solid var(--project-card-border, color-mix(in srgb, var(--rule) 58%, var(--paper)));
  border-radius: 0.5rem;
  box-shadow: var(--project-card-shadow-idle, var(--shadow-sm));
  transition:
    background-color 220ms cubic-bezier(0.25, 1, 0.5, 1),
    box-shadow 260ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 260ms cubic-bezier(0.22, 1, 0.36, 1),
    border-color 200ms cubic-bezier(0.25, 1, 0.5, 1);
}

.project-card-link:hover {
  border-color: color-mix(in srgb, var(--pastel-ink) 34%, var(--project-card-surface, var(--paper)));
  box-shadow: var(--project-card-shadow-hover, var(--shadow-md));
  transform: translate3d(0, -3px, 0);
}

.project-card-link:active {
  transform: translate3d(0, -1px, 0) scale(0.995);
  transition-duration: 120ms;
}

.project-card-link:hover .project-card__body {
  background: var(
    --project-card-surface-hover,
    color-mix(in srgb, var(--project-card-surface, var(--bg-secondary)) 86%, var(--bg-primary))
  );
}

.project-card-link:focus-visible {
  /* Neutral ring: brand accent reads as stray “orange border” on bright tile fills + dark shell. */
  outline: 2px solid color-mix(in srgb, var(--pastel-ink) 42%, var(--project-card-surface, var(--paper)));
  outline-offset: 3px;
}

.project-card-link * {
  text-decoration: none;
}

.project-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.78rem;
  flex: 1 1 auto;
  min-width: 0;
  min-height: 0;
  padding: 1.05rem 1rem 0.95rem;
  background: var(--project-card-surface, var(--bg-secondary));
  border-bottom: 1px solid color-mix(in srgb, var(--pastel-ink) 10%, var(--project-card-surface, var(--bg-secondary)));
  transition: background-color 220ms cubic-bezier(0.25, 1, 0.5, 1);
}

:root.dark .project-card__body {
  border-bottom-color: color-mix(in srgb, var(--pastel-ink) 22%, var(--project-card-surface, var(--bg-secondary)));
}

.project-card__client {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.35;
  letter-spacing: 0.02em;
  color: var(--fg-muted);
}

.project-card__media {
  position: relative;
  flex: 0 0 auto;
  width: 100%;
  min-width: 0;
  aspect-ratio: var(--project-card-media-aspect);
  overflow: hidden;
  isolation: isolate;
  background-color: var(--project-card-media-bg, var(--bg-secondary));
  background-image: radial-gradient(
    circle,
    color-mix(in srgb, var(--fg-muted) 18%, var(--project-card-media-bg, var(--bg-secondary))) 0.5px,
    var(--project-card-media-bg, var(--bg-secondary)) 0.6px
  );
  background-size: 11px 11px;
  border-bottom: none;
}

.project-card__media.work-media-frame {
  border-bottom: none;
}

:root.dark .project-card__media {
  background-image: radial-gradient(
    circle,
    color-mix(in srgb, var(--fg-muted) 30%, var(--project-card-media-bg, var(--bg-secondary))) 0.5px,
    var(--project-card-media-bg, var(--bg-secondary)) 0.6px
  );
}

.project-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1);
  transition: transform 480ms cubic-bezier(0.16, 1, 0.3, 1);
}

.project-card:hover .project-card__image {
  transform: scale3d(1.05, 1.05, 1);
}

.project-card__media-fallback {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  gap: 0.4rem;
  color: var(--fg-muted);
  background:
    radial-gradient(
      circle at 22% 24%,
      color-mix(in srgb, var(--project-accent, var(--accent)) 14%, var(--project-card-media-bg, var(--bg-secondary))),
      var(--project-card-media-bg, var(--bg-secondary)) 42%
    ),
    linear-gradient(
      140deg,
      var(--project-card-media-bg, var(--bg-secondary)),
      color-mix(in srgb, var(--project-card-media-bg, var(--bg-secondary)) 90%, var(--bg-primary))
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
  color: var(--fg-primary);
  background: color-mix(in srgb, var(--project-card-surface, var(--paper)) 80%, var(--paper));
  border: 1px solid color-mix(in srgb, var(--fg-primary) 22%, var(--project-card-surface, var(--paper)));
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

.project-card__title {
  margin: 0;
  font-size: clamp(1.08rem, 1.15vw + 0.72rem, 1.28rem);
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.016em;
  color: var(--fg-primary);
  text-decoration: none;
  transition: color 200ms cubic-bezier(0.25, 1, 0.5, 1);
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
  gap: 0 0.7rem;
  row-gap: 0.2rem;
}

.project-card__tags .tag-chip {
  padding: 0;
  background: transparent;
  border: 0;
  color: color-mix(in srgb, var(--fg-primary) 76%, var(--project-card-surface, var(--paper)));
  font-size: calc(var(--label-size) * 0.95);
}

.project-card__summary {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.48;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: color-mix(in srgb, var(--fg-primary) 82%, var(--project-card-surface, var(--paper)));
  text-decoration: none;
}

@media (min-width: 720px) {
  .project-card__summary {
    -webkit-line-clamp: 3;
  }
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
  transition: color 200ms cubic-bezier(0.25, 1, 0.5, 1);
}

.project-card__cta-label {
  white-space: nowrap;
}

.project-card__cta-icon {
  width: 0.82rem;
  height: 0.82rem;
  flex-shrink: 0;
  transform: translateY(0);
  transition: transform 240ms cubic-bezier(0.22, 1, 0.36, 1);
}

.project-card:hover .project-card__cta {
  color: var(--fg-primary);
}

.project-card:hover .project-card__cta-icon,
.project-card-link:focus-visible .project-card__cta-icon {
  transform: translate3d(3px, -2px, 0);
}

@media (min-width: 720px) {
  .project-card-link {
    flex-direction: row;
    align-items: stretch;
  }

  .project-card__body {
    flex: 1 1 50%;
    align-self: stretch;
    padding: clamp(1.1rem, 2vw, 1.55rem) clamp(1rem, 2vw, 1.35rem);
    border-bottom: none;
  }

  .project-card__title {
    font-size: clamp(1.15rem, 1.1vw + 0.82rem, 1.45rem);
  }

  .project-card__media {
    flex: 1 1 50%;
    align-self: center;
    aspect-ratio: var(--project-card-media-aspect);
    /* Tie divider to tile ink × surface—media-bg pulls in peach-heavy bg-secondary in dark and reads orange. */
    border-left: 1px solid color-mix(in srgb, var(--pastel-ink) 12%, var(--project-card-surface, var(--bg-secondary)));
  }

  :root.dark .project-card__media {
    border-left-color: color-mix(in srgb, var(--pastel-ink) 28%, var(--project-card-surface, var(--bg-secondary)));
  }
}

@media (max-width: 520px) {
  .project-card__body {
    padding: 0.92rem 0.86rem 0.85rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .project-card-link,
  .project-card__body,
  .project-card__image,
  .project-card__title,
  .project-card__cta,
  .project-card__cta-icon {
    transition: none;
  }

  .project-card-link:hover,
  .project-card-link:active,
  .project-card:hover .project-card__cta-icon {
    transform: none;
  }
}
</style>
