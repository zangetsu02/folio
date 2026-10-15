// Screenshot delle pagine vive, nei due temi e alle larghezze che contano.
// Vanno guardati, non solo contati: la misura giusta non garantisce che la
// pagina stia in piedi.
import process from 'node:process'
import puppeteer from 'puppeteer'

const BASE = process.env.BASE_URL ?? 'http://localhost:3000'
const OUT = process.env.OUT ?? '/tmp'

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] })
for (const theme of ['dark', 'light']) {
  for (const [w, h] of [[1440, 900], [1920, 1080], [390, 844]]) {
    for (const route of ['/', '/works', '/resume']) {
      const page = await browser.newPage()
      await page.setViewport({ width: w, height: h })
      await page.evaluateOnNewDocument(t => localStorage.setItem('nuxt-color-mode', t), theme)
      await page.goto(BASE + route, { waitUntil: 'networkidle0', timeout: 60000 })
      await new Promise(r => setTimeout(r, 1500))
      const name = `${theme}-${w}x${h}-${route.replace(/\//g, '_') || '_home'}.png`
      await page.screenshot({ path: `${OUT}/${name}`, fullPage: true })
      console.log(name)
      await page.close()
    }
  }
}
await browser.close()
