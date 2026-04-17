import { ref, onMounted, onUnmounted, watch, type Ref } from 'vue'

export interface ScrollRevealOptions {
  threshold?: number
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

  const elementRef: Ref<HTMLElement | null> = ref(null)
  const isVisible = ref(false)
  const hasRevealed = ref(false)
  let observer: IntersectionObserver | null = null

  const observe = () => {
    if (!import.meta.client || !elementRef.value) return

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (once && hasRevealed.value) return

            if (delay > 0) {
              setTimeout(() => {
                isVisible.value = true
                hasRevealed.value = true
              }, delay)
            } else {
              isVisible.value = true
              hasRevealed.value = true
            }

            if (once && observer) {
              observer.disconnect()
            }
          } else if (!once) {
            isVisible.value = false
          }
        })
      },
      {
        threshold,
        rootMargin,
      }
    )

    observer.observe(elementRef.value)
  }

  const disconnect = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  onMounted(observe)
  onUnmounted(disconnect)

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
  options: ScrollRevealOptions & { staggerDelay?: number } = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    once = true,
    delay = 0,
    staggerDelay = 100,
  } = options

  const containerRef: Ref<HTMLElement | null> = ref(null)
  const visibleItems = ref<boolean[]>(new Array(count).fill(false))
  let observer: IntersectionObserver | null = null

  const observe = () => {
    if (!import.meta.client || !containerRef.value) return

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const children = containerRef.value?.children
            if (!children) return

            Array.from(children).forEach((_, index) => {
              const itemDelay = delay + index * staggerDelay
              setTimeout(() => {
                visibleItems.value[index] = true
              }, itemDelay)
            })

            if (once && observer) {
              observer.disconnect()
            }
          }
        })
      },
      {
        threshold,
        rootMargin,
      }
    )

    observer.observe(containerRef.value)
  }

  const disconnect = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  onMounted(() => {
    observe()
    // Container may mount after initial onMounted when it's gated behind
    // an async v-if (e.g., waiting on a fetch). Re-attempt observation
    // as soon as the ref resolves to an element.
    if (!observer) {
      const stop = watch(containerRef, (el) => {
        if (el && !observer) {
          observe()
          stop()
        }
      })
    }
  })
  onUnmounted(disconnect)

  return {
    containerRef,
    visibleItems,
    observe,
    disconnect,
  }
}
