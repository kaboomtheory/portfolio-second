/**
 * Case study behaviour: the pinned image sequence, the lightbox, live type-spec
 * sizes and hex swatches. Styles are set through the CSSOM (element.style),
 * which the hash-based CSP allows, so no inline style attributes are rendered.
 */
export function initCaseStudy() {
  initSpecSizes()
  initSwatches()
  initStory()
  initLightbox()
}

/** Type-spec lines report the headline's real rendered size. */
export function initSpecSizes() {
  const update = () => {
    document.querySelectorAll<HTMLElement>('[data-bx-size]').forEach((el) => {
      const h = el.closest('.bx-spec')?.previousElementSibling as HTMLElement | null
      const target = (h?.querySelector('.intro__name') as HTMLElement | null) ?? h
      if (!target) return
      el.textContent = String(Math.round(parseFloat(getComputedStyle(target).fontSize)))
    })
  }
  update()
  window.addEventListener('resize', update, { passive: true })
}

function initSwatches() {
  document.querySelectorAll<HTMLElement>('[data-swatch]').forEach((el) => {
    el.style.background = el.dataset.swatch ?? ''
  })
}

function initStory() {
  const story = document.querySelector<HTMLElement>('[data-story]')
  const stage = story?.querySelector<HTMLElement>('[data-stage]')
  if (!story || !stage) return
  const steps = Number(story.dataset.steps) || 1
    const fill = stage.querySelector<HTMLElement>('[data-fill]')
  const count = stage.querySelector<HTMLElement>('[data-count]')
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let raf = 0

  const render = () => {
    raf = 0
    const rect = story.getBoundingClientRect()
    const travel = story.offsetHeight - window.innerHeight
    const p = Math.min(1, Math.max(0, -rect.top / Math.max(1, travel)))
    const step = Math.min(steps - 1, Math.floor(p * steps))
    if (stage.dataset.step !== String(step)) {
      stage.dataset.step = String(step)
      if (count) count.textContent = String(step + 1).padStart(2, '0')
    }
    fill?.style.setProperty('--p', p.toFixed(4))
    if (!reduce) {
      // Each step starts tipped back and settles flat as you scroll through it.
      const local = p * steps - step
      const eased = 1 - Math.pow(1 - Math.min(1, local * 1.6), 3)
      stage.style.setProperty('--tilt', `${(1 - eased) * 14}deg`)
      stage.style.setProperty('--tilt-y', `${(1 - eased) * (step % 2 ? 6 : -6)}deg`)
    }
  }

  const onScroll = () => {
    if (!raf) raf = requestAnimationFrame(render)
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
  render()
}

function initLightbox() {
  const dialog = document.querySelector<HTMLDialogElement>('[data-lb]')
  const img = dialog?.querySelector<HTMLImageElement>('[data-lb-img]')
  if (!dialog || !img || typeof dialog.showModal !== 'function') return

  document.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-lightbox]')
    if (!btn) return
    img.src = btn.dataset.lightbox ?? ''
    img.alt = btn.dataset.alt || btn.querySelector('img')?.alt || ''
    dialog.showModal()
  })
  dialog.querySelector('[data-lb-close]')?.addEventListener('click', () => dialog.close())
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close()
  })
  dialog.addEventListener('close', () => img.removeAttribute('src'))
}
