<script setup lang="ts">
import { Icon } from '@iconify/vue'

const { isDark, toggle } = useTheme()
</script>

<template>
  <button
    type="button"
    class="relative inline-flex h-9 w-[78px] items-center rounded-full px-2 transition-all duration-300 hover:scale-105 active:scale-95"
    :style="{
      backgroundColor: 'var(--bg-primary)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
    }"
    :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
    :aria-pressed="isDark"
    @click="toggle"
  >
    <span
      class="relative z-0 flex w-full items-center justify-between px-0.5 text-sm pointer-events-none"
      :style="{ color: 'var(--fg-muted)' }"
    >
      <Icon
        icon="lucide:sun"
        class="h-4 w-4 shrink-0 transition-all duration-300"
        :class="isDark ? 'opacity-40 scale-75' : 'opacity-100 scale-100'"
        aria-hidden="true"
      />
      <Icon
        icon="lucide:moon"
        class="h-4 w-4 shrink-0 transition-all duration-300"
        :class="!isDark ? 'opacity-40 scale-75' : 'opacity-100 scale-100'"
        aria-hidden="true"
      />
    </span>
    <span
      class="pointer-events-none absolute left-2 z-10 flex h-7 w-7 items-center justify-center rounded-full transition-transform"
      :style="{
        transform: isDark ? 'translateX(38px)' : 'translateX(0)',
        backgroundColor: isDark ? 'rgba(10, 15, 30, 0.85)' : 'rgba(255, 255, 255, 0.9)',
        boxShadow: 'var(--shadow-sm)',
      }"
    >
      <Icon
        :key="isDark ? 'moon' : 'sun'"
        :icon="isDark ? 'lucide:moon' : 'lucide:sun'"
        class="h-4 w-4 shrink-0"
        :style="{ color: 'var(--fg-secondary)' }"
        aria-hidden="true"
      />
    </span>
  </button>
</template>
