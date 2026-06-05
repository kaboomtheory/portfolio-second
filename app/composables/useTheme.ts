import type { ThemeMode } from '~/utils/theme'
import { themeInjectKey, THEME_STORAGE_KEY } from '~/utils/theme'

export function useTheme() {
  const injected = inject(themeInjectKey, null)
  const mode = injected ?? useState<ThemeMode>('theme-mode', () => 'light')

  function toggle() {
    mode.value = mode.value === 'dark' ? 'light' : 'dark'
    if (import.meta.client) {
      localStorage.setItem(THEME_STORAGE_KEY, mode.value)
    }
  }

  return {
    mode,
    isDark: computed(() => mode.value === 'dark'),
    toggle,
  }
}
