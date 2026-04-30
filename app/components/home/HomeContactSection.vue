<script setup lang="ts">
import { computed, ref } from 'vue'
import TurnstileWidget from '~/components/TurnstileWidget.vue'
import { socialLinks } from '~/data/site'

const props = defineProps<{
  linkedinHref?: string
}>()

const resolvedLinkedin = computed(() => {
  if (props.linkedinHref) return props.linkedinHref
  const found = socialLinks.find((l) => /linkedin/i.test(l.label))
  return found?.href ?? 'https://www.linkedin.com/'
})

const name = ref('')
const email = ref('')
const subject = ref('')
const message = ref('')
const website = ref('')
const turnstileToken = ref('')
const turnstileRef = ref<InstanceType<typeof TurnstileWidget> | null>(null)

const submitting = ref(false)
const success = ref(false)
const formError = ref('')

/* Magnetic submit button */
const submitRef = ref<HTMLElement | null>(null)
useMagneticHover(submitRef, { maxPx: 4, radius: 56 })

function getFetchStatus(e: unknown): number | undefined {
  return (e as { statusCode?: number })?.statusCode ?? (e as { response?: { status?: number } })?.response?.status
}

function getFetchMessage(e: unknown): string | undefined {
  return (e as { statusMessage?: string })?.statusMessage
}

async function onSubmit() {
  formError.value = ''
  success.value = false
  if (!turnstileToken.value) {
    formError.value = 'Complete the verification challenge first.'
    return
  }
  submitting.value = true
  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: {
        name: name.value,
        email: email.value,
        subject: subject.value,
        message: message.value,
        website: website.value,
        turnstileToken: turnstileToken.value,
      },
    })
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
    } else if (status === 503) {
      formError.value = 'This form is not set up yet. Please use LinkedIn for now.'
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
</script>

<template>
  <RevealOnScroll
    id="contact"
    :delay="320"
    class="closing-cta-section content-flow"
    aria-labelledby="closing-cta-heading"
  >
    <div class="closing-band full-bleed">
      <div class="closing-band__inner">
        <div class="closing-grid grid-12">
          <div class="closing-marker">
            <SectionMarker index="05" word="Contact" />
          </div>

          <div class="closing-main">
            <h2
              id="closing-cta-heading"
              class="closing-heading"
            >
              Let's work together.
            </h2>

            <p
              v-if="success"
              class="closing-status closing-status--ok"
              role="status"
              aria-live="polite"
            >
              Thanks — your message is on its way.
            </p>

            <form class="closing-form" novalidate @submit.prevent="onSubmit">
              <div class="closing-row">
                <label class="closing-field">
                  <input
                    v-model="name"
                    class="closing-input"
                    type="text"
                    name="name"
                    autocomplete="name"
                    placeholder=" "
                    required
                    maxlength="120"
                    :disabled="submitting"
                  >
                  <span class="closing-label">Name</span>
                </label>
                <label class="closing-field">
                  <input
                    v-model="email"
                    class="closing-input"
                    type="email"
                    name="email"
                    autocomplete="email"
                    placeholder=" "
                    required
                    maxlength="254"
                    :disabled="submitting"
                  >
                  <span class="closing-label">Email</span>
                </label>
              </div>
              <label class="closing-field">
                <input
                  v-model="subject"
                  class="closing-input"
                  type="text"
                  name="subject"
                  autocomplete="off"
                  placeholder=" "
                  maxlength="200"
                  :disabled="submitting"
                >
                <span class="closing-label">Subject <span class="closing-optional">(optional)</span></span>
              </label>
              <label class="closing-field">
                <textarea
                  v-model="message"
                  class="closing-textarea"
                  name="message"
                  rows="3"
                  placeholder=" "
                  required
                  maxlength="10000"
                  :disabled="submitting"
                />
                <span class="closing-label">Message</span>
              </label>

              <label class="closing-hp" aria-hidden="true">
                <span>Website</span>
                <input
                  v-model="website"
                  tabindex="-1"
                  autocomplete="off"
                  type="text"
                  name="website"
                >
              </label>

              <p v-if="formError" class="closing-form-error" role="alert">{{ formError }}</p>

              <TurnstileWidget
                ref="turnstileRef"
                v-model="turnstileToken"
                action="contact"
                @error="formError = 'Verification failed to load. Refresh and try again.'"
              />

              <div class="closing-actions">
                <button
                  ref="submitRef"
                  type="submit"
                  class="closing-submit"
                  :disabled="submitting || !turnstileToken"
                >
                  <span class="closing-submit__inner">
                    <AppIcon icon="lucide:send" class="closing-submit__icon text-sm" aria-hidden="true" />
                    {{ submitting ? 'Sending…' : 'Send message' }}
                  </span>
                </button>
                <a
                  :href="resolvedLinkedin"
                  class="closing-linkedin"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <AppIcon icon="ri:linkedin-fill" class="closing-linkedin-icon" aria-hidden="true" />
                  LinkedIn
                  <span class="sr-only">(opens in new tab)</span>
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </RevealOnScroll>
</template>

<style scoped>
.closing-cta-section {
  --home-section-bg: var(--pastel-lemon);
  --signal: var(--ink);
  --fg-primary: var(--pastel-ink);
  --fg-secondary: color-mix(in srgb, var(--pastel-ink) 76%, var(--home-section-bg));
  --fg-muted: color-mix(in srgb, var(--pastel-ink) 50%, var(--home-section-bg));
  --bg-primary: var(--home-section-bg);
  --bg-tertiary: var(--home-section-bg);
  --rule: color-mix(in srgb, var(--pastel-ink) 16%, var(--home-section-bg));
  --btn-attention-bg: var(--pastel-peach);
  background-color: transparent;
  padding-top: 0;
  padding-bottom: 0;
}

.closing-band {
  position: relative;
  overflow: hidden;
  --fg-primary: var(--pastel-ink);
  --fg-secondary: var(--pastel-ink-muted);
  --fg-muted: color-mix(in srgb, var(--pastel-ink) 52%, var(--bg-tertiary));
  --closing-form-bg: color-mix(in srgb, var(--paper) 78%, transparent);
  --closing-form-border: color-mix(in srgb, var(--fg-primary) 12%, var(--paper));
  --closing-field-bg: color-mix(in srgb, #ffffff 92%, var(--bg-tertiary));
  --closing-field-fg: var(--pastel-ink);
  --closing-field-label: color-mix(in srgb, var(--pastel-ink) 78%, var(--bg-tertiary));
  --signal: var(--signal-mint);
  --rule: color-mix(in srgb, var(--pastel-ink) 16%, var(--bg-tertiary));
}

:global(html[data-theme='dark'] .closing-band) {
  --fg-primary: var(--ink);
  --fg-secondary: var(--ink-mid);
  --fg-muted: var(--ink-muted);
  --closing-form-bg: var(--paper-sunk);
  --closing-form-border: color-mix(in srgb, var(--ink) 18%, var(--paper-sunk));
  --closing-field-bg: #1d2433;
  --closing-field-fg: var(--ink);
  --closing-field-label: var(--ink-mid);
  --signal: var(--signal-coral-ink);
  --rule: color-mix(in srgb, var(--ink) 22%, var(--paper-sunk));
}

.closing-band__inner {
  width: 100%;
  max-width: 82rem;
  margin-inline: auto;
}

.closing-grid {
  row-gap: var(--home-grid-gap-dense);
  align-items: start;
  padding-top: 0;
  padding-bottom: clamp(2.5rem, 5vw, 4rem);
}

.closing-marker {
  grid-column: 1 / -1;
  width: 100%;
  padding-bottom: var(--home-stack-gap-tight, 1rem);
}

.closing-marker :deep(.section-marker) {
  margin-inline-start: 0.14rem;
}

.closing-marker :deep(.section-marker-word) {
  color: #000000;
}

.closing-main {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  min-width: 0;
  width: 100%;
  align-self: start;
  padding-inline: clamp(4.5rem, 10vw, 8rem);
}

@media (min-width: 768px) {
  .closing-marker {
    grid-column: 1 / -1;
  }

  .closing-main {
    grid-column: 1 / -1;
  }
}

.closing-heading {
  margin: 0;
  font-family: var(--font-serif);
  font-size: clamp(2rem, 3.5vw + 0.8rem, 3.6rem);
  font-style: italic;
  font-weight: 500;
  line-height: 0.98;
  letter-spacing: -0.04em;
  color: #000000;
}

.closing-status {
  margin: 0;
  font-family: var(--font-sans);
  font-size: 0.9rem;
  color: var(--fg-secondary);
}

.closing-status--ok {
  color: var(--signal);
}

.closing-form {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  margin-top: clamp(0.9rem, 1.8vw, 1.4rem);
  padding: clamp(0.65rem, 1.4vw, 1rem);
  background: var(--closing-form-bg);
  border: 1px solid var(--closing-form-border);
  box-shadow: var(--shadow-md);
}

.closing-row {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

@media (min-width: 768px) {
  .closing-row {
    flex-direction: row;
    gap: 1rem;
  }

  .closing-row .closing-field {
    flex: 1;
  }
}

.closing-field {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding-top: 0.35rem;
}

.closing-label {
  position: absolute;
  top: 1.15rem;
  left: 0.7rem;
  z-index: 1;
  font-family: var(--font-mono);
  font-size: var(--label-size);
  font-weight: 500;
  letter-spacing: var(--label-tracking-mono);
  text-transform: uppercase;
  color: var(--closing-field-label);
  background: linear-gradient(
    to right,
    var(--closing-field-bg) 0%,
    var(--closing-field-bg) 88%,
    transparent 100%
  );
  padding-inline: 0.08rem 0.2rem;
  pointer-events: none;
  transform-origin: left top;
  transition:
    transform 180ms var(--motion-ease-hero, cubic-bezier(0.16, 1, 0.3, 1)),
    color 180ms var(--motion-ease-hero, cubic-bezier(0.16, 1, 0.3, 1));
}

.closing-optional {
  text-transform: none;
  letter-spacing: 0;
  font-weight: 400;
  color: var(--fg-muted);
}

.closing-input,
.closing-textarea {
  width: 100%;
  border: 1px solid var(--rule);
  border-radius: 0.25rem;
  padding: 1rem 0.65rem 0.45rem;
  font-family: var(--font-sans);
  font-size: var(--text-body);
  line-height: 1.45;
  color: var(--closing-field-fg);
  background-color: var(--closing-field-bg);
  outline: none;
  transition:
    border-color 180ms ease,
    box-shadow 180ms ease;
  caret-color: var(--closing-field-fg);
}

.closing-input::placeholder,
.closing-textarea::placeholder {
  color: transparent;
}

.closing-input:focus-visible,
.closing-textarea:focus-visible {
  border-color: color-mix(in srgb, var(--signal) 55%, var(--rule));
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--emphasis) 35%, transparent);
}

.closing-input:-webkit-autofill,
.closing-input:-webkit-autofill:hover,
.closing-input:-webkit-autofill:focus,
.closing-textarea:-webkit-autofill,
.closing-textarea:-webkit-autofill:hover,
.closing-textarea:-webkit-autofill:focus {
  -webkit-text-fill-color: var(--closing-field-fg);
  box-shadow: 0 0 0 1000px var(--closing-field-bg) inset;
  transition: background-color 99999s ease-out 0s;
}

.closing-input:focus-visible + .closing-label,
.closing-input:not(:placeholder-shown) + .closing-label,
.closing-textarea:focus-visible + .closing-label,
.closing-textarea:not(:placeholder-shown) + .closing-label {
  color: var(--signal);
  transform: translate3d(0, -0.95rem, 0) scale(0.82);
}

/* Checkmark confirmation when field has a value */
.closing-label::after {
  content: '✓';
  position: absolute;
  right: -1.4rem;
  top: 0;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--signal);
  opacity: 0;
  transform: translateY(2px) scale(0.7);
  transition:
    opacity 180ms var(--flourish-ease, cubic-bezier(0.22, 1, 0.36, 1)),
    transform 180ms var(--flourish-ease, cubic-bezier(0.22, 1, 0.36, 1));
  pointer-events: none;
}

.closing-input:not(:placeholder-shown) + .closing-label::after,
.closing-textarea:not(:placeholder-shown) + .closing-label::after {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.closing-textarea {
  resize: vertical;
  min-height: 4rem;
  padding-top: 1.15rem;
}

.closing-input:disabled,
.closing-textarea:disabled {
  opacity: 0.65;
}

.closing-hp {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.closing-form-error {
  margin: 0;
  font-size: 0.85rem;
  color: var(--danger);
}

.closing-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
}

.closing-submit {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  padding: 0;
  background: transparent;
  color: inherit;
}

.closing-submit:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.closing-submit__inner {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.65rem;
  border-radius: var(--radius-control, 0.35rem);
  background: var(--btn-attention-bg);
  color: var(--pastel-ink);
  border: 1px solid color-mix(in srgb, var(--pastel-ink) 22%, var(--btn-attention-bg));
  box-shadow: var(--shadow-sm);
  transition:
    transform 200ms var(--motion-ease-hero, cubic-bezier(0.16, 1, 0.3, 1)),
    color 200ms ease,
    box-shadow 200ms ease;
}

.closing-submit:not(:disabled):hover .closing-submit__inner {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.closing-submit:focus-visible .closing-submit__inner {
  outline: 2px solid var(--emphasis);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  .closing-label {
    transition: none;
  }

  .closing-submit:not(:disabled):hover .closing-submit__inner {
    transform: none;
  }
}

.closing-submit__icon {
  flex-shrink: 0;
}

.closing-linkedin {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-family: var(--font-mono);
  font-size: var(--label-size);
  font-weight: 500;
  letter-spacing: var(--label-tracking-mono);
  text-transform: uppercase;
  color: var(--pastel-ink);
  text-decoration: none;
  padding-bottom: 0.1rem;
  position: relative;
  transition:
    color 200ms var(--motion-ease-hero, cubic-bezier(0.16, 1, 0.3, 1)),
    transform 200ms var(--motion-ease-hero, cubic-bezier(0.16, 1, 0.3, 1));
}

:global(html[data-theme='dark'] .closing-linkedin) {
  color: var(--ink);
}

.closing-linkedin::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: var(--pastel-ink);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 240ms var(--motion-ease-hero, cubic-bezier(0.16, 1, 0.3, 1));
}

:global(html[data-theme='dark'] .closing-linkedin::after) {
  background: var(--ink);
}

.closing-linkedin:hover {
  color: var(--pastel-ink);
  transform: translateY(-1px);
}

:global(html[data-theme='dark'] .closing-linkedin:hover) {
  color: var(--ink);
}

.closing-linkedin:hover::after {
  transform: scaleX(1);
}

@media (prefers-reduced-motion: reduce) {
  .closing-linkedin {
    transition: color 150ms ease;
  }

  .closing-linkedin::after {
    transition: none;
  }

  .closing-linkedin:hover {
    transform: none;
  }
}

.closing-linkedin:focus-visible {
  outline: 2px solid var(--emphasis);
  outline-offset: 4px;
}

.closing-linkedin-icon {
  width: 1rem;
  height: 1rem;
}
</style>
