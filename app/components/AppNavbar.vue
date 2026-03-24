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
    <div class="navbar-inner">
      <div class="pill">
        <NuxtLink to="/" class="navbar-brand">
          <img :src="profile.photo" :alt="profile.name" class="navbar-brand-avatar">
          <span class="navbar-brand-name">{{ profile.name }}</span>
        </NuxtLink>

        <span class="pill-divider" />

        <nav ref="pillNav" class="pill-nav">
          <span ref="blob" class="nav-blob" />
          <NuxtLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="nav-link"
          >
            {{ item.title }}
          </NuxtLink>
        </nav>

        <span class="pill-divider" />
        <ThemeToggle />
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
  padding: 1.5rem 1.25rem;
  pointer-events: none;
  transition: transform 0.3s cubic-bezier(0.2, 0.65, 0.3, 0.9);
}

.navbar-hidden {
  transform: translateY(-100%);
}

.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 72rem;
  margin: 0 auto;
  pointer-events: auto;
}

/* Single pill */
.pill {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  border: 1px solid var(--border);
  border-radius: 9999px;
  padding: 0.375rem 0.5rem;
  background-color: color-mix(in srgb, var(--bg-primary) 85%, transparent);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  min-width: 0;
}

/* Brand */
.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
  transition: opacity 0.2s ease;
}

.navbar-brand:hover {
  opacity: 0.8;
}

.navbar-brand-avatar {
  height: 2rem;
  width: 2rem;
  border-radius: 9999px;
  object-fit: cover;
  border: 2px solid var(--border);
  padding: 2px;
  flex-shrink: 0;
}

.navbar-brand-name {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--fg-primary);
  white-space: nowrap;
}

/* Hide name on small screens */
@media (max-width: 480px) {
  .navbar-brand-name {
    display: none;
  }
}

/* Divider */
.pill-divider {
  width: 1px;
  height: 1.25rem;
  background-color: var(--border);
  margin: 0 0.125rem;
  flex-shrink: 0;
}

/* Nav links */
.pill-nav {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  position: relative;
}

.nav-blob {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 0;
  opacity: 0;
  border-radius: 9999px;
  background-color: color-mix(in srgb, var(--wash-warm) 22%, transparent);
  transition: left 0.35s cubic-bezier(0.4, 0, 0.2, 1),
              width 0.35s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.25s ease;
  z-index: 0;
  pointer-events: none;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: var(--fg-secondary);
  white-space: nowrap;
  transition: color 0.2s ease, background-color 0.2s ease;
  position: relative;
  z-index: 1;
}

@media (min-width: 640px) {
  .nav-link {
    padding: 0.4rem 1rem;
    font-size: 0.8rem;
  }
}

.nav-link:hover {
  color: var(--fg-primary);
  background-color: var(--bg-tertiary);
}

.nav-link.router-link-exact-active {
  color: var(--emphasis);
  font-weight: 600;
}

@media (prefers-reduced-motion: reduce) {
  .nav-blob {
    transition: none;
  }
}

</style>
