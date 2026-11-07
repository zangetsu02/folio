// Il CV stampato. Esiste perche' print.css nascondeva la decorazione con un
// selettore legato alla posizione nel markup: spostarla l'ha fatto smettere di
// combaciare in silenzio, e nessun controllo guardava la stampa.
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { LOCALES, resumePdf } from '../app/utils/locales.ts'
import { createReport, openPage, settle, withBrowser } from './lib/check.mjs'

/** Un CV di due pagine viene letto, uno di tre spesso no. */
const MAX_PAGES = 2
const PDFS = LOCALES.map(locale => `public${resumePdf(locale)}`)

const { note, finish } = createReport()

await withBrowser(async (browser) => {
  const page = await openPage(browser, { route: '/resume', width: 1200, height: 1600 })
  await page.emulateMediaType('print')
  await settle(600)

  const state = await page.evaluate(() => {
    // checkVisibility e non `display`: su un figlio, `display` riporta il valore
    // proprio anche quando e' un antenato a essere nascosto.
    const visible = el => !!el && el.checkVisibility()
    return {
      numerals: [...document.querySelectorAll('.cv span[aria-hidden]')]
        .filter(visible)
        .map(el => el.textContent.trim())
        .filter(Boolean),
      svg: [...document.querySelectorAll('.cv svg')].filter(visible).length,
      masthead: visible(document.querySelector('header')),
      footer: visible(document.querySelector('footer')),
      backdrop: visible(document.querySelector('canvas.backdrop')),
      unruled: [...document.querySelectorAll('.cv h2')]
        .filter(h => getComputedStyle(h).borderBottomWidth === '0px')
        .map(h => h.textContent.trim()),
    }
  })

  note(!state.numerals.length, `numerali di sezione: ${state.numerals.join(', ') || 'nessuno'}`)
  note(!state.svg, `decorazioni svg: ${state.svg}`)
  note(!state.masthead, `testata: ${state.masthead ? 'VISIBILE' : 'nascosta'}`)
  note(!state.footer, `piede: ${state.footer ? 'VISIBILE' : 'nascosto'}`)
  note(!state.backdrop, `fondo a retino: ${state.backdrop ? 'VISIBILE' : 'nascosto'}`)
  // Tolta la decorazione, e' il filo sotto il titolo a marcare la sezione.
  note(!state.unruled.length, `titoli senza filo di sezione: ${state.unruled.join(', ') || 'nessuno'}`)

  await page.close()
})

console.log('\n— pagine dei PDF —')
for (const file of PDFS) {
  if (!existsSync(file)) {
    note(false, `${file} non esiste: lancia pnpm pdf`)
    continue
  }
  // Il separatore di pagina di pdftotext e' il form feed.
  const pages = execFileSync('pdftotext', ['-layout', file, '-'], { encoding: 'utf8' })
    .split('\f')
    .length - 1
  note(pages <= MAX_PAGES, `${file} — ${pages} pagine (max ${MAX_PAGES})`)
}

finish()
