/*
 * La lastra tipografica del sito, condivisa da chi la usa.
 *
 * Serve a due cose diverse: il fondo a nuvole (`Backdrop.vue`), che la fa
 * derivare nel tempo, e il ritratto in cima alla home (`Portrait.vue`), che la
 * usa ferma sulla luminanza di un'immagine. Il motore sta qui perche' se le due
 * avessero inclinazioni o passi diversi si vedrebbe al primo sguardo: sono due
 * retini sulla stessa pagina.
 *
 * Inchiostro di densita' costante e punto che cambia dimensione, su reticolo
 * inclinato: e' un retino vero, non un dot-matrix da schermo con l'alpha che
 * varia. Il raggio va con la radice della densita' perche' e' l'area a dover
 * essere proporzionale, ed e' cio' che rende lineare il grigio all'occhio.
 */

// Passo del retino, in px di canvas. Il fondo usa questo; un'immagine ne vuole
// uno piu' fitto, come in stampa una foto si retina piu' fine di un fondino:
// il numero di punti e' il limite di risoluzione, e un viso in 24 punti di
// larghezza non esiste.
export const SCREEN = 10
export const ANGLE = 22 * (Math.PI / 180) // inclinazione della lastra
export const DOT_MAX = 1.1 // diametro del punto pieno, in multipli del passo

/**
 * Un punto del reticolo: posizione in px di canvas, piu' le sue coordinate
 * `u`/`v` nel riferimento della lastra -- servono a chi vuole un dither
 * stabile per punto, che deve dipendere dal punto e non da dove cade.
 */
export interface ScreenDot {
  px: number
  py: number
  u: number
  v: number
}

/**
 * Scorre il reticolo ruotato che copre un canvas `cw x ch`, chiamando `fn` su
 * ogni punto. `offU` e `offV` spostano la lastra: sono modulo `SCREEN`, e il
 * wrap non si vede perche' spostare di un passo esatto rimappa ogni punto sulla
 * posizione del vicino.
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

  // Scorro nel riferimento del reticolo e torno indietro. Gli estremi sono i
  // quattro angoli del canvas visti da li'.
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

/** Il raggio del punto per una densita' 0..1. Area proporzionale, non raggio. */
export function dotRadius(density: number, pitch: number = SCREEN) {
  return Math.sqrt(Math.min(1, Math.max(0, density))) * pitch * 0.5 * DOT_MAX
}

/**
 * Stampa un punto tondo dentro una ImageData, fondendo in max e non in somma:
 * i punti vicini si toccano, e sommare farebbe cuciture piu' scure sui bordi.
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
  for (let yy = y0; yy <= y1; yy++) {
    for (let xx = x0; xx <= x1; xx++) {
      const cov = rad + 0.5 - Math.hypot(xx + 0.5 - px, yy + 0.5 - py)
      if (cov <= 0)
        continue
      const alpha = Math.round(maxAlpha * Math.min(1, cov))
      const p = (yy * cw + xx) * 4
      if (alpha <= data[p + 3]!)
        continue
      data[p] = ink[0]
      data[p + 1] = ink[1]
      data[p + 2] = ink[2]
      data[p + 3] = alpha
    }
  }
}

/** L'inchiostro corrente di un elemento, letto dal suo `color`. */
export function readInk(el: HTMLElement): [number, number, number] {
  const parsed = getComputedStyle(el).color.match(/\d+/g)
  if (parsed && parsed.length >= 3)
    return [Number(parsed[0]), Number(parsed[1]), Number(parsed[2])]
  return [235, 235, 235]
}
