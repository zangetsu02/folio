/**
 * Campi dei dati tradotti sul posto, invece di duplicare i file per lingua.
 *
 * Nomi, date, stack e URL sono identici in tutte le lingue: duplicare i record
 * li ripeterebbe, e la prima correzione a una data ne lascerebbe indietro una.
 */
export interface Localized<T> {
  it: T
  en: T
}

/** L'inglese è il ripiego: è la lingua che chiunque legge. */
export function pickLocale<T>(field: Localized<T> | undefined, locale: string): T | undefined {
  // Senza la guardia un campo assente butta giu' la pagina in SSR, invece di
  // lasciare un buco: check:i18n lo intercetta prima, ma non e' una ragione
  // per far esplodere il sito se gli sfugge.
  if (!field)
    return undefined
  return locale === 'it' ? field.it : field.en
}
