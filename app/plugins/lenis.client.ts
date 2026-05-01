import Lenis, { type LenisOptions } from 'lenis'

export default defineNuxtPlugin((nuxtApp) => {
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches
  const isDesktopViewport = window.matchMedia('(min-width: 1024px)').matches
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const isFirefox = /firefox/i.test(navigator.userAgent)

  if (!hasFinePointer || !isDesktopViewport || prefersReducedMotion) {
    return
  }

  const lenisOptions: LenisOptions = isFirefox
    ? {
        // Conservative Gecko path: keep interpolation light to avoid delayed catch-up.
        lerp: 0.075,
        smoothWheel: true,
        wheelMultiplier: 0.7,
      }
    : {
        duration: 1.15,
        // Slightly cinematic default easing without feeling sluggish.
        easing: (t: number) => 1 - Math.pow(1 - t, 3.2),
      }

  const lenis = new Lenis(lenisOptions)

  nuxtApp.provide('lenis', lenis)

  let rafId = 0
  const raf = (time: number) => {
    lenis.raf(time)
    rafId = window.requestAnimationFrame(raf)
  }

  rafId = window.requestAnimationFrame(raf)

  // @ts-expect-error - app:beforeUnmount is not in RuntimeNuxtHooks but may exist at runtime
  nuxtApp.hook('app:beforeUnmount', () => {
    window.cancelAnimationFrame(rafId)
    lenis.destroy()
  })
})
