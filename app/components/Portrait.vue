<script setup lang="ts">
/*
 * Il ritratto, stampato con la stessa lastra del fondo.
 *
 * L'immagine e' gia' inchiostro ad alto contrasto, quindi un retino la
 * riproduce bene: la luminanza di ogni punto decide il diametro, e il resto
 * -- passo, inclinazione, forma del punto -- viene da utils/halftone, lo
 * stesso modulo del fondo. Due retini sulla stessa pagina con angoli diversi
 * si vedrebbero subito.
 *
 * Il retino risolve anche il problema che aveva la foto nella vecchia barra:
 * a 40px diventava un quadrato scuro impastato. Un retino e' una texture, non
 * un'immagine, e regge qualunque dimensione perche' il punto non rimpicciolisce
 * con lei -- a parita' di passo, piu' piccola e' la fascia, meno punti ci stanno.
 *
 * Disegna una volta sola: al montaggio, al cambio tema e al resize. Il fondo
 * ridisegna dieci volte al secondo perche' deve muoversi; qui non serve, e un
 * secondo canvas animato raddoppierebbe un costo gia' misurato come non banale.
 */
import { dotRadius, forEachScreenDot, readInk, stampDot } from '~/utils/halftone'

const { src, width = 260 } = defineProps<{
  src: string
  /** Larghezza della tavola in px CSS. L'altezza segue il 4:5. */
  width?: number
}>()

const INK = 150 // su 255: molto piu' del fondo (24), qui l'immagine deve leggersi
// Retino piu' fitto di quello del fondo: a passo 10 una tavola da 240px aveva
// 24 punti di larghezza, e un viso in 24 punti non si risolve. A 3.2 ne ha ~75.
const PITCH = 3.2
const GAMMA = 0.9

const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
const colorMode = useColorMode()
let source: HTMLImageElement | null = null

function draw() {
  const el = canvas.value
  if (!el || !source?.complete || !source.naturalWidth)
    return

  const w = Math.max(1, Math.round(el.clientWidth))
  const h = Math.max(1, Math.round(el.clientHeight))
  if (el.width !== w || el.height !== h) {
    el.width = w
    el.height = h
  }

  const ctx = el.getContext('2d')
  if (!ctx)
    return

  // Campiono l'immagine su un canvas fuori schermo delle stesse dimensioni,
  // ritagliata come `object-fit: cover`: il punto del retino legge la luminanza
  // alla propria posizione, quindi non serve scalare l'immagine, solo leggerla.
  const probe = document.createElement('canvas')
  probe.width = w
  probe.height = h
  const pctx = probe.getContext('2d', { willReadFrequently: true })
  if (!pctx)
    return
  const scale = Math.max(w / source.naturalWidth, h / source.naturalHeight)
  const dw = source.naturalWidth * scale
  const dh = source.naturalHeight * scale
  pctx.drawImage(source, (w - dw) / 2, (h - dh) / 2, dw, dh)
  const pixels = pctx.getImageData(0, 0, w, h).data

  // Primo passaggio: raccolgo la luminanza di ogni punto.
  const dots: { px: number, py: number, luma: number }[] = []
  forEachScreenDot(w, h, 0, 0, ({ px, py }) => {
    const sx = Math.min(w - 1, Math.max(0, Math.round(px)))
    const sy = Math.min(h - 1, Math.max(0, Math.round(py)))
    const i = (sy * w + sx) * 4
    dots.push({
      px,
      py,
      luma: ((pixels[i]! * 0.299) + (pixels[i + 1]! * 0.587) + (pixels[i + 2]! * 0.114)) / 255,
    })
  }, PITCH)
  if (!dots.length)
    return

  // Auto-livello sul 5-95 percentile. Senza, un'immagine con l'istogramma
  // schiacciato -- come questa, quasi tutta nera -- stampa quasi solo punti
  // pieni e la tavola diventa un rettangolo compatto invece di un ritratto.
  const ordinate = dots.map(d => d.luma).sort((a, b) => a - b)
  const lo = ordinate[Math.floor(ordinate.length * 0.05)]!
  const hi = ordinate[Math.floor(ordinate.length * 0.95)]!
  const span = Math.max(0.04, hi - lo)

  const img = ctx.createImageData(w, h)
  const data = img.data
  const ink = readInk(el)

  // L'inchiostro marca le LUCI, in tutti e due i temi. La lettura fedele --
  // punto grande dove l'immagine e' scura -- su questa sorgente non funziona:
  // e' un'immagine a campo scuro, l'istogramma e' tutto in basso, e in chiaro
  // la tavola diventava un blocco pieno al 78%. Marcare le luci la rende un
  // disegno a tratti in entrambi i temi, e la struttura letta e' la stessa.
  for (const { px, py, luma } of dots) {
    const livellata = Math.min(1, Math.max(0, (luma - lo) / span))
    const d = livellata ** GAMMA
    if (d <= 0.02)
      continue
    stampDot(data, w, h, px, py, dotRadius(d, PITCH), ink, INK)
  }

  ctx.putImageData(img, 0, 0)
}

onMounted(() => {
  const image = new Image()
  image.crossOrigin = 'anonymous' // l'avatar arriva da un altro dominio: senza, il canvas si sporca e getImageData esplode
  image.decoding = 'async'
  image.addEventListener('load', draw)
  image.src = src
  source = image
})

watch(() => colorMode.value, () => draw())
useEventListener('resize', useDebounceFn(draw, 150))
</script>

<template>
  <!-- 4:5, la proporzione che aveva la foto nel vecchio binario. Un ritratto
       quadrato dentro una fascia larga diventa una striscia di capelli: provato,
       e la composizione spariva. -->
  <canvas
    ref="canvas"
    aria-hidden="true"
    class="portrait block print:hidden"
    :style="{ width: `${width}px`, height: `${Math.round(width * 1.25)}px` }"
  />
</template>

<style scoped>
.portrait {
  color: var(--ui-text);
}
</style>
