import type { ThemeMode } from '~/utils/theme'
import { readStoredTheme, themeInjectKey } from '~/utils/theme'

const THEME_STATE_KEY = 'theme-mode'
const THEME_PAYLOAD_KEY = `$s${THEME_STATE_KEY}`

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

export default defineNuxtPlugin({
  enforce: 'pre',
  setup(nuxtApp) {
    const stored = readStoredTheme()
    if (stored && nuxtApp.payload.state) {
      nuxtApp.payload.state[THEME_PAYLOAD_KEY] = stored
    }

    const theme = ref<ThemeMode>(stored ?? 'light')
    nuxtApp.vueApp.provide(themeInjectKey, theme)

    applyTheme(theme.value)

    watch(theme, (value) => {
      // Avoid document.startViewTransition: some Chromium builds leave a dark snapshot
      // layer on screen after theme toggles (looks like a black overlay).
      applyTheme(value)
    })
  },
})
