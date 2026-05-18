<script setup lang="ts">
type TurnstileTheme = 'auto' | 'light' | 'dark'

const props = withDefaults(defineProps<{
  modelValue?: string
  theme?: TurnstileTheme
  action?: string
  /** Wait until true before loading Turnstile (e.g. after scroll-reveal). */
  ready?: boolean
}>(), {
  modelValue: '',
  theme: 'auto',
  action: 'submit',
  ready: true,
})

const emit = defineEmits<{
  'update:modelValue': [token: string]
  error: [message: string]
}>()

const { turnstileSiteKey } = useRuntimeConfig().public
const containerRef = ref<HTMLElement | null>(null)
const widgetId = ref<string | number | null>(null)
const loading = ref(false)
let loadPromise: Promise<void> | null = null

function turnstileHostErrorMessage(): string {
  const host = window.location.hostname
  const keyHint = turnstileSiteKey ? `${turnstileSiteKey.slice(0, 12)}…` : 'your site key'
  return `Security check failed for “${host}”. In Cloudflare Turnstile → widget (${keyHint}) → Hostname management, add ${host} (hostname only, no https://), save, then refresh.`
}

function getTurnstile(): Turnstile | undefined {
  return window.turnstile
}

function loadTurnstileScript(): Promise<void> {
  if (loadPromise) return loadPromise
  if (getTurnstile()) return Promise.resolve()

  loadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-turnstile-script="true"]',
    )

    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error('Turnstile failed to load')), {
        once: true,
      })
      return
    }

    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true
    script.defer = true
    script.setAttribute('data-turnstile-script', 'true')
    script.addEventListener('load', () => resolve(), { once: true })
    script.addEventListener('error', () => reject(new Error('Turnstile failed to load')), {
      once: true,
    })
    document.head.appendChild(script)
  })

  return loadPromise
}

function clearToken() {
  emit('update:modelValue', '')
}

async function renderWidget() {
  if (!import.meta.client || !containerRef.value || !turnstileSiteKey || widgetId.value != null) return

  loading.value = true

  try {
    await loadTurnstileScript()
    const turnstile = getTurnstile()
    if (!turnstile || !containerRef.value) return

    if (widgetId.value != null) {
      turnstile.remove(widgetId.value)
      widgetId.value = null
    }

    widgetId.value = turnstile.render(containerRef.value, {
      sitekey: turnstileSiteKey,
      theme: props.theme,
      action: props.action,
      callback(token: string) {
        emit('update:modelValue', token)
      },
      'expired-callback'() {
        clearToken()
      },
      'error-callback'() {
        clearToken()
        emit('error', turnstileHostErrorMessage())
      },
    })
  } finally {
    loading.value = false
  }
}

function reset() {
  const turnstile = getTurnstile()
  clearToken()
  if (turnstile && widgetId.value != null) {
    turnstile.reset(widgetId.value)
  }
}

defineExpose({ reset })

watch(
  () => props.ready,
  async (ready) => {
    if (!ready || !turnstileSiteKey) return
    await nextTick()
    if (!containerRef.value) return
    renderWidget().catch(() => emit('error', turnstileHostErrorMessage()))
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  const turnstile = getTurnstile()
  if (turnstile && widgetId.value != null) {
    turnstile.remove(widgetId.value)
  }
})
</script>

<template>
  <div class="turnstile-widget">
    <div
      v-if="turnstileSiteKey"
      ref="containerRef"
      class="turnstile-widget__frame"
      :aria-busy="loading"
    />
    <p v-else class="turnstile-widget__error">
      Security verification is not configured.
    </p>
  </div>
</template>

<style scoped>
.turnstile-widget {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.turnstile-widget__frame {
  min-height: 65px;
}

.turnstile-widget__error {
  margin: 0;
  font-size: 0.8125rem;
  color: var(--danger);
}
</style>
