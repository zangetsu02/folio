import { createReadStream, existsSync, statSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize, resolve } from 'node:path'
import process from 'node:process'
import puppeteer from 'puppeteer'

const ROOT = resolve('./dist/public')
const PAGE_PATH = '/_resume.html'
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
  await page.goto(url, { waitUntil: 'networkidle0' })
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '10mm', right: '8mm', bottom: '10mm', left: '8mm' },
  })
  writeFileSync(OUTPUT, pdfBuffer)
  console.log(`✔ PDF saved to ${OUTPUT}`)
}
finally {
  await browser.close()
  server.close()
}
