// Misura della colonna di lettura, altezza delle pagine, rotte assorbite.
import { BASE, createReport, openPage, withBrowser } from './lib/check.mjs'

const PAGES = ['/', '/works', '/resume']
const WIDTHS = [1280, 1440, 1920, 2560]
const MIN_CH = 60
const MAX_CH = 75
const MIN_HEIGHT = 900
/** Rotte confluite nella home: devono reindirizzare, non servire la vecchia pagina. */
const GONE = ['/about', '/contact', '/writing', '/timeline']

const { note, finish } = createReport()

/** Caratteri per riga del paragrafo piu' largo, misurati col font reale. */
function measure(page) {
  return page.evaluate(() => {
    const paragraphs = [...document.querySelectorAll('p, li')]
      // innerText e non textContent: serve il testo come viene reso. textContent
      // conterebbe i figli nascosti e allungherebbe paragrafi quasi vuoti.
      // eslint-disable-next-line unicorn/prefer-dom-node-text-content
      .filter(el => el.innerText.trim().length > 90 && el.offsetParent !== null)
    if (!paragraphs.length)
      return null

    const probe = document.createElement('span')
    probe.style.cssText = 'position:absolute;visibility:hidden;white-space:pre'
    probe.textContent = '0'.repeat(100)
    document.body.appendChild(probe)

    let widest = 0
    for (const p of paragraphs) {
      probe.style.font = getComputedStyle(p).font
      const charWidth = probe.getBoundingClientRect().width / 100
      widest = Math.max(widest, Math.round(p.getBoundingClientRect().width / charWidth))
    }
    probe.remove()
    return widest
  })
}

await withBrowser(async (browser) => {
  console.log('\n— misura della prosa —')
  for (const route of PAGES) {
    for (const width of WIDTHS) {
      const page = await openPage(browser, { route, width })
      const ch = await measure(page)
      if (ch === null)
        note(true, `${route} @${width} — nessuna prosa lunga da misurare`)
      else
        note(ch >= MIN_CH && ch <= MAX_CH, `${route} @${width} — ${ch} caratteri per riga (atteso ${MIN_CH}-${MAX_CH})`)
      await page.close()
    }
  }

  console.log('\n— altezza delle pagine —')
  for (const route of PAGES) {
    const page = await openPage(browser, { route })
    const height = await page.evaluate(() => document.documentElement.scrollHeight)
    note(height > MIN_HEIGHT, `${route} — alta ${height}px (deve superare la viewport di ${MIN_HEIGHT}px)`)
    await page.close()
  }

  console.log('\n— rotte assorbite —')
  for (const route of GONE) {
    const page = await browser.newPage()
    await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 60000 })
    const landed = new URL(page.url()).pathname
    note(landed !== route, `${route} — reindirizza a ${landed}`)
    await page.close()
  }

  console.log('\n— link interni —')
  const page = await openPage(browser)
  const seen = new Set()
  for (const route of PAGES) {
    await page.goto(BASE + route, { waitUntil: 'networkidle0', timeout: 60000 })
    const hrefs = await page.evaluate(() =>
      [...document.querySelectorAll('a[href^="/"]')].map(a => a.getAttribute('href')))
    for (const href of hrefs) seen.add(href.split('#')[0])
  }
  const dangling = [...seen].filter(href => GONE.includes(href))
  for (const href of dangling)
    note(false, `un link interno punta ancora a ${href}`)
  if (!dangling.length)
    note(true, 'nessun link interno verso le rotte assorbite')
  await page.close()
})

finish()
