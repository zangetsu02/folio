<script setup lang="ts">
import { dotRadius, forEachScreenDot, readInk, SCREEN, stampDot } from '~/utils/halftone'
import { cloud, hash2, lerp } from '~/utils/noise'

/** Passo della griglia di campionamento del campo, in px CSS. */
const CELL = 24
/** Deriva della lastra, px/s sui suoi assi: senza, i punti non si spostano mai e il fondo sembra fermo. */
const DRIFT_U = 5.5
const DRIFT_V = 3.2
/** Su 255. Sotto al testo deve restare un fondo, non un disegno. */
const INK = 24
/** Livello medio a cui riportare il campo: le nuvole respirano, e senza questo la copertura triplica. */
const TARGET = 0.11
const NORM_MIN = 0.25
const NORM_MAX = 1.9
/** Oltre, il ciclo per-pixel non sta nel frame. */
const MAX_PIXELS = 1.8e6
/** Sopra i ~20fps il retino sfarfalla nella visione periferica. */
const FRAME_MS = 100
const NOISE_SCALE = 0.0038
const FIELD = { drift: 0.032, evolve: 0.035, contrast: 0.72 }

const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
const colorMode = useColorMode()
const visibility = useDocumentVisibility()
const motion = usePreferredReducedMotion()

let ctx: CanvasRenderingContext2D | null = null
let buffer: ImageData | null = null
let ink: readonly [number, number, number] = [235, 235, 235]
let timer: ReturnType<typeof setTimeout> | undefined
let elapsed = 0
let last = 0

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
    buffer = ctx.createImageData(cw, ch)
  }
  if (!buffer)
    return

  const cols = Math.ceil(w / CELL) + 2
  const rows = Math.ceil(h / CELL) + 2
  const field = new Float32Array(cols * rows)
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++)
      field[r * cols + c] = cloud(c * CELL * NOISE_SCALE, r * CELL * NOISE_SCALE, t, FIELD)
  }

  let mean = 0
  for (let k = 0; k < field.length; k++) mean += field[k]!
  mean /= field.length
  // Entro limiti, perche' la normalizzazione non inventi contrasto dal nulla.
  const norm = mean > 1e-4 ? Math.min(NORM_MAX, Math.max(NORM_MIN, TARGET / mean)) : 1

  const { data } = buffer
  data.fill(0)

  forEachScreenDot(cw, ch, (t * DRIFT_U) % SCREEN, (t * DRIFT_V) % SCREEN, ({ px, py, u, v }) => {
    const gx = px / scale / CELL
    const gy = py / scale / CELL
    const rx = Math.floor(gx)
    const ry = Math.floor(gy)
    const i = ry * cols + rx
    if (i < 0 || i + cols + 1 >= field.length)
      return

    // Il dither rompe le fasce dove il campo cambia piano.
    const density = lerp(
      lerp(field[i]!, field[i + 1]!, gx - rx),
      lerp(field[i + cols]!, field[i + cols + 1]!, gx - rx),
      gy - ry,
    ) * norm * (0.88 + hash2(Math.round(u), Math.round(v)) * 0.12)
    if (density <= 0.004)
      return

    stampDot(data, cw, ch, px, py, dotRadius(density), ink, INK)
  })

  ctx.putImageData(buffer, 0, 0)
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

watch(colorMode, () => {
  refreshInk()
  start()
})
watch([visibility, motion], start)

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
  /* Il canvas e' sottocampionato: senza, il browser lo sfoca e il retino sparisce. */
  image-rendering: pixelated;
}

@media print {
  .backdrop {
    display: none;
  }
}
</style>
