<template>
  <footer class="footer">
    <div class="footer-rule" aria-hidden="true" />
    <div class="footer-bottom mx-auto max-w-[82rem] px-[clamp(1.25rem,3vw,2.5rem)]">
      <span class="footer-brand">&copy; 2026 Bryan X. Mendez</span>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: clamp(2.5rem, 5vw, 4rem);
}

.footer-rule {
  height: 1px;
  width: 100%;
  background: var(--rule);
  margin-bottom: clamp(0.9rem, 2vw, 1.4rem);
}

.footer-bottom {
  display: flex;
  justify-content: center;
  padding: var(--space-md) 0;
  font-size: var(--label-size);
  letter-spacing: 0.02em;
  color: var(--fg-muted);
  margin-top: clamp(1.1rem, 2.2vw, 1.75rem);
}

.footer-brand {
  font-weight: 500;
  color: color-mix(in srgb, var(--fg-primary) 72%, var(--fg-muted));
}
</style>
