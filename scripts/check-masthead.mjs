// La testata scorre via col contenuto. Verifica che non sia tornata una barra
// fissa, e che niente nel flusso di lettura resti appiccicato sopra il testo.
import { createReport, openPage, settle, withBrowser } from './lib/check.mjs'

/** 320px incluso: e' la larghezza dove il nome andava a capo. */
const VIEWPORTS = [[320, 568], [390, 844], [1280, 768], [1440, 900]]
const MAX_HEIGHT_RATIO = 0.33
const SCROLL_TO = 1200
/** Lenis interpola lo scroll: senza attesa si misura il viaggio, non l'arrivo. */
const SCROLL_SETTLE = 1200

const { note, finish } = createReport()

await withBrowser(async (browser) => {
  for (const [width, height] of VIEWPORTS) {
    const page = await openPage(browser, { width, height })

    const head = await page.evaluate(() => {
      const el = document.querySelector('header')
      return { height: Math.round(el.getBoundingClientRect().height), position: getComputedStyle(el).position }
    })
    note(head.position === 'static', `${width}x${height} — la testata non e' fissa (position: ${head.position})`)
    note(
      head.height <= height * MAX_HEIGHT_RATIO,
      `${width}x${height} — testata alta ${head.height}px (max ${Math.round(height * MAX_HEIGHT_RATIO)}px)`,
    )

    await page.evaluate(y => window.scrollTo(0, y), SCROLL_TO)
    await settle(SCROLL_SETTLE)
    const top = await page.evaluate(() => Math.round(document.querySelector('header').getBoundingClientRect().top))
    note(top < -100, `${width}x${height} — dopo lo scroll la testata e' uscita (top=${top})`)

    // Solo dentro <main>: fuori ci sono i devtools e i toast, fissi legittimamente.
    const pinned = await page.evaluate(() =>
      [...document.querySelectorAll('main, main *')]
        .filter((el) => {
          const { position } = getComputedStyle(el)
          return position === 'fixed' || position === 'sticky'
        })
        .map(el => el.tagName))
    note(!pinned.length, `${width}x${height} — niente di fisso dentro main${pinned.length ? `: ${pinned.join(', ')}` : ''}`)

    const lines = await page.evaluate(() => {
      const link = document.querySelector('header a')
      return Math.round(link.getBoundingClientRect().height / Number.parseFloat(getComputedStyle(link).fontSize))
    })
    note(lines <= 2, `${width}x${height} — il nome sta in ${lines} riga/e`)

    await page.close()
  }
})

finish()
