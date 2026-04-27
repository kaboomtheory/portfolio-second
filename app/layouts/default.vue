<script setup lang="ts">
import { activeSectionSignalKey, useActiveSectionSignal } from '~/composables/useActiveSectionSignal'

const route = useRoute()
const { ambientTone } = useTimeOfDay()

const activeSectionSignal = useActiveSectionSignal()
provide(activeSectionSignalKey, activeSectionSignal)

useHead(() => ({
  htmlAttrs: {
    'data-home-landing': route.path === '/' ? 'true' : undefined,
    'data-ambient-tone': ambientTone.value,
  },
}))
</script>

<template>
  <div class="layout-root relative min-h-screen w-full text-[var(--fg-primary)]">
    <ScrollProgress />
    <ScrollDriftLayer />

    <!-- Circuit board pattern (full strength top half; fades over bottom half) -->
    <div
      class="layout-circuit-bg pointer-events-none absolute inset-0 z-0"
      aria-hidden="true"
    />

    <div class="relative z-[1] flex min-h-screen flex-col">
      <a href="#main-content" class="skip-link">Skip to main content</a>
      <AppNavbar />

      <div class="layout-header-pad">
        <div
          class="layout-main-shell relative z-[1] container mx-auto flex min-h-screen w-full min-w-0 max-w-full flex-col px-0 pb-6 md:max-w-[82rem]"
        >
          <main id="main-content" class="relative min-w-0 w-full" tabindex="-1">
            <Transition name="page" mode="out-in">
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
  background: color-mix(in srgb, var(--ambient-tint, transparent) 2%, var(--shell-ui-bg, var(--paper)));
  color: var(--fg-primary);
}

.layout-circuit-bg {
  background-image:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 19px,
      rgba(75, 85, 99, 0.05) 19px,
      rgba(75, 85, 99, 0.05) 20px,
      transparent 20px,
      transparent 39px,
      rgba(75, 85, 99, 0.05) 39px,
      rgba(75, 85, 99, 0.05) 40px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 19px,
      rgba(75, 85, 99, 0.05) 19px,
      rgba(75, 85, 99, 0.05) 20px,
      transparent 20px,
      transparent 39px,
      rgba(75, 85, 99, 0.05) 39px,
      rgba(75, 85, 99, 0.05) 40px
    ),
    radial-gradient(
      circle at 20px 20px,
      rgba(55, 65, 81, 0.08) 2px,
      transparent 2px
    ),
    radial-gradient(
      circle at 40px 40px,
      rgba(55, 65, 81, 0.08) 2px,
      transparent 2px
    );
  background-size: 40px 40px, 40px 40px, 40px 40px, 40px 40px;
  /* Bottom 50%: ease-out → strong drop after midpoint, gentle final feather */
  -webkit-mask-image: linear-gradient(
    to bottom,
    #000 0%,
    #000 50%,
    rgb(0 0 0 / 0.42) 66%,
    rgb(0 0 0 / 0.14) 82%,
    rgb(0 0 0 / 0.04) 94%,
    transparent 100%
  );
  mask-image: linear-gradient(
    to bottom,
    #000 0%,
    #000 50%,
    rgb(0 0 0 / 0.42) 66%,
    rgb(0 0 0 / 0.14) 82%,
    rgb(0 0 0 / 0.04) 94%,
    transparent 100%
  );
}

.page-leave-active {
  transition: all 0.4s;
}

.page-leave-to {
  filter: blur(1rem);
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .page-leave-active {
    transition-duration: 0.01ms;
  }

  .page-leave-to {
    filter: none;
    opacity: 1;
  }
}
</style>
