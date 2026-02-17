<script setup lang="ts">
import type { TrinketItem } from '~/data/trinkets'

const { trinkets } = useMockContent()
const activeTrinket = ref<TrinketItem | null>(null)

useHead({ title: 'Trinkets' })
</script>

<template>
  <div class="page-content">
    <PageHeader
      title="Trinkets"
      description="A placeholder collection of useful objects, small tools, and favorite desk companions."
    />

    <section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <TrinketCard
        v-for="item in trinkets"
        :key="item.id"
        :trinket="item"
        @select="activeTrinket = item"
      />
    </section>

    <TrinketModal :open="Boolean(activeTrinket)" :trinket="activeTrinket" @close="activeTrinket = null" />
  </div>
</template>
