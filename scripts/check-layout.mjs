// Controlli di impaginazione, eseguiti contro il dev server.
// Non e' un test unitario: misura il sito renderizzato, che e' l'unico
// posto dove "quanti caratteri per riga" esiste davvero.
import puppeteer from 'puppeteer'

const BASE = process.env.BASE_URL ?? 'http://localhost:3000'
const PAGES = ['/', '/works', '/resume']
const WIDTHS = [1280, 1440, 1920, 2560]
const MIN_CH = 60
const MAX_CH = 75
const GONE = ['/about', '/contact', '/writing', '/timeline']

const failures = []
const note = (ok, msg) => {
  console.log(`${ok ? '  ok  ' : ' FAIL '} ${msg}`)
  if (!ok)
    failures.push(msg)
}

// Misura i caratteri per riga di un paragrafo di prosa vero.
// Usa un probe con lo stesso font: dividere i px per una larghezza media
// inventata darebbe un numero che non corrisponde a niente.
async function measure(page) {
  return page.evaluate(() => {
    const ps = [...document.querySelectorAll('p, li')]
      .filter(e => e.innerText.trim().length > 90 && e.offsetParent !== null)
    if (!ps.length)
      return null
    const probe = document.createElement('span')
    probe.style.cssText = 'position:absolute;visibility:hidden;white-space:pre'
    probe.textContent = '0'.repeat(100)
    document.body.appendChild(probe)
    let worst = 0
    for (const p of ps) {
      probe.style.font = getComputedStyle(p).font
      const chW = probe.getBoundingClientRect().width / 100
      const ch = Math.round(p.getBoundingClientRect().width / chW)
      if (ch > worst)
        worst = ch
    }
    probe.remove()
    return worst
  })
}

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] })

console.log('\n— misura della prosa —')
for (const route of PAGES) {
  for (const width of WIDTHS) {
    const page = await browser.newPage()
    await page.setViewport({ width, height: 900 })
    await page.goto(BASE + route, { waitUntil: 'networkidle0', timeout: 60000 })
    const ch = await measure(page)
    if (ch === null) {
      note(true, `${route} @${width} — nessuna prosa lunga da misurare`)
    }
    else {
      note(ch >= MIN_CH && ch <= MAX_CH, `${route} @${width} — ${ch} caratteri per riga (atteso ${MIN_CH}-${MAX_CH})`)
    }
    await page.close()
  }
}

console.log('\n— altezza delle pagine —')
for (const route of PAGES) {
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  await page.goto(BASE + route, { waitUntil: 'networkidle0', timeout: 60000 })
  const h = await page.evaluate(() => document.documentElement.scrollHeight)
  note(h > 900, `${route} — alta ${h}px (deve superare la viewport di 900px)`)
  await page.close()
}

console.log('\n— rotte eliminate —')
for (const route of GONE) {
  const page = await browser.newPage()
  await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 60000 })
  const landed = new URL(page.url()).pathname
  note(landed !== route, `${route} — reindirizza a ${landed} invece di servire la vecchia pagina`)
  await page.close()
}

console.log('\n— link interni rotti —')
{
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  const seen = new Set()
  for (const route of PAGES) {
    await page.goto(BASE + route, { waitUntil: 'networkidle0', timeout: 60000 })
    const hrefs = await page.evaluate(() =>
      [...document.querySelectorAll('a[href^="/"]')].map(a => a.getAttribute('href')))
    for (const h of hrefs) seen.add(h.split('#')[0])
  }
  for (const href of [...seen].filter(h => GONE.includes(h)))
    note(false, `un link interno punta ancora a ${href}`)
  if (![...seen].some(h => GONE.includes(h)))
    note(true, 'nessun link interno verso le rotte eliminate')
  await page.close()
}

await browser.close()

console.log(`\n${failures.length ? `${failures.length} controlli falliti` : 'tutti i controlli passati'}\n`)
process.exit(failures.length ? 1 : 0)
