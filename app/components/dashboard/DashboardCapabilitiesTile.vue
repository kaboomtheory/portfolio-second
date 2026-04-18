<script setup lang="ts">
defineProps<{
  groupedCapabilities: { category: string; items: string[] }[]
}>()
</script>

<template>
  <section
    class="dashboard-tile bento-tile capabilities-tile reveal-up flex h-full min-h-0 flex-col"
    aria-labelledby="dashboard-capabilities-heading"
  >
    <div
      class="bento-scroll capabilities-tile__scroll min-h-0 flex-1"
      tabindex="0"
      aria-label="Capabilities and tools"
    >
      <div class="section-header shrink-0">
        <span class="section-number">02</span>
        <h2 id="dashboard-capabilities-heading" class="section-title">
          Capabilities
        </h2>
        <p class="section-lede">
          Disciplines I practice and the software I use.
        </p>
      </div>

      <div class="capabilities-grid mt-3 pb-1">
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
  </section>
</template>

<style scoped>
.capabilities-tile__scroll {
  display: flex;
  flex-direction: column;
}

.section-lede {
  font-size: 0.75rem;
  line-height: 1.4;
  color: var(--fg-muted);
  margin-top: 0.25rem;
  max-width: 100%;
}

.capabilities-grid {
  display: grid;
  gap: var(--space-sm);
  grid-template-columns: 1fr;
}

.capability-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
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
  gap: 0.3125rem;
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
