<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { projectPasswords } = useMockContent()

const password = ref('')
const error = ref('')
const reveal = ref(false)

const slug = computed(() => {
  const source = route.params.slug
  return Array.isArray(source) ? source.join('/') : String(source || '')
})

function submit() {
  error.value = ''
  const expected = projectPasswords[slug.value]

  if (!expected) {
    router.push('/projects')
    return
  }

  if (password.value.trim() === expected) {
    localStorage.setItem(`entered_password_${slug.value}`, expected)
    router.push(`/projects/${slug.value}`)
    return
  }

  error.value = 'Incorrect password. Try placeholder value: letmein!2024'
}

useHead({ title: 'Password Protected Project' })
</script>

<template>
  <div class="grid min-h-[70vh] place-items-center">
    <section class="card-surface w-full max-w-md space-y-4 p-6">
      <h1 class="text-3xl">Enter Password</h1>
      <p class="text-sm">
        This case study is protected in the reference experience. Use the placeholder password for MVP access.
      </p>
      <form @submit.prevent="submit" class="space-y-4">
        <label class="space-y-2 text-sm">
          <span class="block text-xs uppercase tracking-[0.08em] muted">Password</span>
          <div class="relative">
            <input
              v-model="password"
              class="w-full rounded-md border px-3 py-2 pr-12 outline-none"
              :style="{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-primary)' }"
              :type="reveal ? 'text' : 'password'"
              placeholder="Enter password"
            >
            <button
              type="button"
              class="absolute right-2 top-1/2 -translate-y-1/2 text-xs uppercase tracking-[0.08em]"
              :style="{ color: 'var(--fg-muted)' }"
              @click="reveal = !reveal"
            >
              {{ reveal ? 'Hide' : 'Show' }}
            </button>
          </div>
        </label>

        <p v-if="error" class="text-xs" :style="{ color: 'var(--accent)' }">{{ error }}</p>

        <button
          type="submit"
          class="rounded-md border px-4 py-2 text-xs uppercase tracking-[0.08em]"
          :style="{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-tertiary)' }"
        >
          Let me in
        </button>
      </form>
    </section>
  </div>
</template>
