<script setup lang="ts">
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
          <slot />
        </main>
        <div class="mt-auto w-full min-w-0">
          <AppFooter />
        </div>
      </div>
    </div>

    <BackToTop />
  </div>
</template>
