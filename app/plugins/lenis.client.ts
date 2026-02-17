import Lenis from 'lenis'

export default defineNuxtPlugin((nuxtApp) => {
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches
  const isDesktopViewport = window.matchMedia('(min-width: 1024px)').matches
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!hasFinePointer || !isDesktopViewport || prefersReducedMotion) {
    return
  }

  const lenis = new Lenis()

  let rafId = 0
  const raf = (time: number) => {
    lenis.raf(time)
    rafId = window.requestAnimationFrame(raf)
  }

  rafId = window.requestAnimationFrame(raf)

  nuxtApp.hook('app:beforeUnmount', () => {
    window.cancelAnimationFrame(rafId)
    lenis.destroy()
  })
})
