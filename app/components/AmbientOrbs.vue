<template>
  <div class="ambient-orbs" aria-hidden="true">
    <div class="ambient-orbs__blob ambient-orbs__blob--a" />
    <div class="ambient-orbs__blob ambient-orbs__blob--b" />
    <div class="ambient-orbs__blob ambient-orbs__blob--c" />
  </div>
</template>

<style scoped>
.ambient-orbs {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.ambient-orbs__blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(64px);
  will-change: transform;
  opacity: 0.55;
  mix-blend-mode: soft-light;
}

html.dark .ambient-orbs__blob {
  opacity: 0.45;
  mix-blend-mode: screen;
}

.ambient-orbs__blob--a {
  width: min(156vmin, 1260px);
  height: min(156vmin, 1260px);
  top: -12%;
  left: -8%;
  background: radial-gradient(
    circle closest-side,
    var(--orb-a-mid) 0%,
    var(--orb-a-edge) 55%,
    transparent 72%
  );
  animation: ambient-orbs-drift-a 22s ease-in-out infinite;
}

.ambient-orbs__blob--b {
  width: min(174vmin, 1440px);
  height: min(174vmin, 1440px);
  top: 38%;
  right: -18%;
  background: radial-gradient(
    circle closest-side,
    var(--orb-b-mid) 0%,
    var(--orb-b-edge) 50%,
    transparent 70%
  );
  animation: ambient-orbs-drift-b 28s ease-in-out infinite;
}

.ambient-orbs__blob--c {
  width: min(132vmin, 1080px);
  height: min(132vmin, 1080px);
  bottom: -10%;
  left: 22%;
  background: radial-gradient(
    circle closest-side,
    var(--orb-c-mid) 0%,
    var(--orb-c-edge) 52%,
    transparent 68%
  );
  animation: ambient-orbs-drift-c 19s ease-in-out infinite;
}

@keyframes ambient-orbs-drift-a {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  40% {
    transform: translate(18vw, 12vh) scale(1.08);
  }
  70% {
    transform: translate(8vw, -8vh) scale(0.94);
  }
}

@keyframes ambient-orbs-drift-b {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  35% {
    transform: translate(-16vw, -14vh) scale(1.12);
  }
  65% {
    transform: translate(-6vw, 10vh) scale(0.9);
  }
}

@keyframes ambient-orbs-drift-c {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  45% {
    transform: translate(-14vw, -18vh) scale(1.06);
  }
  80% {
    transform: translate(12vw, -6vh) scale(0.92);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ambient-orbs__blob {
    animation: none !important;
  }
}
</style>

<style>
:root {
  --orb-a-mid: rgba(255, 255, 255, 0.95);
  --orb-a-edge: rgba(122, 200, 255, 0.55);
  --orb-b-mid: rgba(200, 235, 255, 0.85);
  --orb-b-edge: rgba(90, 160, 230, 0.5);
  --orb-c-mid: rgba(255, 255, 255, 0.75);
  --orb-c-edge: rgba(140, 190, 255, 0.45);
}

html.dark {
  --orb-a-mid: rgba(200, 235, 255, 0.55);
  --orb-a-edge: rgba(61, 125, 186, 0.4);
  --orb-b-mid: rgba(160, 210, 255, 0.45);
  --orb-b-edge: rgba(90, 148, 200, 0.35);
  --orb-c-mid: rgba(230, 248, 255, 0.4);
  --orb-c-edge: rgba(74, 136, 184, 0.32);
}
</style>
