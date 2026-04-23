/** In-app hash / anchor scrolling (see app.vue) — long enough to read as a glide, not a snap. */
export const SMOOTH_SCROLL_HASH_MS = 1200

export type SmoothScrollPreset = 'default' | 'hashNav'

export interface SmoothScrollOptions {
  duration?: number
  offset?: number
  easing?: (t: number) => number
  preset?: SmoothScrollPreset
  /** Lenis only: when true, blocks user wheel/touch until the scroll finishes. */
  lock?: boolean
  /** Fires after scroll reaches the target (Lenis, rAF fallback, or instant reduced-motion). */
  onComplete?: () => void
}

const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4)
/** In-out sine: soft start and end — reads as a continuous glide (Lenis + rAF fallback). */
const easeInOutSine = (t: number): number => 0.5 * (1 - Math.cos(Math.PI * t))

const SCROLL_PRESETS: Record<SmoothScrollPreset, { duration: number; easing: (t: number) => number }> = {
  default: {
    duration: 880,
    easing: easeOutQuart,
  },
  hashNav: {
    duration: SMOOTH_SCROLL_HASH_MS,
    easing: easeInOutSine,
  },
}

function prefersReducedMotion(): boolean {
  if (!import.meta.client) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export const useSmoothScroll = () => {
  const nuxtApp = useNuxtApp()

  const resolveTargetPosition = (target: string | number | HTMLElement): number | null => {
    if (typeof target === 'number') return target
    if (typeof target === 'string') {
      const element = document.querySelector(target)
      if (!element) return null
      return element.getBoundingClientRect().top + window.scrollY
    }
    return target.getBoundingClientRect().top + window.scrollY
  }

  const fallbackScrollTo = (
    target: string | number | HTMLElement,
    options: SmoothScrollOptions,
  ) => {
    const {
      duration,
      offset = 0,
      easing,
      preset = 'default',
      onComplete,
    } = options

    const presetConfig = SCROLL_PRESETS[preset]
    const targetPosition = resolveTargetPosition(target)
    if (targetPosition == null) return

    if (prefersReducedMotion()) {
      window.scrollTo(0, targetPosition + offset)
      onComplete?.()
      return
    }

    const finalDuration = duration ?? presetConfig.duration
    const easeFn = easing || presetConfig.easing

    if (finalDuration <= 0) {
      window.scrollTo(0, targetPosition + offset)
      onComplete?.()
      return
    }

    const startPosition = window.scrollY
    const distance = targetPosition + offset - startPosition
    let startTime: number | null = null

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / finalDuration, 1)
      const easedProgress = easeFn(progress)

      window.scrollTo(0, startPosition + distance * easedProgress)

      if (elapsed < finalDuration) {
        requestAnimationFrame(animate)
      } else {
        onComplete?.()
      }
    }

    requestAnimationFrame(animate)
  }

  const scrollTo = (
    target: string | number | HTMLElement,
    options: SmoothScrollOptions = {},
  ) => {
    const { duration, offset = 0, easing, preset = 'default', onComplete, lock } = options
    const presetConfig = SCROLL_PRESETS[preset]
    const useLock = lock !== undefined ? lock : preset !== 'hashNav'

    if (prefersReducedMotion()) {
      fallbackScrollTo(target, {
        duration: 0,
        offset,
        easing: presetConfig.easing,
        preset,
        onComplete,
      })
      return
    }

    const lenis = nuxtApp.$lenis
    if (!lenis) {
      fallbackScrollTo(target, { duration, offset, easing, preset, onComplete })
      return
    }

    const finalDurationMs = duration ?? presetConfig.duration
    const lenisDuration = Math.max(finalDurationMs, 1) / 1000

    lenis.scrollTo(target, {
      offset,
      duration: lenisDuration,
      easing: easing || presetConfig.easing,
      immediate: false,
      lock: useLock,
      force: true,
      onComplete: () => {
        document.documentElement.classList.remove('is-programmatic-scrolling')
        onComplete?.()
      },
    })
    document.documentElement.classList.add('is-programmatic-scrolling')
  }

  const scrollToHashNav = (
    target: string | number | HTMLElement,
    options: Omit<SmoothScrollOptions, 'preset'> = {},
  ) => {
    scrollTo(target, {
      ...options,
      preset: 'hashNav',
    })
  }

  const scrollToTop = (duration = SCROLL_PRESETS.default.duration) => {
    scrollTo(0, {
      duration,
      preset: 'default',
    })
  }

  onUnmounted(() => {
    if (import.meta.client) {
      document.documentElement.classList.remove('is-programmatic-scrolling')
    }
  })

  return {
    scrollTo,
    scrollToHashNav,
    scrollToTop,
  }
}
