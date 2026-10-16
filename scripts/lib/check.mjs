// Impalcatura comune ai controlli: misurano il sito renderizzato, che e' l'unico
// posto dove "quanti caratteri per riga" o "cosa si vede in stampa" esistono.
import process from 'node:process'
import puppeteer from 'puppeteer'

export const BASE = process.env.BASE_URL ?? 'http://localhost:3000'

export function createReport() {
  const failures = []
  return {
    note(ok, message) {
      console.log(`${ok ? '  ok  ' : ' FAIL '} ${message}`)
      if (!ok)
        failures.push(message)
    },
    /** Esce 1 se qualcosa e' fallito, cosi' il controllo si incatena con &&. */
    finish() {
      console.log(`\n${failures.length ? `${failures.length} controlli falliti` : 'tutti i controlli passati'}\n`)
      process.exit(failures.length ? 1 : 0)
    },
  }
}

/** Apre un browser, lo passa a `fn` e lo chiude comunque vada. */
export async function withBrowser(fn) {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] })
  try {
    await fn(browser)
  }
  finally {
    await browser.close()
  }
}

export async function openPage(browser, { route = '/', width = 1440, height = 900, theme, scale = 1 } = {}) {
  const page = await browser.newPage()
  await page.setViewport({ width, height, deviceScaleFactor: scale })
  if (theme)
    await page.evaluateOnNewDocument(t => localStorage.setItem('nuxt-color-mode', t), theme)
  await page.goto(BASE + route, { waitUntil: 'networkidle0', timeout: 60000 })
  return page
}

export const settle = (ms = 1200) => new Promise(resolve => setTimeout(resolve, ms))
