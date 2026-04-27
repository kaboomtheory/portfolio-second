<script setup lang="ts">
const { isDark, toggle } = useTheme()
</script>

<template>
  <button
    type="button"
    role="switch"
    class="theme-toggle theme-toggle--motion relative inline-flex h-9 shrink-0 items-center rounded-lg px-2"
    :class="{ 'theme-toggle--dark': isDark }"
    :data-theme="isDark ? 'dark' : 'light'"
    :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
    :aria-checked="isDark"
    @click="toggle"
  >
    <span class="theme-toggle__labels relative z-0 flex w-full items-center justify-between px-0.5 text-sm pointer-events-none">
      <AppIcon
        icon="lucide:sun"
        class="theme-toggle__rail h-4 w-4 shrink-0"
        :class="isDark ? 'theme-toggle__rail--muted' : 'theme-toggle__rail--on'"
        aria-hidden="true"
      />
      <AppIcon
        icon="lucide:moon"
        class="theme-toggle__rail h-4 w-4 shrink-0"
        :class="!isDark ? 'theme-toggle__rail--muted' : 'theme-toggle__rail--on'"
        aria-hidden="true"
      />
    </span>
    <span class="theme-toggle__pill pointer-events-none absolute z-10 flex h-7 w-7 items-center justify-center rounded-lg">
      <span
        class="theme-toggle__icon-wrap relative h-4 w-4 shrink-0"
        :class="{ 'theme-toggle__icon-wrap--dark': isDark }"
      >
        <AppIcon
          icon="lucide:sun"
          class="theme-toggle__orbit-icon theme-toggle__orbit-icon--sun absolute left-1/2 top-1/2 h-4 w-4"
          aria-hidden="true"
        />
        <AppIcon
          icon="lucide:moon"
          class="theme-toggle__orbit-icon theme-toggle__orbit-icon--moon absolute left-1/2 top-1/2 h-4 w-4"
          aria-hidden="true"
        />
      </span>
    </span>
  </button>
</template>

<style scoped>
.theme-toggle {
  --theme-toggle-pad: 0.5rem;
  --theme-toggle-thumb: 1.75rem;
  --theme-toggle-inner: 3.875rem;
  --theme-toggle-travel: calc(var(--theme-toggle-inner) - var(--theme-toggle-thumb));
  width: calc(2 * var(--theme-toggle-pad) + var(--theme-toggle-inner));
  background-color: var(--bg-primary);
  border: var(--card-border);
  box-shadow: var(--card-ring);
  backdrop-filter: blur(15px) saturate(1.2);
  -webkit-backdrop-filter: blur(15px) saturate(1.2);
  transition:
    box-shadow 0.22s cubic-bezier(0.25, 1, 0.5, 1),
    border-color 0.22s cubic-bezier(0.25, 1, 0.5, 1),
    transform 0.18s cubic-bezier(0.22, 1, 0.36, 1);
}

.theme-toggle--motion:hover {
  box-shadow: var(--shadow-md);
  border-color: color-mix(in srgb, var(--accent) 22%, var(--rule));
}

.theme-toggle--motion:active {
  transform: scale(0.98);
}

.theme-toggle__rail {
  color: var(--theme-toggle-rail-emphasis);
  transition:
    color 0.28s cubic-bezier(0.25, 1, 0.5, 1),
    transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}

.theme-toggle__rail--on {
  transform: scale(1);
}

.theme-toggle__rail--muted {
  color: var(--theme-toggle-rail-muted);
  transform: scale(0.82);
}

.theme-toggle__pill {
  left: var(--theme-toggle-pad);
  top: 50%;
  width: var(--theme-toggle-thumb);
  height: var(--theme-toggle-thumb);
  background-color: var(--theme-toggle-knob-bg);
  box-shadow: var(--shadow-sm);
  transform: translateY(-50%) translateX(0);
  transition:
    transform 0.42s cubic-bezier(0.22, 1, 0.36, 1),
    background-color 0.28s cubic-bezier(0.25, 1, 0.5, 1);
}

.theme-toggle--dark .theme-toggle__pill {
  transform: translateY(-50%) translateX(var(--theme-toggle-travel));
}

@media (prefers-reduced-motion: reduce) {
  .theme-toggle,
  .theme-toggle__rail {
    transition-duration: 0.01ms;
  }

  .theme-toggle--motion:hover,
  .theme-toggle--motion:active {
    transform: none;
    box-shadow: var(--card-ring);
  }

  .theme-toggle__pill {
    transition-duration: 0.01ms;
  }

  .theme-toggle__orbit-icon {
    transition-duration: 0.01ms;
  }
}

.theme-toggle__orbit-icon {
  color: var(--theme-toggle-knob-fg);
  transition:
    transform 0.42s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.32s cubic-bezier(0.25, 1, 0.5, 1);
}

.theme-toggle__orbit-icon--sun {
  opacity: 1;
  transform: translate(-50%, -50%) rotate(0deg) scale(1);
}

.theme-toggle__orbit-icon--moon {
  opacity: 0;
  transform: translate(-50%, -50%) rotate(-90deg) scale(0);
}

.theme-toggle__icon-wrap--dark .theme-toggle__orbit-icon--sun {
  opacity: 0;
  transform: translate(-50%, -50%) rotate(90deg) scale(0);
}

.theme-toggle__icon-wrap--dark .theme-toggle__orbit-icon--moon {
  opacity: 1;
  transform: translate(-50%, -50%) rotate(0deg) scale(1);
}
</style>
