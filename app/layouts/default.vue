<script setup lang="ts">
const route = useRoute()

useHead(() => ({
  htmlAttrs: {
    class: route.path === '/' ? 'home-landing' : undefined,
  },
}))
</script>

<template>
  <div class="min-h-screen">
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
</template>

<style scoped>
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
