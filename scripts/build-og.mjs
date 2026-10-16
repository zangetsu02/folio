// Genera la card social dal sito vero: tipografia, palette e fondo non possono
// divergere perche' sono gli stessi. La precedente era un PNG disegnato a mano,
// ed e' rimasta indietro di un ruolo e di una palette senza che nulla lo dicesse.
//
// Uso: pnpm og  (richiede il dev server, o BASE_URL verso una build)
import process from 'node:process'
import { openPage, settle, withBrowser } from './lib/check.mjs'

/** Misura che Open Graph e Twitter ritagliano senza intervenire. */
const WIDTH = 1200
const HEIGHT = 630
const OUT = process.env.OUT ?? 'public/og/index.png'

/** Lascia la testata senza navigazione e la hero, toglie tutto il resto. */
function trimToHero() {
  // I devtools vanno rimossi dal DOM: stanno in shadow DOM e il CSS non li raggiunge.
  for (const el of document.querySelectorAll('*')) {
    if (el.tagName.toLowerCase().includes('devtools'))
      el.remove()
  }
  document.querySelector('#vue-tracer-overlay')?.remove()
  document.querySelector('header nav')?.parentElement?.remove()

  const hero = document.querySelector('main h1')?.closest('[data-animate]')
  if (!hero)
    return
  // I pulsanti non si cliccano in un'immagine statica.
  hero.querySelector('a[href]')?.closest('div')?.remove()

  // Il wrapper <Motion> contiene la hero e tutte le sezioni: va svuotato
  // dall'interno, perche' filtrare i figli della colonna lo risparmierebbe intero.
  const motion = hero.parentElement
  for (const child of [...motion?.children ?? []]) {
    if (child !== hero)
      child.remove()
  }

  const column = motion?.parentElement
  for (const child of [...column?.children ?? []]) {
    if (child !== motion && child.tagName !== 'HEADER')
      child.remove()
  }
  if (column)
    column.style.justifyContent = 'center'

  const main = document.querySelector('main')
  if (main)
    main.style.justifyContent = 'center'
}

await withBrowser(async (browser) => {
  const page = await openPage(browser, { width: WIDTH, height: HEIGHT, scale: 2, theme: 'light' })
  await page.evaluate(trimToHero)
  await settle(1800) // il fondo disegna a ~10fps
  await page.screenshot({ path: OUT })
  console.log(`card scritta in ${OUT}`)
})
