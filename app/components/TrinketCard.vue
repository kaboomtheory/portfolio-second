<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { TrinketItem } from '~/data/trinkets'

defineProps<{
  trinket: TrinketItem
}>()

const emit = defineEmits<{
  select: [TrinketItem]
}>()
</script>

<template>
  <button
    type="button"
    class="group w-full overflow-hidden rounded-xl border text-left transition-transform duration-200 hover:-translate-y-1"
    :style="{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-secondary)' }"
    @click="emit('select', trinket)"
  >
    <img :src="trinket.image" :alt="trinket.name" class="aspect-square w-full object-cover">
    <div class="space-y-1 p-4">
      <p class="text-xs uppercase tracking-[0.08em] muted">{{ trinket.brand }}</p>
      <div class="flex items-center justify-between gap-2">
        <h3 class="text-lg">{{ trinket.name }}</h3>
        <Icon icon="lucide:arrow-up-right" class="text-base" :style="{ color: 'var(--fg-muted)' }" />
      </div>
    </div>
  </button>
</template>
