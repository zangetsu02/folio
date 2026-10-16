// Parità fra le due lingue. È la difesa contro il modo in cui un sito bilingue
// marcisce: una lingua si aggiorna, l'altra no, e nessuno se ne accorge.
import { readdirSync, readFileSync } from 'node:fs'
import { createReport } from './lib/check.mjs'

const LOCALES = ['it', 'en']
const { note, finish } = createReport()

/** Tutte le chiavi di un oggetto annidato, in notazione puntata. */
function flatten(value, prefix = '') {
  if (value === null || typeof value !== 'object')
    return [prefix]
  return Object.entries(value).flatMap(([k, v]) => flatten(v, prefix ? `${prefix}.${k}` : k))
}

console.log('\n— chiavi dei file di locale —')
const keys = Object.fromEntries(LOCALES.map(locale =>
  [locale, new Set(flatten(JSON.parse(readFileSync(`i18n/locales/${locale}.json`, 'utf8'))))]))

for (const [locale, own] of Object.entries(keys)) {
  for (const other of LOCALES.filter(l => l !== locale)) {
    const missing = [...own].filter(key => !keys[other].has(key))
    note(!missing.length, `presenti in ${locale} ma non in ${other}: ${missing.join(', ') || 'nessuna'}`)
  }
}

console.log('\n— file di contenuto —')
const files = Object.fromEntries(LOCALES.map(locale => [locale, new Set(readdirSync(`content/${locale}`))]))
for (const [locale, own] of Object.entries(files)) {
  for (const other of LOCALES.filter(l => l !== locale)) {
    const missing = [...own].filter(file => !files[other].has(file))
    note(!missing.length, `in content/${locale} ma non in content/${other}: ${missing.join(', ') || 'nessuno'}`)
  }
}

finish()
