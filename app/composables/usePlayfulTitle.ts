import { onMounted, onUnmounted } from 'vue'

const HIDDEN_TITLES = [
  'come back :(',
  'still here →',
  'don\'t go yet',
  'left a tab open',
] as const

/**
 * Swap document.title to a playful line while the tab is hidden;
 * restore the original on focus. SSR-safe; no-op when reduced motion is preferred.
 */
export function usePlayfulTitle() {
  let originalTitle = ''
  let lastSwapIndex = -1

  function pickTitle(): string {
    if (HIDDEN_TITLES.length === 1) return HIDDEN_TITLES[0]!
    let i = Math.floor(Math.random() * HIDDEN_TITLES.length)
    if (i === lastSwapIndex) i = (i + 1) % HIDDEN_TITLES.length
    lastSwapIndex = i
    return HIDDEN_TITLES[i]!
  }

  function onVisibilityChange() {
    if (typeof document === 'undefined') return
    if (document.hidden) {
      originalTitle = document.title
      document.title = pickTitle()
    } else if (originalTitle) {
      document.title = originalTitle
    }
  }

  onMounted(() => {
    if (typeof document === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    document.addEventListener('visibilitychange', onVisibilityChange)
  })

  onUnmounted(() => {
    if (typeof document === 'undefined') return
    document.removeEventListener('visibilitychange', onVisibilityChange)
    if (originalTitle && document.hidden) document.title = originalTitle
  })
}
