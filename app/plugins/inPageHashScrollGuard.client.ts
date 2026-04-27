import { markInPageHashScrollY } from '~/composables/inPageHashScrollMemory'

/**
 * When only the hash changes on the current path, the browser can jump to the
 * target before our smooth scroll — we record scrollY in `beforeEach` so
 * `useHomeSectionScroll` can restore it, then Lenis animates.
 */
export default defineNuxtPlugin(() => {
  if (!import.meta.client) return

  const router = useRouter()
  router.beforeEach((to, from) => {
    if (from.matched.length && to.path === from.path && to.hash) {
      markInPageHashScrollY()
    }
  })
})
