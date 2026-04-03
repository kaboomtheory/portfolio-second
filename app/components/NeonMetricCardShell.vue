<script setup lang="ts">
withDefaults(
  defineProps<{
    compact?: boolean
    /** Sets `aria-labelledby` on the article when provided */
    headingId?: string
    /** Full width of parent (e.g. main column); omit metric card max-width cap */
    fluidWidth?: boolean
  }>(),
  {
    compact: false,
    headingId: undefined,
    fluidWidth: false,
  },
)
</script>

<template>
  <div
    class="metric-card-shell"
    :class="{ 'metric-card-shell--fluid': fluidWidth }"
  >
    <article
      class="metric-card"
      :class="{
        'metric-card--compact': compact,
        'metric-card--fluid': fluidWidth,
      }"
      :aria-labelledby="headingId ?? undefined"
    >
      <div class="metric-card__base" aria-hidden="true" />
      <div class="metric-card__sheen" aria-hidden="true" />
      <div class="metric-card__bottom-neon" aria-hidden="true" />

      <div class="metric-card__grid" aria-hidden="true" />

      <div class="metric-card__body">
        <slot />
      </div>
    </article>
  </div>
</template>

<style scoped>
.metric-card-shell {
  width: 100%;
  max-width: 22.5rem;
  margin-inline: auto;
  padding: 1.5rem 0 2.25rem;
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.12))
    drop-shadow(0 8px 20px rgba(61, 125, 186, 0.18));
}

:root.dark .metric-card-shell {
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.5))
    drop-shadow(0 12px 28px rgba(87, 166, 255, 0.22));
}

@media (min-width: 480px) {
  .metric-card-shell:not(.metric-card-shell--fluid) {
    max-width: 24rem;
  }
}

.metric-card-shell--fluid {
  max-width: none;
  width: 100%;
  padding-left: 0;
  padding-right: 0;
}

.metric-card {
  /* Light mode palette */
  --neon: #2a5fa0;
  --neon-mid: #3d7dba;
  --neon-soft: #2a3f5c;
  --neon-frost: #0a1628;
  --text: #0a1628;
  --muted: #425a78;
  --muted-neon: rgba(66, 90, 120, 0.72);

  position: relative;
  isolation: isolate;
  min-height: 26.5rem;
  border-radius: 3rem;
  overflow: hidden;
  font-family: 'Geist Sans', system-ui, sans-serif;
  background: rgba(240, 248, 255, 0.78);
  border: 1px solid rgba(61, 125, 186, 0.22);
  box-shadow:
    0 0 0 1px rgba(61, 125, 186, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(15px) saturate(1.2);
  -webkit-backdrop-filter: blur(15px) saturate(1.2);
}

:root.dark .metric-card {
  --neon: #57a6ff;
  --neon-mid: #7ab8ff;
  --neon-soft: #a8d4ff;
  --neon-frost: #d4eaff;
  --text: #ffffff;
  --muted: #8a94a8;
  --muted-neon: rgba(168, 212, 255, 0.62);
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow:
    0 0 0 1px rgba(87, 166, 255, 0.14),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.metric-card--compact {
  min-height: auto;
}

.metric-card__base {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: transparent;
}

.metric-card__sheen {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.6) 0%,
    transparent 38%,
    rgba(61, 125, 186, 0.05) 100%
  );
  pointer-events: none;
}

:root.dark .metric-card__sheen {
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.045) 0%,
    transparent 38%,
    rgba(87, 166, 255, 0.06) 100%
  );
}

.metric-card__bottom-neon {
  position: absolute;
  left: -18%;
  right: -18%;
  bottom: -38%;
  height: 72%;
  z-index: 0;
  background: transparent;
  pointer-events: none;
}

.metric-card__grid {
  position: absolute;
  left: 0.65rem;
  right: 0.65rem;
  top: 22%;
  bottom: 0;
  z-index: 0;
  background-image:
    linear-gradient(to top, rgba(61, 125, 186, 0.1) 1px, transparent 1px),
    linear-gradient(to right, rgba(61, 125, 186, 0.08) 1px, transparent 1px);
  background-size: 100% 1rem, 1.625rem 100%;
  background-position: 0 100%, 0 0;
  /* Stronger feather: solid near bottom, soft mid-falloff, gone toward top */
  mask-image: linear-gradient(
    to top,
    black 0%,
    black 42%,
    rgba(0, 0, 0, 0.45) 58%,
    rgba(0, 0, 0, 0.12) 74%,
    transparent 92%
  );
  -webkit-mask-image: linear-gradient(
    to top,
    black 0%,
    black 42%,
    rgba(0, 0, 0, 0.45) 58%,
    rgba(0, 0, 0, 0.12) 74%,
    transparent 92%
  );
  opacity: 0.72;
  pointer-events: none;
}

:root.dark .metric-card__grid {
  background-image:
    linear-gradient(to top, rgba(255, 255, 255, 0.06) 1px, transparent 1px),
    linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
}

.metric-card--compact .metric-card__grid {
  top: 18%;
  mask-image: linear-gradient(
    to top,
    black 0%,
    black 38%,
    rgba(0, 0, 0, 0.4) 55%,
    rgba(0, 0, 0, 0.1) 72%,
    transparent 90%
  );
  -webkit-mask-image: linear-gradient(
    to top,
    black 0%,
    black 38%,
    rgba(0, 0, 0, 0.4) 55%,
    rgba(0, 0, 0, 0.1) 72%,
    transparent 90%
  );
}

.metric-card__body {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: inherit;
  padding: 1.5rem 1.625rem 1.75rem;
}

.metric-card--compact .metric-card__body {
  min-height: 0;
}

.metric-card--fluid {
  border-radius: clamp(1rem, 2.25vw, 1.5rem);
}

.metric-card--fluid .metric-card__body {
  padding: clamp(1.25rem, 3.5vw, 1.5rem) clamp(1rem, 4vw, 1.75rem)
    clamp(1.35rem, 3.5vw, 1.75rem);
}

@media (min-width: 768px) {
  .metric-card--fluid .metric-card__body {
    padding-left: clamp(1.5rem, 3vw, 2rem);
    padding-right: clamp(1.5rem, 3vw, 2rem);
  }
}
</style>
