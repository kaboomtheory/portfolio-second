<script setup lang="ts">
import { Icon } from '@iconify/vue'

const { isDark, toggle } = useTheme()
</script>

<template>
  <button
    type="button"
    class="relative inline-flex h-9 w-[78px] items-center rounded-full border px-2 transition-all duration-300 hover:scale-105 active:scale-95"
    :style="{
      borderColor: 'var(--border)',
      backgroundColor: 'var(--bg-secondary)',
    }"
    :title="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
    @click="toggle"
  >
    <span
      class="absolute h-7 w-7 rounded-full transition-transform"
      :style="{
        transform: isDark ? 'translateX(38px)' : 'translateX(0)',
        backgroundColor: 'var(--bg-primary)',
      }"
    />
    <span class="relative z-10 flex w-full justify-between text-sm" :style="{ color: 'var(--fg-secondary)' }">
      <Icon icon="lucide:sun" />
      <Icon icon="lucide:moon" />
    </span>
  </button>
</template>
