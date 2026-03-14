<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { navItems, profile, socialLinks } from '~/data/site'
import { useSanityStatus } from '~/composables/useSanityStatus'

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
    if (!groups[item.group]) groups[item.group] = []
    groups[item.group]!.push(item)
  }

  return groups
})

const { statusItems } = useSanityStatus()
</script>

<template>
  <aside
    class="sidebar"
    :class="{ 'sidebar--mobile': mobile }"
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

      <div v-if="statusItems?.length" class="px-5 pb-5 md:px-4 md:pb-4">
        <div class="mb-3 flex items-center gap-2">
          <div class="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse" style="opacity: 0.8;"></div>
          <h3 class="text-[12px] font-semibold uppercase tracking-[0.1em] muted">Status</h3>
        </div>
        <ul class="space-y-1">
          <li v-for="item in statusItems" :key="item.title">
            <component 
              :is="item.link ? 'a' : 'div'" 
              :href="item.link ? item.link : undefined"
              :target="item.link ? '_blank' : undefined"
              :rel="item.link ? 'noopener noreferrer' : undefined"
              class="group flex items-center gap-3 rounded-md p-2 -mx-2 transition-all duration-200 hover:bg-[var(--bg-tertiary)] cursor-pointer"
            >
              <div class="relative flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-[var(--bg-secondary)] ring-1 ring-inset ring-[var(--border)] transition-transform duration-300 group-hover:scale-105 group-hover:shadow-sm">
                <img 
                  v-if="item.images && item.images.length"
                  :src="item.images[0]" 
                  :alt="item.title"
                  class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <Icon 
                  v-else-if="item.icon" 
                  :icon="item.icon" 
                  class="text-lg text-[var(--fg-muted)] transition-colors duration-300 group-hover:text-[var(--accent)]" 
                />
              </div>
              
              <div class="flex flex-col justify-center min-w-0 py-0.5">
                <span class="text-[9px] font-bold uppercase tracking-[0.08em] text-[var(--fg-muted)] mb-[2px]">{{ item.label }}</span>
                <span class="text-xs font-semibold leading-tight break-words transition-colors duration-200 group-hover:text-[var(--accent)]" :style="{ color: 'var(--fg-primary)' }">{{ item.title }}</span>
                <span v-if="item.content" class="text-[10px] mt-[2px] break-words text-[var(--fg-secondary)]">{{ item.content }}</span>
              </div>
            </component>
          </li>
        </ul>
      </div>
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
.sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  border-radius: 0 1rem 1rem 0;
  position: relative;
}

.sidebar::before,
.sidebar::after {
  content: '';
  position: absolute;
  right: 0;
  width: 1px;
  pointer-events: none;
}

.sidebar::before {
  top: 0;
  height: 50%;
  background: linear-gradient(to bottom, transparent, var(--border));
}

.sidebar::after {
  bottom: 0;
  height: 50%;
  background: linear-gradient(to top, transparent, var(--border));
}

.sidebar--mobile {
  border-radius: 1.5rem 1.5rem 0 0;
  background-color: var(--bg-primary);
}

.sidebar--mobile::before,
.sidebar--mobile::after {
  display: none;
}

.nav-link {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: -0.5rem;
  margin-right: -0.5rem;
  border-radius: 0.375rem;
  padding: 0.375rem 0.5rem;
  opacity: 0.6;
  border-left: 2px solid transparent;
  transition: all 0.2s ease;
}

.nav-link:hover {
  background-color: var(--bg-tertiary);
  opacity: 0.8;
  border-left-color: var(--border);
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
    border-left-color: var(--accent);
    opacity: 1;
  }
}
</style>
