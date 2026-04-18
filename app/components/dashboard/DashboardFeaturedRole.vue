<script setup lang="ts">
interface DashboardExperienceEntry {
  title: string
  company: string
  year: string
  description: string
  image?: string | null
}

const props = withDefaults(
  defineProps<{
    role: DashboardExperienceEntry | null | undefined
    historyItems?: DashboardExperienceEntry[]
  }>(),
  {
    historyItems: () => [],
  },
)

const labelledBy = computed(() =>
  props.historyItems.length
    ? 'dashboard-featured-heading dashboard-history-heading'
    : 'dashboard-featured-heading',
)
</script>

<template>
  <section
    v-if="role"
    class="dashboard-tile bento-tile featured-role experience-tile reveal-up flex h-full min-h-0 flex-col"
    :aria-labelledby="labelledBy"
  >
    <div class="experience-current">
      <div class="featured-eyebrow">
        <span class="featured-eyebrow__tag">CURRENT</span>
        <span class="featured-eyebrow__year">{{ role.year }}</span>
      </div>

      <div class="featured-head">
        <img
          v-if="role.image"
          :src="role.image"
          :alt="role.company"
          loading="lazy"
          class="featured-logo"
        >
        <div class="featured-head__text">
          <p class="featured-company">
            {{ role.company }}
          </p>
          <h2 id="dashboard-featured-heading" class="featured-title">
            {{ role.title }}
          </h2>
        </div>
      </div>

      <div class="bento-scroll featured-body" tabindex="0" aria-label="Current role description">
        <p class="featured-desc">
          {{ role.description }}
        </p>
      </div>
    </div>

    <div v-if="historyItems.length" class="experience-history">
      <div class="history-header">
        <h2 id="dashboard-history-heading" class="history-title">
          History
        </h2>
        <span class="history-count">{{ historyItems.length }}</span>
      </div>

      <div
        class="bento-scroll history-scroll"
        tabindex="0"
        aria-label="Previous roles"
      >
        <ul class="history-list">
          <li
            v-for="(item, index) in historyItems"
            :key="`${item.company}-${item.year}`"
            class="history-row"
            :style="{ '--delay': `${index * 0.06}s` }"
          >
            <img
              v-if="item.image"
              :src="item.image"
              :alt="item.company"
              loading="lazy"
              class="history-logo"
            >
            <div class="history-row__text">
              <p class="history-row__title">
                {{ item.title }}
              </p>
              <p class="history-row__company">
                {{ item.company }}
              </p>
            </div>
            <span class="history-row__year">{{ item.year }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.experience-tile {
  gap: 0.625rem;
  flex: 1 1 auto;
  min-height: 0;
}

.experience-current {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  flex-shrink: 0;
}

.experience-history {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1 1 auto;
  min-height: 0;
  margin-top: 0.125rem;
  padding-top: 0.625rem;
  border-top: 1px solid color-mix(in srgb, var(--fg-muted) 14%, transparent);
}

.featured-eyebrow {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: var(--accent);
}

.featured-eyebrow__year {
  color: var(--fg-muted);
  font-weight: 600;
}

.featured-head {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  min-width: 0;
}

.featured-logo {
  width: 44px;
  height: 44px;
  border-radius: 0.5rem;
  object-fit: contain;
  padding: 4px;
  background: var(--bg-secondary);
  border: var(--card-border);
  flex-shrink: 0;
}

.featured-head__text {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
}

.featured-company {
  font-family: 'Geist Sans', system-ui, sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--fg-muted);
  margin: 0;
}

.featured-title {
  font-size: clamp(1rem, 0.5vw + 0.85rem, 1.125rem);
  font-weight: 650;
  letter-spacing: -0.012em;
  line-height: 1.2;
  color: var(--fg-primary);
  margin: 0;
}

.featured-body {
  padding-right: 0.25rem;
}

.featured-desc {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.55;
  color: var(--fg-secondary);
}

.history-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
  flex-shrink: 0;
}

.history-title {
  font-family: 'Geist Sans', system-ui, sans-serif;
  font-size: 0.8125rem;
  font-weight: 650;
  letter-spacing: -0.01em;
  color: var(--fg-primary);
  margin: 0;
}

.history-count {
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: var(--fg-muted);
  padding: 0.125rem 0.4375rem;
  border-radius: 9999px;
  background: var(--bg-secondary);
  border: 1px solid color-mix(in srgb, var(--fg-muted) 16%, transparent);
}

.history-scroll {
  padding-right: 0.25rem;
  min-height: 0;
  flex: 1 1 auto;
}

.history-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.3125rem;
}

.history-row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  column-gap: 0.5rem;
  padding: 0.375rem 0.5rem;
  background: var(--bg-secondary);
  border: var(--card-border);
  border-radius: calc(var(--radius-card) - 0.25rem);
  animation: history-row-in 0.4s ease-out backwards;
  animation-delay: var(--delay);
}

.history-logo {
  width: 22px;
  height: 22px;
  border-radius: 0.25rem;
  object-fit: contain;
  padding: 2px;
  background: var(--bg-primary);
  flex-shrink: 0;
}

.history-row__text {
  display: flex;
  flex-direction: column;
  gap: 0;
  min-width: 0;
}

.history-row__title {
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.2;
  color: var(--fg-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history-row__company {
  margin: 0;
  font-size: 0.6875rem;
  font-weight: 500;
  color: var(--fg-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history-row__year {
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--accent);
  white-space: nowrap;
}

@keyframes history-row-in {
  from {
    opacity: 0;
    transform: translateY(6px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .history-row {
    animation: none;
  }
}
</style>
