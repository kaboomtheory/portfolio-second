<script setup lang="ts">
import lucideIcons from '@iconify-json/lucide/icons.json'
import remixIcons from '@iconify-json/ri/icons.json'
import { buildIcon, replaceIDs } from '@iconify/vue'

defineOptions({
  inheritAttrs: false,
})

type IconCollection = {
  width?: number
  height?: number
  icons: Record<string, {
    body: string
    width?: number
    height?: number
    left?: number
    top?: number
    hFlip?: boolean
    vFlip?: boolean
    rotate?: number
  }>
}

const props = defineProps<{
  icon: string
}>()

const attrs = useAttrs()

const collections: Record<string, IconCollection> = {
  lucide: lucideIcons as IconCollection,
  ri: remixIcons as IconCollection,
}

const renderedIcon = computed(() => {
  const [prefix, name] = props.icon.split(':')
  if (!prefix || !name) return null

  const collection = collections[prefix]
  const icon = collection?.icons?.[name]

  if (!collection || !icon) {
    if (import.meta.dev) {
      console.warn(`[AppIcon] Unknown icon: ${props.icon}`)
    }
    return null
  }

  const built = buildIcon({
    ...icon,
    width: icon.width || collection.width || 24,
    height: icon.height || collection.height || 24,
    left: icon.left || 0,
    top: icon.top || 0,
  }, {
    width: '1em',
    height: '1em',
  })

  return {
    body: replaceIDs(built.body),
    attrs: built.attributes,
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
