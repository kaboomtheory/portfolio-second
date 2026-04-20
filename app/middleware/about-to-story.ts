export default defineNuxtRouteMiddleware(() => {
  return navigateTo({ path: '/', hash: '#story' }, { replace: true })
})
