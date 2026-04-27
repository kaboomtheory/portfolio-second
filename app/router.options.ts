import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
  /**
   * Disable Nuxt's default instant scroll-to-top on navigation.
   * Scroll is handled by the JS transition hooks in default.vue
   * (smooth-scroll + blur happen simultaneously).
   * Hash scrolling is handled by the watcher in app.vue.
   */
  scrollBehavior() {
    return false
  },
}
