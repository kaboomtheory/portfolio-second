type ThemeMode = 'light' | 'dark'

export function useTheme() {
  const mode = useState<ThemeMode>('theme-mode', () => 'dark')

  function toggle() {
    mode.value = mode.value === 'dark' ? 'light' : 'dark'
  }

  return {
    mode,
    isDark: computed(() => mode.value === 'dark'),
    toggle,
  }
}
