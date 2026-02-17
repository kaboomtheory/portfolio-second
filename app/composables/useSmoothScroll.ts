export const useSmoothScroll = () => {
  const scrollTo = (
    target: string | number | HTMLElement,
    options: {
      duration?: number
      offset?: number
      easing?: (t: number) => number
    } = {}
  ) => {
    const { duration = 1200, offset = 0, easing } = options

    const easeInOutCubic = (t: number): number =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

    const easeFn = easing || easeInOutCubic

    let targetPosition: number
    if (typeof target === 'string') {
      const element = document.querySelector(target)
      if (!element) return
      targetPosition = element.getBoundingClientRect().top + window.scrollY
    } else if (typeof target === 'number') {
      targetPosition = target
    } else {
      targetPosition = target.getBoundingClientRect().top + window.scrollY
    }

    targetPosition += offset

    const startPosition = window.scrollY
    const distance = targetPosition - startPosition
    let startTime: number | null = null

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeFn(progress)

      window.scrollTo(0, startPosition + distance * easedProgress)

      if (elapsed < duration) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }

  const scrollToTop = (duration = 1200) => {
    scrollTo(0, { duration })
  }

  return {
    scrollTo,
    scrollToTop,
  }
}
