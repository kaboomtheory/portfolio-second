import { ref, onUnmounted, watch, nextTick, type Ref } from 'vue'

function prefersReducedMotion(): boolean {
  if (!import.meta.client) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** IntersectionObserver thresholds: include 0 so first pixels reliably fire across engines. */
function normalizeIoThreshold(threshold: number | number[] | undefined, fallback: number): number | number[] {
  if (Array.isArray(threshold)) return threshold
  const t = threshold ?? fallback
  if (typeof t === 'number') {
    if (t <= 0) return [0, 0.02]
    if (t < 0.2) return [0, t]
  }
  return t
}

export interface ScrollRevealOptions {
  threshold?: number | number[]
  rootMargin?: string
  once?: boolean
  delay?: number
}

export function useScrollReveal(options: ScrollRevealOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    once = true,
    delay = 0,
  } = options

  const ioThreshold = normalizeIoThreshold(threshold, 0.1)

  const elementRef: Ref<HTMLElement | null> = ref(null)
  const isVisible = ref(false)
  const hasRevealed = ref(false)
  let observer: IntersectionObserver | null = null
  let revealDelayTimer: ReturnType<typeof setTimeout> | null = null

  const clearRevealDelay = () => {
    if (revealDelayTimer != null) {
      clearTimeout(revealDelayTimer)
      revealDelayTimer = null
    }
  }

  const disconnect = () => {
    clearRevealDelay()
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  const applyReveal = () => {
    if (!elementRef.value) return
    isVisible.value = true
    hasRevealed.value = true
    if (once && observer) {
      observer.disconnect()
      observer = null
    }
  }

  const observe = () => {
    if (!import.meta.client || !elementRef.value || (once && hasRevealed.value)) return

    clearRevealDelay()
    if (observer) {
      observer.disconnect()
      observer = null
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (once && hasRevealed.value) return

            if (delay > 0 && !prefersReducedMotion()) {
              clearRevealDelay()
              revealDelayTimer = setTimeout(() => {
                revealDelayTimer = null
                if (!elementRef.value) return
                applyReveal()
              }, delay)
            } else {
              applyReveal()
            }
          } else if (!once) {
            isVisible.value = false
          }
        })
      },
      {
        threshold: ioThreshold,
        rootMargin,
      },
    )

    observer.observe(elementRef.value)
  }

  const scheduleObserve = () => {
    if (!import.meta.client || (once && hasRevealed.value)) return
    nextTick(() => {
      requestAnimationFrame(() => {
        observe()
      })
    })
  }

  const stopElementWatch = watch(
    elementRef,
    (el, prev) => {
      if (!import.meta.client || (once && hasRevealed.value)) return
      if (el && prev == null) scheduleObserve()
    },
    { flush: 'post', immediate: true },
  )

  onUnmounted(() => {
    stopElementWatch()
    disconnect()
  })

  return {
    elementRef,
    isVisible,
    hasRevealed,
    observe,
    disconnect,
  }
}

export function useScrollRevealGroup(
  count: number,
  options: ScrollRevealOptions & { staggerDelay?: number } = {},
) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    once = true,
    delay = 0,
    staggerDelay = 100,
  } = options

  const ioThreshold = normalizeIoThreshold(threshold, 0.1)

  const containerRef: Ref<HTMLElement | null> = ref(null)
  const visibleItems = ref<boolean[]>(new Array(count).fill(false))
  let observer: IntersectionObserver | null = null
  const staggerTimers: ReturnType<typeof setTimeout>[] = []

  const clearStaggerTimers = () => {
    for (const t of staggerTimers) clearTimeout(t)
    staggerTimers.length = 0
  }

  const observe = () => {
    if (!import.meta.client || !containerRef.value) return

    clearStaggerTimers()
    if (observer) {
      observer.disconnect()
      observer = null
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const children = containerRef.value?.children
            if (!children) return

            if (prefersReducedMotion()) {
              const len = Math.min(children.length, visibleItems.value.length)
              visibleItems.value = visibleItems.value.map((_, i) => i < len)
            } else {
              Array.from(children).forEach((_, index) => {
                const itemDelay = delay + index * staggerDelay
                const tid = setTimeout(() => {
                  visibleItems.value[index] = true
                }, itemDelay)
                staggerTimers.push(tid)
              })
            }

            if (once && observer) {
              observer.disconnect()
              observer = null
            }
          }
        })
      },
      {
        threshold: ioThreshold,
        rootMargin,
      },
    )

    observer.observe(containerRef.value)
  }

  const disconnect = () => {
    clearStaggerTimers()
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  const scheduleObserve = () => {
    if (!import.meta.client) return
    nextTick(() => {
      requestAnimationFrame(() => {
        observe()
      })
    })
  }

  const stopContainerWatch = watch(
    containerRef,
    (el, prev) => {
      if (!import.meta.client) return
      if (el && prev == null) scheduleObserve()
    },
    { flush: 'post', immediate: true },
  )

  onUnmounted(() => {
    stopContainerWatch()
    disconnect()
  })

  return {
    containerRef,
    visibleItems,
    observe,
    disconnect,
  }
}
