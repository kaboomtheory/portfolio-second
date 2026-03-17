<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    to?: string
    href?: string
    label: string
    secondary?: boolean
    withDot?: boolean
    attention?: boolean
  }>(),
  {
    to: undefined,
    href: undefined,
    secondary: false,
    withDot: false,
    attention: false,
  }
)

const btnClass = 'cta-button inline-flex items-center gap-2 rounded-md border px-4 py-2 text-xs uppercase tracking-[0.1em] transition-all duration-300 hover:scale-105 active:scale-95 origin-center hover:shadow-lg'

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
    target="_blank"
    rel="noopener noreferrer"
    :class="[btnClass, attention && 'btn-attention', secondary && 'cta-button-secondary']"
    :style="{
      backgroundColor: secondary ? 'transparent' : 'var(--fg-secondary)',
      borderColor: secondary ? 'var(--border)' : 'transparent',
      color: secondary ? 'var(--fg-secondary)' : 'var(--bg-primary)',
      '--mouse-x': `${mouseX}%`,
      '--mouse-y': `${mouseY}%`
    }"
    @mousemove="handleMouseMove"
  >
    <span v-if="withDot" class="inline-block h-2 w-2 rounded-full pulse-glow" :style="{ backgroundColor: 'var(--accent)' }" />
    <slot name="icon">
      <span class="icon-wrapper" />
    </slot>
    {{ label }}
    <span class="sr-only">(opens in new tab)</span>
    <span class="cta-button-glow" />
  </a>
  <NuxtLink
    v-else-if="to"
    :to="to"
    :class="[btnClass, attention && 'btn-attention', secondary && 'cta-button-secondary']"
    :style="{
      backgroundColor: secondary ? 'transparent' : 'var(--fg-secondary)',
      borderColor: secondary ? 'var(--border)' : 'transparent',
      color: secondary ? 'var(--fg-secondary)' : 'var(--bg-primary)',
      '--mouse-x': `${mouseX}%`,
      '--mouse-y': `${mouseY}%`
    }"
    @mousemove="handleMouseMove"
  >
    <span v-if="withDot" class="inline-block h-2 w-2 rounded-full pulse-glow" :style="{ backgroundColor: 'var(--accent)' }" />
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

.cta-button-secondary {
  border-color: var(--border);
}

.cta-button-secondary:hover {
  background-color: var(--bg-tertiary);
  border-color: var(--accent);
}

/* Glow effect on hover */
.cta-button-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    var(--accent-soft),
    transparent 60%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.cta-button:hover .cta-button-glow {
  opacity: 0.15;
}

.cta-button:hover {
  border-color: var(--accent);
  box-shadow:
    0 0 20px color-mix(in srgb, var(--accent) 30%, transparent),
    0 0 40px color-mix(in srgb, var(--accent) 15%, transparent);
}

.cta-button-secondary:hover {
  box-shadow:
    0 0 15px color-mix(in srgb, var(--accent) 20%, transparent),
    0 0 30px color-mix(in srgb, var(--accent) 10%, transparent);
}

/* Icon wrapper to maintain spacing */
.icon-wrapper:empty {
  display: none;
}

/* Attention animation styles */
.btn-attention {
  position: relative;
}

.btn-attention::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  background: linear-gradient(45deg, var(--accent), var(--accent-soft), var(--accent));
  opacity: 0;
  z-index: -1;
  animation: attention-glow 2s ease-in-out infinite;
  filter: blur(8px);
}

@keyframes attention-glow {
  0%, 100% {
    opacity: 0;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.02);
  }
}

.btn-attention:hover::before {
  animation: none;
  opacity: 0;
}
</style>
