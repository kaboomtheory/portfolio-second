import { takeInPageHashScrollY } from '~/composables/inPageHashScrollMemory'
import { useSmoothScroll } from '~/composables/useSmoothScroll'
import { getScrollAnchorOffsetPx } from '~/utils/scrollAnchor'

const HASH_SCROLL_MIN_MS = 460
const HASH_SCROLL_BASE_MS = 540
const HASH_SCROLL_MAX_MS = 1100
const HASH_SCROLL_PX_FACTOR = 0.33

/** Monotonic id so overlapping hash scroll requests only the latest wins (shared across all composable callers). */
let hashScrollRequestSeq = 0

/** Max time to wait for `document.querySelector(hash)` after route/DOM updates. */
const HASH_TARGET_WAIT_MS = 700

function prefersReducedMotion(): boolean {
  if (!import.meta.client) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function getHashScrollDurationMs(el: HTMLElement, offset: number): number {
  if (!import.meta.client) return HASH_SCROLL_BASE_MS

  const startY = window.scrollY
  const targetY = el.getBoundingClientRect().top + startY + offset
  const distance = Math.abs(targetY - startY)
  const duration = HASH_SCROLL_BASE_MS + distance * HASH_SCROLL_PX_FACTOR

  return Math.min(HASH_SCROLL_MAX_MS, Math.max(HASH_SCROLL_MIN_MS, duration))
}

function queryHashElement(hash: string): HTMLElement | null {
  try {
    const el = document.querySelector(hash)
    return el instanceof HTMLElement ? el : null
  } catch {
    return null
  }
}

function triggerSectionSpotlight(el: HTMLElement) {
  if (prefersReducedMotion()) return
  el.classList.remove('section-nav-spotlight')
  void el.offsetWidth
  el.classList.add('section-nav-spotlight')

  const onAnimEnd = (e: AnimationEvent) => {
    if (e.animationName !== 'section-nav-spotlight-pulse' || e.target !== el) return
    el.removeEventListener('animationend', onAnimEnd)
    el.classList.remove('section-nav-spotlight')
  }
  el.addEventListener('animationend', onAnimEnd)
}

export function useHomeSectionScroll() {
  const { scrollToHashNav } = useSmoothScroll()

  function scrollToHomeHash(hash: string) {
    if (!import.meta.client || !hash || hash === '#') return

    const requestId = ++hashScrollRequestSeq

    const undoY = takeInPageHashScrollY()
    if (undoY != null) {
      window.scrollTo(0, undoY)
    }

    const startedAt = performance.now()

    const tryScroll = () => {
      if (requestId !== hashScrollRequestSeq) return

      const el = queryHashElement(hash)
      if (el) {
        const offset = getScrollAnchorOffsetPx()
        const duration = getHashScrollDurationMs(el, offset)

        scrollToHashNav(hash, {
          duration,
          offset,
          onComplete: () => {
            if (requestId !== hashScrollRequestSeq) return
            triggerSectionSpotlight(el)
          },
        })
        return
      }

      if (performance.now() - startedAt >= HASH_TARGET_WAIT_MS) return

      requestAnimationFrame(tryScroll)
    }

    requestAnimationFrame(tryScroll)
  }

  return {
    scrollToHomeHash,
  }
}
