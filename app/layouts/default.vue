<script setup lang="ts">
const route = useRoute()

const { scrollTo } = useSmoothScroll()

useHead(() => ({
  htmlAttrs: {
    'data-home-landing': route.path === '/' ? 'true' : undefined,
  },
}))

/* ── JS-driven page transition ── */
/*
 * Performance strategy:
 * 1. Primary motion via transform (scale) + opacity — GPU-composited, zero paint.
 * 2. Very light blur (0.6rem) as seasoning — small radius = cheap rasterization.
 * 3. will-change promoted just before animation, cleaned up after.
 * 4. Styles batched inside rAF to avoid forced synchronous layout.
 * 5. Scroll-to-top runs in parallel but defers to native smooth scroll.
 */
const LEAVE_MS  = 550
const ENTER_MS  = 380
const EASE_OUT  = 'cubic-bezier(0.16, 1, 0.3, 1)'   // expo-out — decisive, confident
const EASE_IN   = 'cubic-bezier(0.55, 0, 1, 0.45)'   // ease-in for exit opacity

// Leave: scale + blur lead, opacity follows with a slight delay
const LEAVE_TRANSITION = [
  `transform ${LEAVE_MS}ms ${EASE_OUT}`,
  `filter ${LEAVE_MS}ms ${EASE_OUT}`,
  `opacity ${Math.round(LEAVE_MS * 0.45)}ms ${EASE_IN} ${Math.round(LEAVE_MS * 0.4)}ms`,
].join(', ')

// Enter: everything together with a snappy expo-out
const ENTER_TRANSITION = [
  `transform ${ENTER_MS}ms ${EASE_OUT}`,
  `filter ${ENTER_MS}ms ${EASE_OUT}`,
  `opacity ${ENTER_MS}ms ${EASE_OUT}`,
].join(', ')

function isReducedMotion() {
  return import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function resetPageTransitionStyles(el: HTMLElement) {
  el.style.transition = ''
  el.style.willChange = ''
  el.style.opacity = ''
  el.style.transform = ''
  el.style.filter = ''
}

/** Leave: scale-down + light blur + fade WHILE smooth-scrolling to top. */
function onLeave(el: Element, done: () => void) {
  if (!import.meta.client) {
    resetPageTransitionStyles(el as HTMLElement)
    done()
    return
  }

  if (isReducedMotion()) {
    window.scrollTo(0, 0)
    resetPageTransitionStyles(el as HTMLElement)
    requestAnimationFrame(done)
    return
  }

  const htmlEl = el as HTMLElement

  // Promote to own compositor layer before animating
  htmlEl.style.willChange = 'transform, opacity, filter'

  // Frame 1: apply transition + initial state lock
  requestAnimationFrame(() => {
    htmlEl.style.transition = LEAVE_TRANSITION
    // Frame 2: apply target state (guarantees the transition property was committed)
    requestAnimationFrame(() => {
      htmlEl.style.opacity = '0'
      htmlEl.style.transform = 'scale(0.97) translateZ(0)'
      htmlEl.style.filter = 'blur(0.6rem)'

      // Kick off smooth scroll in parallel, perfectly synced to the transition duration
      if (window.scrollY > 1) {
        scrollTo(0, {
          duration: LEAVE_MS,
          preset: 'default',
        })
      }

      // Route completion must not depend on Lenis' onComplete firing.
      setTimeout(() => {
        resetPageTransitionStyles(htmlEl)
        done()
      }, LEAVE_MS + 20)
    })
  })
}

/** Set initial hidden state before enter — prevents flash of unstyled content. */
function onBeforeEnter(el: Element) {
  if (!import.meta.client) return
  const htmlEl = el as HTMLElement
  // Start state: invisible, slightly scaled up, lightly blurred
  htmlEl.style.willChange = 'transform, opacity, filter'
  htmlEl.style.opacity = '0'
  htmlEl.style.transform = 'scale(1.015) translateZ(0)'
  htmlEl.style.filter = 'blur(0.4rem)'
}

/** Enter: fade + unblur + settle into place. */
function onEnter(el: Element, done: () => void) {
  if (!import.meta.client) {
    resetPageTransitionStyles(el as HTMLElement)
    done()
    return
  }

  if (isReducedMotion()) {
    // Instantly clear hidden state
    resetPageTransitionStyles(el as HTMLElement)
    requestAnimationFrame(done)
    return
  }

  const htmlEl = el as HTMLElement

  // Frame 1: commit the start state from onBeforeEnter, apply transition
  requestAnimationFrame(() => {
    htmlEl.style.transition = ENTER_TRANSITION
    // Frame 2: animate to final state
    requestAnimationFrame(() => {
      htmlEl.style.opacity = '1'
      htmlEl.style.transform = 'scale(1) translateZ(0)'
      htmlEl.style.filter = 'blur(0)'

      setTimeout(() => {
        // Full cleanup — no lingering inline styles or layer promotion
        resetPageTransitionStyles(htmlEl)
        done()
      }, ENTER_MS + 20)
    })
  })
}
</script>

<template>
  <div class="layout-root relative min-h-screen w-full text-[var(--fg-primary)]">
    <ScrollProgress />

    <div class="relative z-[1] flex min-h-screen flex-col">
      <a href="#main-content" class="skip-link">Skip to main content</a>
      <AppNavbar />

      <div class="layout-header-pad">
        <div
          class="layout-main-shell relative z-[1] container mx-auto flex min-h-screen w-full min-w-0 max-w-full flex-col px-0 pb-6 md:max-w-[82rem]"
        >
          <main id="main-content" class="relative min-w-0 w-full" tabindex="-1">
            <Transition :css="false" mode="out-in" @leave="onLeave" @before-enter="onBeforeEnter" @enter="onEnter">
              <div
                :key="route.path"
                class="layout-page-frame min-w-0 w-full"
                :class="{ 'layout-page-frame--home-landing': route.path === '/' }"
              >
                <slot />
              </div>
            </Transition>
          </main>
          <div class="mt-auto w-full min-w-0">
            <AppFooter />
          </div>
        </div>
      </div>

      <BackToTop />
    </div>
  </div>
</template>

<style scoped>
.layout-root {
  background: var(--shell-ui-bg, var(--paper));
  color: var(--fg-primary);
}

/* Page transition is fully JS-driven (:css="false") — see script above. */
</style>
