/**
 * Il retino tipografico del sito: inchiostro di densita' costante e punto che
 * cambia dimensione, su reticolo inclinato.
 *
 * Vive qui perche' lo usano sia il fondo che il ritratto, e due retini sulla
 * stessa pagina con inclinazioni diverse si noterebbero subito.
 */

/** Passo del reticolo, in px di canvas. Il ritratto ne passa uno piu' fitto. */
export const SCREEN = 10

/** Inclinazione della lastra: allineata agli assi entrerebbe in moire' coi pixel. */
const ANGLE = 22 * (Math.PI / 180)

/** Diametro del punto pieno, in multipli del passo. Poco oltre 1 perche' i pieni chiudano. */
const DOT_MAX = 1.1

/** Usato finche' il canvas non ha un `color` calcolato. */
export const FALLBACK_INK: readonly [number, number, number] = [235, 235, 235]

export interface ScreenDot {
  px: number
  py: number
  /** Coordinate nel riferimento della lastra, per un dither stabile per punto. */
  u: number
  v: number
}

/**
 * Scorre il reticolo che copre un canvas `cw x ch`.
 *
 * `offU` e `offV` spostano la lastra; prenderli modulo `pitch` non si vede,
 * perche' uno spostamento di un passo esatto rimappa ogni punto su quello del vicino.
 */
export function forEachScreenDot(
  cw: number,
  ch: number,
  offU: number,
  offV: number,
  fn: (dot: ScreenDot) => void,
  pitch: number = SCREEN,
) {
  const ca = Math.cos(ANGLE)
  const sa = Math.sin(ANGLE)
  const mx = cw / 2
  const my = ch / 2

  // Gli estremi del ciclo sono i quattro angoli del canvas visti dal reticolo.
  let u0 = Infinity
  let u1 = -Infinity
  let v0 = Infinity
  let v1 = -Infinity
  for (const [qx, qy] of [[0, 0], [cw, 0], [0, ch], [cw, ch]] as const) {
    const dx = qx - mx
    const dy = qy - my
    u0 = Math.min(u0, dx * ca + dy * sa)
    u1 = Math.max(u1, dx * ca + dy * sa)
    v0 = Math.min(v0, -dx * sa + dy * ca)
    v1 = Math.max(v1, -dx * sa + dy * ca)
  }

  for (let v = Math.floor(v0 / pitch - 1) * pitch; v <= v1; v += pitch) {
    for (let u = Math.floor(u0 / pitch - 1) * pitch; u <= u1; u += pitch) {
      const uu = u + offU
      const vv = v + offV
      const px = mx + uu * ca - vv * sa
      const py = my + uu * sa + vv * ca
      if (px < -pitch || py < -pitch || px > cw + pitch || py > ch + pitch)
        continue
      fn({ px, py, u, v })
    }
  }
}

/** Area proporzionale alla densita', non raggio: e' cio' che rende lineare il grigio. */
export function dotRadius(density: number, pitch: number = SCREEN) {
  return Math.sqrt(Math.min(1, Math.max(0, density))) * pitch * 0.5 * DOT_MAX
}

/**
 * Stampa un punto tondo antialiasato dentro una ImageData.
 *
 * Fonde in max e non in somma: i punti vicini si toccano, e sommare lascerebbe
 * cuciture piu' scure dove si sovrappongono.
 */
export function stampDot(
  data: Uint8ClampedArray,
  cw: number,
  ch: number,
  px: number,
  py: number,
  rad: number,
  ink: readonly [number, number, number],
  maxAlpha: number,
) {
  if (rad < 0.35)
    return

  const x0 = Math.max(0, Math.floor(px - rad - 1))
  const x1 = Math.min(cw - 1, Math.ceil(px + rad + 1))
  const y0 = Math.max(0, Math.floor(py - rad - 1))
  const y1 = Math.min(ch - 1, Math.ceil(py + rad + 1))

  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const coverage = rad + 0.5 - Math.hypot(x + 0.5 - px, y + 0.5 - py)
      if (coverage <= 0)
        continue
      const alpha = Math.round(maxAlpha * Math.min(1, coverage))
      const i = (y * cw + x) * 4
      if (alpha <= data[i + 3]!)
        continue
      data[i] = ink[0]
      data[i + 1] = ink[1]
      data[i + 2] = ink[2]
      data[i + 3] = alpha
    }
  }
}

/** L'inchiostro di un elemento, letto dal suo `color`: segue il tema senza saperne nulla. */
export function readInk(el: HTMLElement): readonly [number, number, number] {
  const parsed = getComputedStyle(el).color.match(/\d+/g)
  if (parsed && parsed.length >= 3)
    return [Number(parsed[0]), Number(parsed[1]), Number(parsed[2])]
  return FALLBACK_INK
}
