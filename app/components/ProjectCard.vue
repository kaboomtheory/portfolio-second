<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { ProjectItem } from '~/data/projects'

const props = defineProps<{
  project: ProjectItem
  class?: string
}>()

const cardRef = ref<HTMLElement | null>(null)
const mouseX = ref(0)
const mouseY = ref(0)

const handleMouseMove = (e: MouseEvent) => {
  if (!cardRef.value) return
  const rect = cardRef.value.getBoundingClientRect()
  mouseX.value = e.clientX - rect.left
  mouseY.value = e.clientY - rect.top
}
</script>

<template>
  <div :class="['project-card-ethereal group relative rounded-xl transition-all duration-700 ease-out aspect-square', props.class]">
    <div class="project-card-glass" />
    <div class="project-card-glow" />
    <div class="project-card-shimmer" />
    <div class="project-card-border" />

    <NuxtLink
      ref="cardRef"
      class="relative z-10 block h-full p-2.5"
      :style="{
        '--mouse-x': `${mouseX}px`,
        '--mouse-y': `${mouseY}px`
      }"
      :to="`/projects/${project.slug}`"
      @mousemove="handleMouseMove"
    >
      <div
        class="pointer-events-none absolute -inset-px z-30 rounded-xl opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100"
        :style="{
          background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.15), transparent 50%)`
        }"
      />

      <div class="flex h-full flex-col">
        <div class="relative min-h-0 flex-1 overflow-hidden rounded-lg">
          <img
            :src="project.thumbnail"
            :alt="project.name"
            class="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            loading="lazy"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-60 transition-opacity duration-700 ease-out group-hover:opacity-0" />
          <div class="absolute inset-0 opacity-0 transition-opacity duration-700 ease-out delay-75 group-hover:opacity-100 bg-gradient-to-br from-[var(--accent)]/5 via-transparent to-[var(--accent)]/5" />
          <div class="thumbnail-sheen absolute inset-0 z-10" />
          <span v-if="project.category" class="category-badge">{{ project.category }}</span>
        </div>
        <div class="mt-3 flex shrink-0 items-start justify-between gap-3 px-1">
          <div class="space-y-1.5">
            <p class="text-[0.65rem] uppercase tracking-[0.12em] text-[var(--fg-muted)] transition-colors duration-500 ease-out group-hover:text-[var(--fg-secondary)]">
              {{ project.category }} • {{ project.year }}
            </p>
            <h3 class="text-xl font-semibold text-[var(--fg-primary)] transition-all duration-500 ease-out group-hover:text-[var(--accent)]">
              {{ project.name }}
            </h3>
          </div>
          <span
            class="arrow-btn flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[var(--fg-muted)] transition-all duration-500 ease-out group-hover:bg-[var(--accent)] group-hover:text-[var(--bg-primary)] group-hover:shadow-[0_0_20px_var(--accent)/60,0_0_40px_var(--accent)/30] group-hover:rotate-45 group-hover:[translate:2px_-2px]"
          >
            <Icon icon="lucide:arrow-up-right" class="text-lg transition-transform duration-300" />
          </span>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<style scoped>
.project-card-ethereal {
  --glow-color: var(--accent);
  --glass-bg: rgba(255, 255, 255, 0.08);
  --glass-border: rgba(255, 255, 255, 0.12);
  transform: translateY(0);
}

:root.dark .project-card-ethereal {
  --glass-bg: rgba(255, 255, 255, 0.04);
  --glass-border: rgba(255, 255, 255, 0.08);
}

.project-card-ethereal:hover {
  transform: translateY(-6px);
}

.project-card-glass {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  z-index: 0;
  transition: background 0.7s ease-out;
}

.project-card-ethereal:hover .project-card-glass {
  background: rgba(255, 255, 255, 0.12);
}

:root.dark .project-card-ethereal:hover .project-card-glass {
  background: rgba(255, 255, 255, 0.08);
}

.project-card-border {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  border: 1px solid var(--glass-border);
  z-index: 2;
  pointer-events: none;
  transition: border-color 0.7s ease-out;
}

.project-card-ethereal:hover .project-card-border {
  border-color: color-mix(in srgb, var(--accent) 40%, transparent);
}

.project-card-glow {
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--glow-color) 15%, transparent),
    transparent 40%,
    transparent 60%,
    color-mix(in srgb, var(--glow-color) 10%, transparent)
  );
  opacity: 0.4;
  z-index: 0;
  animation: ethereal-breathe 8s ease-in-out infinite;
  transition: opacity 0.7s ease-out, filter 0.7s ease-out;
}

.project-card-ethereal:hover .project-card-glow {
  opacity: 0.85;
  animation: ethereal-pulse 2.5s ease-out forwards;
}

.project-card-shimmer {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(
    105deg,
    transparent 40%,
    color-mix(in srgb, var(--glow-color) 8%, transparent) 45%,
    color-mix(in srgb, var(--glow-color) 15%, transparent) 50%,
    color-mix(in srgb, var(--glow-color) 8%, transparent) 55%,
    transparent 60%
  );
  background-size: 200% 100%;
  background-position: 200% 0;
  opacity: 0.3;
  z-index: 1;
  animation: shimmer-idle 12s ease-in-out infinite;
  pointer-events: none;
  transition: opacity 0.7s ease-out;
}

.project-card-ethereal:hover .project-card-shimmer {
  opacity: 1;
  animation: shimmer-slide 2s ease-out forwards;
}

@keyframes shimmer-idle {
  0%, 100% {
    background-position: 200% 0;
    opacity: 0.15;
  }
  50% {
    background-position: 100% 0;
    opacity: 0.35;
  }
}

@keyframes ethereal-breathe {
  0%, 100% {
    opacity: 0.25;
    filter: blur(22px);
  }
  50% {
    opacity: 0.45;
    filter: blur(28px);
  }
}

@keyframes ethereal-pulse {
  0% {
    opacity: 0.6;
    filter: blur(18px);
  }
  50% {
    opacity: 0.95;
    filter: blur(24px);
  }
  100% {
    opacity: 0.85;
    filter: blur(20px);
  }
}

@keyframes shimmer-slide {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.thumbnail-sheen {
  background: linear-gradient(
    105deg,
    transparent 35%,
    rgba(255, 255, 255, 0.5) 50%,
    transparent 65%
  );
  background-size: 200% 100%;
  background-position: 200% 0;
  opacity: 0;
  pointer-events: none;
}

.project-card-ethereal:hover .thumbnail-sheen {
  animation: thumbnail-sheen 1.8s ease-out forwards;
}

@keyframes thumbnail-sheen {
  0% {
    background-position: 200% 0;
    opacity: 0.9;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    background-position: -200% 0;
    opacity: 0;
  }
}

.category-badge {
  position: absolute;
  top: 0.625rem;
  left: 0.625rem;
  z-index: 20;
  padding: 0.25rem 0.625rem;
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 9999px;
  opacity: 0;
  transform: translateY(-4px);
  transition: all 0.4s ease;
}

.project-card-ethereal:hover .category-badge {
  opacity: 1;
  transform: translateY(0);
}

.arrow-btn {
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

:root.dark .arrow-btn {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

@media (prefers-reduced-motion: reduce) {
  .project-card-ethereal,
  .project-card-glow,
  .project-card-shimmer,
  .thumbnail-sheen {
    animation: none;
  }

  .project-card-ethereal:hover {
    transform: none;
  }
}

@supports not (backdrop-filter: blur(20px)) {
  .project-card-glass {
    background: var(--bg-tertiary);
  }
}
</style>
