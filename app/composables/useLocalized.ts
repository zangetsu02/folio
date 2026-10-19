import type { Localized } from '~/utils/localized'
import { pickLocale } from '~/utils/localized'
import { categoryLabel } from '~/utils/works'

/**
 * I campi tradotti dei dati, già legati alla lingua corrente.
 *
 * Senza, ogni componente si procura `locale` solo per riconsegnarlo a una
 * utility a ogni chiamata: la lingua si lega una volta sola, qui.
 */
export function useLocalized() {
  const { locale } = useI18n()

  return {
    /** Il campo nella lingua corrente. */
    localized: <T>(field: Localized<T> | undefined) => pickLocale(field, locale.value),
    /** L'etichetta di una categoria di progetto. */
    category: (key: string) => categoryLabel(key, locale.value),
  }
}
