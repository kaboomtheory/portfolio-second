import { ref, onMounted, onBeforeUnmount, type Ref } from 'vue'

interface ScrollExpandOptions {
  initialHoldScroll?: number
}

/**
 * Tracks how much of an element is visible in the viewport and returns
 * a reactive `progress` value (0 → 1 → 0).
 *
 * progress = 1 when the element is fully visible (or fills the viewport)
 * progress = 0 when the element is fully out of view
 *
 * Uses a scroll listener + rAF for smooth, efficient updates.
 */
export function useScrollExpand(
  wrapperRef: Ref<HTMLElement | null>,
  options: ScrollExpandOptions = {},
) {
  const progress = ref(0)
  let ticking = false
  const initialHoldScroll = Math.max(0, options.initialHoldScroll ?? 0)

  function calculate() {
    const el = wrapperRef.value
    if (!el) {
      progress.value = 0
      ticking = false
      return
    }

    const rect = el.getBoundingClientRect()
    if (rect.height <= 0) {
      progress.value = 0
      ticking = false
      return
    }

    const viewportH = window.innerHeight
    const visibleTop = Math.max(rect.top, 0)
    const visibleBottom = Math.min(rect.bottom, viewportH)
    const visibleHeight = Math.max(0, visibleBottom - visibleTop)

    const targetVisibleHeight = Math.min(rect.height, viewportH)
    const raw = Math.min(visibleHeight / targetVisibleHeight, 1)
    const slowed = Math.pow(raw, 1.6)
    const eased = slowed * slowed * (3 - 2 * slowed)

    const baseProgress = Math.max(0, Math.min(1, eased))

    if (initialHoldScroll > 0) {
      const holdProgress = 1 - Math.min(window.scrollY / initialHoldScroll, 1)
      progress.value = Math.max(baseProgress, holdProgress)
    }
    else {
      progress.value = baseProgress
    }

    ticking = false
  }

  function onScroll() {
    if (!ticking) {
      ticking = true
      requestAnimationFrame(calculate)
    }
  }

  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    requestAnimationFrame(calculate)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
  })

  return { progress }
}
