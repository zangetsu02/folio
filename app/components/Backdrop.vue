<template>
  <!--
    Fondo fermo. Nessun JavaScript, nessun @keyframes, nessun listener.

    I tentativi di sfondo dinamico sono stati tre e nessuno ha funzionato:
    luci che derivavano da sole + grana con animazione a steps() (flicker su
    tutta la pagina, causa tipica di mal di testa), poi una luce che inseguiva
    il puntatore. Su un sito che si legge, il movimento di fondo e' rumore nella
    visione periferica: toglie attenzione al testo e non aggiunge niente.

    Resta quello che serviva davvero: una variazione di luminosita' che evita il
    fondo piatto, e una grana che da' materia alla superficie.
  -->
  <div class="backdrop" aria-hidden="true">
    <div class="wash" />
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

.wash {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(60vw 48vw at 12% -8%, var(--glow) 0%, transparent 68%),
    radial-gradient(52vw 42vw at 94% 34%, var(--glow) 0%, transparent 70%);
}

.grain {
  position: absolute;
  inset: 0;
  background-image: url("/noise.png");
  opacity: var(--grain-opacity);
}

@media print {
  .backdrop {
    display: none;
  }
}
</style>
