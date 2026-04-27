<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const code = computed(() => props.error.statusCode ?? 500)
const codeLetters = computed(() => String(code.value).split(''))

const heading = computed(() => {
  if (props.error.statusCode === 404) {
    return 'Page not found'
  }
  return 'Something went wrong'
})

const detail = computed(
  () => props.error.message || props.error.statusMessage || 'An unexpected error occurred.',
)

function goHome() {
  clearError({ redirect: '/' })
}

function tryAgain() {
  clearError()
}
</script>

<template>
  <NuxtLayout name="default">
    <div class="error-wrap">
      <div class="error-panel page-content py-16">
        <div class="error-panel__visual" aria-hidden="true">
          <div class="error-panel__visual-card">
            <span class="error-panel__visual-label">Lost in the archive</span>
            <span class="error-panel__visual-code">
              <span
                v-for="(ch, i) in codeLetters"
                :key="i"
                class="error-panel__visual-letter"
              >{{ ch }}</span>
            </span>
          </div>
        </div>

        <div class="error-panel__copy">
          <p class="error-panel__eyebrow">
            Error {{ code }}
          </p>
          <h1 class="error-panel__heading">
            {{ heading }}
          </h1>
          <p class="error-panel__detail">
            {{ detail }}
          </p>
          <div class="error-panel__actions">
            <button
              type="button"
              class="error-panel__primary rounded-md px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.1em]"
              @click="tryAgain"
            >
              Try again
            </button>
            <button
              type="button"
              class="error-panel__ghost rounded-md px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.1em]"
              @click="goHome"
            >
              Back to home
            </button>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped>
.error-wrap {
  padding: clamp(2.5rem, 7vw, 5.5rem) 0;
}

.error-panel {
  --fg-primary: var(--pastel-ink);
  --fg-secondary: var(--pastel-ink-muted);
  --fg-muted: color-mix(in srgb, var(--pastel-ink) 48%, var(--pastel-sky));
  margin-left: auto;
  margin-right: auto;
  max-width: 56rem;
  padding: clamp(1.5rem, 3vw, 2.5rem);
  display: grid;
  gap: clamp(1.5rem, 3vw, 2.5rem);
  background:
    linear-gradient(
      145deg,
      color-mix(in srgb, var(--pastel-sky) 82%, var(--paper)) 0%,
      color-mix(in srgb, var(--pastel-blush) 42%, var(--paper)) 100%
    );
  color: var(--pastel-ink);
  box-shadow: var(--shadow-lg);
}

@media (min-width: 768px) {
  .error-panel {
    grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.18fr);
    align-items: stretch;
  }
}

.error-panel__visual {
  display: flex;
}

.error-panel__visual-card {
  flex: 1 1 auto;
  min-height: clamp(14rem, 28vw, 19rem);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: clamp(1rem, 2vw, 1.5rem);
  background:
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--paper) 52%, transparent) 0%,
      transparent 100%
    ),
    color-mix(in srgb, var(--pastel-ink) 8%, var(--pastel-sky));
  border: 1px solid color-mix(in srgb, var(--pastel-ink) 16%, var(--pastel-sky));
}

.error-panel__visual-label,
.error-panel__eyebrow {
  margin: 0;
  font-family: var(--font-mono);
  font-size: var(--label-size);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: var(--label-tracking-mono);
  color: color-mix(in srgb, var(--pastel-ink) 58%, var(--pastel-sky));
}

.error-panel__visual-code {
  font-family: var(--font-serif);
  font-size: clamp(5rem, 10vw, 8rem);
  font-style: italic;
  line-height: 0.9;
  letter-spacing: -0.06em;
  display: inline-flex;
  gap: 0.02em;
}

.error-panel__visual-letter {
  display: inline-block;
  transform-origin: 50% 78%;
  animation: error-letter-drop 720ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.error-panel__visual-letter:nth-child(1) { animation-delay: 0ms; }
.error-panel__visual-letter:nth-child(2) { animation-delay: 110ms; }
.error-panel__visual-letter:nth-child(3) { animation-delay: 220ms; }
.error-panel__visual-letter:nth-child(4) { animation-delay: 330ms; }
.error-panel__visual-letter:nth-child(5) { animation-delay: 440ms; }

.error-panel__visual-letter:nth-child(2) {
  font-style: normal;
  /* Make the middle digit feel like a misplaced object */
  transform: rotate(-6deg) translateY(0.04em);
}

.error-panel__visual-letter:hover {
  animation: error-letter-jiggle 480ms ease-out;
}

@keyframes error-letter-drop {
  0% {
    opacity: 0;
    transform: translateY(-0.5em) rotate(-8deg);
  }
  60% {
    opacity: 1;
    transform: translateY(0.06em) rotate(2deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0) rotate(0);
  }
}

.error-panel__visual-letter:nth-child(2) {
  animation-name: error-letter-drop-tilted;
}

@keyframes error-letter-drop-tilted {
  0% {
    opacity: 0;
    transform: translateY(-0.5em) rotate(-14deg);
  }
  60% {
    opacity: 1;
    transform: translateY(0.06em) rotate(-3deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0.04em) rotate(-6deg);
  }
}

@keyframes error-letter-jiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-4deg) scale(1.04); }
  75% { transform: rotate(4deg) scale(1.04); }
}

@media (prefers-reduced-motion: reduce) {
  .error-panel__visual-letter,
  .error-panel__visual-letter:nth-child(2) {
    animation: none;
    transform: none;
  }
}

.error-panel__copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.9rem;
}

.error-panel__heading {
  margin: 0;
  font-family: var(--font-serif);
  font-size: clamp(2.4rem, 3.5vw + 1rem, 4.6rem);
  font-style: italic;
  font-weight: 500;
  line-height: 0.96;
  letter-spacing: -0.05em;
  color: var(--fg-primary);
}

.error-panel__detail {
  margin: 0;
  max-width: 34rem;
  font-size: var(--text-body);
  line-height: 1.6;
  color: var(--fg-secondary);
}

.error-panel__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.85rem;
}

.error-panel__primary,
.error-panel__ghost {
  cursor: pointer;
  color: var(--pastel-ink);
  border-width: 1px;
  border-style: solid;
  transition:
    background-color 0.2s cubic-bezier(0.25, 1, 0.5, 1),
    border-color 0.2s cubic-bezier(0.25, 1, 0.5, 1),
    box-shadow 0.22s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.18s cubic-bezier(0.22, 1, 0.36, 1);
}

.error-panel__primary {
  background-color: var(--pastel-mint);
  border-color: color-mix(in srgb, var(--pastel-ink) 18%, var(--pastel-mint));
}

.error-panel__ghost {
  background-color: var(--pastel-peach);
  border-color: color-mix(in srgb, var(--pastel-ink) 18%, var(--pastel-peach));
}

.error-panel__primary:hover {
  transform: translate3d(0, -1px, 0);
  box-shadow: var(--shadow-sm);
}

.error-panel__primary:active {
  transform: translate3d(0, 0.5px, 0) scale(0.99);
}

.error-panel__ghost:hover {
  transform: translate3d(0, -1px, 0);
  box-shadow: var(--shadow-sm);
  filter: brightness(0.97);
}

.error-panel__ghost:active {
  transform: translate3d(0, 0.5px, 0) scale(0.99);
}

@media (prefers-reduced-motion: reduce) {
  .error-panel__primary,
  .error-panel__ghost {
    transition: none;
  }

  .error-panel__primary:hover,
  .error-panel__primary:active,
  .error-panel__ghost:hover,
  .error-panel__ghost:active {
    transform: none;
    box-shadow: none;
    filter: none;
  }
}
</style>
