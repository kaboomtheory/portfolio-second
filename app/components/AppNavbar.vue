<script setup lang="ts">
import { navItems, profile } from '~/data/site'

const route = useRoute()
const pillNav = ref<HTMLElement | null>(null)
const blob = ref<HTMLElement | null>(null)
const BLOB_TRANSITION = 'left 0.35s cubic-bezier(0.4, 0, 0.2, 1), width 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease'
let initialized = false

const updateBlob = () => {
  if (!pillNav.value || !blob.value) return
  const el = blob.value
  const active = pillNav.value.querySelector('.router-link-exact-active') as HTMLElement | null
  if (active) {
    if (!initialized) {
      el.style.transition = 'none'
      el.style.left = `${active.offsetLeft}px`
      el.style.width = `${active.offsetWidth}px`
      el.style.opacity = '1'
      void el.offsetHeight
      el.style.transition = BLOB_TRANSITION
      initialized = true
    } else {
      el.style.left = `${active.offsetLeft}px`
      el.style.width = `${active.offsetWidth}px`
      el.style.opacity = '1'
    }
  } else {
    el.style.opacity = '0'
  }
}

watch(() => route.path, () => {
  nextTick(() => setTimeout(updateBlob, 50))
})

const isHidden = ref(false)
const lastScrollY = ref(0)
const scrollThreshold = 50

const onScroll = () => {
  const currentY = window.scrollY
  if (currentY < scrollThreshold) {
    isHidden.value = false
  } else if (currentY > lastScrollY.value + 5) {
    isHidden.value = true
  } else if (currentY < lastScrollY.value - 5) {
    isHidden.value = false
  }
  lastScrollY.value = currentY
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', updateBlob)
  nextTick(updateBlob)
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', updateBlob)
})
</script>

<template>
  <header class="navbar" :class="{ 'navbar-hidden': isHidden }">
    <div class="navbar-inner container mx-auto w-full px-5 sm:px-6 md:max-w-[72rem] md:px-8">
      <div class="pill">
        <NuxtLink to="/" class="navbar-brand">
          <img :src="profile.photo" :alt="profile.name" class="navbar-brand-avatar">
          <span class="navbar-brand-name mono">{{ profile.name }}</span>
        </NuxtLink>

        <div class="pill-trailing">
          <nav ref="pillNav" class="pill-nav">
            <span ref="blob" class="nav-blob" />
            <NuxtLink
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="nav-link mono"
            >
              {{ item.title }}
            </NuxtLink>
          </nav>

          <ThemeToggle />
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  padding: 1.5rem 0;
  pointer-events: none;
  transition: transform 0.3s cubic-bezier(0.2, 0.65, 0.3, 0.9);
}

.navbar-hidden {
  transform: translateY(-100%);
}

.navbar-inner {
  pointer-events: auto;
}

@keyframes navbar-pill-glow {
  from {
    box-shadow: 0 0 14px color-mix(in srgb, var(--accent) 12%, transparent);
  }

  to {
    box-shadow: 0 0 22px color-mix(in srgb, var(--accent) 22%, transparent);
  }
}

@keyframes navbar-pill-glow-dark {
  from {
    box-shadow: 0 0 16px color-mix(in srgb, var(--accent-soft) 14%, transparent);
  }

  to {
    box-shadow: 0 0 26px color-mix(in srgb, var(--accent-soft) 24%, transparent);
  }
}

/* Full-width bar aligned with layout container */
.pill {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
  min-width: 0;
  border-radius: 9999px;
  padding: 0.5rem 0.75rem;
  background-color: var(--bg-primary);
  border: var(--card-border);
  box-shadow: var(--card-ring);
  backdrop-filter: blur(15px) saturate(1.2);
  -webkit-backdrop-filter: blur(15px) saturate(1.2);
  animation: navbar-pill-glow 6s ease-in-out infinite alternate;
}

@media (min-width: 640px) {
  .pill {
    padding: 0.5rem 1rem;
    gap: 1rem;
  }
}

:root.dark .pill {
  background-color: var(--bg-primary);
  animation-name: navbar-pill-glow-dark;
}

/* Brand */
.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
  transition: opacity 0.2s ease;
}

.navbar-brand:hover {
  opacity: 0.8;
}

.navbar-brand-avatar {
  height: 2.25rem;
  width: 2.25rem;
  border-radius: 9999px;
  object-fit: cover;
  flex-shrink: 0;
}

.navbar-brand-name {
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: var(--fg-primary);
  white-space: nowrap;
}

/* Hide name on small screens */
@media (max-width: 480px) {
  .navbar-brand-name {
    display: none;
  }
}

.pill-trailing {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
  min-width: 0;
}

@media (min-width: 640px) {
  .pill-trailing {
    gap: 0.75rem;
  }
}

/* Nav links */
.pill-nav {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  position: relative;
  min-width: 0;
}

@media (min-width: 640px) {
  .pill-nav {
    gap: 0.5rem;
  }
}

.nav-blob {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 0;
  opacity: 0;
  border-radius: 9999px;
  background-color: var(--bg-secondary);
  box-shadow: 0 2px 8px color-mix(in srgb, var(--fg-primary) 5%, transparent);
  transition: left 0.35s cubic-bezier(0.4, 0, 0.2, 1),
              width 0.35s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.25s ease;
  z-index: 0;
  pointer-events: none;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  padding: 0.4rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.8125rem;
  font-weight: 400;
  letter-spacing: 0.01em;
  color: var(--fg-secondary);
  white-space: nowrap;
  transition: color 0.2s ease, background-color 0.2s ease;
  position: relative;
  z-index: 1;
}

@media (min-width: 640px) {
  .nav-link {
    padding: 0.5rem 1.125rem;
    font-size: 0.875rem;
  }
}

.nav-link:hover {
  color: var(--fg-primary);
  background-color: var(--bg-tertiary);
}

.nav-link.router-link-exact-active {
  color: var(--fg-primary);
  font-weight: 600;
}

@media (prefers-reduced-motion: reduce) {
  .nav-blob {
    transition: none;
  }

  .pill {
    animation: none;
    box-shadow: 0 0 18px color-mix(in srgb, var(--accent) 16%, transparent);
  }

  :root.dark .pill {
    box-shadow: 0 0 20px color-mix(in srgb, var(--accent-soft) 18%, transparent);
  }
}

</style>
