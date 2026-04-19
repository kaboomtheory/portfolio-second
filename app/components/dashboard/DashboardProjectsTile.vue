<script setup lang="ts">
import { Icon } from '@iconify/vue'
import emblaCarouselVue from 'embla-carousel-vue'
import type { ProjectItem } from '~/types/project'

const props = withDefaults(
  defineProps<{
    projects: ProjectItem[]
    loading: boolean
    sectionNumber?: string
    cardTitle?: string
  }>(),
  {
    sectionNumber: '04',
    cardTitle: 'Selected work',
  },
)

const projectsKey = computed(() => props.projects.map((p) => p.slug).join('|') || 'empty')

const emblaOptions = {
  align: 'center' as const,
  loop: false,
  containScroll: 'trimSnaps' as const,
  skipSnaps: false,
  dragFree: false,
}

const [emblaRef, emblaApi] = emblaCarouselVue(emblaOptions)

const activeIndex = ref(0)
const atStart = ref(true)
const atEnd = ref(true)

const reduceMotion = ref(false)
let motionMq: MediaQueryList | null = null

const statusId = 'dashboard-projects-carousel-status'
const carouselHintId = 'dashboard-projects-carousel-hint'

function onMotionPreferenceChange() {
  reduceMotion.value = motionMq?.matches ?? false
}

function syncFromEmbla() {
  const api = emblaApi.value
  if (!api) {
    atStart.value = true
    atEnd.value = true
    activeIndex.value = 0
    return
  }
  activeIndex.value = api.selectedScrollSnap()
  atStart.value = !api.canScrollPrev()
  atEnd.value = !api.canScrollNext()
}

function scrollToIndex(i: number) {
  emblaApi.value?.scrollTo(i, reduceMotion.value)
}

function goPrev() {
  emblaApi.value?.scrollPrev(reduceMotion.value)
}

function goNext() {
  emblaApi.value?.scrollNext(reduceMotion.value)
}

watchEffect((onCleanup) => {
  const api = emblaApi.value
  if (!api) return
  const onSelect = () => syncFromEmbla()
  api.on('select', onSelect)
  api.on('reInit', onSelect)
  onSelect()
  onCleanup(() => {
    api.off('select', onSelect)
    api.off('reInit', onSelect)
  })
})

watch(
  () => projectsKey.value,
  async () => {
    await nextTick()
    emblaApi.value?.reInit()
    syncFromEmbla()
  },
)

function onViewportKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    goPrev()
  }
  else if (e.key === 'ArrowRight') {
    e.preventDefault()
    goNext()
  }
}

onMounted(() => {
  if (!import.meta.client) return
  motionMq = window.matchMedia('(prefers-reduced-motion: reduce)')
  reduceMotion.value = motionMq.matches
  motionMq.addEventListener('change', onMotionPreferenceChange)
  nextTick(() => syncFromEmbla())
})

onUnmounted(() => {
  motionMq?.removeEventListener('change', onMotionPreferenceChange)
})

const activeProject = computed(() => {
  const list = props.projects
  const i = activeIndex.value
  if (!list.length || i < 0 || i >= list.length) return null
  return list[i] ?? null
})

const carouselStatusText = computed(() => {
  const n = props.projects.length
  if (n < 1) return ''
  const p = activeProject.value
  const i = activeIndex.value + 1
  if (p) return `${p.name}, project ${i} of ${n}.`
  return `Project ${i} of ${n}.`
})
</script>

<template>
  <section
    class="dashboard-tile bento-tile reveal-up projects-bento-tile flex h-full min-h-0 min-w-0 flex-col overflow-hidden"
    aria-labelledby="dashboard-projects-heading"
  >
    <div class="section-header projects-tile__header shrink-0">
      <div class="projects-tile__header-titles">
        <span class="section-number">{{ sectionNumber }}</span>
        <h2 id="dashboard-projects-heading" class="section-title">
          {{ cardTitle }}
        </h2>
      </div>
      <div
        v-if="!loading && projects.length > 1"
        class="projects-carousel__footer projects-carousel__footer--in-header"
      >
        <p class="projects-carousel__counter" aria-hidden="true">
          <span class="tabular-nums">{{ activeIndex + 1 }}</span>
          <span class="projects-carousel__counter-sep">/</span>
          <span class="tabular-nums">{{ projects.length }}</span>
        </p>
        <div class="projects-carousel__dots" aria-label="Choose a project">
          <button
            v-for="(item, idx) in projects"
            :key="`${item.slug}-dot`"
            type="button"
            :aria-current="idx === activeIndex ? 'true' : undefined"
            :aria-label="`Go to project ${idx + 1}: ${item.name}`"
            :class="['projects-carousel__dot', idx === activeIndex && 'is-active']"
            @click="scrollToIndex(idx)"
          />
        </div>
      </div>
    </div>

    <div class="dashboard-tile__content projects-tile__main flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <div
        v-if="loading"
        class="projects-tile__body projects-tile__body--fill flex min-h-0 min-w-0 flex-1 flex-col"
      >
        <div class="projects-carousel" aria-hidden="true">
          <div class="projects-carousel__viewport projects-carousel__viewport--static">
            <div class="projects-carousel__track projects-carousel__track--skeleton">
              <div v-for="i in 4" :key="i" class="projects-carousel__slide">
                <div class="skeleton-dashboard" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-else-if="projects.length === 0"
        class="empty-projects flex min-h-[12rem] flex-col items-center justify-center gap-3 rounded-xl px-5 py-8 text-center"
      >
        <div class="empty-projects__icon" aria-hidden="true">
          <Icon
            icon="lucide:folder-open"
            class="empty-projects__icon-svg h-7 w-7"
          />
        </div>
        <div class="empty-projects__copy">
          <p class="empty-projects__title text-sm font-semibold leading-snug tracking-tight text-[var(--fg-primary)]">
            No projects yet
          </p>
          <p class="empty-projects__body mx-auto mt-1.5 max-w-[20rem] text-xs leading-relaxed text-[var(--fg-muted)]">
            New work will land here as soon as it is ready to share.
          </p>
        </div>
      </div>

      <div v-else class="projects-tile__body projects-tile__body--fill flex min-h-0 min-w-0 flex-1 flex-col">
        <div class="projects-carousel">
          <p :id="statusId" class="sr-only" aria-live="polite">
            {{ carouselStatusText }}
          </p>
          <p :id="carouselHintId" class="sr-only">
            Use the side arrows, slide dots, or arrow keys while this area is focused.
          </p>

          <div class="projects-carousel__stage">
            <div
              id="dashboard-projects-viewport"
              ref="emblaRef"
              class="projects-carousel__viewport"
              tabindex="0"
              role="region"
              aria-roledescription="carousel"
              aria-labelledby="dashboard-projects-heading"
              :aria-describedby="carouselHintId"
              @keydown="onViewportKeydown"
            >
              <div class="projects-carousel__track" role="list">
                <div
                  v-for="(item, idx) in projects"
                  :key="item.slug"
                  class="projects-carousel__slide"
                  :class="idx === activeIndex && 'is-active'"
                  role="listitem"
                >
                  <ProjectCard
                    layout="dashboard"
                    :project="item"
                    class="projects-carousel__card h-full min-h-0"
                  />
                </div>
              </div>
            </div>

            <div
              v-if="projects.length > 1"
              class="projects-carousel__edge-nav"
            >
              <button
                type="button"
                class="projects-carousel__btn projects-carousel__btn--edge"
                :disabled="atStart"
                :aria-disabled="atStart"
                aria-controls="dashboard-projects-viewport"
                @click="goPrev"
              >
                <span class="sr-only">Previous project</span>
                <Icon icon="lucide:chevron-left" class="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                class="projects-carousel__btn projects-carousel__btn--edge projects-carousel__btn--edge-next"
                :disabled="atEnd"
                :aria-disabled="atEnd"
                aria-controls="dashboard-projects-viewport"
                @click="goNext"
              >
                <span class="sr-only">Next project</span>
                <Icon icon="lucide:chevron-right" class="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.projects-bento-tile {
  gap: 0.25rem;
  overflow: hidden;
}

.projects-tile__main {
  gap: 0.25rem;
}

.projects-tile__body {
  flex: 0 1 auto;
  min-height: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.projects-tile__body--fill {
  flex: 1 1 0%;
}

.projects-carousel {
  --strip-gap: 0.35rem;
  container-type: inline-size;
  container-name: proj-strip;
  flex: 1 1 0%;
  min-height: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.projects-tile__header {
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem 0.75rem;
  width: 100%;
}

.projects-tile__header-titles {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.5rem 0.75rem;
  min-width: 0;
  flex: 1 1 auto;
}

.projects-carousel__footer--in-header {
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  padding-top: 0;
  margin-left: auto;
  gap: 0.5rem 0.75rem;
  max-width: 100%;
}

@media (max-width: 520px) {
  .projects-carousel__footer--in-header {
    margin-left: 0;
    width: 100%;
    justify-content: flex-start;
  }
}

.projects-carousel__stage {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1 1 0%;
  min-height: 0;
  min-width: 0;
  isolation: isolate;
}

.projects-carousel__viewport {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
  border-radius: var(--radius-card);
  box-shadow: var(--card-ring);
}

.projects-carousel__viewport:focus-visible {
  outline: 2px solid var(--emphasis);
  outline-offset: 2px;
}

.projects-carousel__viewport--static {
  display: flex;
  flex-direction: column;
  flex: 1 1 0%;
  min-height: 0;
  overflow: hidden;
  mask-image: none;
}

.projects-carousel__track {
  display: flex;
  gap: var(--strip-gap);
  flex: 1 1 auto;
  min-height: 0;
  height: 100%;
  align-items: stretch;
  align-self: stretch;
  padding-inline: 0.5rem;
  box-sizing: border-box;
}

.projects-carousel__track--skeleton {
  width: 100%;
}

.projects-carousel__slide {
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
  align-self: stretch;
  height: auto;
  min-height: 100%;
  min-width: 0;
  /* Track uses 0.5rem padding-inline each side → keep slide within query container */
  width: min(30rem, calc(100cqi - 1.25rem));
  opacity: 0.5;
  transition: opacity 0.2s ease;
}

.projects-carousel__slide.is-active {
  opacity: 1;
}

@container proj-strip (min-width: 36rem) {
  .projects-carousel__slide {
    width: calc((100cqi - 1 * var(--strip-gap) - 0.75rem) / 1.85);
  }
}

@container proj-strip (min-width: 52rem) {
  .projects-carousel__slide {
    width: calc((100cqi - 2 * var(--strip-gap) - 0.75rem) / 2.35);
  }
}

@container proj-strip (min-width: 72rem) {
  .projects-carousel__slide {
    width: calc((100cqi - 3 * var(--strip-gap) - 0.75rem) / 3.35);
  }
}

.projects-carousel__card {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  width: 100%;
  max-width: 100%;
  min-height: 0;
}

.projects-carousel__card :deep(.project-card) {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 0;
  min-width: 0;
}

.projects-carousel__card :deep(.project-card-link--dashboard) {
  flex: 1 1 0%;
  min-height: 0;
  min-width: 0;
}

.projects-carousel__edge-nav {
  pointer-events: none;
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-inline: 0.2rem;
  z-index: 2;
}

.projects-carousel__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  border: 1px solid color-mix(in srgb, var(--fg-muted) 18%, transparent);
  background: color-mix(in srgb, var(--bg-primary) 92%, transparent);
  color: var(--fg-primary);
  transition: background 0.15s ease, color 0.15s ease, opacity 0.15s ease;
}

.projects-carousel__btn--edge {
  pointer-events: auto;
  width: 2.5rem;
  height: 2.5rem;
}

.projects-carousel__btn--edge-next {
  margin-inline-start: auto;
}

.projects-carousel__btn:hover:not(:disabled) {
  color: var(--emphasis);
  background: color-mix(in srgb, var(--bg-secondary) 80%, var(--bg-primary));
}

.projects-carousel__btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.projects-carousel__btn:focus-visible {
  outline: 2px solid var(--emphasis);
  outline-offset: 2px;
}

.projects-carousel__footer {
  flex-shrink: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.5rem 0.75rem;
}

.projects-carousel__counter {
  margin: 0;
  font-size: 0.6875rem;
  font-weight: 500;
  color: var(--fg-muted);
  font-variant-numeric: tabular-nums;
}

.projects-carousel__counter-sep {
  margin-inline: 0.12em;
  opacity: 0.4;
}

.projects-carousel__dots {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
}

.projects-carousel__dot {
  position: relative;
  flex: 0 0 auto;
  width: 1.75rem;
  height: 1.75rem;
  padding: 0;
  margin: 0;
  border: none;
  border-radius: 9999px;
  background: transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.projects-carousel__dot::after {
  content: '';
  display: block;
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 9999px;
  background: color-mix(in srgb, var(--fg-muted) 45%, transparent);
  transition: width 0.15s ease, height 0.15s ease, background 0.15s ease;
}

.projects-carousel__dot:hover::after {
  background: color-mix(in srgb, var(--fg-muted) 65%, transparent);
}

.projects-carousel__dot.is-active::after {
  width: 1rem;
  height: 0.3125rem;
  border-radius: 9999px;
  background: var(--emphasis);
}

.projects-carousel__dot.is-active {
  transform: none;
}

.projects-carousel__dot:focus-visible {
  outline: 2px solid var(--emphasis);
  outline-offset: 2px;
}

.skeleton-dashboard {
  height: 100%;
  min-height: 0;
  border-radius: var(--radius-card);
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--fg-muted) 12%, var(--bg-secondary)) 0%,
    var(--bg-secondary) 45%,
    color-mix(in srgb, var(--fg-muted) 10%, var(--bg-secondary)) 100%
  );
  border: var(--card-border);
  box-shadow: var(--card-ring);
  aspect-ratio: 3 / 4;
  max-height: 100%;
  animation: skeleton-shimmer 1.2s ease-in-out infinite alternate;
}

.empty-projects {
  border: var(--card-border);
  box-shadow: var(--card-ring);
  background: color-mix(in srgb, var(--bg-secondary) 50%, var(--bg-primary));
}

.empty-projects__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  background: color-mix(in srgb, var(--fg-muted) 8%, var(--bg-secondary));
  border: 1px solid color-mix(in srgb, var(--accent) 12%, transparent);
  box-shadow: inset 0 1px 0 color-mix(in srgb, #ffffff 6%, transparent);
}

:root.dark .empty-projects__icon {
  box-shadow: inset 0 1px 0 color-mix(in srgb, #ffffff 4%, transparent);
}

.empty-projects__icon-svg {
  color: var(--fg-muted);
  opacity: 0.92;
}

.empty-projects__copy {
  max-width: 100%;
}

@keyframes skeleton-shimmer {
  from {
    opacity: 0.55;
  }

  to {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .projects-carousel__slide {
    transition: none;
    opacity: 1;
  }

  .skeleton-dashboard {
    animation: none;
  }

  .projects-carousel__dot::after {
    transition: none;
  }
}
</style>
