import type { ThemeMode } from '~/utils/theme'
import { getInitialTheme, hasStoredColorMode } from '~/utils/theme'

const THEME_COLORS: Record<ThemeMode, string> = {
  light: '#ffffff',
  dark: '#000000',
}

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement
  root.dataset.theme = mode
  root.classList.toggle('dark', mode === 'dark')

  const themeMeta = document.querySelector('meta[name="theme-color"]')
  if (themeMeta) {
    themeMeta.setAttribute('content', THEME_COLORS[mode])
  }
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
