<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    to?: string
    href?: string
    label: string
    secondary?: boolean
    withDot?: boolean
  }>(),
  {
    to: undefined,
    href: undefined,
    secondary: false,
    withDot: false,
  }
)

const isExternal = computed(() => Boolean(props.href))
</script>

<template>
  <NuxtLink
    v-if="!isExternal"
    :to="to"
    class="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-xs uppercase tracking-[0.1em] transition-opacity hover:opacity-85"
    :style="{
      backgroundColor: secondary ? 'transparent' : 'var(--fg-secondary)',
      borderColor: 'var(--border)',
      color: secondary ? 'var(--fg-secondary)' : 'var(--bg-primary)',
    }"
  >
    <span v-if="withDot" class="inline-block h-2 w-2 rounded-full" :style="{ backgroundColor: 'var(--accent)' }" />
    {{ label }}
  </NuxtLink>
  <a
    v-else
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    class="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-xs uppercase tracking-[0.1em] transition-opacity hover:opacity-85"
    :style="{
      backgroundColor: secondary ? 'transparent' : 'var(--fg-secondary)',
      borderColor: 'var(--border)',
      color: secondary ? 'var(--fg-secondary)' : 'var(--bg-primary)',
    }"
  >
    <span v-if="withDot" class="inline-block h-2 w-2 rounded-full" :style="{ backgroundColor: 'var(--accent)' }" />
    {{ label }}
  </a>
</template>
