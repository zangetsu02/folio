# Impaginazione a documento — piano di implementazione

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Portare il portfolio da sei pagine semivuote a larghezza piena a tre pagine piene impaginate come un documento, con una colonna di lettura a misura leggibile e le date allineate al CV.

**Architecture:** Il vincolo è una sola utility CSS (`measure`, 68ch) applicata al wrapper del contenuto, più una utility di sforo (`bleed`, 88ch) per i soli blocchi tabellari. Il binario laterale diventa una testa orizzontale sticky. Le pagine `/about`, `/contact`, `/writing` e `/timeline` confluiscono nella home o spariscono, con redirect 301 per chi ha i vecchi link.

**Tech Stack:** Nuxt 4.6, @nuxt/content 3, @nuxt/ui 4, Tailwind 4 (`@utility`), Puppeteer (già dipendenza, usato per le misure).

**Spec:** `docs/superpowers/specs/2026-10-15-impaginazione-documento-design.md`

## Global Constraints

- Misura della prosa: **68ch**. Nessun paragrafo la supera a nessuna larghezza.
- Sforo consentito solo a blocchi tabellari: **88ch**, via utility `bleed`.
- Caratteri per riga misurati: **fra 60 e 75** da 1280px in su.
- Palette, radius 0, Instrument Serif + Geist, `Sigil.vue`, `ThornRule.vue`, `Backdrop.vue`: **non si toccano**.
- Il percorso usa **solo** i progetti già sul portfolio. Gli incarichi presenti solo nel CV (FonCoop, Softhings, Sifer-Canoni, SSC) restano fuori.
- La dicitura del ruolo è decisa: titolo fermo `Full Stack Developer` (come il CV), `tech lead` solo attaccato alle commesse Sifer e Sintesi. La applica **Task 8**; i task da 1 a 7 non la toccano.
- `pnpm lint` deve restare senza errori. I 2 warning noti in `app/components/toc/` sono preesistenti e accettati.

## Review Focus

Cose che la spec implica ma che nessun task esercita da sé. Ogni riga ha il suo test assegnato a un task.

1. **Il PDF del CV si rompe.** `app/assets/css/print.css` imposta l'impaginazione A4 a partire dal layout che stiamo cambiando; `pnpm pdf` renderizza `/_resume` con Puppeteer. Test in Task 7.
2. **I vecchi link vanno in 404.** `/about`, `/contact`, `/writing`, `/timeline` possono essere già in firme email, su LinkedIn o indicizzati. Senza redirect diventano errori. Test in Task 6.
3. **Il sitemap pubblica rotte morte.** `@nuxtjs/seo` genera il sitemap dalle rotte note; quelle eliminate vanno sparite anche da lì. Test in Task 6.
4. **La testa sticky mangia la viewport su schermi bassi.** Su 390×844 e su laptop a 768px di altezza una testa troppo alta lascia poca pagina. Test in Task 3.
5. **Lenis litiga con `position: sticky`.** `app/plugins/lenis.client.ts` fa smooth scroll; una testa sticky introdotta ora è il primo elemento sticky del sito. Test in Task 3.

---

### Task 1: Lo strumento di misura

Senza questo il resto del piano non ha modo di fallire. Il controllo della misura va scritto **prima**, e deve fallire sullo stato attuale.

**Files:**
- Create: `scripts/check-layout.mjs`
- Modify: `package.json` (script `check:layout`)

**Interfaces:**
- Produces: `node scripts/check-layout.mjs` esce `0` se tutti i controlli passano, `1` altrimenti. Richiede il dev server su `http://localhost:3000`. I task successivi lo usano come ciclo di test.

- [ ] **Step 1: Scrivere lo strumento**

Create `scripts/check-layout.mjs`:

```js
// Controlli di impaginazione, eseguiti contro il dev server.
// Non e' un test unitario: misura il sito renderizzato, che e' l'unico
// posto dove "quanti caratteri per riga" esiste davvero.
import puppeteer from 'puppeteer'

const BASE = process.env.BASE_URL ?? 'http://localhost:3000'
const PAGES = ['/', '/works', '/resume']
const WIDTHS = [1280, 1440, 1920, 2560]
const MIN_CH = 60
const MAX_CH = 75
const GONE = ['/about', '/contact', '/writing', '/timeline']

const failures = []
const note = (ok, msg) => {
  console.log(`${ok ? '  ok  ' : ' FAIL '} ${msg}`)
  if (!ok) failures.push(msg)
}

// Misura i caratteri per riga di un paragrafo di prosa vero.
// Usa un probe con lo stesso font: dividere i px per una larghezza media
// inventata darebbe un numero che non corrisponde a niente.
async function measure(page) {
  return page.evaluate(() => {
    const ps = [...document.querySelectorAll('p, li')]
      .filter(e => e.innerText.trim().length > 90 && e.offsetParent !== null)
    if (!ps.length) return null
    const probe = document.createElement('span')
    probe.style.cssText = 'position:absolute;visibility:hidden;white-space:pre'
    probe.textContent = '0'.repeat(100)
    document.body.appendChild(probe)
    let worst = 0
    for (const p of ps) {
      probe.style.font = getComputedStyle(p).font
      const chW = probe.getBoundingClientRect().width / 100
      const ch = Math.round(p.getBoundingClientRect().width / chW)
      if (ch > worst) worst = ch
    }
    probe.remove()
    return worst
  })
}

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] })

console.log('\n— misura della prosa —')
for (const route of PAGES) {
  for (const width of WIDTHS) {
    const page = await browser.newPage()
    await page.setViewport({ width, height: 900 })
    await page.goto(BASE + route, { waitUntil: 'networkidle0', timeout: 60000 })
    const ch = await measure(page)
    if (ch === null) {
      note(true, `${route} @${width} — nessuna prosa lunga da misurare`)
    }
    else {
      note(ch >= MIN_CH && ch <= MAX_CH, `${route} @${width} — ${ch} caratteri per riga (atteso ${MIN_CH}-${MAX_CH})`)
    }
    await page.close()
  }
}

console.log('\n— altezza delle pagine —')
for (const route of PAGES) {
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  await page.goto(BASE + route, { waitUntil: 'networkidle0', timeout: 60000 })
  const h = await page.evaluate(() => document.documentElement.scrollHeight)
  note(h > 900, `${route} — alta ${h}px (deve superare la viewport di 900px)`)
  await page.close()
}

console.log('\n— rotte eliminate —')
for (const route of GONE) {
  const page = await browser.newPage()
  const res = await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 60000 })
  const landed = new URL(page.url()).pathname
  note(landed !== route, `${route} — reindirizza a ${landed} invece di servire la vecchia pagina`)
  void res
  await page.close()
}

console.log('\n— link interni rotti —')
{
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  const seen = new Set()
  for (const route of PAGES) {
    await page.goto(BASE + route, { waitUntil: 'networkidle0', timeout: 60000 })
    const hrefs = await page.evaluate(() =>
      [...document.querySelectorAll('a[href^="/"]')].map(a => a.getAttribute('href')))
    for (const h of hrefs) seen.add(h.split('#')[0])
  }
  for (const href of [...seen].filter(h => GONE.includes(h)))
    note(false, `un link interno punta ancora a ${href}`)
  if (![...seen].some(h => GONE.includes(h)))
    note(true, 'nessun link interno verso le rotte eliminate')
  await page.close()
}

await browser.close()

console.log(`\n${failures.length ? `${failures.length} controlli falliti` : 'tutti i controlli passati'}\n`)
process.exit(failures.length ? 1 : 0)
```

- [ ] **Step 2: Registrare lo script**

Modify `package.json`, dentro `"scripts"`, dopo la riga `"lint:fix"`:

```json
    "check:layout": "node scripts/check-layout.mjs",
```

- [ ] **Step 3: Eseguirlo e verificare che FALLISCA**

Il dev server deve essere acceso (`pnpm dev` in un altro terminale).

Run: `pnpm check:layout`

Expected: esce `1`. In particolare:
- `/ @1920 — 117 caratteri per riga (atteso 60-75)` → FAIL
- `/works @1920` → FAIL
- `/about — reindirizza a /about invece di servire la vecchia pagina` → FAIL
- `un link interno punta ancora a /about` → FAIL

Se passa, lo strumento è sbagliato: non sta trovando la prosa. Controllare il filtro `innerText.trim().length > 90`.

- [ ] **Step 4: Commit**

```bash
git add scripts/check-layout.mjs package.json
git commit -m "test: strumento di misura dell'impaginazione

Misura i caratteri per riga sul sito renderizzato, l'altezza delle pagine
e i link verso rotte eliminate. Fallisce sullo stato attuale: 117 caratteri
per riga a 1920px, contro i 60-75 leggibili."
```

---

### Task 2: La misura della colonna e le sezioni

**Files:**
- Modify: `app/assets/css/main.css`
- Modify: `app/layouts/default.vue`
- Modify: `app/components/content/SectionItem.vue`
- Modify: `content/index.md`, `content/works.md` (via l'override `size="w-full"`)

**Interfaces:**
- Produces: due utility Tailwind, `measure` (68ch) e `bleed` (88ch), usabili come classi nei componenti e nei file MDC.
- Produces: `SectionItem` emette un `id` slugificato dal `title` (es. `How I got here` → `how-i-got-here`). Task 6 ci aggancia i redirect: senza questo gli ancoraggi non esistono.

- [ ] **Step 1: Aggiungere le due utility**

Modify `app/assets/css/main.css`, subito dopo il blocco `@utility font-display`:

```css
/* La misura di lettura. 68ch sta dentro la finestra leggibile (45-75):
   prima di questo la prosa arrivava a 117 caratteri per riga a 1920px. */
@utility measure {
  max-width: 68ch;
}

/* Sforo per i soli blocchi tabellari: elenchi progetti, percorso, tabelle
   del CV. Sono dati incolonnati, non prosa, e la riga lunga li' non costa. */
@utility bleed {
  max-width: 88ch;
}
```

- [ ] **Step 2: Riscrivere SectionItem**

Tre cose nello stesso file: il default della misura, l'`id` per gli ancoraggi, e i numerali
che smettono di incastrarsi nel titolo. Oggi il numerale è `absolute -right-10` sopra un `h2`
con `w-fit`, quindi si sovrappone alle parole: "About me 1 Timeline 2" si legge come una frase
sola. Spostarlo in fondo al divisore lo toglie di mezzo e gli dà una posizione fissa.

Modify `app/components/content/SectionItem.vue`, sostituendo l'intero file:

```vue
<script setup lang="ts">
interface SectionItemProps {
  title: string
  number: number
  size?: string
  sizeTitle?: string
  numberSize?: string
}

const {
  title,
  size = 'measure',
  sizeTitle = 'font-display text-3xl sm:text-4xl',
  numberSize = 'text-5xl sm:text-6xl',
} = defineProps<SectionItemProps>()

// Serve ai redirect dalle vecchie rotte: /about atterra su #how-i-got-here.
const slug = computed(() =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
</script>

<template>
  <Motion layout class="flex flex-col gap-2" data-animate :style="{ '--stagger': number, '--delay': `${number * 0.05}s` }">
    <!-- Il numerale sta sul divisore, non sul titolo: in absolute sopra un h2
         con w-fit finiva sopra le parole. -->
    <div class="mb-3 flex items-center gap-4">
      <ThornRule class="flex-1 text-(--ui-border)" />
      <span :class="numberSize" class="font-mono leading-none opacity-[9%]" aria-hidden="true">
        {{ number }}
      </span>
    </div>

    <!-- scroll-mt: la testa sticky coprirebbe il titolo arrivando da un'ancora. -->
    <h2 :id="slug" class="w-fit scroll-mt-24" :class="sizeTitle">
      {{ title }}<span class="text-primary">.</span>
    </h2>

    <div :class="size" class="text-pretty font-light">
      <slot />
    </div>
  </Motion>
</template>
```

- [ ] **Step 3: Togliere gli override a larghezza piena dal contenuto**

In `content/index.md` e `content/works.md`, ogni occorrenza di `size="w-full"` va sostituita con `size="bleed"`. Sono le righe che annullavano il limite e sono la causa diretta delle righe lunghe.

```bash
sed -i 's/size="w-full"/size="bleed"/g' content/index.md content/works.md
```

Verificare che non ne restino:

```bash
grep -rn 'size="w-full"' content/ || echo "nessun override rimasto"
```

- [ ] **Step 4: Centrare la colonna nel layout**

Modify `app/layouts/default.vue`. La griglia a due colonne sparisce in Task 3; qui si prepara il contenitore. Sostituire il `div` con `lg:grid lg:grid-cols-[14rem_minmax(0,1fr)]` con un contenitore a colonna unica centrata:

```vue
          <div class="flex flex-1 flex-col gap-8 print:block">
            <Rail />

            <div class="mx-auto flex w-full min-w-0 max-w-[88ch] flex-col print:max-w-none">
              <Motion layout class="flex-1">
                <slot />
              </Motion>
```

Il `max-w-[88ch]` sul contenitore è il limite esterno: dentro, la prosa si stringe a `68ch` tramite `measure`, i blocchi tabellari arrivano a `88ch` tramite `bleed`.

Rimuovere anche `lg:border-l lg:border-(--ui-border) lg:pl-14` dallo stesso `div`: il bordo verticale aveva senso accanto al binario, non sotto una testa.

- [ ] **Step 5: Eseguire il controllo**

Run: `pnpm check:layout`

Expected: la sezione "misura della prosa" passa interamente — ogni riga fra 60 e 75 caratteri. Le sezioni "rotte eliminate" e "link interni rotti" falliscono ancora: le affronta Task 6.

- [ ] **Step 6: Verificare che gli ancoraggi esistano**

Run:

```bash
curl -s http://localhost:3000/ | grep -oE '<h2 id="[^"]+"'
```

Expected: un `id` per sezione, slugificato dal titolo (es. `<h2 id="open-source"`). Prima di
questo task il comando non restituiva nulla: `SectionItem` non emetteva alcun `id`, ed è il
motivo per cui i redirect di Task 7 hanno bisogno che questo passo venga prima.

- [ ] **Step 7: Verificare che i numerali non coprano più il titolo**

Run:

```bash
node -e "
const puppeteer=require('puppeteer');
(async()=>{
  const b=await puppeteer.launch({headless:'new',args:['--no-sandbox']});
  const p=await b.newPage(); await p.setViewport({width:1440,height:900});
  await p.goto('http://localhost:3000/',{waitUntil:'networkidle0'});
  const sovrapposti=await p.evaluate(()=>{
    const out=[];
    for(const h of document.querySelectorAll('h2[id]')){
      const n=h.closest('[data-animate]')?.querySelector('span[aria-hidden]');
      if(!n) continue;
      const a=h.getBoundingClientRect(), b=n.getBoundingClientRect();
      if(a.right>b.left && a.left<b.right && a.bottom>b.top && a.top<b.bottom)
        out.push(h.id);
    }
    return out;
  });
  console.log(sovrapposti.length ? 'SOVRAPPOSTI: '+sovrapposti.join(', ') : 'ok — nessun numerale sopra un titolo');
  await b.close();
  process.exit(sovrapposti.length?1:0);
})();
"
```

Expected: `ok — nessun numerale sopra un titolo`, uscita `0`.

- [ ] **Step 8: Lint e commit**

```bash
pnpm lint
git add app/assets/css/main.css app/layouts/default.vue app/components/content/SectionItem.vue content/index.md content/works.md
git commit -m "feat: colonna di lettura a misura, 68ch

Da 117 caratteri per riga a 1920px a 68. La causa non era il layout ma
l'override size=\"w-full\" ripetuto nel contenuto, che annullava il
max-w di SectionItem.

Nello stesso componente: il numerale passa dal titolo al divisore, dove
non copre piu' le parole, e le sezioni emettono un id per gli ancoraggi."
```

---

### Task 3: La testa al posto del binario

**Files:**
- Create: `app/components/Masthead.vue`
- Delete: `app/components/Rail.vue`
- Modify: `app/layouts/default.vue`

**Interfaces:**
- Consumes: le utility `measure` e `bleed` di Task 2.
- Produces: `<Masthead />`, una fascia sticky in cima, senza props.

- [ ] **Step 1: Scrivere la testa**

Create `app/components/Masthead.vue`:

```vue
<script setup lang="ts">
const { profile, socials } = useAppConfig()
const route = useRoute()
const colorMode = useColorMode()

const picture = computed(() =>
  colorMode.value === 'dark' ? profile.pictureDark : profile.pictureLight,
)

const nav = [
  { label: 'Works', to: '/works' },
  { label: 'Resume', to: '/resume' },
]

function isActive(to: string) {
  return route.path === to || route.path.startsWith(`${to}/`)
}
</script>

<template>
  <!-- Il binario laterale occupava 14rem e circa un terzo dell'altezza,
       identico su ogni pagina: su /writing conteneva piu' roba della pagina.
       Qui diventa una fascia bassa, cosi' la pagina comincia subito. -->
  <header class="sticky top-0 z-20 -mx-5 mb-10 bg-(--ui-bg)/85 px-5 backdrop-blur-sm sm:-mx-10 sm:px-10 print:hidden">
    <div class="mx-auto flex max-w-[88ch] items-center gap-4 border-b border-(--ui-border) py-3">
      <NuxtImg
        v-if="picture"
        :src="picture"
        :alt="profile.name"
        width="80"
        height="80"
        sizes="40px"
        format="webp"
        class="size-10 shrink-0 border border-(--ui-border) object-cover"
      />

      <div class="min-w-0 flex-1">
        <NuxtLink to="/" class="font-display text-lg leading-tight tracking-tight transition-colors hover:text-primary">
          christian&thinsp;/&thinsp;zangetsu
        </NuxtLink>
        <p class="text-[11px] leading-tight text-muted">
          {{ profile.workTitle }} · Rome
        </p>
      </div>

      <nav class="flex items-center gap-4">
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="text-sm transition-colors hover:text-primary"
          :class="isActive(item.to) ? 'text-highlighted' : 'text-muted'"
        >
          {{ item.label }}
        </NuxtLink>
        <ThemeSelector />
      </nav>
    </div>
  </header>
</template>
```

Il blocco social e il `Sigil` non spariscono: Task 5 li rimette nel piede della home, dove stanno meglio di una fascia di navigazione.

- [ ] **Step 2: Montarla e togliere il binario**

Modify `app/layouts/default.vue`: sostituire `<Rail />` con `<Masthead />`, spostandolo **fuori** dal contenitore della colonna (la testa è a tutta larghezza, il contenuto no).

```bash
git rm app/components/Rail.vue
```

- [ ] **Step 3: Verificare che non resti nessun riferimento**

Run:

```bash
grep -rn "Rail" app/ content/ || echo "nessun riferimento a Rail rimasto"
```

Expected: nessun riferimento.

- [ ] **Step 4: Testare l'altezza della testa e lo sticky con Lenis**

Questo copre i punti 4 e 5 della Review Focus. Create `scripts/check-masthead.mjs`:

```js
// La testa e' il primo elemento sticky del sito e Lenis fa smooth scroll:
// se litigano, la testa si stacca o resta indietro durante lo scroll.
import puppeteer from 'puppeteer'

const BASE = process.env.BASE_URL ?? 'http://localhost:3000'
const failures = []
const note = (ok, msg) => {
  console.log(`${ok ? '  ok  ' : ' FAIL '} ${msg}`)
  if (!ok) failures.push(msg)
}

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] })

for (const [w, h] of [[390, 844], [1280, 768], [1440, 900]]) {
  const page = await browser.newPage()
  await page.setViewport({ width: w, height: h })
  await page.goto(BASE + '/', { waitUntil: 'networkidle0', timeout: 60000 })

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
```

Aggiungere a `package.json`:

```json
    "check:masthead": "node scripts/check-masthead.mjs",
```

- [ ] **Step 5: Eseguire entrambi i controlli**

Run: `pnpm check:masthead && pnpm check:layout`

Expected: `check:masthead` passa interamente. Se la testa resta indietro durante lo scroll, il colpevole è `app/plugins/lenis.client.ts`: Lenis trasforma il wrapper e lo `sticky` si aggancia a quello invece che alla viewport. Rimedio: montare la testa fuori dal contenitore che Lenis trasforma, cioè come primo figlio di `UApp` in `app/layouts/default.vue`.

- [ ] **Step 6: Lint e commit**

```bash
pnpm lint
git add -A app/components app/layouts scripts package.json
git commit -m "feat: testa sottile al posto del binario laterale

Il binario occupava 14rem e un terzo dell'altezza su ogni pagina, sempre
uguale. Diventa una fascia sticky bassa. Con un controllo sullo sticky,
che e' il primo del sito e convive con lo smooth scroll di Lenis."
```

---

### Task 4: Le date corrette

Fonte: `~/Downloads/CV_Links_Palladini_Christian.docx`. Nessuna decisione sul ruolo: la dicitura resta quella che è.

**Files:**
- Modify: `content/timeline.md`
- Modify: `content/2.works-experience/linksmt.json:7`

- [ ] **Step 1: Correggere la data d'ingresso**

Modify `content/2.works-experience/linksmt.json`, riga 7. Da:

```json
  "start": { "month": "Sep", "year": "2022" },
```

a:

```json
  "start": { "month": "Feb", "year": "2023" },
```

- [ ] **Step 2: Riscrivere il percorso nell'ordine reale**

Il sito raccontava Sintesi e poi Sifer; la realtà è l'opposto. Modify `content/timeline.md`, sostituendo l'intero blocco `::about` con:

```markdown
::about

#timeline
:::timeline{year="2023" title="Entrato in Links Management & Technology"}
Febbraio 2023, a Roma, dentro il competence centre dell'azienda.
:::

:::timeline{year="2024" title="Sifer — Regione Emilia-Romagna"}
Tech lead sulla riscrittura completa, da marzo 2024 a maggio 2025. Una libreria di
venticinque componenti circa, poi adottata da altri team del competence centre.
Symfony, Nuxt, PostgreSQL.
:::

:::timeline{year="2024" title="Certified Vue.js Developer"}
Aprile 2024, certificazione VueSchool — la versione formale di una cosa che facevo
da anni.
:::

:::timeline{year="2025" title="Sintesi — Regione Puglia"}
Da gennaio 2025 ad agosto 2026: una piattaforma regionale per i servizi al lavoro,
un monolite legacy spezzato in una quindicina di microservizi. Coordinato un team di
quattro persone restando nel codice, e fissati gli standard DDD e clean architecture.
Spring Boot 3, Java 21, Kafka, Kubernetes.
:::

:::timeline{year="2025" title="I primi progetti che altri hanno installato"}
Ottobre e novembre 2025: il tema Dark Discord per Zed e per VS Code, e un template
Nuxt 4 con Better Auth e Drizzle.
:::

:::timeline{year="2026" title="Librerie e strumenti"}
Giugno 2026, un SDK TypeScript per l'API di fatturazione elettronica di Aruba.
Settembre 2026, un indicatore VPN per la barra di Omarchy.
:::
::
```

- [ ] **Step 3: Verificare la coerenza con le schede progetto**

Le date dei progetti open source devono combaciare con i `date` dei JSON.

Run:

```bash
for f in content/1.works/*.json; do
  node -e "const d=require('./$f'); console.log(d.date, d.name)"
done | sort
```

Expected:

```
2025-10-29 Dark Discord Theme for Zed
2025-11-04 Dark Discord Theme for VS Code
2025-11-05 Nuxt UI Better Auth Template
2026-06-22 Fatturazione Elettronica Aruba
2026-09-14 Omarchy FortiVPN
```

Il percorso scritto allo Step 2 dice "ottobre e novembre 2025" e "giugno 2026, settembre 2026": coincidono.

- [ ] **Step 4: Commit**

```bash
git add content/timeline.md content/2.works-experience/linksmt.json
git commit -m "fix: date del percorso allineate al CV

Ingresso in Links da Sep 2022 a Feb 2023. Sintesi non e' del 2023 ma del
2025-2026, Sifer del 2024-2025: l'ordine narrativo era rovesciato rispetto
alla realta'. Chi apriva il CV accanto al sito vedeva due storie diverse.

La dicitura del ruolo resta invariata: e' una decisione aperta."
```

---

### Task 5: La home assorbe about, percorso e contatto

**Files:**
- Modify: `content/index.md`
- Delete: `content/about.md`, `content/contact.md`, `content/writing.md`, `content/timeline.md`
- Delete: `app/components/content/About.vue`
- Modify: `app/components/content/Timeline.vue` (se dipende dallo slot di `About.vue`)

**Interfaces:**
- Consumes: le utility `measure`/`bleed` di Task 2, la `<Masthead />` di Task 3, le date di Task 4.

- [ ] **Step 1: Confermare che Timeline sia autonomo**

Verificato il 2026-10-15: `app/components/content/Timeline.vue` dichiara solo `year` e `title`
come props e riceve il corpo via `<slot />`. **Non dipende da `About.vue`**, quindi funziona
direttamente dentro `index.md` senza wrapper.

`About.vue` sparisce perché le sue tab puntavano a `/about` e `/timeline`, che non esistono più.

Run, per confermare che nulla sia cambiato nel frattempo:

```bash
grep -n "defineProps\|slot" app/components/content/Timeline.vue
```

Expected: `defineProps<{ year: string, title: string }>` e un solo `<slot />`. Se compare un
`useSlots` o un riferimento a un componente genitore, fermarsi e risolverlo prima di proseguire.

- [ ] **Step 2: Riscrivere la home**

Modify `content/index.md`:

```markdown
---
image: "/og/index.png"
---

::hero
#title
I build things that stay simple [after]{.italic .text-muted} they get complicated.

#default
Software engineer in Rome, Tech Lead at Links Management & Technology.
Enterprise backends during the day, small sharp tools by choice.
::

::section-item{:number='1' size="bleed" title="Open source"}
Tools I needed, finished properly, left in the open.

:::works{:limit='4'}
:::

See everything in [**my projects**](/works){.link}.
::

::section-item{:number='2' size="bleed" title="How I got here"}
:::timeline{year="2023" title="Joined Links Management & Technology"}
February 2023, in Rome, inside the company's competence centre.
:::

:::timeline{year="2024" title="Sifer — Regione Emilia-Romagna"}
Tech lead on the full rewrite, March 2024 to May 2025. A component library of
twenty-five-odd components, later adopted by other teams in the competence centre.
Symfony, Nuxt, PostgreSQL.
:::

:::timeline{year="2024" title="Certified Vue.js Developer"}
April 2024, from VueSchool — the formal version of something I had been doing for years.
:::

:::timeline{year="2025" title="Sintesi — Regione Puglia"}
January 2025 to August 2026: a regional employment-services platform, a legacy monolith
broken into fifteen-odd microservices. Coordinated a team of four while staying in the
code, and set the DDD and clean-architecture standards the team worked to.
Spring Boot 3, Java 21, Kafka, Kubernetes.
:::

:::timeline{year="2025" title="The first things other people installed"}
October and November 2025: the Dark Discord theme for Zed and for VS Code, and a Nuxt 4
starter with Better Auth and Drizzle.
:::

:::timeline{year="2026" title="Libraries and tools"}
June 2026, a TypeScript SDK for Aruba's electronic invoicing API. September 2026, a VPN
indicator for the Omarchy bar.
:::

The formal version is in my [**resume**](/resume){.link}.
::

::section-item{:number='3' title="Let's talk"}
I'm open to new projects and collaborations. If you have something in mind, or just want
to ask me a question, write to me.

:::contact-form
:::
::
```

Nota sulla prosa: le formule generiche di `about.md` ("crafting digital experiences", "true innovation isn't about adding more", "push boundaries") **non vengono riportate**. Il percorso qui sopra dice le stesse cose con date e numeri, che è il motivo per cui la spec lo chiamava il contenuto forte del sito.

- [ ] **Step 3: Eliminare le pagine assorbite**

```bash
git rm content/about.md content/contact.md content/writing.md content/timeline.md
git rm app/components/content/About.vue
```

- [ ] **Step 4: Controllare che nulla referenzi i componenti eliminati**

Run:

```bash
grep -rn "::about\|#about\|#timeline\|About.vue" content/ app/ || echo "nessun riferimento rimasto"
```

Expected: nessun riferimento. Se `content/resume.md` o un componente `cv/` usa `::about`, va scollegato prima di proseguire.

- [ ] **Step 5: Eseguire il controllo**

Run: `pnpm check:layout`

Expected: "misura della prosa" e "altezza delle pagine" passano. "rotte eliminate" fallisce ancora — i redirect sono Task 6. "link interni rotti" ora passa, perché `index.md` non linka più `/about`.

- [ ] **Step 6: Lint e commit**

```bash
pnpm lint
git add -A content app/components
git commit -m "feat: la home assorbe about, percorso e contatto

Da sei pagine a tre. /writing esce finche' non c'e' un articolo: 55 parole
e un form valgono meno di nessuna pagina. Il percorso esce dalla tab
secondaria in cui era sepolto e diventa la prova centrale della home."
```

---

### Task 6: Redirect e sitemap

Copre i punti 2 e 3 della Review Focus. Eliminare le rotte senza redirect rompe i link che esistono già fuori dal sito.

**Files:**
- Modify: `nuxt.config.ts` (`routeRules`, `prerender.routes`)

- [ ] **Step 1: Aggiungere i redirect permanenti**

Modify `nuxt.config.ts`, il blocco `routeRules` alle righe 31-33:

```ts
  routeRules: {
    '/': { isr: true },
    // Le vecchie rotte possono essere in firme email, su LinkedIn o indicizzate.
    // 301 e non 404: il contenuto non e' sparito, si e' spostato nella home.
    '/about': { redirect: { to: '/#how-i-got-here', statusCode: 301 } },
    '/timeline': { redirect: { to: '/#how-i-got-here', statusCode: 301 } },
    '/contact': { redirect: { to: '/#let-s-talk', statusCode: 301 } },
    '/writing': { redirect: { to: '/', statusCode: 301 } },
  },
```

Gli ancoraggi `#how-i-got-here` e `#lets-talk` esistono grazie allo `slug` aggiunto a
`SectionItem` in Task 2, e corrispondono ai titoli scritti in `index.md` in Task 5
("How I got here", "Let's talk" → `how-i-got-here`, `let-s-talk`).

**Attenzione allo slug di "Let's talk":** l'apostrofo diventa un trattino, quindi l'id è
`let-s-talk` e **non** `lets-talk`. Lo Step 3 lo verifica.

- [ ] **Step 2: Togliere le rotte morte dal prerender**

Modify `nuxt.config.ts`, righe 87-94. Rimuovere `'/about'` e `'/timeline'` dall'array `routes`:

```ts
      routes: [
        '/',
        '/sitemap.xml',
        '/works',
        '/_resume',
      ],
```

Nell'array `ignore` alla riga 98, aggiungere le rotte che ora sono redirect, così non finiscono nel sitemap:

```ts
      ignore: ['/notes', '/notes/**', '/writing', '/about', '/timeline', '/contact', '/__og-image__/**'],
```

- [ ] **Step 3: Verificare che gli ancoraggi puntino a qualcosa di reale**

Run:

```bash
curl -s http://localhost:3000/ | grep -oE '<h2 id="[^"]+"' | sort -u
```

Expected: compaiono `how-i-got-here` e `let-s-talk`. Se uno slug non corrisponde, **correggere
il redirect sullo slug reale**, non il contrario: un redirect verso un'ancora inesistente
atterra in cima alla pagina senza dire niente, ed è peggio di un redirect onesto a `/`.

- [ ] **Step 4: Eseguire il controllo completo**

Run: `pnpm check:layout`

Expected: **tutti i controlli passati**, uscita `0`. Le quattro rotte eliminate ora reindirizzano.

- [ ] **Step 5: Verificare il sitemap**

Run:

```bash
curl -s http://localhost:3000/sitemap.xml | grep -oE '<loc>[^<]+</loc>'
```

Expected: nessuna `<loc>` contiene `/about`, `/timeline`, `/contact` o `/writing`.

- [ ] **Step 6: Commit**

```bash
git add nuxt.config.ts
git commit -m "fix: redirect 301 dalle rotte assorbite, via dal sitemap

/about, /timeline, /contact e /writing possono essere gia' in firme email
o indicizzate: diventano redirect permanenti invece di 404."
```

---

### Task 7: Il CV stampato e la verifica finale

Copre il punto 1 della Review Focus. `print.css` imposta l'A4 a partire dal layout che abbiamo cambiato.

**Files:**
- Modify: `app/assets/css/print.css` (solo se la verifica trova regressioni)

- [ ] **Step 1: Rigenerare il PDF**

Run: `pnpm pdf`

Expected: il comando esce `0` e `public/resume.pdf` viene riscritto.

- [ ] **Step 2: Verificare il PDF**

Run:

```bash
node -e "
const fs=require('fs');
const s=fs.statSync('public/resume.pdf');
console.log('dimensione', s.size, 'byte, modificato', s.mtime.toISOString());
if (s.size < 40000) { console.error('TROPPO PICCOLO: il PDF e probabilmente vuoto'); process.exit(1) }
"
pdftotext public/resume.pdf - 2>/dev/null | head -40 || echo "(pdftotext non disponibile, ispezionare a mano)"
```

Expected: il testo estratto contiene nome, ruolo e le voci del percorso. Se `print.css` eredita `measure` o `bleed` e stringe il CV a 68ch su A4, aggiungere a `print.css` dentro `@media print`:

```css
  .measure,
  .bleed {
    max-width: none !important;
  }
```

La misura di lettura serve a schermo, dove la riga è lunga quanto la finestra. Su A4 la larghezza la decide già il margine di pagina.

- [ ] **Step 3: Verificare che la build passi**

Run: `pnpm build`

Expected: esce `0`, nessun errore di prerender su rotte inesistenti.

- [ ] **Step 4: Screenshot finali**

Create `scripts/shots.mjs`:

```js
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
```

Run: `OUT=/tmp/folio-shots mkdir -p /tmp/folio-shots && OUT=/tmp/folio-shots node scripts/shots.mjs`

Expected: 18 immagini. Vanno guardate, non solo contate: la misura giusta non garantisce che la pagina stia in piedi.

- [ ] **Step 5: Il controllo completo, un'ultima volta**

Run: `pnpm lint && pnpm check:layout && pnpm check:masthead`

Expected: tutti e tre escono `0`. `pnpm lint` mostra i 2 warning preesistenti in `app/components/toc/` e nessun errore.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: verifica finale dell'impaginazione a documento

PDF del CV rigenerato, build pulita, screenshot delle tre pagine nei due
temi a tre larghezze."
```

---

---

### Task 8: La dicitura del ruolo

Decisa dall'autore il 2026-10-15: valgono **entrambe**, `Full Stack Developer` e `Tech Lead`,
ma non incollate in un'unica casella. Il titolo fermo è quello del CV; "tech lead" resta
attaccato alle commesse dove è stato esercitato.

Questo task tocca anche la riga di apertura scritta in Task 5: è voluto, così la decisione sul
ruolo si rivede in un commit solo invece di essere sparsa.

**Files:**
- Modify: `app/app.config.ts:9`
- Modify: `content/index.md` (blocco `::hero`, `#default`)
- Modify: `content/2.works-experience/linksmt.json` (riga 3 e `summary[0]`)

- [ ] **Step 1: Il titolo nella testa**

Modify `app/app.config.ts`, riga 9. Da:

```ts
    workTitle: 'Software Engineer',
```

a:

```ts
    workTitle: 'Full stack developer',
```

La testa di Task 3 rende `{{ profile.workTitle }} · Rome`, quindi diventa
`Full stack developer · Rome`.

- [ ] **Step 2: La riga di apertura**

Modify `content/index.md`, dentro `::hero`, il blocco `#default`. Da:

```markdown
Software engineer in Rome, Tech Lead at Links Management & Technology.
Enterprise backends during the day, small sharp tools by choice.
```

a:

```markdown
Full stack developer in Rome, tech lead on the rewrites at Links Management & Technology.
Enterprise backends during the day, small sharp tools by choice.
```

- [ ] **Step 3: La scheda del lavoro**

Modify `content/2.works-experience/linksmt.json`. Riga 3, da:

```json
  "role": "Software Engineer",
```

a:

```json
  "role": "Full Stack Developer",
```

E il primo elemento di `summary`, da:

```json
    "Tech Lead within the company's competence center, providing technical direction and coordinating development teams across multiple client engagements",
```

a:

```json
    "Full stack developer in the company's competence centre, and tech lead on the Sifer and Sintesi engagements: technical direction, team coordination, and the standards those teams worked to",
```

- [ ] **Step 4: Verificare che non resti nessuna dicitura orfana**

Run:

```bash
grep -rn "Software Engineer\|Software engineer\|Tech Lead\|Full Stack\|Full stack" content/ app/app.config.ts
```

Expected: nessuna occorrenza di `Software Engineer` o `Software engineer`. Le occorrenze di
`tech lead` ammesse sono solo quelle **attaccate a una commessa**: la riga di apertura, il
`summary` di `linksmt.json`, e le voci del percorso su Sifer e Sintesi.

Confronto con la fonte: il CV (`CV_Links_Palladini_Christian.docx`, 2026-10-15) riporta
`Full Stack Developer`. Dopo questo task il sito non lo contraddice in nessun punto.

- [ ] **Step 5: Controllo completo e commit**

Run: `pnpm lint && pnpm check:layout`

Expected: entrambi escono `0`.

```bash
git add app/app.config.ts content/index.md content/2.works-experience/linksmt.json
git commit -m "fix: una sola dicitura del ruolo, allineata al CV

Il sito usava tre diciture in quattro punti e il CV una quarta. Il titolo
fermo diventa quello del CV, Full Stack Developer; tech lead resta dove e'
verificabile, attaccato alle commesse Sifer e Sintesi."
```

## Cosa resta aperto

- ~~La dicitura del ruolo~~ — decisa il 2026-10-15, vedi Task 8.
- **`/writing`.** Torna come rotta quando esisterà un articolo. La collection in `content.config.ts:22` resta definita e vuota: non dà fastidio.
- **Le immagini dei progetti.** Oggi sono lettere al posto delle schermate. Fuori perimetro qui, ma è il prossimo salto di credibilità più grosso.
