<script setup lang="ts">
/**
 * Contact block on the home page: heading, pill buttons, and the message form,
 * which opens in place. Same /api/contact request and Turnstile check as before.
 */
import { useRuntimeConfig } from '~/shims/nuxt'
import { computed, nextTick, ref } from 'vue'
import TurnstileWidget from '~/components/TurnstileWidget.vue'
import { socialLinks } from '~/data/site'

const props = defineProps<{
  linkedinHref?: string
}>()

const resolvedLinkedin = computed(() => {
  if (props.linkedinHref) return props.linkedinHref
  const found = socialLinks.find((l) => /linkedin/i.test(l.label))
  return found?.href ?? 'https://www.linkedin.com/in/bryan-mendez/'
})

const name = ref('')
const email = ref('')
const subject = ref('')
const message = ref('')
const website = ref('')
const turnstileToken = ref('')
const turnstileRef = ref<InstanceType<typeof TurnstileWidget> | null>(null)
const turnstileDisabled = useRuntimeConfig().public.turnstileDisabled

const submitting = ref(false)
const success = ref(false)
const formError = ref('')
const sentName = ref('')
const nameInputRef = ref<HTMLInputElement | null>(null)
const open = ref(false)

async function openForm() {
  open.value = true
  await nextTick()
  nameInputRef.value?.focus()
}

const thankYouFirstName = computed(() => {
  const raw = sentName.value.trim()
  if (!raw) return ''
  return raw.split(/\s+/)[0] ?? ''
})


function getFetchStatus(e: unknown): number | undefined {
  return (e as { statusCode?: number })?.statusCode ?? (e as { response?: { status?: number } })?.response?.status
}

function getFetchMessage(e: unknown): string | undefined {
  const err = e as {
    statusMessage?: string
    message?: string
    data?: { statusMessage?: string, message?: string }
  }
  return (
    err.data?.statusMessage
    || err.data?.message
    || err.statusMessage
    || err.message
  )
}

async function onSubmit() {
  formError.value = ''
  success.value = false
  if (!turnstileDisabled && !turnstileToken.value) {
    formError.value = 'Complete the verification challenge first.'
    return
  }
  submitting.value = true
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        subject: subject.value,
        message: message.value,
        website: website.value,
        turnstileToken: turnstileToken.value,
      }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw { statusCode: res.status, data }
    }
    sentName.value = name.value.trim()
    success.value = true
    name.value = ''
    email.value = ''
    subject.value = ''
    message.value = ''
    website.value = ''
    turnstileRef.value?.reset()
  } catch (e: unknown) {
    const status = getFetchStatus(e)
    const msg = getFetchMessage(e)
    if (status === 429) {
      formError.value = 'Too many attempts. Please wait a moment and try again.'
    } else if (status === 403) {
      formError.value = 'Verification failed. Please complete the challenge again.'
    } else if (status === 503 || status === 502) {
      formError.value = msg || 'Could not send your message. Check Resend domain verification and try again.'
    } else if (status === 400) {
      formError.value = msg || 'Please check the fields and try again.'
    } else {
      formError.value = 'Something went wrong sending your message. Please try again later.'
    }
    turnstileRef.value?.reset()
  } finally {
    submitting.value = false
  }
}

async function sendAnother() {
  formError.value = ''
  sentName.value = ''
  success.value = false
  open.value = true
  await nextTick()
  nameInputRef.value?.focus()
}

</script>

<template>
  <div class="bxc">
    <p class="bx-sec">§ 03 · <span class="bx-q">Contact</span></p>
    <h2 id="contact-heading" class="bxc__h">Let's work together.</h2>

    <div v-if="!open && !success" class="bxc__actions">
      <button type="button" class="bx-pill bx-pill--ink" aria-controls="contact-form" :aria-expanded="open" @click="openForm">
        Send a message
      </button>
      <a :href="resolvedLinkedin" class="bx-pill bx-pill--line" target="_blank" rel="noopener noreferrer">
        LinkedIn<span class="bx-sr"> (opens in new tab)</span>
      </a>
    </div>

    <form v-else-if="!success" id="contact-form" class="bxc__form" novalidate @submit.prevent="onSubmit">
      <div class="bxc__row">
        <label class="bxc__field">
          <span class="bx-label">Name</span>
          <input ref="nameInputRef" v-model="name" type="text" name="name" autocomplete="name" required maxlength="120" :disabled="submitting">
        </label>
        <label class="bxc__field">
          <span class="bx-label">Email</span>
          <input v-model="email" type="email" name="email" autocomplete="email" required maxlength="254" :disabled="submitting">
        </label>
      </div>
      <label class="bxc__field">
        <span class="bx-label">Subject <span class="bxc__opt">optional</span></span>
        <input v-model="subject" type="text" name="subject" autocomplete="off" maxlength="200" :disabled="submitting">
      </label>
      <label class="bxc__field">
        <span class="bx-label">Message</span>
        <textarea v-model="message" name="message" rows="4" required maxlength="10000" :disabled="submitting" />
      </label>
      <label class="bxc__hp" aria-hidden="true">
        <span>Website</span>
        <input v-model="website" tabindex="-1" autocomplete="off" type="text" name="website">
      </label>
      <p v-if="formError" class="bxc__error" role="alert">{{ formError }}</p>
      <TurnstileWidget
        v-if="!turnstileDisabled"
        ref="turnstileRef"
        v-model="turnstileToken"
        action="contact"
        :ready="open"
        @error="formError = $event"
      />
      <div class="bxc__actions">
        <button type="submit" class="bx-pill bx-pill--ink" :disabled="submitting || (!turnstileDisabled && !turnstileToken)">
          {{ submitting ? 'Sending' : 'Send message' }}
        </button>
        <a :href="resolvedLinkedin" class="bx-pill bx-pill--line" target="_blank" rel="noopener noreferrer">
          LinkedIn<span class="bx-sr"> (opens in new tab)</span>
        </a>
      </div>
    </form>

    <div v-else class="bxc__done" role="status" aria-live="assertive" tabindex="-1">
      <p class="bx-label"><span class="bx-q">Sent</span></p>
      <p class="bxc__lead">Thanks{{ thankYouFirstName ? `, ${thankYouFirstName}` : '' }}. I'll reply as soon as I can.</p>
      <button type="button" class="bx-pill bx-pill--line bx-pill--sm" @click="sendAnother">Send another</button>
    </div>
  </div>
</template>

<style scoped>
.bxc {
  display: flex;
  flex-direction: column;
  gap: 26px;
  padding-top: 32px;
  border-top: 1.5px solid var(--bx-ink);
  min-width: 0;
}

.bxc__h {
  margin: 0;
  font-weight: 700;
  font-size: clamp(44px, 5vw, 61px);
  line-height: 0.95;
  letter-spacing: -0.045em;
  text-wrap: balance;
}

.bxc__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.bxc__form {
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-width: 640px;
}

.bxc__row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

@media (max-width: 560px) {
  .bxc__row {
    grid-template-columns: 1fr;
  }
}

.bxc__field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.bxc__opt {
  font-weight: 500;
  text-transform: none;
  letter-spacing: 0;
}

.bxc__field input,
.bxc__field textarea {
  box-sizing: border-box;
  width: 100%;
  padding: 14px 16px;
  border-radius: 6px;
  border: 1.5px solid var(--bx-ink);
  background: var(--bx-white);
  color: var(--bx-ink);
  font: 500 16px/1.4 var(--bx-sans);
  resize: vertical;
}

.bxc__field input:focus,
.bxc__field textarea:focus {
  outline: 2px solid var(--bx-signal);
  outline-offset: 2px;
}

.bxc__hp {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.bxc__error {
  margin: 0;
  color: #b3261e;
  font-weight: 500;
}

.bxc button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.bxc__done {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  outline: none;
}

.bxc__done .bx-label {
  color: var(--bx-signal);
}

.bxc__lead {
  margin: 0;
  font-size: 22px;
  line-height: 1.4;
}
</style>
