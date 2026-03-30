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
          class="rounded-md px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] transition-colors"
          :style="{
            backgroundColor: 'var(--bg-tertiary)',
            color: 'var(--fg-primary)',
          }"
          @click="tryAgain"
        >
          Try again
        </button>
        <button
          type="button"
          class="rounded-md px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] transition-opacity hover:opacity-90"
          :style="{
            backgroundColor: 'var(--emphasis)',
            color: 'var(--on-emphasis)',
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
  margin-left: auto;
  margin-right: auto;
  max-width: 36rem;
  padding: 2.5rem 1.5rem;
  border-radius: 1rem;
  background: var(--bg-secondary);
}
</style>
