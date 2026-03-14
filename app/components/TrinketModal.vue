<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { TrinketItem } from '~/data/trinkets'

const props = defineProps<{
  open: boolean
  trinket: TrinketItem | null
}>()

const emit = defineEmits<{
  close: []
}>()

const modalRef = ref<HTMLElement | null>(null)
const triggerElement = ref<HTMLElement | null>(null)

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    emit('close')
  }
}

function trapFocus(event: KeyboardEvent) {
  if (!modalRef.value || event.key !== 'Tab') return

  const focusableElements = modalRef.value.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  const firstElement = focusableElements[0] as HTMLElement
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault()
    lastElement?.focus()
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault()
    firstElement?.focus()
  }
}

watch(() => props.open, (isOpen) => {
  if (isOpen) {
    triggerElement.value = document.activeElement as HTMLElement
    nextTick(() => {
      const firstFocusable = modalRef.value?.querySelector('button, [href], [tabindex]:not([tabindex="-1"])') as HTMLElement
      firstFocusable?.focus()
    })
    document.addEventListener('keydown', trapFocus)
  } else {
    document.removeEventListener('keydown', trapFocus)
    triggerElement.value?.focus()
  }
})

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.removeEventListener('keydown', trapFocus)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open && trinket"
        ref="modalRef"
        role="dialog"
        aria-modal="true"
        :aria-label="trinket.name"
        class="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4"
        @click.self="emit('close')"
      >
        <article class="w-full max-w-md overflow-hidden rounded border" :style="{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }">
          <div class="relative">
            <img :src="trinket.image" :alt="trinket.name" class="aspect-square w-full object-cover">
            <button
              type="button"
              aria-label="Close dialog"
              class="absolute right-3 top-3 rounded-full p-2"
              :style="{ backgroundColor: 'var(--bg-secondary)' }"
              @click="emit('close')"
            >
              <Icon icon="lucide:x" aria-hidden="true" />
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
              class="inline-flex items-center gap-1 rounded-md border px-4 py-2 text-xs uppercase tracking-[0.08em]"
              :style="{ borderColor: 'var(--border)', color: 'var(--fg-secondary)' }"
            >
              View Product
              <span class="sr-only">(opens in new tab)</span>
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
