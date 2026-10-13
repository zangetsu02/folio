# Folio — refresh grafico e di contenuto

Data: 2026-10-13
Stato: in revisione
Budget: ~1 giornata (8h)

## Obiettivo

Il portfolio deve servire tre pubblici senza diventare tre siti:

| Pubblico | Cosa cerca | Pagina che lo serve |
|---|---|---|
| Recruiter / hiring manager | seniority verificabile, stack, storia | `/resume`, `/about`, `/timeline` |
| Cliente freelance | prove di cose finite e funzionanti | `/works` |
| Altri sviluppatori / OSS | craft, open source, gusto tecnico | `/works`, home |

La home non serve nessuno dei tre direttamente: li **smista**. È il pezzo di design più importante del lavoro.

### Criteri di successo

1. Nessuna pagina vuota, nessun link verso il nulla.
2. Nessun dato residuo del template originale.
3. Un visitatore capisce in meno di 10 secondi chi sei e cosa sai fare.
4. `/works` mostra almeno 6 progetti reali e verificabili.
5. Il sito regge il confronto in light mode e su mobile.
6. `pnpm build` passa, il PDF del CV si rigenera.

## Assunzioni dichiarate

- **A1 — Contenuti**: le schede progetto vengono scritte partendo dai repo GitHub reali (README, topics, linguaggi) e poi riviste dall'autore. Gli **articoli no**: non vengono generati post a nome dell'autore. La sezione Writing resta parcheggiata finché non esiste un articolo vero.
- **A2 — Linguaggio visivo**: palette (bone/ink), radius 0, Instrument Serif + Geist, griglia e spotlight **restano**. Il refresh è chirurgico, non un restyle.
- **A3 — Deploy**: Vercel, come da `nuxt.config.ts` (`$production.site.url = christianpalladini.me`). Nessun cambio di hosting.

## Stato attuale — cosa è rotto

Rilevato leggendo il repo al commit `a6e97a4`.

### Buchi di contenuto
- `content/timeline.md` contiene la stringa `todo`. La rotta `/timeline` è **orfana**: in `app/components/content/About.vue:7-15` l'array `items` di `UTabs` contiene solo la voce "About me". Il computed `active` (righe 17-24) sa gestire `/timeline`, ma non esiste nessuna tab da cliccare e nessuna pagina ci linka. La rotta è comunque in prerender (`nuxt.config.ts:88`) e renderizza la stringa `todo`.
- Non esiste `content/2.writing/`. La collection `writing` è definita in `content.config.ts:22` ma è vuota: `/writing` e il blocco `:::writing-list` in home non mostrano nulla.
- Non esiste `app/components/content/Playground.vue`. `content/playground.md:7` invoca `:::playground`, che non renderizza niente. La home linka `/playground` (`content/index.md:40`).
- `content/3.playground/test.md` è un file vuoto, ma la collection `playground` (`content.config.ts:35`) richiede `title`, `description` e `date` non vuoti.
- `/works` espone 3 schede, di cui 2 sono lo stesso tema Discord su editor diversi.

### Residui del template (fork di hr-folio di HugoRCD)
- `app/app.config.ts:8` — `phone: '(+33) 6 21 56 22 18'`, numero francese non appartenente all'autore. Finisce nel CV e quindi nel PDF.
- `content/1.works/fatturazione-elettronica-aruba-sdk.json` — `logo` punta a `/assets/works/dark-discord-theme-logo.png`.

### Bug funzionali
- `toast` è invocato in quattro componenti senza essere importato né ottenuto da `useToast()`: `app/components/content/ContactForm.vue:21,33,36`, `app/components/content/Writing.vue:25,28`, `app/components/CopyLink.vue:8,11`. In `app/layouts/default.vue:60` il `<Toaster />` è commentato. L'effetto: **il form di contatto solleva un ReferenceError al submit**, e il form di contatto è l'unico canale di conversione per il pubblico freelance. Priorità massima.
- `app/components/content/WritingList.vue:8` e `app/components/content/Writing.vue:31` hanno la condizione d'errore invertita: `if (!data.value || !error.value)` entra nel ramo proprio quando l'errore *non* c'è. Il `createError` non è lanciato, quindi oggi è innocuo, ma è codice che mente.

### Testi
- `content/index.md:19` — "you can che out" → "check out".
- `content/index.md:38` — "Im not currenty active on any platoform" → tre refusi in una riga.
- `content/index.md:40` — il paragrafo è racchiuso in `[...]`: le parentesi quadre restano visibili a schermo.
- `content/about.md:9` — "3+ years": l'esperienza in Links parte da Sep 2022, sono 4+.

## Design

### 1. Home — tre porte

Struttura nuova di `content/index.md`:

```
Hero
  nome / handle
  ruolo
  riga di posizionamento (1 frase, non una citazione)
  riga "now": cosa fa oggi, con stack
  CTA: Send me a message / Make a call

§1 Work        → /works + /resume
§2 Open source → progetti selezionati (sostituisce Writing)
§3 Elsewhere   → socials, puliti
```

La citazione "An idiot admires complexity, a genius admires simplicity" resta, ma come chiusura o nota, non come prima riga sotto il nome: oggi occupa lo spazio che dovrebbe dire cosa sai fare.

**Writing non compare in home** finché la collection è vuota (A1). La rotta `/writing` resta raggiungibile ma non linkata.

### 2. Works — il delta visivo principale

**Schema** (`content.config.ts`, collection `works`) — campi modificati:
- `tech: z.array(z.string()).optional()` — chip tecnologie
- `repo: z.string().optional()` — link al sorgente, distinto da `url` (che è il link "vivo": marketplace, sito docs)
- `logo` passa da obbligatorio a **opzionale**: i progetti nuovi non hanno un logo e produrne sei non sta in una giornata. Quando manca, la card disegna un monogramma (iniziale in serif dentro un riquadro bordato) che tiene la griglia uniforme.

**Categorie** — da `API` / `zed` / `vscode` a:
- `libraries` → "Libraries & SDKs"
- `tools` → "Developer tools"
- `themes` → "Editor themes"

Le etichette vivono in un'unica mappa condivisa (`app/utils/works.ts`), perché la categoria è renderizzata in due posti: le card di `/works` e la lista `CvSideProjects.vue:28`, che oggi stampa il valore grezzo. Duplicare la mappa significherebbe vedere `libraries` nel CV e "Libraries & SDKs" sul sito.

**Dataset** — 6 progetti verificati su GitHub il 2026-10-13:

| File | Categoria | Fonte | Note |
|---|---|---|---|
| `fatturazione-elettronica-aruba` | libraries | 372KB TS, sito docs su Vercel | logo da rifare |
| `nuxt-ui-better-auth-template` | libraries | 5★, Nuxt 4 + Drizzle + Better Auth | nuovo |
| `zed-discord-theme` | themes | 6★ — il repo più stellato | esiste, da rinominare |
| `dark-discord-theme` | themes | 2★, VS Code marketplace | esiste |
| `omarchy-fortivpn` | tools | QML + Shell, bar Omarchy | nuovo |
| `jira-tracker` | tools | 2★, app Vue | nuovo |

Esclusi e perché: `comuni-italiani-api` è privato (non linkabile); `bootvue`, `pdf-maker`, `alpine`, `nuxt-docs-maker`, `tweaknui` sono sottili o fermi da oltre un anno.

**Card** (`app/components/Works.vue`) — da logo+titolo+descrizione a:
- riga superiore: titolo, anno, freccia in hover (già presente)
- descrizione su 2 righe (già presente)
- riga inferiore nuova: chip tecnologie in `font-mono text-xs`
- logo: mantenere il trattamento `saturate-0 → saturate-100` in hover, che è buono

### 3. Timeline

Due interventi, perché oggi la rotta è orfana:

1. **Renderla raggiungibile**: aggiungere la voce `Timeline` all'array `items` di `UTabs` in `About.vue`, con `value: 'timeline'`, `slot: 'timeline'`, `to: '/timeline'`, e il template `#timeline` corrispondente. Il computed `active` funziona già.
2. **Riempirla**: `content/timeline.md` passa da `todo` a una timeline verticale reale — 2022 ingresso in Links → ruolo di tech lead → Sintesi (Regione Puglia) → Sifer (Regione Emilia-Romagna) → certificazione Vue (2024) → milestone open source.

Serve un componente `app/components/content/Timeline.vue` che renda le voci in modo coerente con `CvWorkExperience.vue`, che già disegna una linea verticale con pallini e la gestisce bene.

### 4. Playground — rimosso

Si eliminano: `content/playground.md`, `content/3.playground/`, la collection `playground` in `content.config.ts`, il riferimento in `app/pages/[...slug].vue:13`, il link in `content/index.md:40`.

Motivazione: oggi è un link verso una pagina vuota. YAGNI — rientra quando ha contenuto.

### 5. Passaggio di verità

- `app/app.config.ts` — telefono: numero reale o campo rimosso. **Da confermare con l'autore.**
- `content/about.md` — "3+ years" → "4+ years"
- `content/index.md` — i tre refusi e le parentesi quadre
- Rigenerazione del PDF del CV dopo le correzioni (`pnpm pdf`)

### 6. Rifinitura grafica

- **Hero**: scala tipografica più decisa, trattamento dell'avatar, riga "now" con indicatore di stato
- **Ritmo**: scala di spaziatura coerente tra le sezioni numerate (`SectionItem.vue`)
- **Light mode**: `nuxt.config.ts:56` forza `preference: 'dark'`. La palette chiara esiste in `main.css` ma non è verificata. Passata di controllo su tutte le pagine.
- **OG per pagina**: `ogImage.enabled` è `false` (`nuxt.config.ts:103`), c'è una sola immagine statica `/og/index.png`. Abilitare la generazione per pagina migliora ogni condivisione — rilevante per il pubblico cliente e dev.
- **Mobile**: passata a 375px su tutte le pagine.

## Verifica

Il repo **non ha test** (nessun vitest, nessuno script `test` in `package.json`). Questo lavoro è contenuto e presentazione: la verifica è visiva e di build, non unitaria. Introdurre un setup di test non è in scope per questa giornata.

Il cancello di verifica è:

1. `pnpm build` esce con successo
2. nessun errore in console sulle rotte: `/`, `/works`, `/about`, `/timeline`, `/resume`, `/contact`, `/writing`
3. nessun link morto (controllo manuale di ogni link di navigazione)
4. ogni pagina controllata in light e dark
5. ogni pagina controllata a 375px e 1440px
6. `pnpm pdf` rigenera `public/resume.pdf` senza il numero francese
7. `pnpm lint` pulito

## Skill per fase

| Fase | Skill |
|---|---|
| Piano eseguibile | `superpowers:writing-plans` |
| Isolamento | `superpowers:using-git-worktrees` |
| Esecuzione | `superpowers:executing-plans` oppure `superpowers:subagent-driven-development` |
| Decisioni visive | `ui-ux-pro-max:ui-ux-pro-max`, `ui-ux-pro-max:design-system` |
| Tono e messaggi | `ui-ux-pro-max:brand` |
| Implementazione | `nuxt`, `nuxt-ui`, `vue` + MCP `nuxt-ui` (`get-component`, `get-example`) |
| Verifica visiva | `run`, `claude-in-chrome` |
| Chiusura | `superpowers:verification-before-completion`, `anthropic-skills:code-review` |

## Domande aperte

1. **Telefono** — numero reale da mettere, oppure si rimuove il campo dal CV?
2. **Timeline** — ci sono tappe prima di Links (studi, lavori precedenti) da includere?
3. **jira-tracker** — è presentabile come lavoro pubblico o preferisci lasciarlo fuori?
