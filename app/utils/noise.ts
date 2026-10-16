/**
 * Rumore procedurale per il campo del fondo.
 *
 * Value noise e non Perlin o simplex: a questa risoluzione la differenza non si
 * vede, e questo non ha bisogno di tabelle di permutazione da inizializzare.
 */

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** Curva di Hermite: smussa l'interpolazione fra celle, che lineare mostrerebbe la griglia. */
export const smoothstep = (t: number) => t * t * (3 - 2 * t)

/** Hash intero deterministico, 0..1. Niente stato: lo stesso punto da sempre lo stesso valore. */
export function hash2(x: number, y: number) {
  let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ 1831565813
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295
}

export function value2(x: number, y: number) {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const fx = smoothstep(x - xi)
  const fy = smoothstep(y - yi)
  return lerp(
    lerp(hash2(xi, yi), hash2(xi + 1, yi), fx),
    lerp(hash2(xi, yi + 1), hash2(xi + 1, yi + 1), fx),
    fy,
  )
}

/** Interpola fra due fette di rumore 2D: costa meno di un vero 3D e qui non si distingue. */
export function value3(x: number, y: number, z: number) {
  const zi = Math.floor(z)
  return lerp(
    value2(x + zi * 137, y + zi * 197),
    value2(x + (zi + 1) * 137, y + (zi + 1) * 197),
    smoothstep(z - zi),
  )
}

export interface CloudOptions {
  /** Scorrimento del warp, in unita' di rumore al secondo. */
  drift: number
  /** Evoluzione della forma nel tempo. */
  evolve: number
  /** Ampiezza della gamma tonale: piu' stretta, piu' contrasto. */
  contrast: number
}

/**
 * Campo a nuvole, 0..1.
 *
 * Il domain warping serve a togliere la direzione al movimento: il campo si
 * deforma da solo invece di scorrere in blocco, e l'occhio non lo legge come
 * uno slittamento.
 */
export function cloud(x: number, y: number, t: number, { drift, evolve, contrast }: CloudOptions) {
  const d = t * drift
  const wx = value2(x * 0.6 + 17 + d * 0.3, y * 0.6 - 4) - 0.5
  const wy = value2(x * 0.6 - 9, y * 0.6 + 21 - d * 0.25) - 0.5
  const sx = x + wx * 1.6 + d
  const sy = y + wy * 1.6 - d * 0.4
  const z = t * evolve

  const octaves
    = value3(sx, sy, z) * 0.65
      + value3(sx * 2.03 + 8, sy * 2.03 - 3, z * 1.37) * 0.25
      + value3(sx * 4.01 - 7, sy * 4.01 + 11, z * 1.81) * 0.1

  return smoothstep(Math.min(1, Math.max(0, (octaves - 0.34) / contrast)))
}
