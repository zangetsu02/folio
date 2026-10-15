// Genera la card social dal sito vero, invece di disegnarla a mano.
//
// La precedente era un PNG statico senza generatore: diceva "Software
// engineer." in una palette blu su nero che il sito ha abbandonato, ed e'
// rimasta indietro senza che niente lo segnalasse. Renderizzando la pagina
// reale la card non puo' divergere dal sito: tipografia, palette e fondo a
// retino sono gli stessi perche' sono letteralmente gli stessi.
//
// Uso: pnpm og   (richiede il dev server, o BASE_URL verso la build)
import process from 'node:process'
import puppeteer from 'puppeteer'

const BASE = process.env.BASE_URL ?? 'http://localhost:3000'
const OUT = process.env.OUT ?? 'public/og/index.png'

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] })
const page = await browser.newPage()
// 1200x630 e' la misura che Open Graph e Twitter ritagliano senza interventi
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 })
await page.evaluateOnNewDocument(() => localStorage.setItem('nuxt-color-mode', 'light'))
await page.goto(`${BASE}/`, { waitUntil: 'networkidle0', timeout: 60000 })

// La card non e' uno screenshot della pagina: e' il nome e la tesi, al centro.
// Resta la testata senza le voci di navigazione, resta la hero, sparisce tutto
// il resto. Il wrapper <Motion> contiene la hero *e* tutte le sezioni, quindi
// va svuotato dall'interno: filtrare i figli della colonna lo risparmierebbe
// con dentro l'intera pagina.
await page.evaluate(() => {
  // I devtools vanno rimossi dal DOM, non nascosti col CSS: stanno in shadow
  // DOM e una regola esterna non li raggiunge.
  for (const el of document.querySelectorAll('*')) {
    if (el.tagName.toLowerCase().includes('devtools'))
      el.remove()
  }
  document.querySelector('#vue-tracer-overlay')?.remove()

  document.querySelector('header nav')?.parentElement?.remove()
  // i pulsanti in un'immagine statica non si cliccano
  document.querySelector('main h1')?.closest('[data-animate]')?.querySelector('a[href]')?.closest('div')?.remove()

  const hero = document.querySelector('main h1')?.closest('[data-animate]')
  const motion = hero?.parentElement
  if (motion) {
    for (const child of [...motion.children]) {
      if (child !== hero)
        child.remove()
    }
  }

  const col = motion?.parentElement
  if (col) {
    for (const child of [...col.children]) {
      if (child !== motion && child.tagName !== 'HEADER')
        child.remove()
    }
    col.style.justifyContent = 'center'
  }

  const main = document.querySelector('main')
  if (main)
    main.style.justifyContent = 'center'
})
// il fondo a retino disegna a ~10fps: gli lascio qualche frame
await new Promise(r => setTimeout(r, 1800))

await page.screenshot({ path: OUT })
console.log(`card scritta in ${OUT}`)
await browser.close()
