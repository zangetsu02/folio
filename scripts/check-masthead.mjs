// La testata non e' una barra: sta in cima alla pagina e deve scorrere via
// col contenuto. Prima era sticky e questo controllo verificava che restasse
// incollata; il requisito e' cambiato, quindi verifica l'opposto -- e che
// nient'altro sia rimasto fisso sopra il testo.
import process from 'node:process'
import puppeteer from 'puppeteer'

const BASE = process.env.BASE_URL ?? 'http://localhost:3000'
const failures = []
function note(ok, msg) {
  console.log(`${ok ? '  ok  ' : ' FAIL '} ${msg}`)
  if (!ok)
    failures.push(msg)
}

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] })

// 320px incluso: a quella larghezza il nome andava a capo e il sottotitolo
// veniva troncato, e il controllo precedente partiva da 390 senza vederlo.
for (const [w, h] of [[320, 568], [390, 844], [1280, 768], [1440, 900]]) {
  const page = await browser.newPage()
  await page.setViewport({ width: w, height: h })
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle0', timeout: 60000 })

  const head = await page.evaluate(() => {
    const el = document.querySelector('header')
    const r = el.getBoundingClientRect()
    return { altezza: Math.round(r.height), position: getComputedStyle(el).position }
  })

  note(head.position === 'static', `${w}x${h} — la testata non e' fissa (position: ${head.position})`)
  // non e' piu' una fascia, puo' respirare: il vincolo e' che non si mangi
  // la prima schermata prima che il titolo compaia
  note(head.altezza <= h * 0.33, `${w}x${h} — testata alta ${head.altezza}px (max ${Math.round(h * 0.33)}px)`)

  await page.evaluate(() => window.scrollTo(0, 1200))
  await new Promise(r => setTimeout(r, 1200)) // Lenis arriva a destinazione con calma
  const dopo = await page.evaluate(() => Math.round(document.querySelector('header').getBoundingClientRect().top))
  note(dopo < -100, `${w}x${h} — dopo lo scroll la testata e' uscita (top=${dopo})`)

  // Niente dentro <main> deve restare fisso sopra il testo. Cerco li' dentro
  // e non in tutto il body di proposito: fuori ci sono i devtools di Nuxt e il
  // contenitore dei toast, che sono fissi legittimamente e in produzione non
  // ci sono nemmeno. Il fondo a retino e' fuori da main per la stessa ragione.
  const fissi = await page.evaluate(() =>
    [...document.querySelectorAll('main, main *')]
      .filter((el) => {
        const pos = getComputedStyle(el).position
        return pos === 'fixed' || pos === 'sticky'
      })
      .map(el => el.tagName + (el.className ? `.${String(el.className).split(' ')[0]}` : '')))
  note(fissi.length === 0, `${w}x${h} — niente di fisso dentro main${fissi.length ? `: ${fissi.join(', ')}` : ''}`)

  // il nome non deve andare a capo
  const righe = await page.evaluate(() => {
    const a = document.querySelector('header a')
    return Math.round(a.getBoundingClientRect().height / Number.parseFloat(getComputedStyle(a).fontSize))
  })
  note(righe <= 2, `${w}x${h} — il nome sta in ${righe} riga/e`)

  await page.close()
}

await browser.close()
console.log(`\n${failures.length ? `${failures.length} controlli falliti` : 'tutti i controlli passati'}\n`)
process.exit(failures.length ? 1 : 0)
