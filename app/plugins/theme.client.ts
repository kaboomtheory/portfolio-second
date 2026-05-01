import type { ThemeMode } from '~/utils/theme'
import { getInitialTheme } from '~/utils/theme'

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
})
