import type { ThemeMode } from '~/utils/theme'
import { getInitialTheme } from '~/utils/theme'

export function useTheme() {
  const mode = useState<ThemeMode>('theme-mode', () => getInitialTheme())

  function toggle() {
    mode.value = mode.value === 'dark' ? 'light' : 'dark'
    if (import.meta.client) {
      localStorage.setItem('color-mode', mode.value)
    }
  }

  return {
    mode,
    isDark: computed(() => mode.value === 'dark'),
    toggle,
  }
}
