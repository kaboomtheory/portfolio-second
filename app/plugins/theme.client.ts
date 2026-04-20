import type { ThemeMode } from '~/utils/theme'
import { getInitialTheme, hasStoredColorMode } from '~/utils/theme'

function applyTheme(mode: ThemeMode) {
  document.documentElement.dataset.theme = mode
  document.documentElement.classList.toggle('dark', mode === 'dark')
}

export default defineNuxtPlugin(() => {
  const theme = useState<ThemeMode>('theme-mode', () => getInitialTheme())

  applyTheme(theme.value)

  watch(theme, (value) => {
    // Avoid document.startViewTransition: some Chromium builds leave a dark snapshot
    // layer on screen after theme toggles (looks like a black overlay).
    applyTheme(value)
  })

  if (import.meta.client && !hasStoredColorMode()) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onSchemeChange = () => {
      theme.value = mq.matches ? 'dark' : 'light'
    }
    mq.addEventListener('change', onSchemeChange)
  }
})
