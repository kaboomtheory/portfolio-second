<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { TrinketItem } from '~/data/trinkets'

defineProps<{
  open: boolean
  trinket: TrinketItem | null
}>()

const emit = defineEmits<{
  close: []
}>()

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open && trinket"
        class="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4"
        @click.self="emit('close')"
      >
        <article class="w-full max-w-md overflow-hidden rounded border" :style="{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }">
          <div class="relative">
            <img :src="trinket.image" :alt="trinket.name" class="aspect-square w-full object-cover">
            <button
              type="button"
              class="absolute right-3 top-3 rounded-full p-2"
              :style="{ backgroundColor: 'var(--bg-secondary)' }"
              @click="emit('close')"
            >
              <Icon icon="lucide:x" />
            </button>
          </div>
          <div class="space-y-3 p-5">
            <p class="text-xs uppercase tracking-[0.08em] muted">{{ trinket.brand }}</p>
            <h3 class="text-2xl">{{ trinket.name }}</h3>
            <p class="text-sm">{{ trinket.description }}</p>
            <a
              :href="trinket.link"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center rounded-md border px-4 py-2 text-xs uppercase tracking-[0.08em]"
              :style="{ borderColor: 'var(--border)', color: 'var(--fg-secondary)' }"
            >
              View Product
            </a>
          </div>
        </article>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 220ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
