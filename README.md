# Zangetsu Folio

Il codice del mio portfolio personale, costruito con [Nuxt](https://nuxt.com/),
[Nuxt UI](https://ui.nuxt.com/) e [Tailwind CSS](https://tailwindcss.com/).

Dal vivo su [christianpalladini.me](https://christianpalladini.me/).

## Sviluppo locale

Serve Node 22 o successivo e [Corepack](https://github.com/nodejs/corepack)
abilitato (`corepack enable`).

```bash
pnpm install
cp .env.example .env   # senza, il modulo contatti risponde 503
pnpm dev               # http://localhost:3000
```

## Comandi

| Comando | Cosa fa |
|---|---|
| `pnpm dev` | Server di sviluppo |
| `pnpm build` | Build di produzione |
| `pnpm lint` / `pnpm lint:fix` | ESLint |
| `pnpm check:layout` | Misura della colonna di lettura, altezza delle pagine, rotte assorbite |
| `pnpm check:masthead` | La testata scorre via e non copre il testo |
| `pnpm check:print` | Il CV stampato non si porta dietro la decorazione da schermo |
| `pnpm pdf` | Rigenera `public/resume.pdf` |
| `pnpm og` | Rigenera `public/og/index.png` |

I tre `check:*` misurano il **sito renderizzato**, quindi vogliono il dev server
già in esecuzione su `:3000`. Sono il contratto di impaginazione: se passano, la
prosa sta fra 60 e 75 caratteri per riga, nessuna pagina è più corta della
viewport, e le vecchie rotte reindirizzano invece di rispondere 404.

`public/resume.pdf` e `public/og/index.png` sono **artefatti generati**: si
rigenerano coi comandi qui sopra, non si modificano a mano.

## Dove sta cosa

```
content/           i dati del sito: pagine MDC, progetti e CV in JSON
app/components/content/   componenti richiamabili dal markdown (::hero, ::works…)
app/components/    il resto dell'interfaccia
app/utils/halftone.ts     il retino tipografico, condiviso dai due canvas
app/utils/noise.ts        il rumore del campo di sfondo
server/api/        gli endpoint di contatto e newsletter
scripts/           generatori e controlli di impaginazione
docs/superpowers/  spec e piani delle tornate di lavoro
```

Per aggiungere un progetto basta un JSON in `content/1.works/`: lo schema sta in
`content.config.ts`, e la categoria deve essere una di quelle in
`app/utils/works.ts`.

## Licenza

Da scegliere. Finché non c'è un file `LICENSE`, valgono i termini di default del
diritto d'autore: il codice è leggibile ma non riutilizzabile.

---

Partito da [@HugoRCD/hr-folio](https://github.com/HugoRCD/hr-folio.git).
