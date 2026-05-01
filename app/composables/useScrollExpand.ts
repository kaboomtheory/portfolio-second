import { ref, computed, onBeforeUnmount, onMounted, watch, type Ref } from 'vue'
import {
  useScrollLayoutSubscription,
  useSharedScrollY,
  type ScrollLayoutTickSource,
} from '~/composables/useScrollLayoutBus'

export interface ScrollExpandOptions {
  minScale?: number
  maxScale?: number
  centerThreshold?: number
  preExpanded?: boolean
}

function isFirefoxClient(): boolean {
  return import.meta.client && /firefox/i.test(navigator.userAgent)
}

export function useScrollExpand(
  elementRef: Ref<HTMLElement | null>,
  options: ScrollExpandOptions = {},
) {
  const {
    minScale = 0.85,
    maxScale = 1,
    centerThreshold = 0.3,
    preExpanded = false,
  } = options

  const progress = ref(preExpanded ? 1 : 0)
  const scrollY = useSharedScrollY()
  const minProgress = ref(preExpanded ? 1 : 0)
  const hasScrolled = ref(false)
  const TRANSITION_RANGE = 1200

  const topFactor = computed(() => {
    if (scrollY.value >= TRANSITION_RANGE) return 0
    return 1 - scrollY.value / TRANSITION_RANGE
  })

  const scale = computed(() => {
    if (preExpanded && !hasScrolled.value) {
      return maxScale
    }
    if (preExpanded) {
      const scrollBasedScale = minScale + (maxScale - minScale) * minProgress.value
      return scrollBasedScale + (maxScale - scrollBasedScale) * topFactor.value
    }
    return minScale + (maxScale - minScale) * progress.value
  })

  const isCentered = computed(() => progress.value >= 1 - centerThreshold)

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
    const maxDistance = viewportHeight * 0.95
    const normalizedDistance = Math.abs(distanceFromCenter) / maxDistance
    const easedDistance = normalizedDistance * normalizedDistance

    progress.value = Math.max(0, Math.min(1, 1 - easedDistance))

    if (preExpanded && hasScrolled.value) {
      minProgress.value = Math.min(minProgress.value, progress.value)
    }
  }

  const onTick = (source: ScrollLayoutTickSource) => {
    if (source === 'scroll') {
      hasScrolled.value = true
    }
    calculateProgress()
  }

  useScrollLayoutSubscription(onTick)

  const attach = () => {
    calculateProgress()
  }

  const detach = () => {}

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
  options: { preExpanded?: boolean } = {},
) {
  const { preExpanded = false } = options

  const opacity = ref(preExpanded ? 1 : 0)
  const minOpacity = ref(preExpanded ? 1 : 0)
  const hasScrolled = ref(false)
  const scrollY = useSharedScrollY()
  const TRANSITION_RANGE = 1200

  const topFactor = computed(() => {
    if (scrollY.value >= TRANSITION_RANGE) return 0
    return 1 - scrollY.value / TRANSITION_RANGE
  })

  const displayedOpacity = computed(() => {
    if (preExpanded && !hasScrolled.value) {
      return 1
    }
    if (preExpanded) {
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
    const maxDistance = viewportHeight * 0.85
    const bufferZone = maxDistance * 0.4

    if (Math.abs(distanceFromCenter) < bufferZone) {
      opacity.value = 1
    } else {
      const normalizedDistance =
        (Math.abs(distanceFromCenter) - bufferZone) / (maxDistance - bufferZone)
      const easedDistance = normalizedDistance * normalizedDistance
      opacity.value = Math.max(0.25, Math.min(1, 1 - easedDistance))
    }

    if (preExpanded && hasScrolled.value) {
      minOpacity.value = Math.min(minOpacity.value, opacity.value)
    }
  }

  const onTick = (source: ScrollLayoutTickSource) => {
    if (source === 'scroll') {
      hasScrolled.value = true
    }
    calculateOpacity()
  }

  useScrollLayoutSubscription(onTick)

  const attach = () => {
    calculateOpacity()
  }

  const detach = () => {}

  return {
    opacity,
    displayedOpacity,
    hasScrolled,
    attach,
    detach,
  }
}

/**
 * Single layout subscription + one getBoundingClientRect per frame for scroll-driven
 * scale and opacity (used by ScrollExpandImage).
 */
export function useScrollExpandImage(
  elementRef: Ref<HTMLElement | null>,
  options: ScrollExpandOptions = {},
) {
  const {
    minScale = 0.92,
    maxScale = 1,
    centerThreshold = 0.3,
    preExpanded = false,
  } = options

  if (isFirefoxClient()) {
    return {
      progress: ref(1),
      scale: computed(() => maxScale),
      isCentered: computed(() => true),
      displayedOpacity: computed(() => 1),
      scrollY: useSharedScrollY(),
      hasScrolled: ref(false),
    }
  }

  const progress = ref(preExpanded ? 1 : 0)
  const opacity = ref(preExpanded ? 1 : 0)
  const minProgress = ref(preExpanded ? 1 : 0)
  const minOpacity = ref(preExpanded ? 1 : 0)
  const hasScrolled = ref(false)
  const scrollY = useSharedScrollY()
  const TRANSITION_RANGE = 1200

  const topFactor = computed(() => {
    if (scrollY.value >= TRANSITION_RANGE) return 0
    return 1 - scrollY.value / TRANSITION_RANGE
  })

  const scale = computed(() => {
    if (preExpanded && !hasScrolled.value) {
      return maxScale
    }
    if (preExpanded) {
      const scrollBasedScale = minScale + (maxScale - minScale) * minProgress.value
      return scrollBasedScale + (maxScale - scrollBasedScale) * topFactor.value
    }
    return minScale + (maxScale - minScale) * progress.value
  })

  const displayedOpacity = computed(() => {
    if (preExpanded && !hasScrolled.value) {
      return 1
    }
    if (preExpanded) {
      return minOpacity.value + (1 - minOpacity.value) * topFactor.value
    }
    return opacity.value
  })

  const isCentered = computed(() => progress.value >= 1 - centerThreshold)
  const isLayoutActive = ref(true)
  let observer: IntersectionObserver | null = null

  const observeElement = (element: HTMLElement | null) => {
    if (!observer || !element) return
    observer.observe(element)
  }

  onMounted(() => {
    if (!import.meta.client || typeof IntersectionObserver === 'undefined') return

    observer = new IntersectionObserver(
      (entries) => {
        const nextActive = entries.some((entry) => entry.isIntersecting)
        if (isLayoutActive.value === nextActive) return
        isLayoutActive.value = nextActive
        if (nextActive) {
          updateLayout('resize')
        }
      },
      {
        rootMargin: '1200px 0px',
        threshold: 0,
      },
    )

    observeElement(elementRef.value)
  })

  watch(elementRef, (element, previousElement) => {
    if (!import.meta.client || !observer) return
    if (previousElement) observer.unobserve(previousElement)
    observeElement(element)
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
  })

  const updateLayout = (source: ScrollLayoutTickSource) => {
    if (!import.meta.client || !elementRef.value) {
      progress.value = preExpanded ? 1 : 0
      opacity.value = preExpanded ? 1 : 0
      return
    }

    if (source === 'scroll') {
      hasScrolled.value = true
    }

    if (!isLayoutActive.value) {
      return
    }

    const rect = elementRef.value.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const elementCenter = rect.top + rect.height / 2
    const viewportCenter = viewportHeight / 2
    const distanceFromCenter = elementCenter - viewportCenter

    const maxExpand = viewportHeight * 0.95
    const normExpand = Math.abs(distanceFromCenter) / maxExpand
    const easedExpand = normExpand * normExpand
    progress.value = Math.max(0, Math.min(1, 1 - easedExpand))

    const maxOp = viewportHeight * 0.85
    const bufferZone = maxOp * 0.4
    if (Math.abs(distanceFromCenter) < bufferZone) {
      opacity.value = 1
    } else {
      const normOp =
        (Math.abs(distanceFromCenter) - bufferZone) / (maxOp - bufferZone)
      const easedOp = normOp * normOp
      opacity.value = Math.max(0.25, Math.min(1, 1 - easedOp))
    }

    if (preExpanded && hasScrolled.value) {
      minProgress.value = Math.min(minProgress.value, progress.value)
      minOpacity.value = Math.min(minOpacity.value, opacity.value)
    }
  }

  useScrollLayoutSubscription(updateLayout)

  return {
    progress,
    scale,
    isCentered,
    displayedOpacity,
    scrollY,
    hasScrolled,
  }
}
