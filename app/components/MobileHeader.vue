<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { profile } from '~/data/site'

defineProps<{
  isOpen?: boolean
}>()

const emit = defineEmits<{
  toggle: []
}>()
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-[80] border-b p-4 md:hidden"
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
        aria-label="Toggle navigation"
        class="inline-flex h-11 w-11 items-center justify-center -mr-2"
        @click="emit('toggle')"
      >
        <span class="relative flex h-5 w-5 items-center justify-center">
          <Icon
            icon="lucide:menu"
            class="absolute text-xl transition-all duration-300"
            :class="isOpen ? 'scale-0 opacity-0 rotate-90' : 'scale-100 opacity-100 rotate-0'"
          />
          <Icon
            icon="lucide:x"
            class="absolute text-xl transition-all duration-300"
            :class="isOpen ? 'scale-100 opacity-100 rotate-0' : 'scale-0 opacity-0 -rotate-90'"
          />
        </span>
      </button>
    </div>
  </header>
</template>
