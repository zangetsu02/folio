/**
 * Le lingue del sito, dichiarate una volta sola.
 *
 * Prima vivevano in otto file — la config, il picker, il catch-all, la testata,
 * due script — e una terza lingua avrebbe voluto che si trovassero tutti.
 * Qui le importa anche `nuxt.config.ts`, che costruisce da queste il suo
 * blocco `i18n`.
 */
export const LOCALES = ['it', 'en'] as const

export type Locale = typeof LOCALES[number]

/** La lingua servita senza prefisso. */
export const DEFAULT_LOCALE: Locale = 'it'

/**
 * Un path nella lingua data: `/works` in italiano, `/en/works` in inglese.
 *
 * Serve a config e script, che girano fuori dall'app. Nei componenti si usa
 * `useLocalePath()` del modulo.
 */
export function localizePath(path: string, locale: string) {
  const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`
  return (prefix + path).replace(/(.)\/$/, '$1')
}

/** Il PDF del CV di una lingua: l'italiano tiene `/resume.pdf`, URL gia' in giro. */
export function resumePdf(locale: string) {
  return locale === DEFAULT_LOCALE ? '/resume.pdf' : `/resume-${locale}.pdf`
}
