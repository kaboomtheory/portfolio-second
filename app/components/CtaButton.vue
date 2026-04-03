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
  },
)

const isMailto = computed(() => Boolean(props.href?.toLowerCase().startsWith('mailto:')))

const secondaryBg = computed(() =>
  props.secondary && props.elevatedSecondary ? 'var(--btn-secondary-bg)' : 'transparent',
)

const secondaryFg = computed(() =>
  props.secondary && props.elevatedSecondary ? 'var(--fg-primary)' : 'var(--fg-secondary)',
)

const btnClass = computed(() =>
  [
    'cta-button inline-flex items-center gap-2 origin-center',
    !props.attention ? 'transition-all duration-300' : '',
    props.attention ? 'btn-attention shiny-cta' : 'rounded-md px-4 py-2 text-xs tracking-[0.1em]',
    props.preserveCase ? 'cta-button--preserve-case' : 'uppercase',
    props.secondary && 'cta-button-secondary',
    props.secondary && props.elevatedSecondary && 'cta-button-secondary--elevated',
  ]
    .filter(Boolean)
    .join(' '),
)

const mouseX = ref(50)
const mouseY = ref(50)

const handleMouseMove = (e: MouseEvent) => {
  const target = e.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  mouseX.value = ((e.clientX - rect.left) / rect.width) * 100
  mouseY.value = ((e.clientY - rect.top) / rect.height) * 100
}

function onMouseMove(e: MouseEvent) {
  if (props.attention) return
  handleMouseMove(e)
}

const inlineStyle = computed(() => {
  const mouse = {
    '--mouse-x': `${mouseX.value}%`,
    '--mouse-y': `${mouseY.value}%`,
  }
  if (props.secondary) {
    return {
      backgroundColor: secondaryBg.value,
      color: secondaryFg.value,
      ...mouse,
    }
  }
  if (props.attention) {
    return {}
  }
  return {
    backgroundColor: 'var(--btn-primary-bg)',
    color: 'var(--btn-primary-fg)',
    ...mouse,
  }
})
</script>

<template>
  <a
    v-if="href"
    :href="href"
    :target="download || isMailto ? undefined : '_blank'"
    :rel="download || isMailto ? undefined : 'noopener noreferrer'"
    :download="download || undefined"
    :class="btnClass"
    :style="inlineStyle"
    @mousemove="onMouseMove"
  >
    <template v-if="attention">
      <span class="shiny-cta-inner">
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
      </span>
    </template>
    <template v-else>
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
    </template>
    <span v-if="!download && !isMailto" class="sr-only">(opens in new tab)</span>
    <span v-if="!attention" class="cta-button-glow" />
  </a>
  <NuxtLink
    v-else-if="to"
    :to="to"
    :class="btnClass"
    :style="inlineStyle"
    @mousemove="onMouseMove"
  >
    <template v-if="attention">
      <span class="shiny-cta-inner">
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
      </span>
    </template>
    <template v-else>
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
    </template>
    <span v-if="!attention" class="cta-button-glow" />
  </NuxtLink>
</template>

<style scoped>
.cta-button {
  position: relative;
  overflow: hidden;
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
  border: var(--card-border);
  box-shadow: var(--card-ring);
  backdrop-filter: blur(15px) saturate(1.2);
  -webkit-backdrop-filter: blur(15px) saturate(1.2);
}

.cta-button-secondary--elevated {
  box-shadow:
    var(--card-ring),
    var(--shadow-sm),
    0 0 0 1px var(--chrome-ring-idle);
}

.cta-button-secondary:hover {
  background-color: var(--btn-secondary-bg);
}

.cta-button.cta-button-secondary--elevated:hover {
  box-shadow:
    var(--shadow-sm),
    0 0 0 1px var(--chrome-ring-idle),
    0 0 15px color-mix(in srgb, var(--accent) 20%, transparent),
    0 0 30px color-mix(in srgb, var(--accent) 10%, transparent);
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

.cta-button:hover .cta-button-glow {
  opacity: 0.15;
}

.cta-button:hover:not(.btn-attention) {
  box-shadow:
    0 0 20px color-mix(in srgb, var(--accent) 22%, transparent),
    0 0 36px color-mix(in srgb, var(--accent-soft) 18%, transparent);
}

.cta-button:not(.btn-attention):hover {
  transform: scale(1.02);
}

.cta-button:not(.btn-attention):active {
  transform: scale(0.98);
}

.cta-button-secondary:hover:not(.cta-button-secondary--elevated) {
  box-shadow:
    0 0 15px color-mix(in srgb, var(--accent) 20%, transparent),
    0 0 30px color-mix(in srgb, var(--accent) 10%, transparent);
}

/* Icon wrapper to maintain spacing */
.icon-wrapper:empty {
  display: none;
}

/* Attention CTA (non-shiny fallback — shiny resume CTAs use global .shiny-cta rules) */
.btn-attention:not(.shiny-cta) {
  position: relative;
  font-weight: 600;
  padding: 0.5rem 1.25rem;
  box-shadow: 0 0 20px color-mix(in srgb, var(--accent) 22%, transparent);
}

.btn-attention:not(.shiny-cta):hover {
  transform: scale(1.02);
  box-shadow:
    0 0 24px color-mix(in srgb, var(--accent) 28%, transparent);
}

.btn-attention:not(.shiny-cta):active {
  transform: scale(0.98);
}
</style>
