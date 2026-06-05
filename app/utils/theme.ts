import type { InjectionKey, Ref } from 'vue'

export type ThemeMode = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'color-mode'

/** Client plugin provides this ref; SSR falls back to `useState('theme-mode')`. */
export const themeInjectKey: InjectionKey<Ref<ThemeMode>> = Symbol('theme-mode')

/** Client-only read of saved theme; null if missing or invalid. */
export function readStoredTheme(): ThemeMode | null {
  if (!import.meta.client) {
    return null
  }
  const saved = localStorage.getItem(THEME_STORAGE_KEY)
  if (saved === 'light' || saved === 'dark') {
    return saved
  }
  return null
}
