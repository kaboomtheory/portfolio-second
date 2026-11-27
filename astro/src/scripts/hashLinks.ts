import { useHomeSectionScroll } from '~/composables/useHomeSectionScroll'

/**
 * Smooth-scroll in-page `#section` links and honour a hash on first load,
 * ported from app.vue.
 */
export function initHashLinks() {
  const { scrollToHomeHash } = useHomeSectionScroll()

  document.addEventListener('click', (e) => {
    const anchor = (e.target as HTMLElement | null)?.closest('a[href^="#"]') as HTMLAnchorElement | null
    const href = anchor?.getAttribute('href')
    if (!href || href === '#') return
    e.preventDefault()
    scrollToHomeHash(href)
  })

  if (window.location.hash) {
    requestAnimationFrame(() => scrollToHomeHash(window.location.hash))
  }
}

export function printConsoleSignature() {
  const headline = 'color: #15120f; font: 600 14px/1.2 ui-monospace, monospace; padding: 6px 0;'
  const body = 'color: #6b6258; font: 400 12px/1.5 ui-monospace, monospace;'
  const link = 'color: #15120f; font: 500 12px/1.5 ui-monospace, monospace; text-decoration: underline;'
  /* eslint-disable no-console */
  console.log('%cBryan X. Mendez — designer, Los Angeles', headline)
  console.log(
    '%cPoking around? Likewise.\n'
      + 'Brand identity, packaging, and thoughtful digital things.\n'
      + 'If you\'re hiring or just want to swap notes, find me on LinkedIn ↘',
    body,
  )
  console.log('%cor say hi via the form at /#contact', link)
  /* eslint-enable no-console */
}
