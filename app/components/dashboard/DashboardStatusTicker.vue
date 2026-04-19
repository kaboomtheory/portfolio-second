<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { StatusItem } from '~/data/home'

const props = defineProps<{
  statusItems: StatusItem[]
}>()

/** After mount, may switch to one loop for prefers-reduced-motion (SSR stays doubled for hydration match). */
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
  <section
    v-if="statusItems.length"
    class="ticker-section bento-ticker reveal-up flex min-h-0 max-h-full shrink-0 flex-col overflow-hidden"
    aria-label="Status"
  >
    <div class="ticker-wrapper min-h-0 min-w-0">
      <div
        class="ticker-track"
        :class="{ 'ticker-track--marquee': !reduceTickerMotion }"
      >
        <div class="ticker-content">
          <template v-for="cell in tickerCells" :key="cell.key">
            <div class="ticker-item">
              <div class="ticker-image">
                <img v-if="cell.item.images?.length" :src="cell.item.images[0]" :alt="cell.item.title">
                <Icon v-else-if="cell.item.icon" :icon="cell.item.icon" class="h-5 w-5 text-[var(--fg-muted)]" />
              </div>
              <div class="ticker-info">
                <span class="ticker-label">{{ cell.item.label }}</span>
                <span class="ticker-title">{{ cell.item.title }}</span>
              </div>
            </div>
            <span v-if="cell.showSep" class="ticker-sep" aria-hidden="true">·</span>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ticker-section {
  padding: 0.2rem 0;
  overflow: hidden;
  border-block: 1px solid color-mix(in srgb, var(--fg-muted) 14%, transparent);
  background: var(--bg-secondary);
  backdrop-filter: blur(15px) saturate(1.2);
  -webkit-backdrop-filter: blur(15px) saturate(1.2);
  border-radius: var(--radius-card);
  border: var(--card-border);
  box-shadow: var(--card-ring);
}

:root.dark .ticker-section {
  border-block-color: color-mix(in srgb, var(--accent-soft) 16%, transparent);
}

.bento-ticker {
  justify-content: center;
}

.ticker-wrapper {
  position: relative;
  -webkit-mask-image: linear-gradient(
    to right,
    transparent,
    #000 1.25rem,
    #000 calc(100% - 1.25rem),
    transparent
  );
  mask-image: linear-gradient(
    to right,
    transparent,
    #000 1.25rem,
    #000 calc(100% - 1.25rem),
    transparent
  );
}

.ticker-wrapper:hover .ticker-track--marquee {
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
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-50%);
  }
}

.ticker-content {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 0.35rem;
}

.ticker-track:not(.ticker-track--marquee) .ticker-content {
  flex-wrap: wrap;
  justify-content: center;
  row-gap: 0.25rem;
  width: 100%;
}

.ticker-sep {
  flex-shrink: 0;
  align-self: center;
  font-size: 1.125rem;
  line-height: 1;
  font-weight: 300;
  color: var(--fg-muted);
  opacity: 0.45;
  user-select: none;
}

.ticker-item {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  min-width: 0;
  max-width: 100%;
  padding: 0.25rem 0.5rem;
  background: var(--bg-primary);
  border: var(--card-border);
  box-shadow: var(--card-ring);
  backdrop-filter: blur(15px) saturate(1.2);
  -webkit-backdrop-filter: blur(15px) saturate(1.2);
  border-radius: var(--radius-card);
  transition: background-color 200ms ease;
}

.ticker-item:hover {
  background: var(--bg-tertiary);
}

.ticker-image {
  width: 28px;
  height: 28px;
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
  min-width: 0;
}

.ticker-label {
  font-size: 0.625rem;
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent);
}

.ticker-title {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--fg-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 480px) {
  .ticker-item {
    padding: 0.3rem 0.5rem;
  }

  .ticker-title {
    white-space: normal;
    overflow-wrap: anywhere;
    overflow: visible;
    text-overflow: unset;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ticker-track--marquee {
    animation: none;
    transform: none;
  }
}
</style>
