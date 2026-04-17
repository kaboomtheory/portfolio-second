<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen">
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <AppNavbar />

    <div class="pt-28 md:pt-24">
      <div class="container mx-auto flex min-h-screen flex-col px-5 pb-6 sm:px-6 md:max-w-[72rem] md:px-8">
        <main id="main-content" class="flex-1" tabindex="-1">
          <slot />
        </main>
        <AppFooter />
      </div>
    </div>

    <BackToTop />
  </div>
</template>
