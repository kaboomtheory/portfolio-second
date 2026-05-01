<script setup lang="ts">
import TurnstileWidget from '~/components/TurnstileWidget.vue'
import { normalizeProjectSlug } from '~/utils/projectSlug'

const route = useRoute()
const router = useRouter()

const password = ref('')
const error = ref('')
const reveal = ref(false)
const submitting = ref(false)
const turnstileToken = ref('')
const turnstileRef = ref<InstanceType<typeof TurnstileWidget> | null>(null)
const turnstileDisabled = useRuntimeConfig().public.turnstileDisabled

const slug = computed(() => normalizeProjectSlug(route.params.slug))
const canSubmit = computed(() => Boolean(password.value.trim()) && (turnstileDisabled || Boolean(turnstileToken.value)) && !submitting.value)

async function submit() {
  error.value = ''
  if (!slug.value) {
    router.push('/')
    return
  }
  if (!password.value.trim()) {
    error.value = 'Please enter a password.'
    return
  }
  if (!turnstileDisabled && !turnstileToken.value) {
    error.value = 'Complete the verification challenge first.'
    return
  }

  submitting.value = true
  try {
    await $fetch('/api/project-unlock', {
      method: 'POST',
      body: {
        slug: slug.value,
        password: password.value,
        turnstileToken: turnstileToken.value,
      },
    })
    router.push(`/projects/${slug.value}`)
  } catch (e: unknown) {
    const status = (e as { statusCode?: number; response?: { status?: number } })?.statusCode
      ?? (e as { response?: { status?: number } })?.response?.status
    if (status === 429) {
      error.value = 'Too many attempts. Please wait a moment and try again.'
    } else if (status === 403) {
      error.value = 'Verification failed. Please try the challenge again.'
    } else {
      error.value = 'Incorrect password. Please try again.'
    }
    turnstileRef.value?.reset()
  } finally {
    submitting.value = false
  }
}

const { siteUrl } = useRuntimeConfig().public

const passwordCanonicalUrl = computed(() => {
  const path = route.path.startsWith('/password') ? route.path : '/password'
  return `${String(siteUrl).replace(/\/$/, '')}${path}`
})

useHead(() => ({
  title: 'Password Protected Project',
  link: [{ rel: 'canonical', href: passwordCanonicalUrl.value }],
}))

useSeoMeta({
  robots: 'noindex, nofollow',
})
</script>

<template>
  <div class="grid min-h-[70vh] place-items-center">
    <section class="card-surface pastel-grain-shadow w-full max-w-md space-y-4 p-6">
      <h1 class="text-3xl">Enter Password</h1>
      <p class="text-sm">
        This case study is protected. Enter the password to view it.
      </p>
      <form @submit.prevent="submit" class="space-y-4">
        <label class="space-y-2 text-sm">
          <span class="block text-xs uppercase tracking-[0.08em] muted">Password</span>
          <div class="relative">
            <input
              v-model="password"
              class="password-page__input w-full rounded-md px-3 py-2 pr-12 outline-none"
              :type="reveal ? 'text' : 'password'"
              placeholder="Enter password"
              autocomplete="current-password"
              :disabled="submitting"
            >
            <button
              type="button"
              class="password-page__toggle absolute right-2 top-1/2 -translate-y-1/2 text-xs uppercase tracking-[0.08em]"
              :aria-pressed="reveal"
              :aria-label="reveal ? 'Hide password' : 'Show password'"
              @click="reveal = !reveal"
            >
              {{ reveal ? 'Hide' : 'Show' }}
            </button>
          </div>
        </label>

        <TurnstileWidget
          v-if="!turnstileDisabled"
          ref="turnstileRef"
          v-model="turnstileToken"
          action="project_unlock"
          @error="error = 'Verification failed to load. Refresh and try again.'"
        />

        <p v-if="error" class="password-page__error text-xs">{{ error }}</p>

        <button
          type="submit"
          class="password-page__submit rounded-md px-4 py-2 text-xs uppercase tracking-[0.08em]"
          :disabled="!canSubmit"
        >
          {{ submitting ? 'Checking…' : 'Let me in' }}
        </button>
      </form>
    </section>
  </div>
</template>

<style scoped>
.password-page__input {
  background-color: var(--bg-primary);
}

.password-page__toggle {
  color: var(--fg-muted);
}

.password-page__error {
  color: var(--danger);
}

.password-page__submit {
  background-color: var(--pastel-mint);
  color: var(--pastel-ink);
  border: 1px solid color-mix(in srgb, var(--pastel-ink) 18%, var(--pastel-mint));
}

.password-page__submit:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
