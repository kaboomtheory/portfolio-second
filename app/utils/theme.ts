export type ThemeMode = 'light' | 'dark'

/** Client: saved preference or light default. Server fallback: light. */
export function getInitialTheme(): ThemeMode {
  if (!import.meta.client) {
    return 'light'
  }
  const saved = localStorage.getItem('color-mode')
  if (saved === 'light' || saved === 'dark') {
    return saved
  }
  return 'light'
}
