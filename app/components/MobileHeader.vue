<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { profile } from '~/data/site'

const emit = defineEmits<{
  open: []
}>()
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 border-b p-4 md:hidden"
    :style="{
      borderColor: 'var(--border)',
      backgroundColor: 'color-mix(in srgb, var(--bg-primary) 90%, transparent)',
      backdropFilter: 'blur(24px)',
    }"
  >
    <div class="flex items-center justify-between gap-3">
      <NuxtLink to="/" class="inline-flex items-center gap-2">
        <img :src="profile.photo" :alt="`${profile.name} logo`" class="h-8 w-8 rounded-md object-cover">
        <span class="text-xs font-semibold uppercase tracking-[0.08em]" :style="{ color: 'var(--fg-primary)' }">
          {{ profile.name }}
        </span>
      </NuxtLink>

      <ThemeToggle />

      <button
        type="button"
        aria-label="Open navigation"
        class="inline-flex h-11 w-11 items-center justify-center -mr-2"
        @click="emit('open')"
      >
        <Icon icon="lucide:menu" class="text-xl" />
      </button>
    </div>
  </header>
</template>
