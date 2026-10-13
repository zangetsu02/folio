import { createReadStream, existsSync, statSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize, resolve } from 'node:path'
import process from 'node:process'
import puppeteer from 'puppeteer'

const ROOT = resolve('./.output/public')
const PAGE_PATH = '/_resume/index.html'
const OUTPUT = './public/resume.pdf'

if (!existsSync(join(ROOT, PAGE_PATH))) {
  console.error(`✗ ${join(ROOT, PAGE_PATH)} not found. Run "pnpm build" first.`)
  process.exit(1)
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
}

const server = createServer((req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0])
  const safe = normalize(url).replace(/^(\.\.[/\\])+/, '')
  let filePath = join(ROOT, safe)
  if (existsSync(filePath) && statSync(filePath).isDirectory())
    filePath = join(filePath, 'index.html')

  if (!existsSync(filePath)) {
    res.statusCode = 404
    res.end('Not found')
    return
  }
  res.setHeader('Content-Type', MIME[extname(filePath)] || 'application/octet-stream')
  createReadStream(filePath).pipe(res)
})

await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
const { port } = server.address()
const url = `http://127.0.0.1:${port}${PAGE_PATH}`

console.log(`Serving ${ROOT} on ${url}`)
console.log('Generating PDF…')

const browser = await puppeteer.launch({ headless: true })
try {
  const page = await browser.newPage()
  // Esplicito: lo stile del CV vive in @media print (app/assets/css/print.css),
  // condiviso con la stampa da browser. page.pdf() lo farebbe comunque, ma
  // dipendere da un default implicito su cui si regge tutto il layout no.
  await page.emulateMediaType('print')
  await page.goto(url, { waitUntil: 'networkidle0' })
  await page.waitForFunction(
    () => Array.from(document.querySelectorAll('.iconify, [class*="i-lucide"], [class*="i-simple-icons"]'))
      .every(el => el.querySelector('svg') || el.tagName === 'SVG'),
    { timeout: 10000 },
  ).catch(() => {})
  // Nome e numero di pagina in fondo a ogni foglio: un CV stampato su due
  // pagine che si separano, senza questo, ha una seconda pagina anonima.
  const footerTemplate = `
    <div style="
      width: 100%;
      padding: 0 14mm;
      font-family: ui-sans-serif, system-ui, sans-serif;
      font-size: 7pt;
      color: #6b6b66;
      display: flex;
      justify-content: space-between;
    ">
      <span>Christian Palladini · christianpalladini.me</span>
      <span><span class="pageNumber"></span> / <span class="totalPages"></span></span>
    </div>`

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate,
    // I margini li impone qui Puppeteer e non il @page del CSS, perche' servono
    // a riservare lo spazio al footer. Il @page resta per la stampa da browser.
    margin: { top: '18mm', right: '0', bottom: '18mm', left: '0' },
  })
  writeFileSync(OUTPUT, pdfBuffer)
  console.log(`✔ PDF saved to ${OUTPUT}`)
}
finally {
  await browser.close()
  server.close()
}
