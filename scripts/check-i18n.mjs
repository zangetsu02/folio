// Parità fra le due lingue. È la difesa contro il modo in cui un sito bilingue
// marcisce: una lingua si aggiorna, l'altra no, e nessuno se ne accorge.
import assert from 'node:assert/strict'
import { globSync, readdirSync, readFileSync } from 'node:fs'
import { pickLocale } from '../app/utils/localized.ts'
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

// @nuxt/content non fa fallire la build su uno schema violato: verificato,
// salva il record incompleto in silenzio. Il controllo deve stare qui.
console.log('\n— campi tradotti nei dati —')
function incomplete(value, path = '') {
  if (value === null || typeof value !== 'object')
    return []
  if (!Array.isArray(value)) {
    const keys = Object.keys(value)
    const touched = LOCALES.filter(l => keys.includes(l))
    if (touched.length && touched.length !== LOCALES.length)
      return [`${path}: ha ${touched.join(', ')} ma non ${LOCALES.filter(l => !touched.includes(l)).join(', ')}`]
  }
  return Object.entries(value).flatMap(([k, v]) => incomplete(v, path ? `${path}.${k}` : k))
}

for (const file of globSync('content/**/*.json')) {
  const broken = incomplete(JSON.parse(readFileSync(file, 'utf8')))
  for (const problem of broken)
    note(false, `${file} → ${problem}`)
  if (!broken.length)
    note(true, `${file}`)
}

console.log('\n— pickLocale —')
try {
  assert.equal(pickLocale({ it: 'ciao', en: 'hello' }, 'it'), 'ciao')
  assert.equal(pickLocale({ it: 'ciao', en: 'hello' }, 'en'), 'hello')
  // Ripiego sull'inglese e non sull'italiano: e' la lingua che chiunque legge.
  assert.equal(pickLocale({ it: 'ciao', en: 'hello' }, 'fr'), 'hello')
  assert.deepEqual(pickLocale({ it: ['a'], en: ['b'] }, 'it'), ['a'])
  note(true, 'quattro asserzioni passate')
}
catch (error) {
  note(false, `asserzione fallita: ${error.message}`)
}

finish()
