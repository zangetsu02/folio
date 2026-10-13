<script setup lang="ts">
// Sfondo reattivo invece che animato.
//
// La versione precedente derivava da sola e aveva una grana con animazione a
// `steps()`: un'animazione a scatti e' flicker, su tutta la pagina, sotto al
// testo che stai leggendo — la causa tipica di affaticamento e mal di testa.
//
// Qui non c'e' nessuna animazione autonoma. La luce segue il puntatore con un
// ritardo morbido: se non muovi il mouse, non si muove niente. Il movimento e'
// atteso perche' sei tu a produrlo, e si ferma da solo.

const root = useTemplateRef<HTMLElement>('root')

let frame = 0
let tx = 0.5
let ty = 0.35
let cx = 0.5
let cy = 0.35

function tick() {
  // interpolazione: la luce insegue, non incolla
  cx += (tx - cx) * 0.045
  cy += (ty - cy) * 0.045

  root.value?.style.setProperty('--mx', `${(cx - 0.5) * 100}%`)
  root.value?.style.setProperty('--my', `${(cy - 0.5) * 100}%`)

  // il loop si spegne quando e' arrivata: nessun rAF perenne
  if (Math.abs(tx - cx) > 0.0004 || Math.abs(ty - cy) > 0.0004)
    frame = requestAnimationFrame(tick)
  else
    frame = 0
}

function onPointerMove(event: PointerEvent) {
  tx = event.clientX / window.innerWidth
  ty = event.clientY / window.innerHeight
  if (!frame)
    frame = requestAnimationFrame(tick)
}

onMounted(() => {
  // Solo chi ha chiesto meno movimento resta fuori. Niente guardia su
  // `pointer: fine`: alcuni browser la riportano sbagliata e l'effetto non
  // partirebbe mai, in silenzio. Su touch il pointermove arriva solo durante
  // un trascinamento, quindi il comportamento e' gia' quello giusto.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    return

  window.addEventListener('pointermove', onPointerMove, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onPointerMove)
  if (frame)
    cancelAnimationFrame(frame)
})
</script>

<template>
  <div ref="root" class="backdrop" aria-hidden="true">
    <div class="glow glow-follow" />
    <div class="glow glow-anchor" />
    <div class="grain" />
  </div>
</template>

<style scoped>
.backdrop {
  --mx: 0%;
  --my: 0%;

  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.glow {
  position: absolute;
  border-radius: 50%;
  /* Niente filter: blur — a questa dimensione costa caro. La morbidezza viene
     dalle fermate del gradiente, che la GPU compone gratis. */
  background: radial-gradient(circle closest-side, var(--glow) 0%, transparent 70%);
}

/* Quella che segue il puntatore. */
.glow-follow {
  width: 86vw;
  height: 86vw;
  left: 50%;
  top: 50%;
  margin-left: -43vw;
  margin-top: -43vw;
  transform: translate3d(var(--mx), var(--my), 0);
  will-change: transform;
}

/* Una seconda luce ferma, ancorata alla pagina: da' profondita' senza muoversi,
   ed e' l'unica cosa che si vede su touch, dove non c'e' un puntatore. */
.glow-anchor {
  width: 58vw;
  height: 58vw;
  top: -22vw;
  left: -14vw;
  opacity: 0.8;
}

/* Grana ferma. Stessa materia di prima, zero sfarfallio. */
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
