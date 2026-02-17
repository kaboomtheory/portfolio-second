type ThemeMode = 'light' | 'dark'

function applyTheme(mode: ThemeMode) {
  document.documentElement.dataset.theme = mode
  document.documentElement.classList.toggle('dark', mode === 'dark')
}

export default defineNuxtPlugin(() => {
  const theme = useState<ThemeMode>('theme-mode', () => 'dark')

  const saved = localStorage.getItem('color-mode')
  if (saved === 'light' || saved === 'dark') {
    theme.value = saved
  }

  applyTheme(theme.value)

  watch(
    theme,
    (value) => {
      localStorage.setItem('color-mode', value)
      applyTheme(value)
    },
    { immediate: true }
  )
})
