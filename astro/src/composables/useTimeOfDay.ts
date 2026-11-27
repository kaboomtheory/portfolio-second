import { computed, onMounted, ref } from 'vue'

function getAmbientTone(hour: number) {
  if (hour >= 6 && hour <= 11) return 'morning'
  if (hour >= 18 && hour <= 22) return 'evening'
  if (hour >= 23 || hour <= 5) return 'night'
  return 'none'
}

export function useTimeOfDay() {
  const hour = ref<number | null>(null)

  onMounted(() => {
    hour.value = new Date().getHours()
  })

  const ambientTone = computed(() => {
    if (hour.value == null) return 'none'
    return getAmbientTone(hour.value)
  })

  return {
    ambientTone,
  }
}
