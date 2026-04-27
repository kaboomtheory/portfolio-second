import type { RouteLocationRaw } from 'vue-router'
import { useHomeSectionScroll } from '~/composables/useHomeSectionScroll'
import { isInPageHashActive, parseInPageHash } from '~/utils/inPageHashNav'

/**
 * Intercept clicks on links to `/#section` (or `/path#section`) so the browser does not
 * snap-scroll to the fragment before Lenis / `scrollToHomeHash` runs. Works for
 * same-path hash changes and cross-route navigation (e.g. project detail → `/#work`).
 */
export function useInPageHashLink() {
  const route = useRoute()
  const router = useRouter()
  const { scrollToHomeHash } = useHomeSectionScroll()

  function onInPageHashLinkClick(e: MouseEvent, to: string | RouteLocationRaw) {
    let pathOnly: string
    let hash: string

    try {
      const resolved = router.resolve(to)
      pathOnly = resolved.path || '/'
      hash = (resolved.hash || '').trim()
      if ((!hash || hash === '#') && typeof to === 'string') {
        const parsed = parseInPageHash(to.trim())
        if (parsed) {
          pathOnly = parsed.pathOnly
          hash = parsed.hash
        }
      }
    } catch {
      return
    }

    if (!hash || hash === '#') return

    e.preventDefault()

    if (isInPageHashActive(route.path, route.hash || '', pathOnly, hash)) {
      void scrollToHomeHash(hash)
      return
    }

    void router.push({ path: pathOnly, hash })
  }

  return {
    onInPageHashLinkClick,
  }
}
