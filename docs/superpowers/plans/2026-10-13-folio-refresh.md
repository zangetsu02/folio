# Folio Refresh — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rifare home e schede Works, chiudere ogni pagina vuota e ogni dato falso, così che il portfolio serva recruiter, clienti e sviluppatori in una giornata di lavoro.

**Architecture:** Rifinitura chirurgica, non restyle. Il linguaggio visivo esistente (Instrument Serif + Geist, radius 0, palette bone/ink, griglia, spotlight, animazioni `data-animate`) resta invariato: si interviene su contenuto, dati e due componenti di presentazione. I contenuti vivono in `@nuxt/content` v3 come markdown MDC e JSON tipizzati da Zod; i componenti invocati dal markdown stanno in `app/components/content/`.

**Tech Stack:** Nuxt 4.0 (`future.compatibilityVersion: 4`), Vue 3.5 `<script setup>`, Nuxt UI 3, Tailwind CSS 4 (configurazione via `@theme` in CSS, nessun `tailwind.config`), `@nuxt/content` 3, `@nuxtjs/seo`, `motion-v`, pnpm 10.

**Spec:** `docs/superpowers/specs/2026-10-13-folio-refresh-design.md`

## Global Constraints

- **Package manager:** `pnpm` esclusivamente. Mai `npm` né `yarn`: il repo ha `pnpm-lock.yaml` e `packageManager` fissato a `pnpm@10.12.1`.
- **Nessuna dipendenza nuova.** Se un task sembra richiederne una, fermarsi e chiedere.
- **Palette, font e `--ui-radius: 0` non si toccano.** Nessuna modifica ai blocchi `:root` e `.dark` in `app/assets/css/main.css`, se non esplicitamente richiesto da un task.
- **Lingua dei contenuti:** inglese. Tutto il testo visibile sul sito è in inglese, come già oggi.
- **Niente contenuti inventati.** Ogni affermazione nelle schede progetto deve essere verificabile sul repo GitHub corrispondente. Nessun articolo scritto a nome dell'autore (assunzione A1 della spec).
- **Stile dei commit:** Conventional Commits, granulari — `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`. Nessun trailer di attribuzione, nessuna riga "Generated with".
- **Lint:** `pnpm lint` deve restare pulito a ogni commit. La config è `@antfu/eslint-config` via `@nuxt/eslint`: virgolette singole, niente punto e virgola, virgola finale.
- **Branch:** tutto il lavoro su `refresh/2026-10` a partire da `main`. Nessun commit diretto sul branch di default.

## Review Focus

Il repo non ha test. Queste sono le condizioni che nessun task verifica automaticamente e che vanno controllate a mano, dalla più probabile:

1. **Submit del form di contatto** — è il percorso che oggi è rotto (`toast` non definito) ed è l'unica conversione per il pubblico cliente. Va provato un invio reale, non solo il render del form.
2. **Collection `works` vuota o filtrata a zero** — `Works.vue` cicla su `works` senza stato vuoto: una categoria senza progetti produce una sezione con un titolo e il nulla sotto. Dopo il cambio di categorie è lo scenario più facile da innescare.
3. **Progetto senza `logo`** — lo schema lo rende opzionale; se la card non gestisce l'assenza, `NuxtImg` riceve `src` undefined e la griglia si disallinea.
4. **Light mode** — `colorMode.preference` è `'dark'` e il tema chiaro non è mai stato verificato su tutte le pagine. I `compoundVariants` dei bottoni in `app.config.ts` hanno colori hardcoded per entrambi i temi: è lì che si rompe per primo.
5. **Rigenerazione del PDF** — `pnpm pdf` gira Puppeteer su `/_resume`. Ogni modifica a `app.config.ts` o ai componenti `cv/` può spostare il layout oltre la pagina senza che nessuno se ne accorga finché non si apre il file.

---

## Task 0: Setup e baseline

**Files:**
- Nessuna modifica al codice.

**Interfaces:**
- Consumes: niente.
- Produces: un server di sviluppo funzionante e screenshot di partenza su cui misurare ogni task successivo.

- [ ] **Step 1: Creare il branch**

```bash
cd /home/zangetsu/Workspaces/folio
git checkout -b refresh/2026-10
```

- [ ] **Step 2: Installare le dipendenze**

```bash
pnpm install
```

Atteso: installazione completata, `postinstall` esegue `nuxt prepare` senza errori.

- [ ] **Step 3: Verificare che la baseline builda**

```bash
pnpm build
```

Atteso: build completata. Se fallisce **fermarsi e riportare l'errore**: significa che il repo era già rotto prima di questo lavoro, e questo piano assume una baseline verde.

- [ ] **Step 4: Avviare il server di sviluppo**

```bash
pnpm dev
```

Atteso: server su `http://localhost:3000`.

- [ ] **Step 5: Catturare la baseline visiva**

Aprire e salvare uno screenshot di ciascuna di queste rotte, in dark mode, a 1440px:
`/`, `/works`, `/about`, `/timeline`, `/resume`, `/contact`, `/writing`

Salvare in `/tmp/folio-baseline/`. Serviranno per il confronto prima/dopo alla fine.

- [ ] **Step 6: Annotare lo stato osservato**

Scrivere in `/tmp/folio-baseline/notes.md` cosa si vede davvero su ogni rotta, in particolare: cosa mostra `/timeline`, cosa mostra `/writing`, cosa mostra `/playground`. Il piano è stato scritto leggendo il codice, non eseguendolo: se la realtà diverge, è qui che si scopre.

---

## Task 1: Riparare `toast`

Il bug più grave del repo: il form di contatto solleva un `ReferenceError` al submit.

**Files:**
- Modify: `app/components/content/ContactForm.vue`
- Modify: `app/components/content/Writing.vue`
- Modify: `app/components/CopyLink.vue`

**Interfaces:**
- Consumes: niente.
- Produces: `useToast()` di Nuxt UI usato correttamente nei tre componenti. Nessun task successivo dipende da questo, ma nessun task successivo deve reintrodurre `toast` come identificatore libero.

- [ ] **Step 1: Confermare il guasto nel browser**

Aprire `http://localhost:3000/contact`, compilare il form, premere invio. Aprire la console del browser.

Atteso: `ReferenceError: toast is not defined`.

Se invece l'invio funziona, **fermarsi**: `toast` arriva da un auto-import non individuato leggendo il codice, e questo task non serve. Riportarlo e passare al Task 2.

- [ ] **Step 2: Verificare l'API dei toast nella versione di Nuxt UI in uso**

```bash
grep '"@nuxt/ui"' package.json
```

Consultare la documentazione del componente Toast per quella major tramite l'MCP `nuxt-ui`:

```
mcp__nuxt-ui__get-component con name "Toast"
mcp__nuxt-ui__search-composables con query "toast"
```

Atteso: conferma che l'API è `const toast = useToast()` e che `toast.add({ title, description, color })` è il metodo — **non** `toast.success()` / `toast.error()`, che appartengono a `vue-sonner`, libreria non presente fra le dipendenze. Il codice attuale è un residuo del template originale.

- [ ] **Step 3: Correggere `ContactForm.vue`**

Aggiungere in cima al blocco `<script setup lang="ts">`, insieme alle altre dichiarazioni:

```ts
const toast = useToast()
```

Sostituire le tre chiamate con la forma corretta per la major in uso. Per Nuxt UI 3:

```ts
toast.add({ title: 'Please fill in all required fields.', color: 'error' })
```

```ts
toast.add({ title: 'Your message has been sent!', color: 'success' })
```

```ts
toast.add({ title: 'An error occurred while sending your message.', color: 'error' })
```

- [ ] **Step 4: Correggere `Writing.vue` e `CopyLink.vue` allo stesso modo**

Stessa `const toast = useToast()`, stessa conversione da `toast.success(x)` / `toast.error(x)` a `toast.add({ title: x, color: 'success' | 'error' })`.

In `CopyLink.vue` i messaggi sono `'Article link copied to clipboard !'` (success) e `'Failed to copy link to clipboard'` (error).

- [ ] **Step 5: Montare il contenitore dei toast**

In `app/layouts/default.vue` la riga 60 contiene `<!-- <Toaster position="top-center" close-button /> -->`. È il componente di `vue-sonner`, non di Nuxt UI.

In Nuxt UI 3 il contenitore è fornito da `<UApp>`, che in questo layout **avvolge già tutto** (riga 11). Quindi non va aggiunto nulla: va solo **rimossa la riga commentata**, che oggi suggerisce una soluzione sbagliata a chi legge.

Rimuovere anche il commento in `app/pages/[...slug].vue:26`, che contiene lo stesso `<Toaster />` morto.

- [ ] **Step 6: Verificare nel browser**

Ricaricare `/contact`, inviare il form.

Atteso: nessun errore in console, compare un toast. Se l'invio fallisce lato server con un errore Resend, va bene: significa che manca la chiave API in locale, e il percorso JavaScript è comunque riparato. Quello che non deve più comparire è `toast is not defined`.

- [ ] **Step 7: Raddrizzare la condizione d'errore invertita**

Già che si è dentro questi file: `app/components/content/WritingList.vue:8` e `app/components/content/Writing.vue:31` hanno

```ts
if (!data.value || !error.value)
  createError({ statusCode: 404 })
```

`!error.value` è vero proprio quando l'errore **non** c'è, quindi il ramo entra quasi sempre. È innocuo solo perché `createError` non viene lanciato. Allinearlo al modo in cui gli altri componenti del repo lo fanno (`Works.vue:7-14`, `Certificates.vue:3-10`):

```ts
if (error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Writing not found',
    fatal: true,
  })
}
```

In `WritingList.vue` la variabile si chiama `data`, in `Writing.vue` si chiama `posts`: adattare, e usare `statusMessage` coerente con il componente.

- [ ] **Step 8: Verificare che `/writing` regga ancora**

Visitare `http://localhost:3000/writing`.

Atteso: la pagina carica senza errori. La collection è vuota per scelta (assunzione A1), quindi l'elenco è vuoto — ma non deve essere un 404 né una schermata d'errore.

- [ ] **Step 9: Lint e commit**

```bash
pnpm lint
git add app/components/content/ContactForm.vue app/components/content/Writing.vue app/components/content/WritingList.vue app/components/CopyLink.vue app/layouts/default.vue app/pages/\[...slug\].vue
git commit -m "fix: il form di contatto non esplode piu al submit"
```

---

## Task 2: Passaggio di verità sui dati personali

**Files:**
- Modify: `app/app.config.ts:8`
- Modify: `content/about.md:9`
- Modify: `content/index.md:19,38,40`

**Interfaces:**
- Consumes: niente.
- Produces: `content/index.md` ripulito dai refusi. Il Task 6 riscrive questo file interamente: se i due task vengono eseguiti nello stesso giorno, questo resta comunque utile come commit separato e verificabile.

- [ ] **Step 1: Risolvere la questione del telefono**

`app/app.config.ts:8` contiene:

```ts
phone: '(+33) 6 21 56 22 18',
```

È un numero francese ereditato dal template `hr-folio`. Finisce nel CV e quindi nel PDF scaricabile.

**Questa decisione appartiene all'autore.** Se non ha ancora risposto, applicare l'opzione sicura: **rimuovere il campo**. Un numero assente è meglio di un numero sbagliato, e `CvInfo.vue` non lo renderizza comunque oggi — nessun componente legge `profile.phone`.

```bash
grep -rn "profile.phone\|\.phone" app/ --include=*.vue
```

Atteso: nessun risultato. Confermato questo, eliminare la riga 8 da `app/app.config.ts`.

- [ ] **Step 2: Correggere gli anni di esperienza**

In `content/about.md`, l'esperienza dichiarata è "3+ years". L'ingresso in Links è `Sep 2022` (`content/2.works-experience/linksmt.json`), quindi a ottobre 2026 sono 4 anni compiuti.

Sostituire `**3+ years of crafting digital experiences**` con `**4+ years of crafting digital experiences**`.

- [ ] **Step 3: Correggere i refusi nella home**

In `content/index.md`:

| Riga | Da | A |
|---|---|---|
| 19 | `you can che out my` | `you can check out my` |
| 38 | `Im not currenty active on any platoform` | `I'm not currently active on any platform` |

- [ ] **Step 4: Eliminare le parentesi quadre visibili**

`content/index.md:40` è:

```
[I have many open-source projects, snippets of code, and more, where I'm sure you'll find something useful for you. You can also check some out [**here**](/playground){.link}.]
```

Le parentesi quadre esterne non sono sintassi MDC valida: vengono renderizzate letteralmente. Rimuoverle. Il link a `/playground` viene eliminato nel Task 3, quindi per ora riscrivere la riga come:

```
I have many open-source projects, snippets of code, and more — you'll probably find something useful.
```

- [ ] **Step 5: Verificare nel browser**

Ricaricare `/` e `/about`. Rileggere entrambe le pagine parola per parola.

Atteso: nessuna parentesi quadra a schermo, nessun refuso fra quelli in tabella, "4+ years" su `/about`.

- [ ] **Step 6: Commit**

```bash
pnpm lint
git add app/app.config.ts content/about.md content/index.md
git commit -m "fix: rimuove i dati residui del template e i refusi"
```

---

## Task 3: Rimuovere Playground

Oggi `/playground` è una pagina vuota linkata dalla home: il componente `:::playground` non esiste.

**Files:**
- Delete: `content/playground.md`
- Delete: `content/3.playground/` (contiene solo `test.md`, file vuoto)
- Modify: `content.config.ts` — rimuovere la collection `playground` (righe 35-46)
- Modify: `app/pages/[...slug].vue:13` — rimuovere `/playground/` dal computed `isWriting`

**Interfaces:**
- Consumes: la riga di `content/index.md` ripulita dal Task 2.
- Produces: nessuna rotta `/playground`, nessuna collection `playground`.

- [ ] **Step 1: Confermare che nulla punti altrove a playground**

```bash
cd /home/zangetsu/Workspaces/folio
grep -rn "playground" --include=*.vue --include=*.ts --include=*.md . | grep -v node_modules | grep -v docs/superpowers
```

Atteso: esattamente i riferimenti elencati sopra nella sezione Files. Se ne compaiono altri, trattarli nello stesso modo.

- [ ] **Step 2: Eliminare contenuti e collection**

```bash
rm content/playground.md
rm -rf content/3.playground
```

In `content.config.ts`, rimuovere l'intero blocco:

```ts
    playground: defineCollection(
      asSeoCollection({
        type: 'page',
        source: '3.playground/*.md',
        schema: z.object({
          title: z.string().nonempty(),
          description: z.string().nonempty(),
          date: z.string().nonempty(),
          draft: z.boolean().default(false),
        }),
      }),
    ),
```

- [ ] **Step 3: Pulire il computed in `[...slug].vue`**

Riga 13, da:

```ts
const isWriting = computed(() => route.path.includes('/writing/') || route.path.includes('/notes/') || route.path.includes('/playground/'))
```

a:

```ts
const isWriting = computed(() => route.path.includes('/writing/') || route.path.includes('/notes/'))
```

- [ ] **Step 4: Verificare**

Riavviare il server di sviluppo — `@nuxt/content` rigenera il database delle collection all'avvio, una modifica a `content.config.ts` non viene raccolta a caldo.

```bash
# interrompere pnpm dev, poi
pnpm dev
```

Visitare `http://localhost:3000/playground`.

Atteso: 404. Visitare `/`: nessun link verso playground, nessuna sezione rotta.

- [ ] **Step 5: Commit**

```bash
pnpm lint
git add -A
git commit -m "chore: rimuove la sezione playground, era una pagina vuota linkata dalla home"
```

---

## Task 4: Works — schema, dati, etichette

**Files:**
- Create: `app/utils/works.ts`
- Modify: `content.config.ts` — collection `works`
- Create: `content/1.works/nuxt-ui-better-auth-template.json`
- Create: `content/1.works/omarchy-fortivpn.json`
- Create: `content/1.works/jira-tracker.json`
- Modify: `content/1.works/fatturazione-elettronica-aruba-sdk.json`
- Modify: `content/1.works/dark-discord-theme.json`
- Modify: `content/1.works/dark-discord-theme-zed.json`
- Modify: `content/works.md`
- Modify: `app/components/cv/SideProjects.vue:28`

**Interfaces:**
- Consumes: niente.
- Produces:
  - `app/utils/works.ts` esporta `WORK_CATEGORIES: Record<string, string>` e `categoryLabel(key: string): string`. Nuxt auto-importa da `app/utils/`, quindi nessun import esplicito serve nei componenti.
  - La collection `works` espone i campi `name`, `category`, `description`, `url`, `repo?`, `logo?`, `tech?`, `release`, `date`.
  - Le chiavi di categoria valide sono `libraries`, `tools`, `themes`.

- [ ] **Step 1: Creare la mappa delle etichette**

La categoria viene stampata in due posti — le card di `/works` e `CvSideProjects.vue:28` — e senza una mappa condivisa il CV mostrerebbe `libraries` mentre il sito mostra "Libraries & SDKs".

Creare `app/utils/works.ts`:

```ts
export const WORK_CATEGORIES: Record<string, string> = {
  libraries: 'Libraries & SDKs',
  tools: 'Developer tools',
  themes: 'Editor themes',
}

export function categoryLabel(key: string): string {
  return WORK_CATEGORIES[key] ?? key
}
```

- [ ] **Step 2: Estendere lo schema**

In `content.config.ts`, la collection `works`. Rendere `logo` opzionale e aggiungere `tech` e `repo`:

```ts
    works: defineCollection({
      type: 'data',
      source: '1.works/*.json',
      schema: z.object({
        name: z.string().nonempty(),
        description: z.string().nonempty(),
        category: z.enum(['libraries', 'tools', 'themes']),
        release: z.string().optional(),
        date: z.string().nonempty(),
        url: z.string(),
        repo: z.string().optional(),
        logo: z.string().optional(),
        tech: z.array(z.string().nonempty()).optional(),
        screenshotUrl: z.string().optional(),
        screenshotOptions: z
          .object({
            delay: z.number(),
          })
          .optional(),
      }),
    }),
```

`z.enum` invece di `z.string()`: così una categoria scritta male fa fallire la build invece di produrre silenziosamente una sezione vuota.

- [ ] **Step 3: Riscrivere le tre schede esistenti**

`content/1.works/fatturazione-elettronica-aruba-sdk.json` — correggere la categoria, togliere il logo sbagliato (puntava al logo del tema Discord), aggiungere stack e sorgente:

```json
{
  "name": "Fatturazione Elettronica Aruba",
  "category": "libraries",
  "description": "TypeScript SDK for Aruba's Electronic Invoicing API v2. Send, receive and manage Italian electronic invoices through the Sistema di Interscambio.",
  "url": "https://fatturazione-elettronica-aruba-docs.vercel.app/",
  "repo": "https://github.com/zangetsu02/fatturazione-elettronica-aruba",
  "tech": ["TypeScript", "SDI"],
  "release": "2026",
  "date": "2026-06-22"
}
```

`content/1.works/dark-discord-theme.json`:

```json
{
  "name": "Dark Discord Theme for VS Code",
  "category": "themes",
  "description": "A theme for VS Code inspired by Discord's dark palette.",
  "logo": "/assets/works/dark-discord-theme-logo.png",
  "url": "https://marketplace.visualstudio.com/items?itemName=zangetsu002.dark-discord-theme",
  "repo": "https://github.com/zangetsu02/dark-discord-theme",
  "tech": ["TextMate grammar"],
  "release": "2025",
  "date": "2025-11-04"
}
```

`content/1.works/dark-discord-theme-zed.json`:

```json
{
  "name": "Dark Discord Theme for Zed",
  "category": "themes",
  "description": "The same palette, rebuilt for Zed's theme format.",
  "logo": "/assets/works/dark-discord-theme-logo.png",
  "url": "https://zed.dev/extensions/dark-discord",
  "repo": "https://github.com/zangetsu02/zed-discord-theme",
  "tech": ["JSON"],
  "release": "2025",
  "date": "2025-10-29"
}
```

I due temi avevano lo stesso `name`: su `/works` comparivano come due voci identiche. I nomi ora dicono quale editor.

- [ ] **Step 4: Aggiungere le tre schede nuove**

Tutti i dati vengono dai repo reali, verificati il 2026-10-13.

`content/1.works/nuxt-ui-better-auth-template.json`:

```json
{
  "name": "Nuxt UI Better Auth Template",
  "category": "libraries",
  "description": "A starter template for Nuxt 4 applications, wiring up Nuxt UI 4, Drizzle ORM, Better Auth and Resend so authentication is working from the first commit.",
  "url": "https://github.com/zangetsu02/nuxt-ui-better-auth-template",
  "repo": "https://github.com/zangetsu02/nuxt-ui-better-auth-template",
  "tech": ["Nuxt 4", "Better Auth", "Drizzle", "TypeScript"],
  "release": "2025",
  "date": "2025-11-05"
}
```

`content/1.works/omarchy-fortivpn.json`:

```json
{
  "name": "Omarchy FortiVPN",
  "category": "tools",
  "description": "FortiClient VPN status in the Omarchy bar: state, IP, uptime and traffic, with one-click disconnect and a shortcut into the SAML login.",
  "url": "https://github.com/zangetsu02/omarchy-fortivpn",
  "repo": "https://github.com/zangetsu02/omarchy-fortivpn",
  "tech": ["QML", "Shell", "Hyprland"],
  "release": "2026",
  "date": "2026-09-14"
}
```

`content/1.works/jira-tracker.json`:

```json
{
  "name": "Jira Tracker",
  "category": "tools",
  "description": "A desktop-sized Vue application for tracking Jira issues and logging work without living inside the Jira web UI.",
  "url": "https://github.com/zangetsu02/jira-tracker",
  "repo": "https://github.com/zangetsu02/jira-tracker",
  "tech": ["Vue", "TypeScript"],
  "release": "2026",
  "date": "2026-02-02"
}
```

**Prima di scrivere `jira-tracker.json`**: il repo non ha descrizione su GitHub e la riga sopra è una ricostruzione dal nome e dai linguaggi. Aprire il README del repo e correggere `description` e `tech` con quello che dice davvero:

```bash
gh repo view zangetsu02/jira-tracker --json description,repositoryTopics
gh api repos/zangetsu02/jira-tracker/readme --jq '.content' | base64 -d | head -40
```

Se il README non chiarisce cosa fa, **escludere il progetto** e riportarlo: una scheda vaga su un portfolio vale meno di una scheda in meno. Lo stesso vale per `jira-md`, lasciato fuori per questa ragione.

- [ ] **Step 5: Aggiornare le sezioni di `/works`**

`content/works.md` filtra per le vecchie categorie. Riscriverlo:

```markdown
---
title: Works
description: Libraries, developer tools and editor themes I build and maintain in the open.
---

::section-item{:number='1' size="w-full" title="Libraries & SDKs"}
:::works{category="libraries"}
:::
::

::section-item{:number='2' size="w-full" title="Developer tools"}
:::works{category="tools"}
:::
::

::section-item{:number='3' size="w-full" title="Editor themes"}
:::works{category="themes"}
:::
::
```

- [ ] **Step 6: Usare l'etichetta nel CV**

In `app/components/cv/SideProjects.vue`, riga 28, da:

```vue
          {{ item.category }}
```

a:

```vue
          {{ categoryLabel(item.category) }}
```

Nessun import: `app/utils/` è auto-importato da Nuxt.

- [ ] **Step 7: Verificare**

Riavviare il server (modifica a `content.config.ts`).

```bash
pnpm dev
```

Atteso, su `http://localhost:3000/works`:
- tre sezioni, **nessuna vuota**: 2 progetti in Libraries, 2 in Developer tools, 2 in Editor themes
- i due temi Discord hanno nomi diversi
- nessun errore di validazione Zod nel terminale

Su `http://localhost:3000/resume`, sezione Side Projects: sei voci, con le etichette estese ("Libraries & SDKs", non `libraries`).

- [ ] **Step 8: Commit**

```bash
pnpm lint
git add -A
git commit -m "feat: sei progetti reali in works, con stack e categorie leggibili"
```

---

## Task 5: Works — ridisegno della card

Il delta visivo principale del lavoro.

**Files:**
- Modify: `app/components/Works.vue`

**Interfaces:**
- Consumes: la collection `works` con i campi `tech?`, `repo?` e `logo?` opzionali, dal Task 4. La categoria **non** viene renderizzata nella card: la dice già il titolo della sezione che la contiene, quindi `categoryLabel()` qui non serve.
- Produces: niente che altri task consumino.

- [ ] **Step 1: Gestire l'assenza di logo**

Quattro dei sei progetti non hanno un file logo. `NuxtImg` con `src` undefined rompe la griglia.

In `app/components/Works.vue`, sostituire il blocco `<NuxtImg>` con una coppia condizionale: l'immagine quando il logo c'è, un monogramma quando manca.

```vue
        <NuxtImg
          v-if="work.logo"
          width="80"
          height="80"
          class="size-20 shrink-0 object-contain saturate-0 transition duration-300 group-hover:saturate-100"
          :src="work.logo"
          :alt="`${work.name} logo`"
        />

        <div
          v-else
          class="flex size-20 shrink-0 items-center justify-center border border-(--ui-border) font-display text-4xl text-muted transition-colors group-hover:border-primary group-hover:text-primary"
          aria-hidden="true"
        >
          {{ work.name.charAt(0) }}
        </div>
```

Nota: la `<NuxtImg>` attuale non ha `alt`. Aggiungerlo è un requisito di accessibilità, non un extra.

- [ ] **Step 2: Aggiungere le chip delle tecnologie**

Dentro `<div class="flex flex-1 flex-col min-w-0">`, dopo lo `<span>` della descrizione, aggiungere:

```vue
          <ul v-if="work.tech?.length" class="mt-2 flex flex-wrap gap-1">
            <li
              v-for="t in work.tech"
              :key="t"
              class="border border-(--ui-border) px-1.5 py-0.5 font-mono text-[10px] text-muted"
            >
              {{ t }}
            </li>
          </ul>
```

Stesso trattamento usato in `CvWorkExperience.vue:106-112` per lo stack dei progetti: la coerenza fra CV e sito è voluta.

- [ ] **Step 3: Aggiungere lo stato vuoto**

`Works.vue` oggi cicla senza controllare: una categoria senza progetti produce un titolo seguito dal nulla. Dopo il `</NuxtLink>` di chiusura, fuori dal `v-for`, dentro il `<div>` esterno:

```vue
      <p v-if="!works?.length" class="font-mono text-sm text-muted">
        Nothing here yet.
      </p>
```

Spostare questo `<p>` **fuori** dal `<div class="grid ...">`, come fratello, altrimenti eredita la griglia a due colonne.

- [ ] **Step 4: Verificare la gestione dell'assenza**

Creare temporaneamente una quarta sezione in `content/works.md` che punti a una categoria senza progetti:

```markdown
::section-item{:number='4' size="w-full" title="Temp"}
:::works{category="tools-temp"}
:::
::
```

Atteso: compare "Nothing here yet." e nessun errore in console.

**Poi rimuovere la sezione temporanea da `content/works.md`.** Non committarla.

- [ ] **Step 5: Verificare il risultato**

`http://localhost:3000/works`, a 1440px e a 375px, in dark e in light.

Atteso:
- i quattro progetti senza logo mostrano il monogramma, allineato con gli altri due
- le chip stack compaiono sotto ogni descrizione
- a 375px la griglia passa a una colonna e nulla trabocca orizzontalmente

- [ ] **Step 6: Commit**

```bash
pnpm lint
git add app/components/Works.vue
git commit -m "feat: le schede dei progetti mostrano stack e reggono i progetti senza logo"
```

---

## Task 6: Home — tre porte

**Files:**
- Modify: `content/index.md`
- Modify: `app/components/content/Hero.vue`

**Interfaces:**
- Consumes: i progetti del Task 4, `/works` ridisegnata dal Task 5.
- Produces: niente che altri task consumino.

- [ ] **Step 1: Riscrivere il hero in `content/index.md`**

Il blocco `::hero` attuale mette una citazione dove dovrebbe esserci il posizionamento. La citazione resta, ma dopo.

```markdown
---
image: "/og/index.png"
---

::hero
# title
christian / zangetsu

# job

# [Software engineer]{.h1 .border-0 .text-primary }

# default
I build web applications that pair a clear, user-focused frontend with a backend that holds up under change.
Tech Lead at Links Management & Technology, in Rome.<br>
[**More about me**](/about){.link}.
::
```

- [ ] **Step 2: Aggiungere la riga "now" al hero**

In `app/components/content/Hero.vue`, dopo il `<p>` dello slot di default e prima del `<div>` dei bottoni:

```vue
    <p class="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-muted">
      <span class="inline-block size-1.5 shrink-0 bg-primary" aria-hidden="true" />
      <span>Java &amp; Spring and Angular at work</span>
      <span class="text-(--ui-border)">/</span>
      <span>Vue and Nuxt by choice</span>
      <span class="text-(--ui-border)">/</span>
      <span>learning Rust</span>
    </p>
```

Il quadrato pieno invece del pallino: il sito ha `--ui-radius: 0` ovunque, un cerchio stonerebbe.

- [ ] **Step 3: Dare al hero la scala che merita**

`Hero.vue` rende il nome con `font-display text-2xl` dentro un `<h3>`. È più piccolo del titolo di ogni sezione della stessa pagina (`SectionItem.vue` usa `text-3xl sm:text-4xl`): la prima riga del sito è tipograficamente la meno importante.

Due correzioni nello stesso punto, `app/components/content/Hero.vue`:

```vue
        <h1 class="font-display text-4xl tracking-tight sm:text-5xl">
          <slot name="title" mdc-unwrap="p" />
        </h1>
```

Da `<h3>` a `<h1>`: è il titolo della pagina, e oggi la home non ha nessun `h1` oltre a quello dentro lo slot `#job`. Verificare dopo la modifica che la pagina non finisca con due `h1` — se lo slot `#job` ne produce già uno (`content/index.md` usa `# [Software engineer]`), abbassare quello a testo semplice togliendo il `#` e lasciando le classi:

```markdown
# job

[Software engineer]{.h1 .border-0 .text-primary}
```

Ingrandire anche l'avatar, che a `size-16` sparisce accanto a un titolo da `text-5xl`:

```vue
        class="size-20 rounded-full object-cover sm:size-24"
```

- [ ] **Step 4: Sostituire la sezione Writing con Open source**

La §2 della home invoca `:::writing-list`, che pesca da una collection vuota: oggi è una sezione con un titolo e sotto solo il link "See more" verso una pagina vuota.

Sostituire l'intero blocco `::section-item{:number='2' title="Writing"}` con:

```markdown
::section-item{:number='2' title="Open source"}
I build small, sharp tools and libraries and keep them public: a TypeScript SDK for Italian electronic invoicing,
a Nuxt 4 starter with authentication already wired up, a VPN indicator for my window manager, editor themes.

If you're curious about what I build — the tools, the patterns, the decisions — have a look at [**my projects**](/works){.link}.
::
```

La §1 attuale rimanda già a `/works` e `/resume`: riscrivere la §1 per togliere la ripetizione, lasciandole il compito di dire *come* lavori e di mandare al CV:

```markdown
::section-item{:number='1' title="Work"}
I lead a team inside a competence centre, modernising regional public-sector platforms:
a legacy monolith broken into fifteen-odd services, a full rewrite built on a component library
now used by other teams. Domain modelling, clean architecture, and staying hands-on in the code.

The full history is in my [**resume**](/resume){.link}.
::
```

- [ ] **Step 5: Ripulire la sezione Socials**

La §3 diventa:

```markdown
::section-item{:number='3' title="Elsewhere"}
I'm not very active on social platforms, but you can find me on
[**X**](https://x.com/_zangetsu02){.link}, [**GitHub**](https://github.com/zangetsu02){.link}
and [**LinkedIn**](https://www.linkedin.com/in/christian-palladini/){.link}.

An idiot admires complexity, a genius admires simplicity.
::
```

La citazione trova qui la sua collocazione: chiude la pagina invece di occupare la riga di apertura.

- [ ] **Step 6: Verificare**

`http://localhost:3000/`, a 1440px e 375px, dark e light.

Atteso:
- nessuna sezione vuota
- ogni link porta a una pagina con contenuto: `/about`, `/works`, `/resume`, i tre social
- la riga "now" non va a capo male a 375px
- nessun riferimento residuo a Writing o Playground
- esattamente un `h1` nella pagina, controllabile dalla console con `document.querySelectorAll('h1').length`

- [ ] **Step 7: Commit**

```bash
pnpm lint
git add content/index.md app/components/content/Hero.vue
git commit -m "feat: la home smista verso lavoro, progetti e contatti invece di essere un muro di testo"
```

---

## Task 7: Timeline

Oggi `/timeline` è una rotta orfana che mostra la stringa `todo`.

**Files:**
- Create: `app/components/content/Timeline.vue`
- Modify: `app/components/content/About.vue`
- Modify: `content/timeline.md`

**Interfaces:**
- Consumes: niente.
- Produces: `Timeline.vue` accetta uno slot di default contenente markdown e lo rende come lista verticale. È invocato da `content/timeline.md` come `::timeline`.

- [ ] **Step 1: Rendere la tab raggiungibile**

In `app/components/content/About.vue`, l'array `items` contiene una sola voce. Aggiungerne la seconda:

```ts
const items = ref<TabsItem[]>([
  {
    label: 'About me',
    value: 'about',
    slot: 'about',
    to: '/about',
  },
  {
    label: 'Timeline',
    value: 'timeline',
    slot: 'timeline',
    to: '/timeline',
  },
])
```

Il computed `active` (righe 17-24) gestisce già entrambi i valori: non va toccato.

- [ ] **Step 2: Aggiungere il template della tab**

Dopo il blocco `<template #about>`, aggiungere:

```vue
<template #timeline>
  <div data-animate style="--stagger: 2;">
    <slot name="timeline" />
  </div>
</template>
```

- [ ] **Step 3: Correggere il numero decorativo**

Il template `#trailing` (righe 36-40) stampa `1` quando `item.label === 'About me'`. Con due tab serve il numero giusto per ciascuna:

```vue
<template #trailing="{ item, index }">
  <span class="absolute -bottom-0.5 -right-3 text-5xl font-normal opacity-[9%] sm:text-6xl">
    {{ index + 1 }}
  </span>
</template>
```

Verificare che `UTabs` passi `index` allo slot `#trailing` per la major in uso:

```
mcp__nuxt-ui__get-component con name "Tabs"
```

Se non lo passa, tornare al confronto su `item.value`:

```vue
<template #trailing="{ item }">
  <span class="absolute -bottom-0.5 -right-3 text-5xl font-normal opacity-[9%] sm:text-6xl">
    {{ item.value === 'about' ? 1 : 2 }}
  </span>
</template>
```

- [ ] **Step 4: Creare il componente Timeline**

`app/components/content/Timeline.vue`. Riprende il trattamento di `CvWorkExperience.vue:60-61` — linea verticale e quadratino — perché il linguaggio visivo deve essere lo stesso.

```vue
<script setup lang="ts">
defineProps<{
  year: string
  title: string
}>()
</script>

<template>
  <article class="group relative border-l border-(--ui-border) pl-5 pb-8 transition-colors last:pb-0 hover:border-primary">
    <span class="absolute -left-1.5 top-1.5 size-3 border border-(--ui-border) bg-(--ui-bg) transition-colors group-hover:border-primary group-hover:bg-primary" />
    <header class="flex flex-col gap-1">
      <span class="font-mono text-xs text-muted">{{ year }}</span>
      <h3 class="font-display text-xl text-highlighted">
        {{ title }}
      </h3>
    </header>
    <div class="mt-2 text-sm leading-relaxed text-muted *:my-0">
      <slot />
    </div>
  </article>
</template>
```

Il componente rende **una** voce. Il markdown ne impila diverse.

- [ ] **Step 5: Scrivere il contenuto**

`content/timeline.md`. I dati vengono da `content/2.works-experience/linksmt.json` e `content/3.certificates/vue.json`: non inventare tappe che non risultano da questi file o dai repo.

```markdown
---
title: Timeline
description: How I got from writing my first components to leading a team through a public-sector rewrite.
---

::about

# timeline
:::timeline{year="2022" title="Joined Links Management & Technology"}
Started in Rome as a software engineer, in the company's competence centre.
:::

:::timeline{year="2023" title="Sintesi — Regione Puglia"}
Modernising a regional employment-services platform: a legacy monolith broken into fifteen-odd
microservices. Spring Boot 3, Java 21, Kafka, Kubernetes. Coordinated a team of four while staying
in the code, and set the DDD and clean-architecture standards the team worked to.
:::

:::timeline{year="2024" title="Certified Vue.js Developer"}
Certification from VueSchool — the formal version of something I had been doing for years.
:::

:::timeline{year="2024" title="Sifer — Regione Emilia-Romagna"}
Tech lead on a full rewrite: Symfony, Nuxt, PostgreSQL. Built a component library of twenty-five-odd
components that other teams in the competence centre later adopted.
:::

:::timeline{year="2025" title="Editor themes, in the open"}
Dark Discord Theme shipped for VS Code and then rebuilt for Zed. Small projects, but the first ones
other people installed.
:::

:::timeline{year="2026" title="Libraries and tools"}
A TypeScript SDK for Aruba's electronic invoicing API. A Nuxt 4 starter with Better Auth and Drizzle.
A VPN indicator for the Omarchy bar.
:::
::
```

**Da verificare con l'autore**: gli anni di Sintesi e Sifer sono una ricostruzione — `linksmt.json` non li data. Se sono sbagliati, correggerli: una timeline con date inventate è peggio di nessuna timeline.

- [ ] **Step 6: Verificare**

`http://localhost:3000/about` e `http://localhost:3000/timeline`.

Atteso:
- su `/about` compaiono due tab, "About me" e "Timeline", con i numeri 1 e 2
- cliccare "Timeline" naviga a `/timeline` e mostra le sei voci
- cliccare "About me" torna a `/about`
- nessuna stringa `todo` da nessuna parte
- la linea verticale è continua fra le voci

- [ ] **Step 7: Commit**

```bash
pnpm lint
git add app/components/content/Timeline.vue app/components/content/About.vue content/timeline.md
git commit -m "feat: la timeline esiste, e' raggiungibile e racconta il percorso"
```

---

## Task 8: Light mode e mobile

**Files:**
- Modify: `app/assets/css/main.css` e/o `app/app.config.ts`, secondo quello che la verifica rivela.

**Interfaces:**
- Consumes: tutte le pagine dei task precedenti.
- Produces: niente che altri task consumino.

- [ ] **Step 1: Passare in light mode**

`nuxt.config.ts:56` imposta `colorMode.preference: 'dark'`. Il selettore in `ThemeSelector.vue` consente comunque di cambiare.

Nel browser, passare a light e visitare: `/`, `/works`, `/about`, `/timeline`, `/resume`, `/contact`.

- [ ] **Step 2: Annotare ogni rottura prima di correggere**

Scrivere in `/tmp/folio-baseline/light-mode.md` ogni problema trovato, con pagina ed elemento. I sospetti principali, da controllare per primi:

- i `compoundVariants` dei bottoni in `app/app.config.ts:60-73` hanno colori hardcoded per entrambi i temi: verificare il contrasto del testo sui due bottoni del hero
- `.bg-grid-white` ha due definizioni, una per tema (`main.css`): verificare che la griglia si veda in light senza dominare
- `Spotlight.vue`: un effetto luminoso pensato per lo sfondo scuro può risultare una macchia sporca su sfondo chiaro

- [ ] **Step 3: Correggere**

Intervenire sui problemi annotati. Vincolo: **non cambiare i valori della palette** nei blocchi `:root` e `.dark` di `main.css`. Se una correzione sembra richiederlo, fermarsi e riportare — è una decisione di design, non di implementazione.

- [ ] **Step 4: Passata mobile**

Tornare in dark, portare la finestra a 375px di larghezza. Stesse sei rotte.

Atteso su ciascuna: nessuno scorrimento orizzontale, nessun testo tagliato, le aree cliccabili raggiungibili con il pollice.

Il sospetto principale è `/resume`: `Resume.vue` usa una griglia a 6 colonne che collassa a `grid-cols-1` sotto `md`, ma `CvInfo.vue` ha `md:sticky` e un'immagine da `size-44`.

- [ ] **Step 5: Commit**

```bash
pnpm lint
git add -A
git commit -m "fix: il sito regge in light mode e a 375px"
```

---

## Task 9: Immagini OG per pagina

**Files:**
- Modify: `nuxt.config.ts:102-104`

**Interfaces:**
- Consumes: tutte le pagine.
- Produces: niente che altri task consumino.

- [ ] **Step 1: Valutare prima di fare**

`ogImage.enabled` è `false` e `nitro.prerender.ignore` esclude `/__og-image__/**`. Qualcuno ha disattivato la generazione di proposito: probabilmente perché il rendering delle OG allunga la build o perché falliva su Vercel.

```bash
git log --oneline -- nuxt.config.ts
git log -p --follow nuxt.config.ts | grep -B5 -A5 "ogImage" | head -60
```

Se la cronologia mostra che è stato disattivato per rimediare a un guasto di deploy, **saltare questo task** e riportarlo: riaccenderlo significherebbe rompere di nuovo il deploy, e non vale il rischio in una giornata che finisce con una pubblicazione.

- [ ] **Step 2: Riattivare, se il passo 1 non ha fatto emergere ostacoli**

```ts
  ogImage: {
    enabled: true,
  },
```

Rimuovere `"/__og-image__/**"` dall'array `nitro.prerender.ignore`.

- [ ] **Step 3: Verificare che la build regga**

```bash
pnpm build
```

Atteso: build completata. Se fallisce o si allunga oltre il ragionevole, **tornare indietro** (`git checkout nuxt.config.ts`) e riportare. Una OG image non vale una build rotta.

- [ ] **Step 4: Controllare il risultato**

```bash
pnpm preview
```

Visitare `http://localhost:3000/__og-image__/image/works/og.png`.

Atteso: viene prodotta un'immagine che riporta il titolo della pagina.

- [ ] **Step 5: Commit**

```bash
pnpm lint
git add nuxt.config.ts
git commit -m "feat: ogni pagina ha la sua immagine di anteprima"
```

---

## Task 10: Chiusura

**Files:**
- Modify: `public/resume.pdf` (rigenerato)
- Modify: `README.md`

**Interfaces:**
- Consumes: tutto il lavoro precedente.
- Produces: il branch pronto per la revisione.

- [ ] **Step 1: Rigenerare il PDF del CV**

```bash
pnpm pdf
```

Aprire `public/resume.pdf`.

Atteso: il numero di telefono francese non c'è più; le sei voci di Side Projects sono presenti con le etichette estese; niente trabocca fuori pagina.

- [ ] **Step 2: Aggiornare il README**

Il README dichiara l'ispirazione a `@HugoRCD` — resta, è corretto. Ma contiene un `</a>` orfano in fondo, residuo di un copia-incolla. Rimuoverlo.

- [ ] **Step 3: Il giro completo dei link**

Partendo da `/`, cliccare **ogni** link del sito, compresi quelli esterni e quelli nel footer e in `CvInfo.vue`.

Atteso: nessun 404, nessuna pagina vuota. Annotare qualsiasi link morto e ripararlo prima di proseguire.

- [ ] **Step 4: Il cancello di verifica**

Eseguire tutti e tre i comandi e **incollare l'output vero** nel resoconto finale. Nessuna affermazione di successo senza output.

```bash
pnpm lint
pnpm build
```

Atteso: entrambi escono con codice 0.

Poi, sulle sette rotte (`/`, `/works`, `/about`, `/timeline`, `/resume`, `/contact`, `/writing`), con la console del browser aperta: zero errori, zero warning di Vue.

Nota su `/writing`: la pagina resta raggiungibile e la collection è vuota per scelta (assunzione A1). Verificare che mostri qualcosa di sensato e non un blocco vuoto — se è vuota e basta, aggiungere una riga onesta al posto dell'elenco.

- [ ] **Step 5: Confronto prima/dopo**

Rifare gli screenshot delle sette rotte e metterli a fianco di quelli in `/tmp/folio-baseline/`.

Questa è la verifica che risponde alla domanda da cui è partito tutto: il sito sembra rinnovato?

- [ ] **Step 6: Code review**

Usare la skill `anthropic-skills:code-review` sul diff completo del branch:

```bash
git diff main...refresh/2026-10
```

- [ ] **Step 7: Commit finale**

```bash
git add -A
git commit -m "chore: rigenera il pdf del cv e pulisce il readme"
```

- [ ] **Step 8: Riportare**

Elencare all'autore: cosa è stato fatto, cosa è stato saltato e perché, e le decisioni rimaste in sospeso — il telefono, gli anni della timeline, l'inclusione di `jira-tracker`.
