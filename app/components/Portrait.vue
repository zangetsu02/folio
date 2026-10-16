<script setup lang="ts">
import { dotRadius, forEachScreenDot, readInk, stampDot } from '~/utils/halftone'

const { src, width = 260 } = defineProps<{
  src: string
  width?: number
}>()

const ASPECT = 1.25
const INK = 150
/** Piu' fitto del fondo: a passo 10 una tavola da 240px ha 24 punti, e un viso in 24 punti non si risolve. */
const PITCH = 3.2
const GAMMA = 0.9
const CLIP_LO = 0.05
const CLIP_HI = 0.95

const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
const colorMode = useColorMode()
const height = computed(() => Math.round(width * ASPECT))

let source: HTMLImageElement | null = null

interface Sample { px: number, py: number, luma: number }

/** Luminanza della sorgente sotto ogni punto del reticolo, ritagliata come `object-fit: cover`. */
function sample(image: HTMLImageElement, w: number, h: number): Sample[] {
  const off = document.createElement('canvas')
  off.width = w
  off.height = h
  const ctx = off.getContext('2d', { willReadFrequently: true })
  if (!ctx)
    return []

  const scale = Math.max(w / image.naturalWidth, h / image.naturalHeight)
  const dw = image.naturalWidth * scale
  const dh = image.naturalHeight * scale
  ctx.drawImage(image, (w - dw) / 2, (h - dh) / 2, dw, dh)
  const pixels = ctx.getImageData(0, 0, w, h).data

  const samples: Sample[] = []
  forEachScreenDot(w, h, 0, 0, ({ px, py }) => {
    const x = Math.min(w - 1, Math.max(0, Math.round(px)))
    const y = Math.min(h - 1, Math.max(0, Math.round(py)))
    const i = (y * w + x) * 4
    samples.push({
      px,
      py,
      luma: ((pixels[i]! * 0.299) + (pixels[i + 1]! * 0.587) + (pixels[i + 2]! * 0.114)) / 255,
    })
  }, PITCH)
  return samples
}

function draw() {
  const el = canvas.value
  const ctx = el?.getContext('2d')
  if (!el || !ctx || !source?.complete || !source.naturalWidth)
    return

  const w = Math.max(1, Math.round(el.clientWidth))
  const h = Math.max(1, Math.round(el.clientHeight))
  el.width = w
  el.height = h

  const samples = sample(source, w, h)
  if (!samples.length)
    return

  // Senza auto-livello una sorgente con l'istogramma schiacciato stampa quasi
  // solo punti pieni, e la tavola diventa un rettangolo compatto.
  const sorted = samples.map(s => s.luma).sort((a, b) => a - b)
  const lo = sorted[Math.floor(sorted.length * CLIP_LO)]!
  const hi = sorted[Math.floor(sorted.length * CLIP_HI)]!
  const span = Math.max(0.04, hi - lo)

  const image = ctx.createImageData(w, h)
  const ink = readInk(el)

  // L'inchiostro marca le luci in entrambi i temi: la sorgente e' a campo
  // scuro, e inchiostrare le ombre la rende un blocco pieno su fondo chiaro.
  for (const { px, py, luma } of samples) {
    const density = (Math.min(1, Math.max(0, (luma - lo) / span))) ** GAMMA
    if (density <= 0.02)
      continue
    stampDot(image.data, w, h, px, py, dotRadius(density, PITCH), ink, INK)
  }

  ctx.putImageData(image, 0, 0)
}

onMounted(() => {
  const image = new Image()
  // L'avatar arriva da un altro dominio: senza, il canvas si sporca e getImageData solleva.
  image.crossOrigin = 'anonymous'
  image.decoding = 'async'
  image.addEventListener('load', draw, { once: true })
  image.src = src
  source = image
})

onBeforeUnmount(() => {
  source?.removeEventListener('load', draw)
  source = null
})

watch(colorMode, draw)
useEventListener('resize', useDebounceFn(draw, 150))
</script>

<template>
  <canvas
    ref="canvas"
    aria-hidden="true"
    class="portrait block print:hidden"
    :style="{ width: `${width}px`, height: `${height}px` }"
  />
</template>

<style scoped>
.portrait {
  color: var(--ui-text);
}
</style>
