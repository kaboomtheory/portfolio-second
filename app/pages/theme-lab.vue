<script setup lang="ts">
import type { ThemeColorGroup, ThemeColorToken, ThemePreviewContext } from '~/data/themeColorTokens'

definePageMeta({
  layout: 'default',
})

const { siteUrl } = useRuntimeConfig().public
const themeLabCanonical = `${String(siteUrl).replace(/\/$/, '')}/theme-lab`

useHead({
  title: 'Theme lab',
  link: [{ rel: 'canonical', href: themeLabCanonical }],
})

useSeoMeta({
  robots: 'noindex, nofollow',
})

const {
  tokens,
  effectiveLight,
  effectiveDark,
  overridesLight,
  overridesDark,
  pastelVariant,
  setColor,
  resetToken,
  resetAll,
  setPastelVariant,
  reportMarkdown,
} = useThemeColorLab()

const { mode, toggle } = useTheme()

const editorTab = ref<'light' | 'dark' | 'split'>('light')
const copyStatus = ref<'idle' | 'copied' | 'error'>('idle')
const reportPreview = ref(false)

const groups = computed(() => {
  const map = new Map<ThemeColorGroup, ThemeColorToken[]>()
  for (const t of tokens) {
    const list = map.get(t.group) ?? []
    list.push(t)
    map.set(t.group, list)
  }
  return [...map.entries()]
})

function previewCtxFrom(map: Record<string, string>): ThemePreviewContext {
  const c = (key: string) => map[key] ?? '#000000'
  return {
    shell: c('--shell-ui-bg'),
    bgPrimary: c('--bg-primary'),
    bgSecondary: c('--bg-secondary'),
    bgTertiary: c('--bg-tertiary'),
    surfaceInteractive: c('--surface-interactive'),
    paperSunk: c('--paper-sunk'),
    pastelPeach: c('--pastel-peach'),
    pastelInk: c('--pastel-ink'),
    fgPrimary: c('--fg-primary'),
    accent: c('--accent'),
    border: c('--border'),
    attentionBg: c('--btn-attention-bg'),
    attentionFg: c('--btn-attention-fg'),
  }
}

const previewCtxLight = computed(() => previewCtxFrom(effectiveLight.value))
const previewCtxDark = computed(() => previewCtxFrom(effectiveDark.value))

function valueFor(token: ThemeColorToken, side: 'light' | 'dark'): string {
  const v =
    side === 'light' ? effectiveLight.value[token.var] : effectiveDark.value[token.var]
  return v ?? (side === 'light' ? token.light : token.dark)
}

function isOverridden(token: ThemeColorToken, side: 'light' | 'dark') {
  const o = side === 'light' ? overridesLight.value : overridesDark.value
  return Object.prototype.hasOwnProperty.call(o, token.var)
}

function onHexInput(token: ThemeColorToken, side: 'light' | 'dark', raw: string) {
  setColor(side, token.var, raw)
}

function supportsColorPicker(token: ThemeColorToken, side: 'light' | 'dark') {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(valueFor(token, side))
}

function colorPickerValue(token: ThemeColorToken, side: 'light' | 'dark') {
  const value = valueFor(token, side)
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)) {
    return value
  }
  return '#000000'
}

async function copyReport() {
  copyStatus.value = 'idle'
  const text = reportMarkdown()
  try {
    await navigator.clipboard.writeText(text)
    copyStatus.value = 'copied'
    window.setTimeout(() => {
      if (copyStatus.value === 'copied') {
        copyStatus.value = 'idle'
      }
    }, 2000)
  } catch {
    copyStatus.value = 'error'
  }
}
</script>

<template>
  <main class="theme-lab page-section">
    <div class="theme-lab__inner card-surface">
      <header class="theme-lab__header">
        <div>
          <p class="eyebrow-sans">Internal</p>
          <h1 class="text-section-title">
            Theme lab
          </h1>
          <p class="text-body-lg theme-lab__lede">
            Adjust the site’s CSS color tokens for light and dark mode. Changes save in this
            browser and apply everywhere until you reset. When you are happy with the palette,
            copy the report and paste it into a chat so your assistant can update
            <code class="mono">app/assets/css/main.css</code> for you. Each row includes a small
            sample of where that token shows up (using the row’s light or dark values, independent
            of the preview theme toggle above).
          </p>
        </div>
        <div class="theme-lab__header-actions">
          <button
            type="button"
            class="filter-pill"
            :class="{ 'filter-pill--active': mode === 'light' }"
            @click="mode === 'dark' && toggle()"
          >
            Preview light
          </button>
          <button
            type="button"
            class="filter-pill"
            :class="{ 'filter-pill--active': mode === 'dark' }"
            @click="mode === 'light' && toggle()"
          >
            Preview dark
          </button>
        </div>
      </header>

      <div class="theme-lab__toolbar">
        <div class="theme-lab__tabs" role="tablist" aria-label="Editor scope">
          <button
            type="button"
            class="filter-pill"
            :class="{ 'filter-pill--active': editorTab === 'light' }"
            role="tab"
            :aria-selected="editorTab === 'light'"
            @click="editorTab = 'light'"
          >
            Edit light
          </button>
          <button
            type="button"
            class="filter-pill"
            :class="{ 'filter-pill--active': editorTab === 'dark' }"
            role="tab"
            :aria-selected="editorTab === 'dark'"
            @click="editorTab = 'dark'"
          >
            Edit dark
          </button>
          <button
            type="button"
            class="filter-pill"
            :class="{ 'filter-pill--active': editorTab === 'split' }"
            role="tab"
            :aria-selected="editorTab === 'split'"
            @click="editorTab = 'split'"
          >
            Split view
          </button>
        </div>
        <div class="theme-lab__toolbar-actions">
          <button type="button" class="theme-lab__btn theme-lab__btn--ghost" @click="resetAll">
            Reset all to defaults
          </button>
          <button type="button" class="theme-lab__btn theme-lab__btn--accent" @click="copyReport">
            Copy report for assistant
          </button>
        </div>
      </div>

      <p
        v-if="copyStatus === 'copied'"
        class="theme-lab__banner theme-lab__banner--ok"
        role="status"
      >
        Report copied. Paste it into your assistant’s chat.
      </p>
      <p
        v-else-if="copyStatus === 'error'"
        class="theme-lab__banner theme-lab__banner--err"
        role="alert"
      >
        Clipboard was blocked. Open the preview below and copy manually.
      </p>

      <div class="theme-lab__panels" :data-editor="editorTab">
        <section
          v-if="editorTab === 'light' || editorTab === 'split'"
          class="theme-lab__panel"
          aria-label="Light palette"
        >
          <h2 class="theme-lab__panel-title">
            Light tokens
          </h2>
          <div
            v-for="[group, items] in groups"
            :key="`light-${group}`"
            class="theme-lab__group"
          >
            <h3 class="theme-lab__group-title">
              {{ group }}
            </h3>
            <ul class="theme-lab__list">
              <li v-for="token in items" :key="`light-${token.var}`" class="theme-lab__row">
                <div class="theme-lab__preview" aria-hidden="true">
                  <ThemeTokenPreview
                    :kind="token.preview"
                    :hex="valueFor(token, 'light')"
                    :ctx="previewCtxLight"
                  />
                </div>
                <div class="theme-lab__row-label">
                  <span class="theme-lab__name">{{ token.label }}</span>
                  <span class="mono theme-lab__var">{{ token.var }}</span>
                </div>
                <label class="theme-lab__picker">
                  <span class="sr-only">Color for {{ token.label }} (light)</span>
                  <input
                    type="color"
                    class="theme-lab__color"
                    :value="colorPickerValue(token, 'light')"
                    :disabled="!supportsColorPicker(token, 'light')"
                    @input="onHexInput(token, 'light', ($event.target as HTMLInputElement).value)"
                  >
                </label>
                <input
                  type="text"
                  class="theme-lab__hex mono"
                  :value="valueFor(token, 'light')"
                  spellcheck="false"
                  @change="onHexInput(token, 'light', ($event.target as HTMLInputElement).value)"
                >
                <button
                  v-if="isOverridden(token, 'light')"
                  type="button"
                  class="theme-lab__reset"
                  @click="resetToken('light', token.var)"
                >
                  Reset
                </button>
              </li>
            </ul>
          </div>
        </section>

        <section
          v-if="editorTab === 'dark' || editorTab === 'split'"
          class="theme-lab__panel"
          aria-label="Dark palette"
        >
          <div class="theme-lab__variant-bar">
            <div class="theme-lab__variant-bar-label">
              <span class="theme-lab__panel-title" style="margin: 0;">Dark tokens</span>
              <span class="text-meta">Pastel variant (staging only)</span>
            </div>
            <div class="theme-lab__variant-btns" role="group" aria-label="Pastel variant">
              <button
                type="button"
                class="filter-pill"
                :class="{ 'filter-pill--active': pastelVariant === 'bright' }"
                @click="setPastelVariant('bright')"
              >
                Bright
              </button>
              <button
                type="button"
                class="filter-pill"
                :class="{ 'filter-pill--active': pastelVariant === 'moody' }"
                @click="setPastelVariant('moody')"
              >
                Moody
              </button>
            </div>
          </div>
          <div
            v-for="[group, items] in groups"
            :key="`dark-${group}`"
            class="theme-lab__group"
          >
            <h3 class="theme-lab__group-title">
              {{ group }}
            </h3>
            <ul class="theme-lab__list">
              <li v-for="token in items" :key="`dark-${token.var}`" class="theme-lab__row">
                <div class="theme-lab__preview" aria-hidden="true">
                  <ThemeTokenPreview
                    :kind="token.preview"
                    :hex="valueFor(token, 'dark')"
                    :ctx="previewCtxDark"
                  />
                </div>
                <div class="theme-lab__row-label">
                  <span class="theme-lab__name">{{ token.label }}</span>
                  <span class="mono theme-lab__var">{{ token.var }}</span>
                </div>
                <label class="theme-lab__picker">
                  <span class="sr-only">Color for {{ token.label }} (dark)</span>
                  <input
                    type="color"
                    class="theme-lab__color"
                    :value="colorPickerValue(token, 'dark')"
                    :disabled="!supportsColorPicker(token, 'dark')"
                    @input="onHexInput(token, 'dark', ($event.target as HTMLInputElement).value)"
                  >
                </label>
                <input
                  type="text"
                  class="theme-lab__hex mono"
                  :value="valueFor(token, 'dark')"
                  spellcheck="false"
                  @change="onHexInput(token, 'dark', ($event.target as HTMLInputElement).value)"
                >
                <button
                  v-if="isOverridden(token, 'dark')"
                  type="button"
                  class="theme-lab__reset"
                  @click="resetToken('dark', token.var)"
                >
                  Reset
                </button>
              </li>
            </ul>
          </div>
        </section>
      </div>

      <section class="theme-lab__report card-surface">
        <div class="theme-lab__report-head">
          <h2 class="theme-lab__panel-title">
            Report preview
          </h2>
          <button
            type="button"
            class="theme-lab__btn theme-lab__btn--ghost"
            @click="reportPreview = !reportPreview"
          >
            {{ reportPreview ? 'Hide' : 'Show' }} markdown
          </button>
        </div>
        <p class="text-caption theme-lab__report-hint">
          Defaults are tagged in the report; overridden rows are easy to spot. Includes JSON for
          tooling.
        </p>
        <textarea
          v-show="reportPreview"
          class="theme-lab__textarea mono"
          readonly
          rows="14"
          :value="reportMarkdown()"
        />
      </section>

      <p class="text-caption theme-lab__foot">
        <NuxtLink to="/" class="content-flow">← Back to the site</NuxtLink>
        · Route: <span class="mono">/theme-lab</span>
      </p>
    </div>
  </main>
</template>

<style scoped>
.theme-lab {
  padding-bottom: var(--space-2xl);
}

.theme-lab__inner {
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.theme-lab__header {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

@media (min-width: 900px) {
  .theme-lab__header {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--space-xl);
  }
}

.theme-lab__lede {
  margin-top: var(--space-sm);
  max-width: 48rem;
}

.theme-lab__lede code {
  font-size: 0.9em;
}

.theme-lab__header-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.theme-lab__toolbar {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  padding-top: var(--space-sm);
  border-top: 1px solid color-mix(in srgb, var(--fg-muted) 22%, var(--paper));
}

@media (min-width: 768px) {
  .theme-lab__toolbar {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.theme-lab__tabs,
.theme-lab__toolbar-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.theme-lab__panel-title {
  font-size: 1.125rem;
  font-weight: 650;
  letter-spacing: -0.012em;
  margin: 0 0 var(--space-md);
}

.theme-lab__group {
  margin-bottom: var(--space-lg);
}

.theme-lab__group-title {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-family: var(--font-mono);
  color: var(--fg-muted);
  margin: 0 0 var(--space-sm);
}

.theme-lab__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.theme-lab__row {
  display: grid;
  grid-template-columns: clamp(6.25rem, 18vw, 8.25rem) minmax(0, 1fr) auto auto auto;
  gap: var(--space-sm);
  align-items: center;
  padding: var(--space-sm) var(--space-sm);
  border-radius: var(--radius-inner);
  background: color-mix(in srgb, var(--surface-interactive) 40%, var(--paper));
}

.theme-lab__preview {
  min-width: 0;
  align-self: stretch;
  display: flex;
}

@media (max-width: 640px) {
  .theme-lab__row {
    grid-template-columns: minmax(0, 1fr) auto;
    grid-template-rows: auto auto auto auto;
  }

  .theme-lab__preview {
    grid-column: 1 / -1;
  }

  .theme-lab__row-label {
    grid-column: 1 / -1;
  }

  .theme-lab__hex {
    grid-column: 1 / span 1;
  }

  .theme-lab__picker {
    justify-self: end;
  }

  .theme-lab__reset {
    grid-column: 1 / -1;
    justify-self: start;
  }
}

.theme-lab__row-label {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.theme-lab__name {
  font-weight: 600;
  color: var(--fg-primary);
}

.theme-lab__var {
  font-size: 0.6875rem;
  color: var(--fg-muted);
  word-break: break-all;
}

.theme-lab__picker {
  display: flex;
}

.theme-lab__color {
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  border: 1px solid color-mix(in srgb, var(--fg-muted) 25%, var(--paper));
  border-radius: 0.5rem;
  background: transparent;
  cursor: pointer;
}

.theme-lab__color:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.theme-lab__hex {
  width: 7.25rem;
  max-width: 100%;
  border-radius: 0.5rem;
  border: 1px solid color-mix(in srgb, var(--fg-muted) 25%, var(--paper));
  padding: 0.4rem 0.5rem;
  font-size: 0.8125rem;
  background: var(--bg-primary);
  color: var(--fg-primary);
}

.theme-lab__reset {
  border: none;
  background: transparent;
  color: var(--accent);
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 0.15em;
  padding: 0.25rem 0.35rem;
}

.theme-lab__reset:focus-visible {
  outline: 2px solid var(--emphasis);
  outline-offset: 2px;
  border-radius: 4px;
}

.theme-lab__panels {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.theme-lab__panels[data-editor='split'] {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-lg);
}

@media (max-width: 960px) {
  .theme-lab__panels[data-editor='split'] {
    grid-template-columns: 1fr;
  }
}

.theme-lab__panel {
  min-width: 0;
}

.theme-lab__variant-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
}

.theme-lab__variant-bar-label {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.theme-lab__variant-btns {
  display: flex;
  gap: var(--space-sm);
}

.theme-lab__banner {
  margin: 0;
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-inner);
  font-size: 0.9375rem;
}

.theme-lab__banner--ok {
  background: color-mix(in srgb, var(--fg-muted) 14%, var(--paper));
  color: var(--fg-primary);
}

.theme-lab__banner--err {
  background: color-mix(in srgb, var(--danger) 18%, var(--paper));
  color: var(--fg-primary);
}

.theme-lab__report {
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.theme-lab__report-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.theme-lab__report .theme-lab__panel-title {
  margin: 0;
}

.theme-lab__report-hint {
  margin: 0;
}

.theme-lab__textarea {
  width: 100%;
  resize: vertical;
  min-height: 12rem;
  border-radius: var(--radius-inner);
  border: 1px solid color-mix(in srgb, var(--fg-muted) 25%, var(--paper));
  padding: var(--space-sm);
  font-size: 0.75rem;
  line-height: 1.5;
  background: var(--bg-secondary);
  color: var(--fg-primary);
}

.theme-lab__foot {
  margin: 0;
}

.theme-lab__foot :deep(a) {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 0.15em;
}

.theme-lab__btn {
  border-radius: 9999px;
  padding: 0.55rem 1.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  border: 1px solid transparent;
  transition:
    background-color 180ms ease,
    color 180ms ease,
    box-shadow 220ms ease,
    transform 180ms ease;
}

.theme-lab__btn:focus-visible {
  outline: 2px solid var(--emphasis);
  outline-offset: 3px;
}

.theme-lab__btn--ghost {
  background: var(--surface-interactive);
  color: var(--fg-primary);
  border-color: color-mix(in srgb, var(--fg-muted) 22%, var(--paper));
  box-shadow: var(--shadow-sm);
}

.theme-lab__btn--ghost:hover {
  background: color-mix(in srgb, var(--fg-primary) 6%, var(--surface-interactive));
}

.theme-lab__btn--accent {
  background: var(--btn-primary-bg);
  color: var(--btn-primary-fg);
}

.theme-lab__btn--accent:hover {
  filter: brightness(1.05);
}

.theme-lab__btn:active {
  transform: scale(0.98);
}
</style>
