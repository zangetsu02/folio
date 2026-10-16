/**
 * Le categorie dei progetti.
 *
 * `content.config.ts` costruisce da qui l'enum dello schema, cosi' aggiungerne
 * una e' un posto solo. I titoli delle sezioni su `/works` restano scritti in
 * `content/works.md`: sono contenuto, e non passano da questa mappa.
 */
export const WORK_CATEGORIES = {
  libraries: 'Libraries & SDKs',
  tools: 'Developer tools',
  themes: 'Editor themes',
} as const

export type WorkCategory = keyof typeof WORK_CATEGORIES

export const WORK_CATEGORY_KEYS = Object.keys(WORK_CATEGORIES) as [WorkCategory, ...WorkCategory[]]

export function categoryLabel(key: string): string {
  return WORK_CATEGORIES[key as WorkCategory] ?? key
}
