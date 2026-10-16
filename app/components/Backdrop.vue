<script setup lang="ts">
/*
 * Nuvole stampate a retino.
 *
 * Il campo e' rumore "value noise" a tre ottave con domain warping: si deforma
 * da solo invece di scorrere in blocco, cosi' il movimento non ha una direzione
 * leggibile.
 *
 * A stamparlo e' un retino tipografico, non uno schermo: inchiostro di densita'
 * costante e punto che cambia dimensione, su un reticolo ruotato di 22 gradi
 * come le lastre vere per non entrare in moire' coi pixel. L'alternativa --
 * punti tutti uguali con l'alpha che varia -- e' quello che fa un CRT, e su un
 * sito di carta e grazie non c'entra niente.
 *
 * Perche' il fondo dinamico non e' rumore visivo come i tentativi precedenti:
 * inchiostro a 24/255, e dieci fotogrammi al secondo. Sopra i ~20fps il retino
 * sfarfalla nella visione periferica, che era esattamente il problema di prima.
 */

import { dotRadius, forEachScreenDot, readInk, SCREEN, stampDot } from '~/utils/halftone'

// Il motore del reticolo sta in utils/halftone:
// li condivide con Portrait.vue, e due retini sulla stessa pagina con passi o
// inclinazioni diverse si vedrebbero al primo sguardo.
const CELL = 24 // passo della griglia di rumore, in px CSS
const SCREEN_VU = 5.5 // deriva della lastra, px/s lungo il suo asse u
const SCREEN_VV = 3.2 // idem lungo v: insieme fanno ~6.4 px/s in diagonale
const INK = 24 // su 255: sotto il testo deve restare un fondo, non un disegno
const CONTRAST = 0.72 // ampiezza della gamma tonale del campo
const TARGET = 0.11 // livello medio a cui riportare il campo, vedi `norm`
const MAX_PIXELS = 1.8e6 // oltre, il ciclo per-pixel non sta nei 100ms
const FRAME_MS = 100
const DRIFT = 0.032 // scorrimento del warp
const EVOLVE = 0.035 // evoluzione della nuvola nel tempo
const NOISE_SCALE = 0.0038

const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
const colorMode = useColorMode()
const visibility = useDocumentVisibility()
const motion = usePreferredReducedMotion()

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const smooth = (t: number) => t * t * (3 - 2 * t)

function hash(x: number, y: number) {
  let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ 1831565813
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295
}

function value2(x: number, y: number) {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const fx = smooth(x - xi)
  const fy = smooth(y - yi)
  return lerp(
    lerp(hash(xi, yi), hash(xi + 1, yi), fx),
    lerp(hash(xi, yi + 1), hash(xi + 1, yi + 1), fx),
    fy,
  )
}

// Terza dimensione per interpolazione fra "fette" di rumore 2D: costa meno di
// un vero simplex 3D e a questa risoluzione non si distingue.
function value3(x: number, y: number, z: number) {
  const zi = Math.floor(z)
  return lerp(
    value2(x + zi * 137, y + zi * 197),
    value2(x + (zi + 1) * 137, y + (zi + 1) * 197),
    smooth(z - zi),
  )
}

function cloud(x: number, y: number, t: number) {
  const drift = t * DRIFT
  const wx = value2(x * 0.6 + 17 + drift * 0.3, y * 0.6 - 4) - 0.5
  const wy = value2(x * 0.6 - 9, y * 0.6 + 21 - drift * 0.25) - 0.5
  const sx = x + wx * 1.6 + drift
  const sy = y + wy * 1.6 - drift * 0.4
  const z = t * EVOLVE
  const v
    = value3(sx, sy, z) * 0.65
      + value3(sx * 2.03 + 8, sy * 2.03 - 3, z * 1.37) * 0.25
      + value3(sx * 4.01 - 7, sy * 4.01 + 11, z * 1.81) * 0.1
  return smooth(Math.min(1, Math.max(0, (v - 0.34) / CONTRAST)))
}

let ctx: CanvasRenderingContext2D | null = null
let img: ImageData | null = null
let ink: [number, number, number] = [235, 235, 235]
let timer: ReturnType<typeof setTimeout> | undefined
let elapsed = 0
let last = 0

// L'inchiostro segue il tema: il canvas eredita `color` dalle variabili di Nuxt UI.
function refreshInk() {
  if (canvas.value)
    ink = readInk(canvas.value)
}

function draw(t: number) {
  const el = canvas.value
  if (!el || !ctx)
    return

  const w = window.innerWidth
  const h = window.innerHeight
  if (!w || !h)
    return

  const scale = Math.min(1, Math.sqrt(MAX_PIXELS / (w * h)))
  const cw = Math.max(1, Math.floor(w * scale))
  const ch = Math.max(1, Math.floor(h * scale))
  if (el.width !== cw || el.height !== ch) {
    el.width = cw
    el.height = ch
    img = ctx.createImageData(cw, ch)
  }
  if (!img)
    return

  const cols = Math.ceil(w / CELL) + 2
  const rows = Math.ceil(h / CELL) + 2
  const grid = new Float32Array(cols * rows)
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++)
      grid[r * cols + c] = cloud(c * CELL * NOISE_SCALE, r * CELL * NOISE_SCALE, t)
  }

  // Le nuvole respirano molto: senza questo la copertura triplica attorno al
  // minuto e il fondo si fa visibilmente piu' scuro. Riporto la media del campo
  // a un livello fisso, entro limiti perche' non inventi contrasto dal nulla.
  let mean = 0
  for (let k = 0; k < grid.length; k++) mean += grid[k]!
  mean /= grid.length
  const norm = mean > 1e-4 ? Math.min(1.9, Math.max(0.25, TARGET / mean)) : 1

  const data = img.data
  data.fill(0)

  // La lastra deriva. Serve perche' con un reticolo fermo i punti non si
  // spostano mai: cambia solo il loro diametro, e la variazione finisce tutta
  // sull'anello antialiasato del bordo. L'occhio la integra come grana, non
  // come movimento, e il fondo sembra fermo anche mentre cambia.
  // Il modulo non si vede: spostare di un passo esatto rimappa ogni punto sulla
  // posizione del vicino, quindi l'immagine al wrap e' identica.
  forEachScreenDot(cw, ch, (t * SCREEN_VU) % SCREEN, (t * SCREEN_VV) % SCREEN, ({ px, py, u, v }) => {
    const gx = px / scale / CELL
    const gy = py / scale / CELL
    const rx = Math.floor(gx)
    const ry = Math.floor(gy)
    const i = ry * cols + rx
    if (i < 0 || i + cols + 1 >= grid.length)
      return

    // Dither per punto: rompe le fasce dove il campo cambia piano.
    const d = lerp(
      lerp(grid[i]!, grid[i + 1]!, gx - rx),
      lerp(grid[i + cols]!, grid[i + cols + 1]!, gx - rx),
      gy - ry,
    ) * norm * (0.88 + hash(Math.round(u), Math.round(v)) * 0.12)
    if (d <= 0.004)
      return

    stampDot(data, cw, ch, px, py, dotRadius(d), ink, INK)
  })

  ctx.putImageData(img, 0, 0)
}

const paused = () => motion.value === 'reduce' || visibility.value === 'hidden'

function tick() {
  const now = performance.now()
  elapsed += Math.min(0.25, (now - last) / 1000)
  last = now
  draw(elapsed)
  timer = paused() ? undefined : setTimeout(tick, FRAME_MS)
}

function start() {
  clearTimeout(timer)
  last = performance.now()
  tick()
}

onMounted(() => {
  ctx = canvas.value?.getContext('2d') ?? null
  if (!ctx)
    return
  refreshInk()
  start()
})

onBeforeUnmount(() => clearTimeout(timer))

// Un frame subito al cambio tema o al ritorno sulla scheda, poi riparte il ciclo.
watch(() => colorMode.value, () => {
  refreshInk()
  start()
})
watch([visibility, motion], () => start())

useEventListener('resize', useDebounceFn(() => draw(elapsed), 100))
</script>

<template>
  <canvas
    ref="canvas"
    aria-hidden="true"
    class="backdrop"
  />
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  color: var(--ui-text);
  /* Il canvas e' sottocampionato: senza questo il browser lo sfoca e il retino sparisce. */
  image-rendering: pixelated;
}

@media print {
  .backdrop {
    display: none;
  }
}
</style>
