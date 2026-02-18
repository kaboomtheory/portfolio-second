import { ref, onMounted, onBeforeUnmount, type Ref } from 'vue'

interface ScrollExpandOptions {
  initialHoldScroll?: number
}

/**
 * Tracks an element against the viewport center and returns
 * a reactive `progress` value (0 → 1 → 0).
 *
 * progress = 1 when the element center aligns with viewport center
 * progress = 0 when the element is fully outside viewport bounds
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
    const viewportCenterY = viewportH / 2
    const elementCenterY = rect.top + rect.height / 2
    const distanceToCenter = Math.abs(elementCenterY - viewportCenterY)

    // The element starts contributing once it intersects the viewport,
    // then ramps smoothly toward the center.
    const slowdownFactor = 2.5
    const influenceRadius = ((viewportH + rect.height) / 2) * slowdownFactor
    const peakHoldDistance = Math.min(96, influenceRadius * 0.2)
    const distanceAfterHold = Math.max(0, distanceToCenter - peakHoldDistance)
    const usableRadius = Math.max(1, influenceRadius - peakHoldDistance)
    const centered = 1 - Math.min(distanceAfterHold / usableRadius, 1)

    // Remove tiny edge jitter and soften the curve.
    const edgeClamp = centered <= 0.05 ? 0 : (centered - 0.05) / 0.95
    const eased = edgeClamp * edgeClamp * (3 - 2 * edgeClamp)

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
