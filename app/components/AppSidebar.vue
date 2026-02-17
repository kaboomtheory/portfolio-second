<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { navItems, profile, socialLinks } from '~/data/site'

withDefaults(
  defineProps<{
    mobile?: boolean
  }>(),
  {
    mobile: false,
  }
)

const emit = defineEmits<{
  navigate: []
}>()

const groupedNav = computed(() => {
  const groups: Record<string, typeof navItems> = { Work: [], Personal: [] }

  for (const item of navItems) {
    groups[item.group].push(item)
  }

  return groups
})
</script>

<template>
  <aside
    class="flex h-full flex-col overflow-hidden rounded-t-2xl md:rounded-lg"
    :style="{
      backgroundColor: mobile ? 'var(--bg-primary)' : 'color-mix(in srgb, var(--bg-primary) 94%, transparent)',
      border: mobile ? 'none' : '1px solid var(--border)',
    }"
  >
    <div class="flex-1">
      <div class="flex items-center gap-4 border-b p-5 md:p-4" :style="{ borderColor: 'var(--border)' }">
        <img v-if="!mobile" :src="profile.photo" alt="Profile" class="h-10 w-10 rounded-md object-cover">
        <div>
          <h2 class="text-[12px] font-semibold uppercase tracking-[0.08em]" :style="{ color: 'var(--fg-primary)' }">{{ profile.name }}</h2>
          <p class="mt-1 text-[12px] uppercase tracking-[0.08em] muted">{{ profile.role }}</p>
        </div>
      </div>

      <nav class="px-5 py-3 md:p-4 md:pt-3">
        <template v-if="mobile">
          <ul class="space-y-1">
            <li v-for="item in navItems" :key="item.path">
              <NuxtLink
                :to="item.path"
                class="nav-link text-lg font-semibold"
                @click="emit('navigate')"
              >
                {{ item.title }}
              </NuxtLink>
            </li>
          </ul>
        </template>

        <template v-else>
          <section v-for="(items, groupName) in groupedNav" :key="groupName" class="mb-5 last:mb-0">
            <h3 class="mb-2 text-[12px] font-semibold uppercase tracking-[0.1em] muted">{{ groupName }}</h3>
            <ul class="space-y-1">
              <li v-for="item in items" :key="item.path">
                <NuxtLink
                  :to="item.path"
                  class="nav-link text-sm font-semibold"
                  @click="emit('navigate')"
                >
                  {{ item.title }}
                </NuxtLink>
              </li>
            </ul>
          </section>
        </template>
      </nav>
    </div>

    <div class="space-y-4 border-t p-5 pt-4 md:p-4" :style="{ borderColor: 'var(--border)' }">
      <ClockDigital />
      <ThemeToggle v-if="!mobile" />
      <ul class="flex items-center gap-2">
        <li v-for="link in socialLinks" :key="link.label">
          <a
            :href="link.href"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-300"
            :style="{ backgroundColor: 'var(--bg-tertiary)' }"
            :title="link.label"
            :aria-label="link.label"
          >
            <Icon :icon="link.icon" class="text-sm" aria-hidden="true" />
          </a>
        </li>
      </ul>
    </div>
  </aside>
</template>

<style scoped>
.nav-link {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: -0.5rem;
  margin-right: -0.5rem;
  border-radius: 0.375rem;
  padding: 0.375rem 0.5rem;
  opacity: 0.6;
  transition: all 0.2s ease;
}

.nav-link:hover {
  background-color: var(--bg-tertiary);
  opacity: 0.8;
}

.nav-link.router-link-active,
.nav-link.router-link-exact-active {
  opacity: 1;
}

@media (min-width: 768px) {
  .nav-link {
    opacity: 0.7;
  }

  .nav-link.router-link-active,
  .nav-link.router-link-exact-active {
    background-color: var(--bg-tertiary);
    opacity: 1;
  }
}
</style>
