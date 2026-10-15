// Controlli di stampa. Esistono per un difetto vero: `print.css` nascondeva il
// numerale con `.cv h2 span.absolute`, un selettore legato alla posizione e
// alle utility di Tailwind. Spostando il numerale fuori dall'h2 la regola ha
// smesso di combaciare in silenzio, e il PDF del CV si e' riempito di
// decorazione da schermo -- con una sezione spinta alla pagina dopo.
// Nessun controllo se ne era accorto perche' nessuno guardava la stampa.
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
const page = await browser.newPage()
await page.setViewport({ width: 1200, height: 1600 })
await page.goto(`${BASE}/resume`, { waitUntil: 'networkidle0', timeout: 60000 })
await page.emulateMediaType('print')
await new Promise(r => setTimeout(r, 600))

const stato = await page.evaluate(() => {
  // checkVisibility e non getComputedStyle().display: su un figlio, `display`
  // riporta il valore proprio anche quando e' un antenato a essere nascosto,
  // e il controllo segnalava come visibili elementi larghi zero pixel.
  const visibile = el => el.checkVisibility()
  return {
    numerali: [...document.querySelectorAll('.cv span[aria-hidden]')]
      .filter(visibile)
      .map(e => e.textContent.trim())
      .filter(Boolean),
    svg: [...document.querySelectorAll('.cv svg')].filter(visibile).length,
    testata: !!document.querySelector('header') && visibile(document.querySelector('header')),
    piede: !!document.querySelector('footer') && visibile(document.querySelector('footer')),
    fondo: !!document.querySelector('canvas.backdrop') && visibile(document.querySelector('canvas.backdrop')),
    titoli: [...document.querySelectorAll('.cv h2')].map(h => ({
      testo: h.textContent.trim(),
      bordo: getComputedStyle(h).borderBottomWidth,
    })),
  }
})

note(stato.numerali.length === 0, `numerali di sezione in stampa: ${stato.numerali.length ? stato.numerali.join(', ') : 'nessuno'}`)
note(stato.svg === 0, `decorazioni svg in stampa: ${stato.svg}`)
note(!stato.testata, `testata in stampa: ${stato.testata ? 'VISIBILE' : 'nascosta'}`)
note(!stato.piede, `piede in stampa: ${stato.piede ? 'VISIBILE' : 'nascosto'}`)
note(!stato.fondo, `fondo a retino in stampa: ${stato.fondo ? 'VISIBILE' : 'nascosto'}`)
// il filo sotto il titolo e' cio' che marca la sezione quando la decorazione sparisce
const senzaBordo = stato.titoli.filter(t => t.bordo === '0px').map(t => t.testo)
note(senzaBordo.length === 0, `titoli senza filo di sezione: ${senzaBordo.length ? senzaBordo.join(', ') : 'nessuno'}`)

await browser.close()
console.log(`\n${failures.length ? `${failures.length} controlli falliti` : 'tutti i controlli passati'}\n`)
process.exit(failures.length ? 1 : 0)
