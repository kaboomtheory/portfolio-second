import { ref, onMounted, onUnmounted, computed, type Ref } from 'vue'

export interface ScrollExpandOptions {
  minScale?: number
  maxScale?: number
  centerThreshold?: number
  preExpanded?: boolean
}

export function useScrollExpand(
  elementRef: Ref<HTMLElement | null>,
  options: ScrollExpandOptions = {}
) {
  const {
    minScale = 0.85,
    maxScale = 1,
    centerThreshold = 0.3,
    preExpanded = false,
  } = options

  const progress = ref(preExpanded ? 1 : 0)
  const scrollY = ref(0)
  const minProgress = ref(preExpanded ? 1 : 0)
  const hasScrolled = ref(false)
  const TRANSITION_RANGE = 1200 // Pixels over which to transition from full to scroll-based
  let rafId: number | null = null

  // Smooth factor: 1 at top, 0 after TRANSITION_RANGE
  const topFactor = computed(() => {
    if (scrollY.value >= TRANSITION_RANGE) return 0
    return 1 - (scrollY.value / TRANSITION_RANGE)
  })

  const scale = computed(() => {
    if (preExpanded && !hasScrolled.value) {
      return maxScale
    }
    if (preExpanded) {
      const scrollBasedScale = minScale + (maxScale - minScale) * minProgress.value
      // Blend between maxScale and scroll-based based on topFactor
      return scrollBasedScale + (maxScale - scrollBasedScale) * topFactor.value
    }
    return minScale + (maxScale - minScale) * progress.value
  })

  const isCentered = computed(() => progress.value >= (1 - centerThreshold))

  const calculateProgress = () => {
    if (!import.meta.client || !elementRef.value) {
      progress.value = preExpanded ? 1 : 0
      return
    }

    const rect = elementRef.value.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const elementCenter = rect.top + rect.height / 2
    const viewportCenter = viewportHeight / 2

    const distanceFromCenter = elementCenter - viewportCenter
    const maxDistance = viewportHeight * 0.95 // Wider range for more gradual scale fade

    const normalizedDistance = Math.abs(distanceFromCenter) / maxDistance

    // Apply easing for more gradual transition
    const easedDistance = normalizedDistance * normalizedDistance // Quadratic easing

    progress.value = Math.max(0, Math.min(1, 1 - easedDistance))

    if (preExpanded && hasScrolled.value) {
      minProgress.value = Math.min(minProgress.value, progress.value)
    }
  }

  const onScroll = () => {
    scrollY.value = window.scrollY
    hasScrolled.value = true

    if (rafId) {
      cancelAnimationFrame(rafId)
    }

    rafId = requestAnimationFrame(calculateProgress)
  }

  const attach = () => {
    if (!import.meta.client) return

    calculateProgress()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', calculateProgress, { passive: true })
  }

  const detach = () => {
    if (!import.meta.client) return

    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', calculateProgress)
    if (rafId) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  }

  onMounted(attach)
  onUnmounted(detach)

  return {
    progress,
    scale,
    isCentered,
    scrollY,
    hasScrolled,
    attach,
    detach,
  }
}

export function useScrollOpacity(
  elementRef: Ref<HTMLElement | null>,
  options: { preExpanded?: boolean } = {}
) {
  const { preExpanded = false } = options

  const opacity = ref(preExpanded ? 1 : 0)
  const minOpacity = ref(preExpanded ? 1 : 0)
  const hasScrolled = ref(false)
  const scrollY = ref(0)
  const TRANSITION_RANGE = 1200 // Pixels over which to transition from full to scroll-based
  let rafId: number | null = null

  // Smooth factor: 1 at top, 0 after TRANSITION_RANGE
  const topFactor = computed(() => {
    if (scrollY.value >= TRANSITION_RANGE) return 0
    return 1 - (scrollY.value / TRANSITION_RANGE)
  })

  const displayedOpacity = computed(() => {
    if (preExpanded && !hasScrolled.value) {
      return 1
    }
    if (preExpanded) {
      // Blend between 1 and scroll-based based on topFactor
      return minOpacity.value + (1 - minOpacity.value) * topFactor.value
    }
    return opacity.value
  })

  const calculateOpacity = () => {
    if (!import.meta.client || !elementRef.value) {
      opacity.value = preExpanded ? 1 : 0
      return
    }

    const rect = elementRef.value.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const elementCenter = rect.top + rect.height / 2
    const viewportCenter = viewportHeight / 2

    const distanceFromCenter = elementCenter - viewportCenter
    const maxDistance = viewportHeight * 0.85 // Wider range for more gradual opacity fade
    const bufferZone = maxDistance * 0.4 // Larger zone where opacity stays at 1

    if (Math.abs(distanceFromCenter) < bufferZone) {
      opacity.value = 1
    } else {
      const normalizedDistance = (Math.abs(distanceFromCenter) - bufferZone) / (maxDistance - bufferZone)
      // Apply easing for more gradual transition
      const easedDistance = normalizedDistance * normalizedDistance
      opacity.value = Math.max(0, Math.min(1, 1 - easedDistance))
    }

    if (preExpanded && hasScrolled.value) {
      minOpacity.value = Math.min(minOpacity.value, opacity.value)
    }
  }

  const onScroll = () => {
    scrollY.value = window.scrollY
    hasScrolled.value = true
    if (rafId) {
      cancelAnimationFrame(rafId)
    }
    rafId = requestAnimationFrame(calculateOpacity)
  }

  const attach = () => {
    if (!import.meta.client) return

    calculateOpacity()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', calculateOpacity, { passive: true })
  }

  const detach = () => {
    if (!import.meta.client) return

    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', calculateOpacity)
    if (rafId) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  }

  onMounted(attach)
  onUnmounted(detach)

  return {
    opacity,
    displayedOpacity,
    hasScrolled,
    attach,
    detach,
  }
}
