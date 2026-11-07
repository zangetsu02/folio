import type { Localized } from '~/utils/localized'
import { pickLocale } from '~/utils/localized'

/**
 * I campi tradotti dei dati, gia' legati alla lingua corrente.
 *
 * Senza, ogni componente si procura `locale` solo per riconsegnarlo a una
 * utility a ogni chiamata: la lingua si lega una volta sola, qui.
 */
export function useLocalized() {
  const { locale } = useI18n()
  return {
    localized: <T>(field: Localized<T> | undefined) => pickLocale(field, locale.value),
  }
}
