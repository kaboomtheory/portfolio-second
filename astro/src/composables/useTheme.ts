import { computed, getCurrentInstance, onMounted } from 'vue'
import { useState } from '~/shims/nuxt'
import type { ThemeMode } from '~/utils/theme'
import { applyTheme, readStoredTheme, THEME_STORAGE_KEY } from '~/utils/theme'

/**
 * Shared theme state for every Vue island on the page. The inline script in
 * BaseLayout applies the saved theme to <html> before first paint.
 *
 * The server always renders 'light', so islands hydrate as 'light' and then
 * read the saved theme once mounted. Starting from the saved value instead
 * would make hydration mismatch, and Vue does not fix that up in production.
 */
export function useTheme() {
  const mode = useState<ThemeMode>('theme-mode', () => 'light')

  if (!import.meta.env.SSR && getCurrentInstance()) {
    onMounted(() => {
      const stored = readStoredTheme()
      if (stored && stored !== mode.value) mode.value = stored
    })
  }

  function toggle() {
    mode.value = mode.value === 'dark' ? 'light' : 'dark'
    if (!import.meta.env.SSR) {
      localStorage.setItem(THEME_STORAGE_KEY, mode.value)
      applyTheme(mode.value)
    }
  }

  return {
    mode,
    isDark: computed(() => mode.value === 'dark'),
    toggle,
  }
}
