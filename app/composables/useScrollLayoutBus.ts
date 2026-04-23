import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export type ScrollLayoutTickSource = 'init' | 'scroll' | 'resize'

const scrollY = ref(0)
/** Max scrollable distance: scrollHeight − viewport (min 1). Updated each flush + on layout resize. */
const maxScroll = ref(1)
const subscribers = new Set<(source: ScrollLayoutTickSource) => void>()
let rafId: number | null = null
/** Coalesce: scroll beats resize for the same rAF (hasScrolled semantics). */
let coalescedSource: ScrollLayoutTickSource = 'init'
let docResizeObserver: ResizeObserver | null = null

function updateScrollMetrics() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return
  scrollY.value = window.scrollY
  const h = document.documentElement.scrollHeight
  const ih = window.innerHeight
  maxScroll.value = Math.max(1, h - ih)
}

function runFlush() {
  if (typeof window === 'undefined') return
  updateScrollMetrics()
  const source = coalescedSource
  coalescedSource = 'init'
  for (const fn of subscribers) {
    fn(source)
  }
  rafId = null
}

function schedule(source: ScrollLayoutTickSource) {
  if (typeof window === 'undefined') return
  if (source === 'scroll') {
    coalescedSource = 'scroll'
  } else if (source === 'resize' && coalescedSource !== 'scroll') {
    coalescedSource = 'resize'
  }
  if (rafId !== null) return
  rafId = requestAnimationFrame(runFlush)
}

function onWindowScroll() {
  schedule('scroll')
}

function onWindowResize() {
  schedule('resize')
}

/**
 * Shared window.scrollY updated once per animation frame before tick callbacks.
 */
export function useSharedScrollY(): Ref<number> {
  return scrollY
}

/**
 * Shared max scroll distance (document height minus viewport), same cadence as scrollY.
 */
export function useSharedScrollMax(): Ref<number> {
  return maxScroll
}

/**
 * One scroll + resize listener + one rAF for all subscribers (coalesced).
 */
export function useScrollLayoutSubscription(
  onTick: (source: ScrollLayoutTickSource) => void,
) {
  onMounted(() => {
    if (!import.meta.client) return

    subscribers.add(onTick)
    if (subscribers.size === 1) {
      window.addEventListener('scroll', onWindowScroll, { passive: true })
      window.addEventListener('resize', onWindowResize, { passive: true })
      if (typeof ResizeObserver !== 'undefined') {
        docResizeObserver = new ResizeObserver(() => {
          schedule('resize')
        })
        docResizeObserver.observe(document.documentElement)
      }
    }

    updateScrollMetrics()
    onTick('init')
  })

  onUnmounted(() => {
    if (!import.meta.client) return

    subscribers.delete(onTick)
    if (subscribers.size === 0) {
      window.removeEventListener('scroll', onWindowScroll)
      window.removeEventListener('resize', onWindowResize)
      if (docResizeObserver) {
        docResizeObserver.disconnect()
        docResizeObserver = null
      }
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
    }
  })
}
