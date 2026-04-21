import { SMOOTH_SCROLL_HASH_MS, useSmoothScroll } from '~/composables/useSmoothScroll'
import { getScrollAnchorOffsetPx } from '~/utils/scrollAnchor'

function prefersReducedMotion(): boolean {
  if (!import.meta.client) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function triggerSectionArrival(el: HTMLElement) {
  if (prefersReducedMotion()) return
  el.classList.remove('section-arrival')
  void el.offsetWidth
  el.classList.add('section-arrival')

  const onAnimEnd = (e: AnimationEvent) => {
    if (e.animationName !== 'section-arrival-lift' || e.target !== el) return
    el.removeEventListener('animationend', onAnimEnd)
    el.classList.remove('section-arrival')
  }
  el.addEventListener('animationend', onAnimEnd)
}

export function useHomeSectionScroll() {
  const { scrollToHashNav } = useSmoothScroll()

  function scrollToHomeHash(hash: string) {
    if (!import.meta.client || !hash || hash === '#') return
    const el = document.querySelector(hash)
    if (!(el instanceof HTMLElement)) return

    scrollToHashNav(hash, {
      duration: SMOOTH_SCROLL_HASH_MS,
      offset: getScrollAnchorOffsetPx(),
      onComplete: () => triggerSectionArrival(el),
    })
  }

  return {
    scrollToHomeHash,
  }
}
