export default defineNuxtPlugin(() => {
  if (!import.meta.client) {
    return
  }
  useThemeColorLab().hydrateFromStorage()
})
