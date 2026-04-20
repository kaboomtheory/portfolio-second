<script setup lang="ts">
import type { ThemePreviewContext, ThemePreviewKind } from '~/data/themeColorTokens'

defineProps<{
  kind: ThemePreviewKind
  hex: string
  ctx: ThemePreviewContext
}>()
</script>

<template>
  <div class="theme-token-preview">
    <!-- Surfaces -->
    <div
      v-if="kind === 'shell'"
      class="theme-token-preview__fill"
      :style="{ backgroundColor: hex }"
      title="Page shell behind content"
    />

    <div
      v-else-if="kind === 'surface-primary'"
      class="theme-token-preview__fill theme-token-preview__fill--inset"
      :style="{ backgroundColor: hex, boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${ctx.border} 18%, transparent)` }"
      title="Cards and main panels"
    />

    <div
      v-else-if="kind === 'surface-secondary'"
      class="theme-token-preview__fill theme-token-preview__fill--inset"
      :style="{ backgroundColor: hex, boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${ctx.border} 14%, transparent)` }"
      title="Secondary panels"
    />

    <div
      v-else-if="kind === 'surface-tertiary'"
      class="theme-token-preview__fill theme-token-preview__fill--inset"
      :style="{ backgroundColor: hex, boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${ctx.border} 12%, transparent)` }"
      title="Tertiary bands"
    />

    <div
      v-else-if="kind === 'surface-interactive'"
      class="theme-token-preview__pill"
      :style="{
        backgroundColor: hex,
        border: `1px solid color-mix(in srgb, ${ctx.border} 35%, transparent)`,
        color: ctx.accent,
        boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
      }"
      title="Filter pills, inputs"
    >
      Filter
    </div>

    <!-- Text -->
    <div
      v-else-if="kind === 'text-primary'"
      class="theme-token-preview__text-block"
      :style="{ backgroundColor: ctx.bgPrimary, color: hex }"
      title="Headings and titles"
    >
      <span class="theme-token-preview__h">Section title</span>
    </div>

    <div
      v-else-if="kind === 'text-secondary'"
      class="theme-token-preview__text-block"
      :style="{ backgroundColor: ctx.bgPrimary, color: hex }"
      title="Body copy"
    >
      <span class="theme-token-preview__p">Supporting paragraph for a project card.</span>
    </div>

    <div
      v-else-if="kind === 'text-muted'"
      class="theme-token-preview__text-block"
      :style="{ backgroundColor: ctx.bgPrimary, color: hex }"
      title="Eyebrows and meta"
    >
      <span class="theme-token-preview__eyebrow">Case study · 2025</span>
    </div>

    <div
      v-else-if="kind === 'hairline-border'"
      class="theme-token-preview__border-demo"
      :style="{
        backgroundColor: ctx.bgSecondary,
        border: `2px solid ${hex}`,
      }"
      title="Dividers and outlines"
    />

    <div
      v-else-if="kind === 'theme-knob'"
      class="theme-token-preview__track"
      :style="{
        backgroundColor: ctx.bgTertiary,
        border: `1px solid color-mix(in srgb, ${ctx.border} 25%, transparent)`,
      }"
      title="Theme switch knob"
    >
      <span
        class="theme-token-preview__knob"
        :style="{ backgroundColor: hex, boxShadow: `0 1px 2px color-mix(in srgb, ${ctx.border} 20%, transparent)` }"
      />
    </div>

    <!-- Accent -->
    <div
      v-else-if="kind === 'link-accent'"
      class="theme-token-preview__text-block theme-token-preview__text-block--left"
      :style="{ backgroundColor: ctx.bgPrimary }"
      title="Inline links in prose"
    >
      <span
        class="theme-token-preview__link"
        :style="{ color: hex, textDecorationColor: hex }"
      >Read the story</span>
    </div>

    <div
      v-else-if="kind === 'link-accent-soft'"
      class="theme-token-preview__text-block theme-token-preview__text-block--left"
      :style="{ backgroundColor: ctx.bgPrimary }"
      title="Link hover tone"
    >
      <span
        class="theme-token-preview__link theme-token-preview__link--sm"
        :style="{ color: hex, textDecorationColor: hex }"
      >Hovered link</span>
    </div>

    <div
      v-else-if="kind === 'swatch-strong'"
      class="theme-token-preview__bars"
      :style="{ backgroundColor: ctx.bgPrimary }"
    >
      <span class="theme-token-preview__bar" :style="{ backgroundColor: hex }" />
    </div>

    <div
      v-else-if="kind === 'swatch-soft'"
      class="theme-token-preview__bars"
      :style="{ backgroundColor: ctx.bgPrimary }"
    >
      <span
        class="theme-token-preview__bar theme-token-preview__bar--soft"
        :style="{ backgroundColor: hex }"
      />
    </div>

    <div
      v-else-if="kind === 'on-accent'"
      class="theme-token-preview__on-accent"
      :style="{ backgroundColor: ctx.accent, color: hex }"
      title="Label on solid accent"
    >
      <span class="theme-token-preview__on-accent-t">View project</span>
    </div>

    <div
      v-else-if="kind === 'on-accent-muted'"
      class="theme-token-preview__on-accent"
      :style="{ backgroundColor: ctx.accent, color: hex }"
      title="Secondary line on accent"
    >
      <span class="theme-token-preview__on-accent-t theme-token-preview__on-accent-t--sm">PDF · 2.4 MB</span>
    </div>

    <div
      v-else-if="kind === 'neon-dot'"
      class="theme-token-preview__neon"
      :style="{ backgroundColor: ctx.bgSecondary }"
    >
      <span
        class="theme-token-preview__neon-dot"
        :style="{
          backgroundColor: hex,
          boxShadow: `0 0 14px color-mix(in srgb, ${hex} 65%, transparent)`,
        }"
      />
    </div>

    <!-- Status -->
    <div
      v-else-if="kind === 'status-pill'"
      class="theme-token-preview__status"
      :style="{ backgroundColor: ctx.bgPrimary }"
      title="Availability dot + label"
    >
      <span class="theme-token-preview__status-dot" :style="{ backgroundColor: hex }" />
      <span class="theme-token-preview__status-txt" :style="{ color: hex }">Available</span>
    </div>

    <div
      v-else-if="kind === 'danger-chip'"
      class="theme-token-preview__danger"
      :style="{
        backgroundColor: ctx.bgPrimary,
        borderColor: hex,
        color: hex,
      }"
      title="Errors and destructive actions"
    >
      Remove
    </div>

    <!-- Buttons -->
    <div
      v-else-if="kind === 'attention-button-bg'"
      class="theme-token-preview__attn"
      :style="{ backgroundColor: hex, color: ctx.attentionFg }"
      title="Filled attention CTA"
    >
      Download
    </div>

    <div
      v-else-if="kind === 'attention-button-fg'"
      class="theme-token-preview__attn"
      :style="{ backgroundColor: ctx.attentionBg, color: hex }"
      title="Label on attention CTA"
    >
      Download
    </div>

  </div>
</template>

<style scoped>
.theme-token-preview {
  width: 100%;
  min-height: 3.25rem;
  border-radius: 0.5rem;
  overflow: hidden;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  border: 1px solid color-mix(in srgb, var(--fg-muted) 18%, transparent);
}

.theme-token-preview__fill {
  width: 100%;
  min-height: 3.25rem;
}

.theme-token-preview__fill--inset {
  border-radius: 0.35rem;
  margin: 0.35rem;
  width: auto;
  min-height: 2.55rem;
}

.theme-token-preview__pill {
  align-self: center;
  margin: 0.4rem auto;
  padding: 0.28rem 0.65rem;
  border-radius: 9999px;
  font-size: 0.625rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-family: var(--font-mono);
}

.theme-token-preview__text-block {
  width: 100%;
  padding: 0.45rem 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.theme-token-preview__text-block--left {
  justify-content: flex-start;
  text-align: left;
}

.theme-token-preview__h {
  font-family: var(--font-display);
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.2;
}

.theme-token-preview__p {
  font-family: var(--font-sans);
  font-size: 0.625rem;
  line-height: 1.35;
  max-width: 11rem;
}

.theme-token-preview__eyebrow {
  font-family: var(--font-sans);
  font-size: 0.5625rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.theme-token-preview__link {
  font-family: var(--font-sans);
  font-size: 0.6875rem;
  font-weight: 500;
  text-decoration: underline;
  text-underline-offset: 0.15em;
}

.theme-token-preview__link--sm {
  font-size: 0.625rem;
}

.theme-token-preview__bars {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.5rem;
}

.theme-token-preview__bar {
  display: block;
  width: 100%;
  height: 0.65rem;
  border-radius: 0.25rem;
}

.theme-token-preview__bar--soft {
  height: 0.45rem;
  opacity: 0.92;
}

.theme-token-preview__border-demo {
  margin: 0.45rem;
  border-radius: 0.35rem;
  min-height: 2.35rem;
  width: auto;
}

.theme-token-preview__track {
  align-self: center;
  margin: 0.45rem auto;
  width: 2.75rem;
  height: 1.35rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  padding: 0.15rem 0.2rem;
}

.theme-token-preview__knob {
  width: 1.05rem;
  height: 1.05rem;
  border-radius: 9999px;
  margin-left: auto;
}

.theme-token-preview__on-accent {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.45rem 0.35rem;
}

.theme-token-preview__on-accent-t {
  font-family: var(--font-sans);
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.theme-token-preview__on-accent-t--sm {
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: none;
  font-size: 0.5625rem;
}

.theme-token-preview__neon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.theme-token-preview__neon-dot {
  width: 0.65rem;
  height: 0.65rem;
  border-radius: 9999px;
}

.theme-token-preview__status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  width: 100%;
  padding: 0.35rem;
}

.theme-token-preview__status-dot {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 9999px;
  flex-shrink: 0;
}

.theme-token-preview__status-txt {
  font-family: var(--font-mono);
  font-size: 0.5625rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.theme-token-preview__danger {
  align-self: center;
  margin: 0.4rem auto;
  padding: 0.25rem 0.55rem;
  border-radius: 9999px;
  border-width: 1px;
  border-style: solid;
  font-size: 0.5625rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-family: var(--font-sans);
}

.theme-token-preview__attn {
  align-self: center;
  margin: 0.35rem auto;
  padding: 0.32rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.5625rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-family: var(--font-sans);
}

</style>
