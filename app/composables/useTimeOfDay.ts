import { computed, onMounted, ref } from 'vue'

function getAmbientTint(hour: number) {
  if (hour >= 6 && hour <= 11) return 'oklch(0.72 0.02 240)'
  if (hour >= 18 && hour <= 22) return 'oklch(0.76 0.025 55)'
  if (hour >= 23 || hour <= 5) return 'oklch(0.62 0.018 255)'
  return 'transparent'
}

export function useTimeOfDay() {
  const hour = ref<number | null>(null)

  onMounted(() => {
    hour.value = new Date().getHours()
  })

  const ambientTint = computed(() => {
    if (hour.value == null) return 'transparent'
    return getAmbientTint(hour.value)
  })

  return {
    ambientTint,
  }
}
