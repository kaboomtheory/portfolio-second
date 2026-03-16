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
  <div :class="['group relative rounded-xl border border-[var(--border)] bg-[var(--bg-tertiary)] transition-all duration-400 hover:border-[var(--accent)]/40 hover:shadow-[0_0_30px_-5px_var(--accent)/20] hover:scale-[1.02]', props.class]">
    <NuxtLink
      ref="cardRef"
      class="block h-full p-2.5"
      :style="{
        '--mouse-x': `${mouseX}px`,
        '--mouse-y': `${mouseY}px`
      }"
      :to="`/projects/${project.slug}`"
      @mousemove="handleMouseMove"
    >
      <div
        class="pointer-events-none absolute -inset-px z-30 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        :style="{
          background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.15), transparent 40%)`
        }"
      />

      <div class="flex h-full flex-col">
        <div class="relative min-h-0 flex-1 overflow-hidden rounded-lg">
          <img
            :src="project.thumbnail"
            :alt="project.name"
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-0" />
        </div>
        <div class="mt-3 flex shrink-0 items-start justify-between gap-3 px-1">
          <div class="space-y-1.5">
            <p class="text-[0.65rem] uppercase tracking-[0.12em] text-[var(--fg-muted)]">
              {{ project.category }} • {{ project.year }}
            </p>
            <h3 class="text-xl font-semibold text-[var(--fg-primary)] transition-colors duration-300 group-hover:text-[var(--accent)]">
              {{ project.name }}
            </h3>
          </div>
          <span
            class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[var(--bg-secondary)] text-[var(--fg-muted)] transition-all duration-300 group-hover:bg-[var(--accent)] group-hover:text-[var(--bg-primary)] group-hover:shadow-[0_0_15px_var(--accent)/50] group-hover:rotate-45 group-hover:[translate:2px_-2px]"
          >
            <Icon icon="lucide:arrow-up-right" class="text-lg transition-transform duration-300" />
          </span>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>
