/**
 * Fades .bx-reveal elements in as they enter the viewport. Elements already
 * on screen when the script runs are shown at once, so nothing blinks.
 */
export function initReveal() {
  const items = Array.from(document.querySelectorAll<HTMLElement>('.bx-reveal'))
  if (!items.length || !('IntersectionObserver' in window)) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const fold = window.innerHeight
  const later = items.filter((el) => el.getBoundingClientRect().top > fold)
  if (!later.length) return
  document.documentElement.classList.add('bx-js')
  items.filter((el) => !later.includes(el)).forEach((el) => el.classList.add('is-in'))

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        e.target.classList.add('is-in')
        io.unobserve(e.target)
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  )
  later.forEach((el) => io.observe(el))
}
