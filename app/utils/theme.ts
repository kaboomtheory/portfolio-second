export type ThemeMode = 'light' | 'dark'

/** Client: saved preference or OS scheme. Server fallback: dark. */
export function getInitialTheme(): ThemeMode {
  if (!import.meta.client) {
    return 'dark'
  }
  const saved = localStorage.getItem('color-mode')
  if (saved === 'light' || saved === 'dark') {
    return saved
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function hasStoredColorMode(): boolean {
  if (!import.meta.client) {
    return false
  }
  const saved = localStorage.getItem('color-mode')
  return saved === 'light' || saved === 'dark'
}
