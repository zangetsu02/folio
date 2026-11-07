/**
 * Le categorie dei progetti.
 *
 * `content.config.ts` costruisce da qui l'enum dello schema, cosi' aggiungerne
 * una e' un posto solo. Le etichette stanno nei messaggi (`categories.*`), i
 * titoli delle sezioni su `/works` nel markdown di ogni lingua.
 */
export const WORK_CATEGORY_KEYS = ['libraries', 'tools', 'themes'] as const

export type WorkCategory = typeof WORK_CATEGORY_KEYS[number]
