# Folio — reimpostazione dell'impaginazione: il documento

Data: 2026-10-15
Stato: in revisione
Sostituisce parzialmente: `2026-10-13-folio-refresh-design.md` (la struttura a sei pagine decisa lì)

## Obiettivo

Il sito ha **un solo pubblico**: chi sta decidendo se lavorare con Christian — recruiter,
hiring manager, cliente. Il percorso professionale e i progetti open source non sono due
sezioni che competono per lo spazio: sono **due prove della stessa tesi**, cioè come lavora
e con che cura. I side project valgono proprio perché nessuno glieli ha commissionati.

Questo corregge l'impostazione della spec del 13 ottobre, che assumeva tre pubblici distinti
e dava alla home il compito di smistarli. Con un pubblico solo la home non smista: **argomenta**.

### Criteri di successo

1. Misura della colonna di prosa fra **60 e 75 caratteri** a ogni larghezza da 1280px in su.
2. Nessuna pagina più corta della viewport su desktop a 1440×900.
3. Le date sul sito coincidono con quelle del CV (vedi *Dati corretti*).
4. L'ordine narrativo del percorso è quello reale: Sifer prima, Sintesi dopo.
5. `pnpm lint` pulito, `pnpm build` passa, il PDF del CV si rigenera senza regressioni.
6. Le tre pagine reggono in light e dark a 1440, 1920 e 390px.

## Assunzioni dichiarate

- **A1 — Nessun contenuto nuovo da produrre.** La riduzione da sei a tre pagine è fatta apposta
  per stare dentro il materiale che esiste già. Non vengono scritti articoli a nome dell'autore.
- **A2 — Il linguaggio visivo resta.** Palette bone/ink, radius 0, Instrument Serif + Geist,
  `Sigil.vue`, `ThornRule.vue` e lo sfondo `Backdrop.vue` non si toccano. Cambia la griglia,
  non l'identità.
- **A3 — I progetti del percorso sono solo quelli già sul portfolio.** Il CV elenca anche
  FonCoop, Softhings, Sifer-Canoni e altri incarichi: **restano fuori**, su richiesta esplicita
  dell'autore. Il CV serve come fonte per le **date**, non come fonte per i progetti.

## Stato attuale — cosa è rotto

Misurato sul sito in esecuzione al 2026-10-15.

### La misura di lettura

| Larghezza finestra | Colonna di prosa | Caratteri per riga |
|---|---|---|
| 1440px | 1023px | **95** |
| 1920px | 1263px | **117** |
| 2560px | 1263px | **117** |

La misura leggibile sta fra 45 e 75 caratteri. Il sito è al **doppio del limite** su schermi
grandi. Deriva dal commit `97d414a` ("il sito usa tutta la larghezza"): la larghezza l'ha presa
il testo, che è l'unica cosa a cui non serviva. Sintomo che lo conferma: **il mobile si legge
meglio del desktop**, perché lì la misura è imposta dalla finestra.

### Pagine semivuote

| Pagina | Parole | Altezza |
|---|---|---|
| `/` | 266 | 1507px |
| `/resume` | 413 | 2394px |
| `/about` | 217 | 900px |
| `/works` | 182 | 1042px |
| `/contact` | 89 | 900px |
| `/writing` | **55** | 900px |

Tre pagine su sei sono alte esattamente quanto la viewport, cioè mezza schermata vuota sotto.
Su `/writing` il binario di sinistra contiene **più contenuto della pagina stessa**.

### Il contenuto forte è sepolto

`content/timeline.md` è di gran lunga il materiale migliore: concreto, datato, verificabile
("un monolite spezzato in una quindicina di microservizi", "una libreria di venticinque
componenti che altri team hanno poi adottato"). Sta dentro una tab secondaria di `/about`.

`content/about.md` è quello che si legge per primo ed è il più debole: "crafting digital
experiences", "push boundaries", "true innovation isn't about adding more", grassetti
distribuiti a caso. Stona con la riga della home, che invece è specifica e riconoscibile.

### Altro

- `/about` non emette alcun `h1`.
- I numerali fantasma di `SectionItem` collidono coi titoli: "About me 1 Timeline 2" si legge
  come una frase unica.

## Dati corretti

Fonte: `~/Downloads/CV_Links_Palladini_Christian.docx`, estratto il 2026-10-15.

### Discrepanze trovate

| Dato | Sito | CV |
|---|---|---|
| Ingresso in Links | `Sep 2022` (`linksmt.json:7`), "2022" (`timeline.md`) | **01/02/2023** |
| Sintesi — Regione Puglia | 2023 (`timeline.md`) | **gen 2025 → ago 2026** |
| Sifer — Emilia-Romagna | 2024 (`timeline.md`) | **mar 2024 → mag 2025** |
| Certified Vue.js Developer | 2024 | 29/04/2024 ✓ coincide |

L'errore non è solo di date: il sito racconta **Sintesi e poi Sifer**, la realtà è **Sifer e poi
Sintesi**. Chi apre il CV accanto al sito vede due storie diverse. Da notare che anche la spec
del 13 ottobre dava per buono "Sep 2022"; quell'affermazione è ora smentita dalla fonte.

### Percorso corretto

```
2023   Entrato in Links Management & Technology           feb 2023
2024   Sifer — Regione Emilia-Romagna                     mar 2024 → mag 2025
2024   Certified Vue.js Developer                         apr 2024
2025   Sintesi — Regione Puglia                           gen 2025 → ago 2026
2025   Temi Discord (Zed, VS Code), Nuxt UI Template      ott–nov 2025
2026   SDK Fatturazione Aruba, Omarchy FortiVPN           giu, set 2026
```

Date dei progetti open source prese da `content/1.works/*.json` (campo `date`), già coerenti.

### Questione aperta — da decidere, non risolta qui

Il CV riporta il ruolo **`Full Stack Developer`**. Il sito dice **`Tech Lead`** in due punti
(`linksmt.json` summary, `content/index.md`) e `Software Engineer` in altri due
(`linksmt.json:3`, `Rail.vue`). È la prima cosa che un recruiter incrocia fra CV e sito.
**Non viene cambiato in autonomia**: serve la decisione dell'autore su quale dicitura vale.

## Design

### Forma: tre pagine

| Rotta | Contenuto |
|---|---|
| `/` | Tesi · chi sono (3–4 righe riscritte) · open source · percorso · contatto |
| `/works` | Tutti i progetti, raggruppati per categoria come oggi |
| `/resume` | Il CV completo, invariato nella sostanza |

Escono: `/about` (si fonde nella home), `/contact` (diventa la sezione di chiusura della home),
`/writing` (ritorna quando esisterà un articolo). `/timeline` sparisce come rotta: il percorso
diventa una sezione della home, che è dove serve.

### La griglia

- **Colonna di prosa: `68ch`.** È il vincolo principale. Nessun paragrafo la supera mai.
- **Sforo a `88ch`** per i soli elementi tabellari, tramite una utility `@utility bleed` in
  `main.css`: elenco progetti, percorso, tabelle del resume. Sono dati, non prosa: la misura
  lunga lì non costa nulla.
- **Il binario diventa una testa.** `Rail.vue` oggi occupa 14rem di colonna e circa un terzo
  dell'altezza, identico su ogni pagina. Diventa una fascia sottile in cima: foto piccola, nome,
  tre voci di navigazione, selettore tema. Sticky.
- La colonna è centrata. La larghezza che avanza resta vuota: con lo sfondo a retino il margine
  non è spazio sprecato, è il fondo che si vede.

### Testi

La prosa di `about.md` viene riscritta corta quando entra nella home: tre o quattro righe
concrete al posto delle formule generiche. Il materiale forte esiste già ed è il percorso —
la home non deve raccontare a parole quello che la timeline dimostra con le date.

## File toccati

| File | Intervento |
|---|---|
| `app/layouts/default.vue` | Via la griglia a due colonne, dentro la colonna unica a `68ch` |
| `app/components/Rail.vue` | Diventa la testa sottile |
| `app/assets/css/main.css` | Le due misure, `68ch` e lo sforo a `88ch` |
| `content/index.md` | Assorbe `about.md` e `timeline.md`, chiude col contatto |
| `content/timeline.md` | Date corrette, poi confluisce nella home |
| `content/2.works-experience/linksmt.json` | `start` da `Sep 2022` a `Feb 2023` |
| `content/about.md`, `contact.md`, `writing.md` | Eliminati |
| `nuxt.config.ts:91-92` | Via `/about` e `/timeline` dalle `prerender.routes` |
| `app/components/content/SectionItem.vue` | Numerali fantasma che non collidono col titolo |

### Link in entrata da aggiornare

Verificati sul repo al 2026-10-15; sono tutti quelli che puntano a rotte che spariscono.

- `content/index.md:12` — `[More about me](/about)`
- `app/components/Rail.vue:12` — voce di menu `About` → `/about`
- `app/components/Rail.vue:14` — voce di menu `Contact` → `/contact`

Nessun altro riferimento interno a `/about`, `/contact`, `/writing` o `/timeline`.
`/timeline` risponde oggi `200` tramite il catch-all `app/pages/[...slug].vue`.

## Fuori perimetro

- `Backdrop.vue` e lo sfondo a retino: appena approvati, non si toccano.
- `print.css` e la generazione del PDF: non cambiano, ma **vanno verificati** perché dipendono
  dal layout che stiamo modificando.
- La decisione su `Tech Lead` / `Full Stack Developer`.
- Scrivere articoli per `/writing`.

## Verifica

1. Misura dei caratteri rimisurata a 1280, 1440, 1920, 2560 — attesa fra 60 e 75.
2. Screenshot delle tre pagine, light e dark, a 1440×900, 1920×1080 e 390×844.
3. Nessuna pagina più corta della viewport a 1440×900.
4. `pnpm lint` senza errori nuovi (restano i 2 warning noti in `app/components/toc/`).
5. `pnpm build` passa; `pnpm pdf` rigenera `public/resume.pdf` e il risultato si apre.
6. Nessun link interno rotto verso le rotte eliminate.
