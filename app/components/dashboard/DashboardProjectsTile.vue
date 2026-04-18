<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { ProjectItem } from '~/types/project'

const props = defineProps<{
  projects: ProjectItem[]
  loading: boolean
}>()

const stripRef = ref<HTMLElement | null>(null)
const canScrollPrev = ref(false)
const canScrollNext = ref(false)

let rafId = 0

function updateScrollState() {
  const el = stripRef.value
  if (!el) {
    canScrollPrev.value = false
    canScrollNext.value = false
    return
  }
  const maxScroll = el.scrollWidth - el.clientWidth
  if (maxScroll <= 1) {
    canScrollPrev.value = false
    canScrollNext.value = false
    return
  }
  canScrollPrev.value = el.scrollLeft > 1
  canScrollNext.value = el.scrollLeft < maxScroll - 1
}

function scheduleUpdateScrollState() {
  if (rafId) return
  rafId = requestAnimationFrame(() => {
    rafId = 0
    updateScrollState()
  })
}

function getScrollStep(el: HTMLElement) {
  const first = el.querySelector<HTMLElement>('.projects-strip__card')
  const gs = getComputedStyle(el)
  const gapStr = gs.columnGap || gs.gap || '12px'
  const gap = Number.parseFloat(gapStr) || 12
  const cardW = first?.offsetWidth ?? el.clientWidth * 0.8
  return cardW + gap
}

function step(dir: 1 | -1) {
  if (!import.meta.client) return
  const el = stripRef.value
  if (!el) return
  const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const delta = getScrollStep(el) * dir
  el.scrollBy({ left: delta, behavior: smooth ? 'smooth' : 'auto' })
}

function onStripKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    step(-1)
  } else if (e.key === 'ArrowRight') {
    e.preventDefault()
    step(1)
  }
}

const stripKey = computed(() =>
  props.projects.map((p) => p.slug).join('|') || 'empty',
)

watch(
  () => [props.projects.length, stripKey.value] as const,
  () => {
    nextTick(() => {
      scheduleUpdateScrollState()
    })
  },
)

onUpdated(() => {
  nextTick(() => scheduleUpdateScrollState())
})

onMounted(() => {
  if (!import.meta.client) return
  window.addEventListener('resize', scheduleUpdateScrollState, { passive: true })
  nextTick(() => scheduleUpdateScrollState())
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('resize', scheduleUpdateScrollState)
  }
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = 0
  }
})

const showCarouselNav = computed(
  () => !props.loading && props.projects.length > 0,
)
</script>

<template>
  <section
    class="dashboard-tile bento-tile reveal-up projects-bento-tile flex h-full min-h-0 flex-col"
    aria-labelledby="dashboard-projects-heading"
  >
    <div class="section-header-row shrink-0">
      <div class="section-header-main section-header">
        <span class="section-number">00</span>
        <h2 id="dashboard-projects-heading" class="section-title">
          Selected work
        </h2>
        <p class="projects-lede text-xs leading-relaxed text-muted">
          Case studies and client work — use arrows or scroll to browse.
        </p>
      </div>
      <div
        v-if="showCarouselNav"
        class="carousel-nav"
        role="group"
        aria-label="Scroll projects"
      >
        <button
          type="button"
          class="carousel-nav__btn"
          aria-label="Previous projects"
          :disabled="!canScrollPrev"
          @click="step(-1)"
        >
          <Icon icon="lucide:chevron-left" class="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          class="carousel-nav__btn"
          aria-label="Next projects"
          :disabled="!canScrollNext"
          @click="step(1)"
        >
          <Icon icon="lucide:chevron-right" class="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>

    <div v-if="loading" class="project-strip-skeleton bento-scroll min-h-0 flex-1">
      <div v-for="i in 4" :key="i" class="skeleton-card">
        <div class="skeleton-thumbnail" />
        <div class="skeleton-body">
          <div class="skeleton-line skeleton-line-short" />
          <div class="skeleton-line" />
        </div>
      </div>
    </div>

    <div
      v-else-if="projects.length === 0"
      class="empty-projects flex flex-1 flex-col items-center justify-center rounded-xl px-4 py-6 text-center"
    >
      <Icon
        icon="lucide:folder-open"
        class="mb-2 h-8 w-8 text-[var(--fg-muted)]"
        aria-hidden="true"
      />
      <p class="text-sm font-medium text-[var(--fg-primary)]">
        No projects to show yet
      </p>
      <p class="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-[var(--fg-muted)]">
        Check back soon.
      </p>
    </div>

    <div v-else class="projects-tile__scroll bento-scroll min-h-0 min-w-0 flex-1">
      <div class="projects-strip-slot">
        <Transition name="grid-fade" mode="out-in" appear>
          <div
            :key="stripKey"
            ref="stripRef"
            class="projects-strip"
            role="list"
            aria-label="Selected work projects"
            tabindex="0"
            @scroll.passive="scheduleUpdateScrollState"
            @keydown="onStripKeydown"
          >
            <ProjectCard
              v-for="(item, idx) in projects"
              :key="item.slug"
              layout="strip"
              :project="item"
              class="projects-strip__card"
              :style="{ '--i': idx }"
            />
          </div>
        </Transition>
      </div>
    </div>
  </section>
</template>

<style scoped>
.projects-bento-tile {
  gap: 0.375rem;
  overflow: visible;
}

.section-header-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.375rem 0.75rem;
}

.section-header-main {
  flex: 1 1 auto;
  min-width: 0;
}

.projects-lede {
  margin-top: 0.125rem;
  max-width: 36rem;
}

.carousel-nav {
  display: flex;
  flex-shrink: 0;
  gap: 0.25rem;
}

.carousel-nav__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: var(--radius-card);
  border: var(--card-border);
  background: var(--bg-secondary);
  color: var(--fg-primary);
  box-shadow: var(--card-ring);
  transition:
    background-color 180ms ease,
    color 180ms ease,
    opacity 180ms ease;
}

.carousel-nav__btn:hover:not(:disabled) {
  background: color-mix(in srgb, var(--fg-primary) 6%, var(--bg-secondary));
}

.carousel-nav__btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.carousel-nav__btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.projects-tile__scroll {
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
  overscroll-behavior: contain;
  padding-bottom: 0.25rem;
}

.projects-strip-slot {
  flex: 1 1 auto;
  min-height: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.projects-strip {
  --peek: 3.4;
  --strip-gap: 0.75rem;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  min-height: 0;
  height: auto;
  display: grid;
  align-items: start;
  align-content: start;
  grid-auto-flow: column;
  gap: var(--strip-gap);
  grid-auto-columns: calc((100% - (var(--peek) - 1) * var(--strip-gap)) / var(--peek));
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  overscroll-behavior-inline: contain;
  padding-top: 0.25rem;
  padding-bottom: 0.625rem;
  padding-right: 0.125rem;
  scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--fg-muted) 35%, transparent) transparent;
}

.projects-strip::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.projects-strip::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--fg-muted) 35%, transparent);
  border-radius: 999px;
}

.projects-strip:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  border-radius: var(--radius-card);
}

@media (max-width: 1279px) {
  .projects-strip {
    --peek: 2.45;
  }
}

@media (max-width: 1023px) {
  .projects-strip {
    --peek: 1.2;
  }
}

.projects-strip__card {
  scroll-snap-align: start;
  height: auto;
}

.projects-strip__card :deep(.project-card-link) {
  padding: 0.625rem;
}

.projects-strip__card :deep(.project-card__media) {
  aspect-ratio: 4 / 3;
}

.projects-strip__card :deep(.project-card-link > div:last-child) {
  gap: 0.5rem;
  padding-top: 0.75rem;
}

.projects-strip__card :deep(h3) {
  font-size: 1rem !important;
  line-height: 1.25 !important;
}

.projects-strip__card :deep(p) {
  font-size: 0.8125rem !important;
  line-height: 1.45 !important;
}

.projects-strip__card :deep(.tag-chip) {
  font-size: 0.6875rem;
  padding: 0.22rem 0.55rem;
}

.grid-fade-enter-active {
  transition: opacity 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.grid-fade-leave-active {
  transition: opacity 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.grid-fade-enter-from,
.grid-fade-leave-to {
  opacity: 0;
}

.grid-fade-enter-active :deep(.project-card) {
  animation: card-enter 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  animation-delay: calc(var(--i, 0) * 50ms);
}

@keyframes card-enter {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.97);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.project-strip-skeleton {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(10rem, 14rem);
  gap: 0.75rem;
  overflow: hidden;
}

.skeleton-card {
  border-radius: 0.75rem;
  background: var(--bg-secondary);
  border: var(--card-border);
  overflow: hidden;
}

.skeleton-thumbnail {
  aspect-ratio: 4 / 3;
  background: linear-gradient(90deg, var(--bg-tertiary) 25%, var(--bg-secondary) 50%, var(--bg-tertiary) 75%);
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
}

.skeleton-body {
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skeleton-line {
  height: 0.625rem;
  border-radius: 0.25rem;
  background: linear-gradient(90deg, var(--bg-tertiary) 25%, var(--bg-secondary) 50%, var(--bg-tertiary) 75%);
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
}

.skeleton-line-short {
  width: 40%;
}

@keyframes skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

.empty-projects {
  border: var(--card-border);
  box-shadow: var(--card-ring);
  backdrop-filter: blur(15px) saturate(1.2);
  -webkit-backdrop-filter: blur(15px) saturate(1.2);
}

@media (prefers-reduced-motion: reduce) {
  .grid-fade-enter-active,
  .grid-fade-leave-active {
    transition: none;
  }

  .grid-fade-enter-from,
  .grid-fade-leave-to {
    opacity: 1;
  }

  .grid-fade-enter-active :deep(.project-card) {
    animation: none;
    opacity: 1;
    transform: none;
  }

  .skeleton-thumbnail,
  .skeleton-line {
    animation: none;
  }
}
</style>
