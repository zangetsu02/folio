import type { Locale } from './locales.ts'
import { DEFAULT_LOCALE } from './locales.ts'

/**
 * Campi dei dati tradotti sul posto, invece di duplicare i file per lingua.
 *
 * Nomi, date, stack e URL sono identici in tutte le lingue: duplicare i record
 * li ripeterebbe, e la prima correzione a una data ne lascerebbe indietro una.
 */
export type Localized<T> = Record<Locale, T>

/**
 * Il campo nella lingua richiesta, con la lingua di default come ripiego.
 *
 * Torna `undefined` su un campo assente invece di sollevare: `check:i18n` lo
 * intercetta prima, ma un dato incompleto deve lasciare un buco nella pagina,
 * non buttarla giu' in SSR.
 */
export function pickLocale<T>(field: Localized<T> | undefined, locale: string): T | undefined {
  return field?.[locale as Locale] ?? field?.[DEFAULT_LOCALE]
}
