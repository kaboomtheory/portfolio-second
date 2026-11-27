import Lenis, { type LenisOptions } from 'lenis'

/**
 * Smooth wheel scrolling on desktop pointers, ported from the Nuxt lenis plugin.
 * The instance is exposed on `window.__lenis` for useSmoothScroll().
 */
export function initLenis() {
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches
  const isDesktopViewport = window.matchMedia('(min-width: 1024px)').matches
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!hasFinePointer || !isDesktopViewport || prefersReducedMotion) return

  const isFirefox = /firefox/i.test(navigator.userAgent)
  const options: LenisOptions = isFirefox
    ? { lerp: 0.075, smoothWheel: true, wheelMultiplier: 0.7 }
    : { duration: 1.15, easing: (t: number) => 1 - Math.pow(1 - t, 3.2) }

  const lenis = new Lenis(options)
  window.__lenis = lenis

  const raf = (time: number) => {
    lenis.raf(time)
    window.requestAnimationFrame(raf)
  }
  window.requestAnimationFrame(raf)
}
