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
    <div class="footer-rule" aria-hidden="true" />
    <div class="footer-bottom mx-auto max-w-[82rem] px-[clamp(1.25rem,3vw,2.5rem)]">
      <div class="footer-row">
        <span class="footer-brand">&copy; 2026 Bryan X. Mendez</span>
        <span class="footer-dot" aria-hidden="true">·</span>
        <span class="footer-meta">{{ greeting }}</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: clamp(2.5rem, 5vw, 4rem);
}

.footer-rule {
  height: 1px;
  width: 100%;
  background: var(--rule);
  margin-bottom: clamp(0.9rem, 2vw, 1.4rem);
}

.footer-bottom {
  display: flex;
  justify-content: center;
  padding: var(--space-md) 0;
  font-size: var(--label-size);
  letter-spacing: 0.02em;
  color: var(--fg-muted);
  margin-top: clamp(1.1rem, 2.2vw, 1.75rem);
}

.footer-row {
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: baseline;
  gap: 0.5rem;
}

.footer-brand {
  font-weight: 500;
  color: color-mix(in srgb, var(--fg-primary) 72%, var(--fg-muted));
}

.footer-dot {
  color: var(--fg-muted);
  opacity: 0.55;
}

.footer-meta {
  font-style: italic;
  font-family: var(--font-serif);
  letter-spacing: 0;
  color: color-mix(in srgb, var(--fg-primary) 56%, var(--fg-muted));
}
</style>
