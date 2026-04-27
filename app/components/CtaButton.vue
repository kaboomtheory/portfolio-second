<script setup lang="ts">
import { computed } from 'vue'
import { useInPageHashLink } from '~/composables/useInPageHashLink'

const { onInPageHashLinkClick } = useInPageHashLink()

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

/** http(s) links only: same-site paths, hashes, mailto, tel, and files stay in-page / same tab. */
const isExternalHttpHref = computed(() => /^https?:\/\//i.test((props.href ?? '').trim()))

const opensInNewTab = computed(
  () => !props.download && !isMailto.value && isExternalHttpHref.value,
)

const btnClass = computed(() =>
  [
    'cta-button inline-flex items-center gap-2 origin-center',
    !props.attention && !props.secondary ? 'cta-button--primary-surface' : '',
    !props.attention && props.secondary ? 'transition-colors duration-150' : '',
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

function onNuxtLinkClick(e: MouseEvent) {
  if (!props.to) return
  onInPageHashLinkClick(e, props.to)
}

</script>

<template>
  <a
    v-if="href"
    :href="href"
    :target="download || isMailto || !opensInNewTab ? undefined : '_blank'"
    :rel="download || isMailto || !opensInNewTab ? undefined : 'noopener noreferrer'"
    :download="download || undefined"
    :class="btnClass"
  >
    <template v-if="attention">
      <span class="cta-attention-pill__inner">
        <span
          v-if="withDot"
          class="inline-block h-2 w-2 shrink-0 rounded-full cta-attention-dot"
        />
        <span class="cta-icon-wrap">
          <slot name="icon">
            <span class="icon-wrapper" />
          </slot>
        </span>
        {{ label }}
      </span>
    </template>
    <template v-else>
      <span
        v-if="withDot"
        class="inline-block h-2 w-2 shrink-0 rounded-full cta-attention-dot"
      />
      <span class="cta-icon-wrap">
        <slot name="icon">
          <span class="icon-wrapper" />
        </slot>
      </span>
      {{ label }}
    </template>
    <span v-if="opensInNewTab" class="sr-only">(opens in new tab)</span>
  </a>
  <NuxtLink
    v-else-if="to"
    :to="to"
    :class="btnClass"
    @click="onNuxtLinkClick"
  >
    <template v-if="attention">
      <span class="cta-attention-pill__inner">
        <span
          v-if="withDot"
          class="inline-block h-2 w-2 shrink-0 rounded-full cta-attention-dot"
        />
        <span class="cta-icon-wrap">
          <slot name="icon">
            <span class="icon-wrapper" />
          </slot>
        </span>
        {{ label }}
      </span>
    </template>
    <template v-else>
      <span
        v-if="withDot"
        class="inline-block h-2 w-2 shrink-0 rounded-full cta-attention-dot"
      />
      <span class="cta-icon-wrap">
        <slot name="icon">
          <span class="icon-wrapper" />
        </slot>
      </span>
      {{ label }}
    </template>
  </NuxtLink>
</template>

<style scoped>
.cta-button {
  position: relative;
  overflow: hidden;
  background-color: var(--btn-primary-bg);
  color: var(--btn-primary-fg);
}

/* Hue-matched hover shadows paint outside the box; attention pills opt out of clipping */
.cta-button.btn-attention {
  overflow: visible;
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
  background: color-mix(in srgb, var(--pastel-ink) 42%, var(--btn-attention-bg, var(--pastel-peach)));
}

.cta-button-secondary {
  border: 1px solid var(--fg-primary);
  background: transparent !important;
  color: var(--fg-primary) !important;
}

.cta-button-secondary--elevated {
  border: 1px solid var(--fg-primary);
  background-color: var(--btn-secondary-bg) !important;
  color: var(--fg-primary) !important;
}

.cta-button-secondary:not(.cta-button-secondary--elevated) {
  background-color: transparent !important;
  color: var(--fg-secondary) !important;
}

.cta-button-secondary:hover {
  background-color: var(--fg-primary) !important;
  color: var(--bg-primary) !important;
}

.cta-button--primary-surface {
  transition:
    transform 0.2s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.22s cubic-bezier(0.16, 1, 0.3, 1),
    background-color 0.18s cubic-bezier(0.25, 1, 0.5, 1),
    color 0.18s cubic-bezier(0.25, 1, 0.5, 1);
}

.cta-button--primary-surface:hover {
  transform: translate3d(0, -1px, 0);
  box-shadow: 0 0.35rem 1.1rem color-mix(in srgb, var(--btn-primary-bg) 28%, transparent);
}

.cta-button--primary-surface:active {
  transform: translate3d(0, 0.5px, 0) scale(0.99);
  transition-duration: 0.1s;
}

@media (prefers-reduced-motion: reduce) {
  .cta-button--primary-surface {
    transition: none;
  }

  .cta-button--primary-surface:hover,
  .cta-button--primary-surface:active {
    transform: none;
    box-shadow: none;
  }
}

/* Icon wrapper to maintain spacing */
.icon-wrapper:empty {
  display: none;
}

/* B3: Icon micro-animation on hover */
.cta-icon-wrap {
  display: inline-flex;
  align-items: center;
  transition: transform 240ms var(--motion-ease-hero, cubic-bezier(0.16, 1, 0.3, 1));
}

.cta-button--primary-surface:hover .cta-icon-wrap {
  transform: translateY(-1px) scale(1.1);
}

.btn-attention:is(:hover, :focus-visible) .cta-icon-wrap {
  transform: scale(1.12);
}

@media (prefers-reduced-motion: reduce) {
  .cta-icon-wrap {
    transition: none;
  }

  .cta-button--primary-surface:hover .cta-icon-wrap,
  .btn-attention:is(:hover, :focus-visible) .cta-icon-wrap {
    transform: none;
  }
}

</style>
