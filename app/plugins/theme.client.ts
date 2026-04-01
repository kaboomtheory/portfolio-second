import type { ThemeMode } from '~/utils/theme'
import { getInitialTheme, hasStoredColorMode } from '~/utils/theme'

function applyTheme(mode: ThemeMode) {
  document.documentElement.dataset.theme = mode
  document.documentElement.classList.toggle('dark', mode === 'dark')
}

function runWithThemeViewTransition(apply: () => void) {
  if (import.meta.server) {
    apply()
    return
  }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    apply()
    return
  }
  if (typeof document.startViewTransition !== 'function') {
    apply()
    return
  }
  document.startViewTransition(apply)
}

export default defineNuxtPlugin(() => {
  const theme = useState<ThemeMode>('theme-mode', () => getInitialTheme())

  applyTheme(theme.value)

  watch(theme, (value) => {
    runWithThemeViewTransition(() => applyTheme(value))
  })

  if (import.meta.client && !hasStoredColorMode()) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onSchemeChange = () => {
      theme.value = mq.matches ? 'dark' : 'light'
    }
    mq.addEventListener('change', onSchemeChange)
  }
})
