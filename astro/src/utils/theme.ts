export type ThemeMode = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'color-mode'

const THEME_COLORS: Record<ThemeMode, string> = {
  light: '#ffffff',
  dark: '#000000',
}

/** Client-only read of saved theme; null if missing or invalid. */
export function readStoredTheme(): ThemeMode | null {
  if (import.meta.env.SSR) return null
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    /* storage blocked */
  }
  return null
}

export function applyTheme(mode: ThemeMode) {
  const root = document.documentElement
  root.dataset.theme = mode
  root.classList.toggle('dark', mode === 'dark')
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[mode])
}
