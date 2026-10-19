import { pickLocale } from './localized'

/**
 * Le categorie dei progetti.
 *
 * `content.config.ts` costruisce da qui l'enum dello schema, cosi' aggiungerne
 * una e' un posto solo. I titoli delle sezioni su `/works` restano scritti in
 * `content/works.md`: sono contenuto, e non passano da questa mappa.
 */
export const WORK_CATEGORIES = {
  libraries: { it: 'Librerie e SDK', en: 'Libraries & SDKs' },
  tools: { it: 'Strumenti', en: 'Developer tools' },
  themes: { it: 'Temi per editor', en: 'Editor themes' },
} as const

export type WorkCategory = keyof typeof WORK_CATEGORIES

export const WORK_CATEGORY_KEYS = Object.keys(WORK_CATEGORIES) as [WorkCategory, ...WorkCategory[]]

export function categoryLabel(key: string, locale: string): string {
  const label = WORK_CATEGORIES[key as WorkCategory]
  return label ? pickLocale(label, locale) ?? key : key
}
