<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useTimeOfDay } from '~/composables/useTimeOfDay'

const { ambientTone } = useTimeOfDay()

const greetingByTone: Record<string, string> = {
  morning: 'Made with coffee in Los Angeles',
  evening: 'Made after-hours in Los Angeles',
  night: 'Made past bedtime in Los Angeles',
  none: 'Made with care in Los Angeles',
}

const mounted = ref(false)
onMounted(() => { mounted.value = true })

const greeting = computed(() =>
  mounted.value ? greetingByTone[ambientTone.value] ?? greetingByTone.none : greetingByTone.none,
)
</script>

<template>
  <footer class="footer">
    <p class="footer-content mx-auto max-w-[82rem] px-[clamp(1.25rem,3vw,2.5rem)]">
      <span class="footer-brand">&copy; 2026 Bryan X. Mendez</span>
      <span aria-hidden="true"> · </span>
      <span class="footer-meta">{{ greeting }}</span>
    </p>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: clamp(2.5rem, 5vw, 4rem);
  padding: var(--space-md) 0;
}

.footer-brand {
  font-weight: 500;
}

.footer-content {
  margin-top: clamp(1.1rem, 2.2vw, 1.75rem);
  text-align: center;
  font-size: var(--label-size);
  letter-spacing: 0.02em;
}

.footer-meta {
  font-style: italic;
  font-family: var(--font-serif);
  letter-spacing: 0;
}
</style>
