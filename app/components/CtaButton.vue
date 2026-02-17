<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    to?: string
    href?: string
    label: string
    secondary?: boolean
    withDot?: boolean
    attention?: boolean
  }>(),
  {
    to: undefined,
    href: undefined,
    secondary: false,
    withDot: false,
    attention: false,
  }
)

const btnClass = 'inline-flex items-center gap-2 rounded-md border px-4 py-2 text-xs uppercase tracking-[0.1em] transition-opacity hover:opacity-85'
</script>

<template>
  <a
    v-if="href"
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    :class="[btnClass, attention && 'btn-attention']"
    :style="{
      backgroundColor: secondary ? 'transparent' : 'var(--fg-secondary)',
      borderColor: 'var(--border)',
      color: secondary ? 'var(--fg-secondary)' : 'var(--bg-primary)',
    }"
  >
    <span v-if="withDot" class="inline-block h-2 w-2 rounded-full pulse-glow" :style="{ backgroundColor: 'var(--accent)' }" />
    {{ label }}
  </a>
  <NuxtLink
    v-else-if="to"
    :to="to"
    :class="[btnClass, attention && 'btn-attention']"
    :style="{
      backgroundColor: secondary ? 'transparent' : 'var(--fg-secondary)',
      borderColor: 'var(--border)',
      color: secondary ? 'var(--fg-secondary)' : 'var(--bg-primary)',
    }"
  >
    <span v-if="withDot" class="inline-block h-2 w-2 rounded-full pulse-glow" :style="{ backgroundColor: 'var(--accent)' }" />
    {{ label }}
  </NuxtLink>
</template>
