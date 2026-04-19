<script setup lang="ts">
withDefaults(
  defineProps<{
    groupedCapabilities: { category: string; items: string[] }[]
    sectionNumber?: string
    cardTitle?: string
  }>(),
  {
    sectionNumber: '03',
    cardTitle: 'Capabilities',
  },
)
</script>

<template>
  <section
    class="dashboard-tile bento-tile capabilities-tile reveal-up flex h-full min-h-0 flex-col overflow-hidden"
    aria-labelledby="dashboard-capabilities-heading"
  >
    <div class="capabilities-tile__scroll flex min-h-0 flex-1 flex-col overflow-hidden">
      <div class="section-header shrink-0">
        <span class="section-number">{{ sectionNumber }}</span>
        <h2 id="dashboard-capabilities-heading" class="section-title">
          {{ cardTitle }}
        </h2>
      </div>

      <div class="dashboard-tile__content min-h-0 flex-1 overflow-hidden">
        <div class="capabilities-grid">
          <div v-for="group in groupedCapabilities" :key="group.category" class="capability-group">
            <h3 class="capability-group-title">
              {{ group.category }}
            </h3>
            <div class="capability-tags">
              <span v-for="item in group.items" :key="item" class="capability-tag">
                {{ item }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.capabilities-tile__scroll {
  display: flex;
  flex-direction: column;
}

.capabilities-grid {
  display: grid;
  gap: 0.25rem;
  grid-template-columns: 1fr;
  min-height: 0;
  overflow: hidden;
  align-content: start;
}

.capability-group {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.capability-group-title {
  font-family: 'Geist Sans', system-ui, sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: -0.005em;
  color: var(--fg-muted);
}

.capability-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.2rem;
}

.capability-tag {
  padding: 0.25rem 0.5625rem;
  font-size: 0.6875rem;
  font-weight: 500;
  color: var(--fg-secondary);
  background: var(--bg-secondary);
  border: 1px solid rgba(61, 125, 186, 0.15);
  backdrop-filter: blur(15px) saturate(1.2);
  -webkit-backdrop-filter: blur(15px) saturate(1.2);
  border-radius: 9999px;
  transition:
    color 200ms ease,
    background-color 200ms ease;
}

:root.dark .capability-tag {
  background: var(--bg-secondary);
  border-color: rgba(255, 255, 255, 0.08);
}

.capability-tag:hover {
  color: var(--fg-primary);
  background-color: color-mix(in srgb, var(--neon-mid) 8%, var(--bg-secondary));
}

:root.dark .capability-tag:hover {
  background-color: color-mix(in srgb, var(--neon) 8%, var(--bg-secondary));
}
</style>
