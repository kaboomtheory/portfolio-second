<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import type { StatusItem } from '~/data/home'

const props = withDefaults(
  defineProps<{
    statusItems: StatusItem[]
    /** `ticker` = horizontal marquee; `stack` = mono list (e.g. story rail) */
    layout?: 'ticker' | 'stack'
  }>(),
  { layout: 'ticker' },
)

const reduceTickerMotion = ref(false)
let motionPreferenceQuery: MediaQueryList | null = null

function syncReduceTickerMotion() {
  if (!import.meta.client || !motionPreferenceQuery) return
  reduceTickerMotion.value = motionPreferenceQuery.matches
}

onMounted(() => {
  motionPreferenceQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  syncReduceTickerMotion()
  motionPreferenceQuery.addEventListener('change', syncReduceTickerMotion)
})

onUnmounted(() => {
  motionPreferenceQuery?.removeEventListener('change', syncReduceTickerMotion)
})

const tickerCells = computed(() => {
  const items = props.statusItems
  const repeats = reduceTickerMotion.value ? 1 : 2
  const out: { item: StatusItem; key: string; showSep: boolean }[] = []
  for (let r = 0; r < repeats; r++) {
    for (let i = 0; i < items.length; i++) {
      const isLast = r === repeats - 1 && i === items.length - 1
      out.push({
        item: items[i]!,
        key: `ticker-${r}-${i}`,
        showSep: !isLast,
      })
    }
  }
  return out
})
</script>

<template>
  <RevealOnScroll
    v-if="layout === 'ticker'"
    id="status"
    :delay="200"
    class="ticker-section full-bleed"
  >
    <div class="full-bleed-inner">
      <div class="ticker-wrapper">
        <div
          class="ticker-track"
          :class="{ 'ticker-track--marquee': !reduceTickerMotion }"
        >
          <div class="ticker-content">
            <template v-for="cell in tickerCells" :key="cell.key">
              <div class="ticker-cluster">
                <div class="ticker-item">
                  <div class="ticker-image">
                    <img
                      v-if="cell.item.images?.length"
                      :src="cell.item.images[0]"
                      alt=""
                    >
                    <Icon v-else-if="cell.item.icon" :icon="cell.item.icon" class="h-5 w-5 text-[var(--fg-muted)]" />
                  </div>
                  <div class="ticker-info">
                    <span class="ticker-label">{{ cell.item.label }}</span>
                    <span class="ticker-title">{{ cell.item.title }}</span>
                  </div>
                </div>
                <span v-if="cell.showSep" class="ticker-sep" aria-hidden="true">·</span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </RevealOnScroll>
  <div v-else class="status-stack" role="list">
    <div
      v-for="(item, i) in statusItems"
      :key="`${item.label}-${i}`"
      class="status-stack-row"
      role="listitem"
    >
      <span class="status-stack-label">{{ item.label }}</span>
      <span class="status-stack-title">{{ item.title }}</span>
    </div>
  </div>
</template>

<style scoped>
.status-stack {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.status-stack-row {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.55rem 0;
  border-bottom: 1px solid var(--rule-soft);
}

.status-stack-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.status-stack-label {
  font-family: var(--font-mono);
  font-size: var(--label-size);
  font-weight: 500;
  letter-spacing: var(--label-tracking-mono);
  text-transform: uppercase;
  color: var(--signal);
}

.status-stack-title {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: var(--fg-primary);
  line-height: 1.35;
}

.ticker-section {
  margin-block: 0;
  padding: var(--space-md) 0;
  overflow: hidden;
  border-top: 1px solid color-mix(in srgb, var(--fg-muted) 14%, transparent);
  /* Inherits .story-band surface; avoids tone seam vs parent */
  background: transparent;
}

.ticker-wrapper {
  position: relative;
  padding-block: 0.125rem;
  padding-inline: clamp(0.5rem, 2vw, 1.25rem);
  -webkit-mask-image: linear-gradient(
    to right,
    transparent,
    #000 3.25rem,
    #000 calc(100% - 3.25rem),
    transparent
  );
  mask-image: linear-gradient(
    to right,
    transparent,
    #000 3.25rem,
    #000 calc(100% - 3.25rem),
    transparent
  );
}

.ticker-wrapper:hover .ticker-track--marquee,
.ticker-wrapper:focus-within .ticker-track--marquee {
  animation-play-state: paused;
}

.ticker-track {
  display: flex;
  --ticker-duration: 40s;
}

.ticker-track--marquee {
  width: max-content;
  animation: ticker-scroll var(--ticker-duration) linear infinite;
}

@media (max-width: 640px) {
  .ticker-track {
    --ticker-duration: 56s;
  }
}

.ticker-track:not(.ticker-track--marquee) {
  width: 100%;
  max-width: 100%;
}

@keyframes ticker-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.ticker-content {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: var(--space-lg);
}

.ticker-cluster {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: var(--space-md);
}

.ticker-track:not(.ticker-track--marquee) .ticker-content {
  flex-wrap: wrap;
  justify-content: center;
  row-gap: var(--space-md);
  width: 100%;
}

.ticker-sep {
  flex: 0 0 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  line-height: 1;
  font-weight: 300;
  color: var(--fg-muted);
  opacity: 0.45;
  user-select: none;
}

.ticker-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.875rem;
  background: var(--bg-primary);
  border: var(--card-border);
  box-shadow: var(--shadow-sm);
  border-radius: var(--radius-card);
  transition: background-color 200ms ease;
}

.ticker-item:hover {
  background: var(--bg-tertiary);
}

.ticker-image {
  width: 32px;
  height: 32px;
  border-radius: 0.25rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-tertiary);
}

.ticker-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ticker-info {
  display: flex;
  flex-direction: column;
}

.ticker-label {
  font-size: var(--label-size);
  font-family: var(--font-mono);
  font-weight: 500;
  letter-spacing: var(--label-tracking-mono);
  text-transform: uppercase;
  color: var(--signal);
}

.ticker-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--fg-primary);
  white-space: nowrap;
  max-width: min(14rem, 42vw);
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (min-width: 768px) {
  .ticker-title {
    max-width: min(20rem, 32vw);
  }
}
</style>
