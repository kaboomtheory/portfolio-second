<script setup lang="ts">
import { computed } from 'vue'

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
    /** Pill shape + padding aligned with attention Swiss pill */
    pill?: boolean
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
    pill: false,
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
    !props.attention ? 'transition-colors duration-150' : '',
    props.attention
      ? 'btn-attention cta-attention-pill'
      : props.pill
        ? 'cta-button--pill tracking-[0.12em]'
        : 'px-4 py-2 text-xs tracking-[0.12em]',
    props.preserveCase ? 'cta-button--preserve-case' : 'uppercase',
    props.secondary && 'cta-button-secondary',
    props.secondary && props.elevatedSecondary && 'cta-button-secondary--elevated',
  ]
    .filter(Boolean)
    .join(' '),
)

const inlineStyle = computed(() => {
  if (props.secondary) {
    return {
      backgroundColor: secondaryBg.value,
      color: secondaryFg.value,
    }
  }
  if (props.attention) {
    return {}
  }
  return {
    backgroundColor: 'var(--btn-primary-bg)',
    color: 'var(--btn-primary-fg)',
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
  >
    <template v-if="attention">
      <span class="cta-attention-pill__inner">
        <span
          v-if="withDot"
          class="inline-block h-2 w-2 shrink-0 rounded-full cta-attention-dot"
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
        class="inline-block h-2 w-2 shrink-0 rounded-full cta-attention-dot"
      />
      <slot name="icon">
        <span class="icon-wrapper" />
      </slot>
      {{ label }}
    </template>
    <span v-if="!download && !isMailto" class="sr-only">(opens in new tab)</span>
  </a>
  <NuxtLink
    v-else-if="to"
    :to="to"
    :class="btnClass"
    :style="inlineStyle"
  >
    <template v-if="attention">
      <span class="cta-attention-pill__inner">
        <span
          v-if="withDot"
          class="inline-block h-2 w-2 shrink-0 rounded-full cta-attention-dot"
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
        class="inline-block h-2 w-2 shrink-0 rounded-full cta-attention-dot"
      />
      <slot name="icon">
        <span class="icon-wrapper" />
      </slot>
      {{ label }}
    </template>
  </NuxtLink>
</template>

<style scoped>
.cta-button {
  position: relative;
  overflow: hidden;
}

/* Swiss flat pill: mono label, hairline border — corners match .nav-link */
.cta-button {
  font-family: var(--font-mono);
  border-radius: var(--radius-control, 0.35rem);
}

.cta-button--pill:not(.btn-attention) {
  border-radius: var(--radius-control, 0.35rem);
  padding: 0.65rem 1.4rem;
  font-size: 0.75rem;
  line-height: 1.2;
  font-weight: 500;
}

.cta-button--preserve-case {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 500;
}

.cta-attention-dot {
  flex-shrink: 0;
  background: var(--fg-muted);
}

.btn-attention .cta-attention-dot {
  background: color-mix(in srgb, var(--pastel-ink) 42%, transparent);
}

.cta-button-secondary {
  border: 1px solid var(--fg-primary);
  background: transparent !important;
  color: var(--fg-primary) !important;
}

.cta-button-secondary--elevated {
  border: 1px solid var(--fg-primary);
}

.cta-button-secondary:hover {
  background-color: var(--fg-primary) !important;
  color: var(--bg-primary) !important;
}

/* Icon wrapper to maintain spacing */
.icon-wrapper:empty {
  display: none;
}

</style>
