// La categoria viene mostrata in due posti — le sezioni di /works e la lista
// Side Projects del CV — quindi l'etichetta vive qui e non duplicata nei due
// componenti.
export const WORK_CATEGORIES: Record<string, string> = {
  libraries: 'Libraries & SDKs',
  tools: 'Developer tools',
  themes: 'Editor themes',
}

export function categoryLabel(key: string): string {
  return WORK_CATEGORIES[key] ?? key
}
