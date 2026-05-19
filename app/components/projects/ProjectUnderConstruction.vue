<script setup lang="ts">
import type { ProjectItem } from '~/types/project'
import { useInPageHashLink } from '~/composables/useInPageHashLink'

const props = defineProps<{
  project: ProjectItem
  prevProject?: ProjectItem | null
  nextProject?: ProjectItem | null
}>()

const backToWorkHref = '/#work'
const { onInPageHashLinkClick } = useInPageHashLink()

const accentStyle = computed<Record<string, string>>(() => ({
  '--project-accent': props.project.color?.trim() || 'var(--accent)',
}))
const { styleAttr, styleId } = useCspTargetStyle(() => accentStyle.value)
</script>

<template>
  <div
    class="project-under-construction project-detail-page"
    v-bind:[styleAttr]="styleId"
  >
    <NuxtLink
      :to="backToWorkHref"
      class="back-link mb-8 inline-flex items-center gap-2 text-sm transition-colors"
      @click="(e) => onInPageHashLinkClick(e, backToWorkHref)"
    >
      <span>← Back to work</span>
    </NuxtLink>

    <div class="hero-header">
      <h1 class="project-hero-title font-display">
        {{ project.name }}
      </h1>
      <p
        v-if="project.summary?.trim()"
        class="mt-4 max-w-3xl text-base leading-relaxed sm:text-lg"
      >
        {{ project.summary }}
      </p>
      <div v-if="project.tags?.length" class="mt-4 flex flex-wrap gap-2">
        <span
          v-for="tag in project.tags"
          :key="tag"
          class="tag-chip"
        >
          {{ tag }}
        </span>
      </div>
    </div>

    <div
      class="construction-panel pastel-grain-shadow"
      role="status"
      aria-live="polite"
    >
      <div class="construction-icon-wrap" aria-hidden="true">
        <AppIcon icon="lucide:hard-hat" class="construction-icon" />
      </div>
      <p class="construction-eyebrow">
        Under construction
      </p>
      <p class="construction-message">
        This case study is still being built — check back soon.
      </p>
    </div>

    <nav
      class="project-pager mt-14 flex flex-col gap-4 pt-10 md:flex-row md:items-center md:justify-between"
      aria-label="Project navigation"
    >
      <NuxtLink
        v-if="prevProject"
        :to="`/projects/${prevProject.slug}`"
        class="pager-link inline-flex min-w-0 max-w-full items-center gap-2 break-words text-sm font-medium transition-colors"
      >
        <AppIcon icon="lucide:arrow-left" class="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>
          <span class="pager-label block text-meta">Previous</span>
          {{ prevProject.name }}
        </span>
      </NuxtLink>
      <span v-else class="hidden md:block md:w-40" />

      <NuxtLink
        v-if="nextProject"
        :to="`/projects/${nextProject.slug}`"
        class="pager-link inline-flex min-w-0 max-w-full items-center gap-2 break-words text-right text-sm font-medium transition-colors md:ml-auto"
      >
        <span>
          <span class="pager-label block text-meta">Next</span>
          {{ nextProject.name }}
        </span>
        <AppIcon icon="lucide:arrow-right" class="h-4 w-4 shrink-0" aria-hidden="true" />
      </NuxtLink>
    </nav>
  </div>
</template>

<style scoped>
.project-under-construction {
  --signal: var(--signal-peach);
}

.back-link {
  color: var(--fg-muted);
}
.back-link:hover {
  color: var(--emphasis);
}

.hero-header {
  animation: hero-reveal 0.6s ease-out forwards;
  margin-bottom: var(--space-xl);
}

.project-hero-title {
  font-size: clamp(2.25rem, 4vw + 1rem, 3.25rem);
  font-weight: 600;
  line-height: 1.08;
  letter-spacing: -0.02em;
  color: var(--fg-primary);
  overflow-wrap: anywhere;
}

.construction-panel {
  margin-inline: auto;
  max-width: 36rem;
  padding: clamp(2rem, 5vw, 3rem) clamp(1.5rem, 4vw, 2.5rem);
  text-align: center;
  border-radius: 1rem;
  background: var(--bg-secondary);
  animation: panel-reveal 0.7s ease-out 0.15s both;
}

.construction-icon-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.construction-icon {
  width: 3rem;
  height: 3rem;
  color: var(--project-accent, var(--accent));
  animation: icon-bob 2.4s ease-in-out infinite;
}

.construction-eyebrow {
  font-size: var(--label-size);
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--project-accent, var(--accent));
}

.construction-message {
  margin-top: 0.75rem;
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(1.125rem, 0.5vw + 1rem, 1.35rem);
  line-height: 1.5;
  color: var(--fg-secondary);
}

.pager-link {
  color: var(--fg-secondary);
}
.pager-link:hover {
  color: var(--emphasis);
}

.pager-label {
  color: var(--fg-muted);
}

@keyframes hero-reveal {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes panel-reveal {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes icon-bob {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-header,
  .construction-panel {
    animation: none !important;
  }

  .construction-icon {
    animation: none !important;
  }
}
</style>
