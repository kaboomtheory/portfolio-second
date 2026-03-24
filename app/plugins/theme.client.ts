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
