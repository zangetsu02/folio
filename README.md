# Zangetsu Folio

My personal portfolio, built with [Nuxt](https://nuxt.com/),
[Nuxt UI](https://ui.nuxt.com/) and [Tailwind CSS](https://tailwindcss.com/).

Live at [christianpalladini.me](https://christianpalladini.me/).

## Local development

Needs Node 22+ and [Corepack](https://github.com/nodejs/corepack) enabled
(`corepack enable`).

```bash
pnpm install
cp .env.example .env   # without it, the contact endpoints answer 503
pnpm dev               # http://localhost:3000
```

## Commands

| Command | What it does |
|---|---|
| `pnpm dev` | Development server |
| `pnpm build` | Production build |
| `pnpm lint` / `pnpm lint:fix` | ESLint |
| `pnpm check:layout` | Reading measure, page heights, absorbed routes |
| `pnpm check:masthead` | The masthead scrolls away and nothing covers the text |
| `pnpm check:print` | The printed CV drops screen-only decoration |
| `pnpm pdf` | Regenerates `public/resume.pdf` |
| `pnpm og` | Regenerates `public/og/index.png` |

The three `check:*` commands measure the **rendered site**, so they need the dev
server already running on `:3000`. They are the layout contract: when they pass,
prose sits between 60 and 75 characters per line, no page is shorter than the
viewport, and the old routes redirect instead of 404-ing.

`public/resume.pdf` and `public/og/index.png` are **generated artifacts** —
regenerate them with the commands above, don't edit them by hand.

## Layout of the repo

```
content/                  site data: MDC pages, projects and CV as JSON
app/components/content/   components callable from markdown (::hero, ::works…)
app/components/           everything else in the interface
app/utils/halftone.ts     the typographic screen, shared by both canvases
app/utils/noise.ts        the noise field behind the background
server/api/               contact and newsletter endpoints
scripts/                  generators and layout checks
docs/superpowers/         specs and plans for each round of work
```

Adding a project is one JSON file in `content/1.works/`: the schema lives in
`content.config.ts`, and the category must be one of those in
`app/utils/works.ts`.

## Licence

The **code** is [MIT](./LICENSE). Take it, fork it, use it.

The **content** is not. Text, CV, images and the portrait referenced in
`app.config.ts` are mine and fall outside the licence — replace them with your
own, which is the only way a fork makes sense anyway.

If you do fork it, two things to change first: `NUXT_PRIVATE_RESEND_AUDIENCE_ID`
in `.env`, or you write into an audience that isn't yours, and the destination
address in `server/service/resendService.ts`.
