// Parità fra le due lingue. È la difesa contro il modo in cui un sito bilingue
// marcisce: una lingua si aggiorna, l'altra no, e nessuno se ne accorge.
import assert from 'node:assert/strict'
import { globSync, readdirSync, readFileSync } from 'node:fs'
import { LOCALES } from '../app/utils/locales.ts'
import { pickLocale } from '../app/utils/localized.ts'
import { createReport } from './lib/check.mjs'

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
    if (touched.length === LOCALES.length) {
      // Una traduzione vuota, o di tipo diverso dall'altra, passava la forma.
      const empty = LOCALES.filter(l => value[l] === '' || (Array.isArray(value[l]) && !value[l].length))
      if (empty.length)
        return [`${path}: ${empty.join(', ')} vuoto`]
      const types = LOCALES.map(l => (Array.isArray(value[l]) ? 'array' : typeof value[l]))
      if (new Set(types).size > 1)
        return [`${path}: tipi diversi fra le lingue (${types.join(' / ')})`]
    }
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

// Lo schema zod di @nuxt/content non e' un cancello: verificato, un title
// mancante passa la build e la pagina esce con <title> che apre con una pipe.
// Un campo cancellato del tutto non ha forma da controllare: lo si vede solo
// confrontando i record fratelli, che e' anche il caso reale (si modifica un
// file solo). Se sparisse da tutti sarebbe una rimozione voluta.
console.log('\n— campi tradotti coerenti fra record fratelli —')
function localizedPaths(value, path = '') {
  if (value === null || typeof value !== 'object')
    return []
  if (!Array.isArray(value) && LOCALES.every(l => l in value))
    return [path]
  return Object.entries(value).flatMap(([k, v]) => localizedPaths(v, path ? `${path}.${k}` : k))
}

const byDir = {}
for (const file of globSync('content/**/*.json'))
  (byDir[file.slice(0, file.lastIndexOf('/'))] ??= []).push(file)

for (const [dir, files] of Object.entries(byDir)) {
  if (files.length < 2)
    continue
  const paths = files.map(f => new Set(localizedPaths(JSON.parse(readFileSync(f, 'utf8')))))
  const all = new Set(paths.flatMap(p => [...p]))
  for (const [i, own] of paths.entries()) {
    const missing = [...all].filter(p => !own.has(p))
    note(!missing.length, `${files[i]} — campi tradotti che i fratelli hanno: ${missing.join(', ') || 'nessuno'}`)
  }
  void dir
}

console.log('\n— frontmatter delle pagine —')
for (const locale of LOCALES) {
  for (const file of readdirSync(`content/${locale}`)) {
    const head = readFileSync(`content/${locale}/${file}`, 'utf8').split('---')[1] ?? ''
    const missing = ['title', 'description'].filter(k => !new RegExp(`^${k}:\\s*\\S`, 'm').test(head))
    note(!missing.length, `content/${locale}/${file} — manca: ${missing.join(', ') || 'niente'}`)
  }
}

console.log('\n— pickLocale —')
try {
  assert.equal(pickLocale({ it: 'ciao', en: 'hello' }, 'it'), 'ciao')
  assert.equal(pickLocale({ it: 'ciao', en: 'hello' }, 'en'), 'hello')
  // Ripiego sulla lingua di default, come fa il modulo i18n con le sue chiavi.
  assert.equal(pickLocale({ it: 'ciao', en: 'hello' }, 'fr'), 'ciao')
  assert.deepEqual(pickLocale({ it: ['a'], en: ['b'] }, 'it'), ['a'])
  note(true, 'quattro asserzioni passate')
}
catch (error) {
  note(false, `asserzione fallita: ${error.message}`)
}

finish()
