// La testa e' il primo elemento sticky del sito e Lenis fa smooth scroll:
// se litigano, la testa si stacca o resta indietro durante lo scroll.
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

for (const [w, h] of [[390, 844], [1280, 768], [1440, 900]]) {
  const page = await browser.newPage()
  await page.setViewport({ width: w, height: h })
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle0', timeout: 60000 })

  const head = await page.evaluate(() => {
    const el = document.querySelector('header')
    const r = el.getBoundingClientRect()
    return { altezza: Math.round(r.height), top: Math.round(r.top) }
  })
  // oltre il 12% della viewport la testa smette di essere una fascia
  note(head.altezza <= h * 0.12, `${w}x${h} — testa alta ${head.altezza}px (max ${Math.round(h * 0.12)}px)`)

  await page.evaluate(() => window.scrollTo(0, 1200))
  await new Promise(r => setTimeout(r, 1200)) // Lenis arriva a destinazione con calma
  const dopo = await page.evaluate(() => Math.round(document.querySelector('header').getBoundingClientRect().top))
  note(Math.abs(dopo) <= 2, `${w}x${h} — dopo lo scroll la testa e' a top=${dopo} (attesa 0, sticky regge con Lenis)`)

  await page.close()
}

await browser.close()
console.log(`\n${failures.length ? `${failures.length} controlli falliti` : 'tutti i controlli passati'}\n`)
process.exit(failures.length ? 1 : 0)
