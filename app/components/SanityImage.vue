<script setup lang="ts">
import { isSanityCdnUrl } from '~/utils/sanity'

interface Props {
  src: string
  alt?: string
  sizes?: string
  width?: string | number
  height?: string | number
  loading?: 'lazy' | 'eager'
  decoding?: 'async' | 'auto' | 'sync'
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  sizes: undefined,
  width: undefined,
  height: undefined,
  loading: 'lazy',
  decoding: 'async',
})

const emit = defineEmits<{
  load: [event: Event]
}>()

const isSanityCdn = computed(() => isSanityCdnUrl(props.src))

function onLoad(event: Event) {
  emit('load', event)
}
</script>

<template>
  <img
    v-if="isSanityCdn"
    :src="src"
    :alt="alt"
    :sizes="sizes"
    :width="width"
    :height="height"
    :loading="loading"
    :decoding="decoding"
    @load="onLoad"
  >
  <NuxtImg
    v-else
    :src="src"
    :alt="alt"
    :sizes="sizes"
    :width="width"
    :height="height"
    :loading="loading"
    :decoding="decoding"
    @load="onLoad"
  />
</template>
