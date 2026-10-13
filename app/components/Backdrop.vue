<script setup lang="ts">
// Sfondo ambientale: tre luci molto larghe e molto tenui che derivano su
// percorsi indipendenti, piu' una grana sottile che da' materia alla
// superficie. Sostituisce la griglia statica e lo Spotlight, che aveva una
// classe `animate-spotlight` non definita in questo progetto e opacity-0.
// Tutto in CSS: nessun requestAnimationFrame, nessun lavoro sul thread principale.
</script>

<template>
  <div class="backdrop" aria-hidden="true">
    <div class="glow glow-a" />
    <div class="glow glow-b" />
    <div class="glow glow-c" />
    <div class="grain" />
  </div>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.glow {
  position: absolute;
  border-radius: 50%;
  /* Niente filter: blur — a questa dimensione costa caro. La morbidezza
     viene dalle fermate del gradiente, che la GPU compone gratis. */
  background: radial-gradient(circle closest-side, var(--glow) 0%, transparent 72%);
  will-change: transform;
}

.glow-a {
  width: 78vw;
  height: 78vw;
  top: -30vw;
  left: -16vw;
  animation: drift-a 58s ease-in-out infinite alternate;
}

.glow-b {
  width: 62vw;
  height: 62vw;
  top: 24vh;
  right: -24vw;
  animation: drift-b 74s ease-in-out infinite alternate;
}

.glow-c {
  width: 54vw;
  height: 54vw;
  bottom: -26vw;
  left: 28vw;
  animation: drift-c 92s ease-in-out infinite alternate;
}

/* Spostamenti ampi e lentissimi: deve leggersi come atmosfera, non come
   un'animazione che chiede attenzione mentre si legge. */
@keyframes drift-a {
  from { transform: translate3d(0, 0, 0) scale(1); }
  to   { transform: translate3d(14vw, 9vh, 0) scale(1.14); }
}

@keyframes drift-b {
  from { transform: translate3d(0, 0, 0) scale(1.08); }
  to   { transform: translate3d(-12vw, -14vh, 0) scale(0.92); }
}

@keyframes drift-c {
  from { transform: translate3d(0, 0, 0) scale(0.95); }
  to   { transform: translate3d(-9vw, -11vh, 0) scale(1.2); }
}

.grain {
  position: absolute;
  /* deborda, cosi' lo spostamento della grana non scopre mai i bordi */
  inset: -120px;
  background-image: url("/noise.png");
  opacity: var(--grain-opacity);
  animation: grain-shift 1.8s steps(8) infinite;
}

@keyframes grain-shift {
  0%, 100% { transform: translate(0, 0); }
  20%      { transform: translate(-3%, -4%); }
  40%      { transform: translate(4%, 3%); }
  60%      { transform: translate(-5%, 2%); }
  80%      { transform: translate(3%, -3%); }
}

@media (prefers-reduced-motion: reduce) {
  .glow,
  .grain {
    animation: none;
  }
}

@media print {
  .backdrop {
    display: none;
  }
}
</style>
