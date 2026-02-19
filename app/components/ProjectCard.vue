<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { ProjectItem } from '~/data/projects'

defineProps<{
  project: ProjectItem
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
  <NuxtLink
    ref="cardRef"
    class="group relative block aspect-[4/3] overflow-hidden rounded-lg"
    :to="`/projects/${project.slug}`"
    @mousemove="handleMouseMove"
    :style="{
      '--mouse-x': `${mouseX}px`,
      '--mouse-y': `${mouseY}px`
    }"
  >
    <!-- Spotlight Overlay -->
    <div
      class="pointer-events-none absolute -inset-px z-30 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      :style="{
        background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.1), transparent 40%)`
      }"
    />

    <img
      :src="project.thumbnail"
      :alt="project.name"
      class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      loading="lazy"
    >
    <div
      class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90"
    />
    <div class="absolute inset-x-0 bottom-0 p-5 z-20">
      <div class="flex items-end justify-between gap-3">
        <div class="space-y-1">
          <p class="text-xs uppercase tracking-[0.08em] text-white/70">
            {{ project.category }} • {{ project.year }}
          </p>
          <h3 class="text-xl font-semibold text-white">
            {{ project.name }}
          </h3>
        </div>
        <span
          class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all duration-300 group-hover:bg-white group-hover:text-black"
        >
          <Icon icon="lucide:arrow-up-right" class="text-lg" />
        </span>
      </div>
    </div>
  </NuxtLink>
</template>
