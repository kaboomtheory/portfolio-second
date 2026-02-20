import { ref, onMounted, onBeforeUnmount, type Ref } from 'vue'

interface ScrollExpandOptions {
  preExpanded?: boolean
  preloadDistance?: number
  centerHold?: number
  influenceMultiplier?: number
  edgeFadeStart?: number
  edgeFadeEnd?: number
}

export function useScrollExpand(
  wrapperRef: Ref<HTMLElement | null>,
  options: ScrollExpandOptions = {},
) {
  const preExpanded = options.preExpanded ?? false
  const preloadDistance = Math.max(0, options.preloadDistance ?? 360)
  const centerHold = Math.max(0, options.centerHold ?? 84)
  const influenceMultiplier = Math.max(1, options.influenceMultiplier ?? 1.7)
  const edgeFadeStart = Math.max(0.12, Math.min(1, options.edgeFadeStart ?? 0.58))
  const edgeFadeEnd = Math.max(0, Math.min(edgeFadeStart - 0.01, options.edgeFadeEnd ?? 0.1))

  const progress = ref(preExpanded ? 1 : 0)
  const visibility = ref(0)
  let rafId = 0
  let resizeObserver: ResizeObserver | null = null

  const ease = (value: number) => value * value * (3 - 2 * value)

  const calculate = () => {
    const el = wrapperRef.value
    if (!el) {
      progress.value = 0
      visibility.value = 0
      rafId = 0
      return
    }

    const rect = el.getBoundingClientRect()
    if (rect.height <= 0) {
      progress.value = 0
      visibility.value = 0
      rafId = 0
      return
    }

    const viewportH = window.innerHeight
    const viewportCenterY = viewportH / 2
    const elementCenterY = rect.top + rect.height / 2
    const distanceToCenter = Math.abs(elementCenterY - viewportCenterY)
    const visibleTop = Math.max(rect.top, 0)
    const visibleBottom = Math.min(rect.bottom, viewportH)
    const visiblePixels = Math.max(0, visibleBottom - visibleTop)
    const ratioDenominator = Math.max(1, Math.min(rect.height, viewportH))
    const visibleRatio = Math.max(0, Math.min(1, visiblePixels / ratioDenominator))

    if (visibleRatio <= edgeFadeEnd) {
      visibility.value = 0
    }
    else if (visibleRatio >= edgeFadeStart) {
      visibility.value = 1
    }
    else {
      const blend = (visibleRatio - edgeFadeEnd) / (edgeFadeStart - edgeFadeEnd)
      visibility.value = ease(blend)
    }

    const influenceRadius = ((viewportH + rect.height) / 2) * influenceMultiplier
    const distanceAfterHold = Math.max(0, distanceToCenter - centerHold)
    const usableRadius = Math.max(1, influenceRadius - centerHold)
    const normalized = 1 - Math.min(distanceAfterHold / usableRadius, 1)
    const baseProgress = ease(Math.max(0, Math.min(1, normalized)))

    if (preExpanded && preloadDistance > 0) {
      const lockDistance = Math.min(120, preloadDistance * 0.28)
      const blendDistance = Math.max(160, preloadDistance * 0.62)

      if (window.scrollY <= lockDistance) {
        progress.value = 1
      }
      else {
        const blendT = Math.max(0, Math.min(1, (window.scrollY - lockDistance) / blendDistance))
        const release = 1 - ease(blendT)
        progress.value = baseProgress + (1 - baseProgress) * release
      }
    }
    else {
      progress.value = baseProgress
    }

    rafId = 0
  }

  const schedule = () => {
    if (rafId) return
    rafId = window.requestAnimationFrame(calculate)
  }

  onMounted(() => {
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })

    if ('ResizeObserver' in window && wrapperRef.value) {
      resizeObserver = new ResizeObserver(schedule)
      resizeObserver.observe(wrapperRef.value)
    }

    schedule()
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', schedule)
    window.removeEventListener('resize', schedule)

    if (rafId) {
      window.cancelAnimationFrame(rafId)
      rafId = 0
    }

    resizeObserver?.disconnect()
    resizeObserver = null
  })

  return { progress, visibility }
}
