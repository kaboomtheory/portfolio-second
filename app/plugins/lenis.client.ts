import Lenis from 'lenis'

export default defineNuxtPlugin((nuxtApp) => {
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches
  const isDesktopViewport = window.matchMedia('(min-width: 1024px)').matches
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!hasFinePointer || !isDesktopViewport || prefersReducedMotion) {
    return
  }

  const lenis = new Lenis({
    duration: 1.15,
    // Slightly cinematic default easing without feeling sluggish.
    easing: (t: number) => 1 - Math.pow(1 - t, 3.2),
  })

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
