<script setup lang="ts">
const route = useRoute()

useHead(() => ({
  htmlAttrs: {
    'data-home-landing': route.path === '/' ? 'true' : undefined,
  },
}))
</script>

<template>
  <div
    class="layout-root relative min-h-screen w-full bg-[var(--shell-ui-bg)] text-[var(--fg-primary)]"
  >
    <!-- Circuit board pattern (fades out by ~25% from top) -->
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
          <main id="main-content" class="min-w-0 w-full" tabindex="-1">
            <Transition name="layout-page" mode="default">
              <div :key="route.path" class="layout-page-frame min-w-0 w-full">
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
  background-color: var(--shell-ui-bg, var(--paper));
  color: var(--fg-primary);
}

.layout-circuit-bg {
  background-image:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 19px,
      rgba(75, 85, 99, 0.08) 19px,
      rgba(75, 85, 99, 0.08) 20px,
      transparent 20px,
      transparent 39px,
      rgba(75, 85, 99, 0.08) 39px,
      rgba(75, 85, 99, 0.08) 40px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 19px,
      rgba(75, 85, 99, 0.08) 19px,
      rgba(75, 85, 99, 0.08) 20px,
      transparent 20px,
      transparent 39px,
      rgba(75, 85, 99, 0.08) 39px,
      rgba(75, 85, 99, 0.08) 40px
    ),
    radial-gradient(
      circle at 20px 20px,
      rgba(55, 65, 81, 0.12) 2px,
      transparent 2px
    ),
    radial-gradient(
      circle at 40px 40px,
      rgba(55, 65, 81, 0.12) 2px,
      transparent 2px
    );
  background-size: 40px 40px, 40px 40px, 40px 40px, 40px 40px;
  -webkit-mask-image: linear-gradient(
    to bottom,
    #000 0%,
    transparent 25%
  );
  mask-image: linear-gradient(to bottom, #000 0%, transparent 25%);
}

:global(html.dark) .layout-circuit-bg {
  background-image:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 19px,
      color-mix(in srgb, var(--ink) 24%, transparent) 19px,
      color-mix(in srgb, var(--ink) 24%, transparent) 20px,
      transparent 20px,
      transparent 39px,
      color-mix(in srgb, var(--ink) 24%, transparent) 39px,
      color-mix(in srgb, var(--ink) 24%, transparent) 40px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 19px,
      color-mix(in srgb, var(--ink) 24%, transparent) 19px,
      color-mix(in srgb, var(--ink) 24%, transparent) 20px,
      transparent 20px,
      transparent 39px,
      color-mix(in srgb, var(--ink) 24%, transparent) 39px,
      color-mix(in srgb, var(--ink) 24%, transparent) 40px
    ),
    radial-gradient(
      circle at 20px 20px,
      color-mix(in srgb, var(--ink) 37.5%, transparent) 2px,
      transparent 2px
    ),
    radial-gradient(
      circle at 40px 40px,
      color-mix(in srgb, var(--ink) 37.5%, transparent) 2px,
      transparent 2px
    );
}

.layout-page-enter-active {
  transition:
    opacity 0.24s var(--motion-ease-reveal, cubic-bezier(0.16, 1, 0.3, 1)),
    transform 0.24s var(--motion-ease-reveal, cubic-bezier(0.16, 1, 0.3, 1));
}

.layout-page-leave-active {
  transition:
    opacity 0.16s var(--motion-ease-in, cubic-bezier(0.7, 0, 0.84, 0)),
    transform 0.16s var(--motion-ease-in, cubic-bezier(0.7, 0, 0.84, 0));
}

.layout-page-enter-from,
.layout-page-leave-to {
  opacity: 0;
  transform: translate3d(0, 8px, 0);
}

@media (prefers-reduced-motion: reduce) {
  .layout-page-enter-active,
  .layout-page-leave-active {
    transition-duration: 0.01ms;
  }

  .layout-page-enter-from,
  .layout-page-leave-to {
    opacity: 1;
    transform: none;
  }
}
</style>
