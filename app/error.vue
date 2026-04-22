<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const code = computed(() => props.error.statusCode ?? 500)

const heading = computed(() => {
  if (props.error.statusCode === 404) {
    return 'Page not found'
  }
  return 'Something went wrong'
})

const detail = computed(
  () => props.error.message || props.error.statusMessage || 'An unexpected error occurred.',
)

function goHome() {
  clearError({ redirect: '/' })
}

function tryAgain() {
  clearError()
}
</script>

<template>
  <NuxtLayout name="default">
    <div class="error-panel page-content py-16 text-center">
      <p
        class="text-xs font-medium uppercase tracking-[0.14em]"
        :style="{ color: 'var(--fg-muted)' }"
      >
        Error {{ code }}
      </p>
      <h1
        class="mt-3 text-3xl font-bold tracking-tight md:text-4xl"
        :style="{ color: 'var(--fg-primary)' }"
      >
        {{ heading }}
      </h1>
      <p
        class="mx-auto mt-4 max-w-md text-base leading-relaxed"
        :style="{ color: 'var(--fg-secondary)' }"
      >
        {{ detail }}
      </p>
      <div class="mt-10 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          class="error-panel__primary rounded-md px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.1em]"
          :style="{
            backgroundColor: 'var(--pastel-mint)',
            color: 'var(--pastel-ink)',
            border: '1px solid color-mix(in srgb, var(--pastel-ink) 18%, var(--pastel-mint))',
          }"
          @click="tryAgain"
        >
          Try again
        </button>
        <button
          type="button"
          class="error-panel__ghost rounded-md px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.1em]"
          :style="{
            backgroundColor: 'var(--pastel-peach)',
            color: 'var(--pastel-ink)',
            border: '1px solid color-mix(in srgb, var(--pastel-ink) 18%, var(--pastel-peach))',
          }"
          @click="goHome"
        >
          Back to home
        </button>
      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped>
.error-panel {
  --fg-primary: var(--pastel-ink);
  --fg-secondary: var(--pastel-ink-muted);
  --fg-muted: color-mix(in srgb, var(--pastel-ink) 48%, var(--pastel-sky));
  margin-left: auto;
  margin-right: auto;
  max-width: 36rem;
  padding: 2.5rem 1.5rem;
  border-radius: 1rem;
  background: var(--pastel-sky);
  color: var(--pastel-ink);
}

.error-panel__primary,
.error-panel__ghost {
  cursor: pointer;
  transition:
    background-color 0.2s cubic-bezier(0.25, 1, 0.5, 1),
    border-color 0.2s cubic-bezier(0.25, 1, 0.5, 1),
    box-shadow 0.22s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.18s cubic-bezier(0.22, 1, 0.36, 1);
}

.error-panel__primary:hover {
  transform: translate3d(0, -1px, 0);
  box-shadow: var(--shadow-sm);
}

.error-panel__primary:active {
  transform: translate3d(0, 0.5px, 0) scale(0.99);
}

.error-panel__ghost:hover {
  transform: translate3d(0, -1px, 0);
  box-shadow: var(--shadow-sm);
  filter: brightness(0.97);
}

.error-panel__ghost:active {
  transform: translate3d(0, 0.5px, 0) scale(0.99);
}

@media (prefers-reduced-motion: reduce) {
  .error-panel__primary,
  .error-panel__ghost {
    transition: none;
  }

  .error-panel__primary:hover,
  .error-panel__primary:active,
  .error-panel__ghost:hover,
  .error-panel__ghost:active {
    transform: none;
    box-shadow: none;
    filter: none;
  }
}
</style>
