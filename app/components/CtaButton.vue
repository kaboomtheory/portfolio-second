<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    to?: string
    href?: string
    label: string
    secondary?: boolean
    withDot?: boolean
    attention?: boolean
    download?: boolean
    preserveCase?: boolean
    /** Stronger fill + text contrast for secondary (e.g. hero CTAs) */
    elevatedSecondary?: boolean
  }>(),
  {
    to: undefined,
    href: undefined,
    secondary: false,
    withDot: false,
    attention: false,
    download: false,
    preserveCase: false,
    elevatedSecondary: false,
  }
)

const isMailto = computed(() => Boolean(props.href?.toLowerCase().startsWith('mailto:')))

const secondaryBg = computed(() =>
  props.secondary && props.elevatedSecondary ? 'var(--bg-secondary)' : 'transparent',
)

const secondaryFg = computed(() =>
  props.secondary && props.elevatedSecondary ? 'var(--fg-primary)' : 'var(--fg-secondary)',
)

const secondaryBorder = computed(() =>
  props.secondary && props.elevatedSecondary
    ? 'color-mix(in srgb, var(--border) 65%, var(--fg-muted) 35%)'
    : 'var(--border)',
)

const btnClass = computed(() =>
  [
    'cta-button inline-flex items-center gap-2 rounded-md border px-4 py-2 text-xs tracking-[0.1em] transition-all duration-300 origin-center',
    props.preserveCase ? 'cta-button--preserve-case' : 'uppercase',
  ].join(' '),
)

const mouseX = ref(50)
const mouseY = ref(50)

const handleMouseMove = (e: MouseEvent) => {
  const target = e.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  mouseX.value = ((e.clientX - rect.left) / rect.width) * 100
  mouseY.value = ((e.clientY - rect.top) / rect.height) * 100
}
</script>

<template>
  <a
    v-if="href"
    :href="href"
    :target="download || isMailto ? undefined : '_blank'"
    :rel="download || isMailto ? undefined : 'noopener noreferrer'"
    :download="download || undefined"
    :class="[btnClass, attention && 'btn-attention', secondary && 'cta-button-secondary']"
    :style="{
      backgroundColor: secondary ? secondaryBg : (attention ? 'var(--emphasis)' : 'var(--fg-secondary)'),
      borderColor: secondary ? secondaryBorder : (attention ? 'var(--emphasis)' : 'transparent'),
      color: secondary ? secondaryFg : (attention ? 'var(--on-emphasis)' : 'var(--bg-primary)'),
      '--mouse-x': `${mouseX}%`,
      '--mouse-y': `${mouseY}%`
    }"
    @mousemove="handleMouseMove"
  >
    <span
      v-if="withDot"
      :class="[
        'inline-block h-2 w-2 rounded-full',
        secondary ? 'cta-status-dot' : 'pulse-glow',
      ]"
      :style="secondary ? undefined : { backgroundColor: 'var(--emphasis)' }"
    />
    <slot name="icon">
      <span class="icon-wrapper" />
    </slot>
    {{ label }}
    <span v-if="!download && !isMailto" class="sr-only">(opens in new tab)</span>
    <span class="cta-button-glow" />
  </a>
  <NuxtLink
    v-else-if="to"
    :to="to"
    :class="[btnClass, attention && 'btn-attention', secondary && 'cta-button-secondary']"
    :style="{
      backgroundColor: secondary ? secondaryBg : (attention ? 'var(--emphasis)' : 'var(--fg-secondary)'),
      borderColor: secondary ? secondaryBorder : (attention ? 'var(--emphasis)' : 'transparent'),
      color: secondary ? secondaryFg : (attention ? 'var(--on-emphasis)' : 'var(--bg-primary)'),
      '--mouse-x': `${mouseX}%`,
      '--mouse-y': `${mouseY}%`
    }"
    @mousemove="handleMouseMove"
  >
    <span
      v-if="withDot"
      :class="[
        'inline-block h-2 w-2 rounded-full',
        secondary ? 'cta-status-dot' : 'pulse-glow',
      ]"
      :style="secondary ? undefined : { backgroundColor: 'var(--emphasis)' }"
    />
    <slot name="icon">
      <span class="icon-wrapper" />
    </slot>
    {{ label }}
    <span class="cta-button-glow" />
  </NuxtLink>
</template>

<style scoped>
.cta-button {
  position: relative;
  overflow: hidden;
  border-color: transparent;
}

.cta-button--preserve-case {
  text-transform: none;
  letter-spacing: 0.02em;
  font-weight: 500;
}

/* Same token + pulse rhythm as about page `.availability-dot` */
.cta-status-dot {
  flex-shrink: 0;
  background: var(--status-available);
  animation: cta-status-dot-pulse 2s ease-in-out infinite;
}

@keyframes cta-status-dot-pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.6;
    transform: scale(1.2);
  }
}

@media (prefers-reduced-motion: reduce) {
  .cta-status-dot {
    animation: none;
    opacity: 1;
    transform: none;
  }
}

.cta-button-secondary {
  border-color: var(--border);
}

.cta-button-secondary:hover {
  background-color: var(--bg-tertiary);
  border-color: var(--emphasis);
}

/* Glow effect on hover */
.cta-button-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    color-mix(in srgb, var(--accent-soft) 55%, var(--accent-2-soft) 45%),
    transparent 60%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.btn-attention .cta-button-glow {
  background: radial-gradient(
    circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    color-mix(in srgb, var(--emphasis-soft) 55%, var(--emphasis) 45%),
    transparent 60%
  );
}

.cta-button:hover .cta-button-glow {
  opacity: 0.15;
}

.cta-button:hover:not(.btn-attention) {
  border-color: var(--emphasis);
  box-shadow:
    0 0 20px color-mix(in srgb, var(--emphasis) 22%, transparent),
    0 0 36px color-mix(in srgb, var(--emphasis-soft) 18%, transparent);
}

.cta-button:not(.btn-attention):hover {
  transform: scale(1.02);
}

.cta-button:not(.btn-attention):active {
  transform: scale(0.98);
}

.cta-button-secondary:hover {
  box-shadow:
    0 0 15px color-mix(in srgb, var(--emphasis) 20%, transparent),
    0 0 30px color-mix(in srgb, var(--emphasis) 10%, transparent);
}

/* Icon wrapper to maintain spacing */
.icon-wrapper:empty {
  display: none;
}

/* Attention CTA: single clear emphasis (no idle pulse) */
.btn-attention {
  position: relative;
  font-weight: 600;
  padding: 0.5rem 1.25rem;
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--emphasis) 35%, transparent);
}

.btn-attention:hover {
  border-color: var(--emphasis);
  transform: scale(1.02);
  box-shadow:
    0 0 24px color-mix(in srgb, var(--emphasis) 28%, transparent),
    0 0 0 1px color-mix(in srgb, var(--emphasis) 45%, transparent);
}

.btn-attention:active {
  transform: scale(0.98);
}
</style>
