<script setup lang="ts">
import { activeSectionSignalKey, useActiveSectionSignal } from '~/composables/useActiveSectionSignal'

const route = useRoute()
const router = useRouter()
const { ambientTint } = useTimeOfDay()

const activeSectionSignal = useActiveSectionSignal()
provide(activeSectionSignalKey, activeSectionSignal)

const transitionName = ref('layout-page')

router.beforeEach((to, from) => {
  const involvesProject =
    to.path.startsWith('/projects/') || from.path.startsWith('/projects/')
  transitionName.value = involvesProject ? 'project-blur' : 'layout-page'
})

useHead(() => ({
  htmlAttrs: {
    'data-home-landing': route.path === '/' ? 'true' : undefined,
    style: ambientTint.value !== 'transparent' ? `--ambient-tint: ${ambientTint.value};` : undefined,
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
            <Transition :name="transitionName" mode="default">
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

.layout-page-enter-active {
  transition:
    opacity 0.32s var(--motion-ease-reveal, cubic-bezier(0.16, 1, 0.3, 1)),
    transform 0.32s var(--motion-ease-reveal, cubic-bezier(0.16, 1, 0.3, 1));
}

.layout-page-frame--home-landing.layout-page-enter-active {
  /* Shorter than generic layout enter so it does not stack awkwardly with scroll reveals */
  transition-duration: 0.26s;
  transition-timing-function: var(--motion-ease-hero, cubic-bezier(0.16, 1, 0.3, 1));
}

.layout-page-leave-active {
  transition:
    opacity 0.16s var(--motion-ease-in, cubic-bezier(0.7, 0, 0.84, 0)),
    transform 0.16s var(--motion-ease-in, cubic-bezier(0.7, 0, 0.84, 0));
}

.layout-page-enter-from,
.layout-page-leave-to {
  opacity: 0;
  transform: translate3d(0, 8px, 0) scale(0.995);
}

.layout-page-frame--home-landing.layout-page-enter-from {
  transform: translate3d(0, 5px, 0) scale(0.997);
}

@media (prefers-reduced-motion: reduce) {
  .layout-page-enter-active,
  .layout-page-leave-active {
    transition-duration: 0.01ms;
  }

  .layout-page-frame--home-landing.layout-page-enter-active {
    transition-duration: 0.01ms;
  }

  .layout-page-enter-from,
  .layout-page-leave-to {
    opacity: 1;
    transform: none;
  }

  .layout-page-frame--home-landing.layout-page-enter-from {
    opacity: 1;
    transform: none;
  }
}

.project-blur-enter-active,
.project-blur-leave-active {
  will-change: opacity, filter, transform;
}

.project-blur-leave-active {
  position: absolute;
  inset: 0;
  transition:
    opacity 0.28s cubic-bezier(0.7, 0, 0.84, 0),
    filter 0.28s cubic-bezier(0.7, 0, 0.84, 0);
}

.project-blur-enter-active {
  transition:
    opacity 0.34s cubic-bezier(0.16, 1, 0.3, 1),
    filter 0.34s cubic-bezier(0.16, 1, 0.3, 1);
}

.project-blur-leave-to {
  opacity: 0;
  filter: blur(6px);
}

.project-blur-enter-from {
  opacity: 0;
  filter: blur(6px);
}

@media (prefers-reduced-motion: reduce) {
  .project-blur-leave-active,
  .project-blur-enter-active {
    transition-duration: 0.01ms;
    position: static;
  }

  .project-blur-leave-to,
  .project-blur-enter-from {
    opacity: 1;
    filter: none;
  }
}
</style>
