import { ref, onMounted, onBeforeUnmount, type Ref } from 'vue'

/**
 * Tracks how much of an element is visible in the viewport and returns
 * a reactive `progress` value (0 → 1 → 0).
 *
 * progress = 1 when the element is fully visible (or fills the viewport)
 * progress = 0 when the element is fully out of view
 *
 * Uses a scroll listener + rAF for smooth, efficient updates.
 */
export function useScrollExpand(wrapperRef: Ref<HTMLElement | null>) {
  const progress = ref(0)
  let ticking = false

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
    const eased = raw * raw * (3 - 2 * raw)

    progress.value = Math.max(0, Math.min(1, eased))
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
