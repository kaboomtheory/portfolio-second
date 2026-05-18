<script setup lang="ts">
import { PortableText } from '@portabletext/vue'
import type { PortableTextBlock } from '@portabletext/types'
import { storyPortableTextComponents } from '~/utils/storyPortableText'

defineProps<{
  value: PortableTextBlock[]
}>()
</script>

<template>
  <PortableText :value="value" :components="storyPortableTextComponents" />
</template>
