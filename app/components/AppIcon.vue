<script setup lang="ts">
import { iconRegistry } from '~/data/iconRegistry'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  icon: string
}>()

const attrs = useAttrs()

const renderedIcon = computed(() => {
  const icon = iconRegistry[props.icon as keyof typeof iconRegistry]

  if (!icon) {
    if (import.meta.dev) {
      console.warn(`[AppIcon] Unknown icon: ${props.icon}`)
    }
    return null
  }

  return {
    body: icon.body,
    attrs: {
      width: '1em',
      height: '1em',
      viewBox: `${icon.left ?? 0} ${icon.top ?? 0} ${icon.width} ${icon.height}`,
    },
  }
})

const svgAttrs = computed<Record<string, unknown>>(() => {
  const baseAttrs = renderedIcon.value?.attrs || {}
  const hasAccessibleLabel = Boolean(attrs['aria-label'] || attrs.role === 'img')
  const role = typeof attrs.role === 'string'
    ? attrs.role
    : (hasAccessibleLabel ? 'img' : 'presentation')

  return {
    ...baseAttrs,
    ...attrs,
    focusable: attrs.focusable || 'false',
    role,
    'aria-hidden': hasAccessibleLabel ? undefined : String(attrs['aria-hidden'] ?? 'true'),
  }
})
</script>

<template>
  <svg
    v-if="renderedIcon"
    v-bind="svgAttrs"
    v-html="renderedIcon.body"
  />
</template>
