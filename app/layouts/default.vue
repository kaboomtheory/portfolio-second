<script setup lang="ts">
const route = useRoute()
const isDashboard = computed(() => route.path === '/')
/** Same horizontal padding / max content width as home (navbar + main column). */
const usesHomeContentShell = computed(
  () => isDashboard.value || /^\/projects\//.test(route.path),
)

/** Padding below fixed navbar + CSS vars for `.bento-page` min-height and full-bleed gutters. */
const contentChromeStyle = computed(() => {
  const top = 'calc(var(--navbar-h, 7rem) + 0.5rem)'
  const bottom = usesHomeContentShell.value ? '1rem' : '1.5rem'
  return {
    paddingTop: top,
    '--content-pad-top': top,
    '--content-pad-bottom': bottom,
  } as Record<string, string>
})
</script>

<template>
  <div
    :class="isDashboard ? 'dashboard-root flex h-dvh max-h-dvh min-h-0 flex-col overflow-hidden' : 'min-h-screen'"
  >
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <AppNavbar />

    <div
      :class="isDashboard ? 'flex min-h-0 flex-1 flex-col' : 'h-full'"
      :style="contentChromeStyle"
    >
      <div
        :class="[
          'container mx-auto',
          isDashboard
            ? 'layout-shell--wide flex min-h-0 max-h-full max-w-none flex-1 flex-col overflow-hidden pb-4'
            : usesHomeContentShell
              ? 'layout-shell--wide flex min-h-screen max-w-none flex-col pb-4'
              : 'layout-shell--narrow flex min-h-screen flex-col pb-6 md:max-w-[72rem]',
        ]"
      >
        <main
          id="main-content"
          tabindex="-1"
          :class="isDashboard ? 'flex min-h-0 flex-1 flex-col overflow-hidden' : 'flex-1 min-h-0'"
        >
          <div
            v-if="usesHomeContentShell && !isDashboard"
            class="mx-auto w-full max-w-[108rem]"
          >
            <slot />
          </div>
          <slot v-else />
        </main>
        <AppFooter v-if="!isDashboard" />
      </div>
    </div>

    <BackToTop v-if="!isDashboard" />
  </div>
</template>
