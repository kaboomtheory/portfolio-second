<script setup lang="ts">
const now = ref(new Date())
let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timer = setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer)
  }
})

const dateLabel = computed(() => {
  const month = String(now.value.getMonth() + 1).padStart(2, '0')
  const day = String(now.value.getDate()).padStart(2, '0')
  return `${month}.${day}`
})

const hour = computed(() => {
  const hours = now.value.getHours() % 12 || 12
  return String(hours).padStart(2, '0')
})

const minute = computed(() => String(now.value.getMinutes()).padStart(2, '0'))
const meridiem = computed(() => (now.value.getHours() >= 12 ? 'PM' : 'AM'))

const timezoneLabel = computed(() => {
  try {
    const tz = Intl.DateTimeFormat('en', { timeZoneName: 'short' })
      .formatToParts(now.value)
      .find(p => p.type === 'timeZoneName')
    return tz?.value || 'Local'
  } catch {
    return 'Local'
  }
})
</script>

<template>
  <div class="space-y-1">
    <p class="text-[12px] uppercase tracking-[0.08em] muted">Local Time ({{ timezoneLabel }})</p>
    <p class="text-[12px] font-semibold tracking-[0.05em]" :style="{ color: 'var(--fg-primary)' }">
      {{ dateLabel }} / {{ hour }} : {{ minute }} {{ meridiem }}
    </p>
  </div>
</template>
