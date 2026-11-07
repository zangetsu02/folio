# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Recruiters, hiring managers and tech leads at companies who are evaluating Christian Palladini for a senior full stack or tech lead role. They arrive from LinkedIn, a CV or a shared link and give the site a short scan. They are looking for three things: what he has been responsible for, which stack he works in, and whether he is worth a conversation.

Two secondary audiences are not the primary target: developers who arrive from his open-source projects, and potential freelance clients.

## Product Purpose

The site is the personal portfolio and CV of Christian Palladini, a full stack developer in Rome and tech lead at Links Management & Technology. A visit succeeds when the evaluator either books a call (cal.com) or downloads the CV as a PDF. Both outcomes carry equal weight.

## Positioning

He is an enterprise tech lead who has worked on large rewrites:
- Sifer for Regione Emilia-Romagna;
- Sintesi for Regione Puglia, where a legacy monolith was split into about fifteen microservices.

He also builds and maintains his own open-source tools. The thesis on the site is "I build things that stay simple after they get complicated."

## Operating Context

- Visitors are evaluating a candidate. They often compare him with others and spend little time per page.
- The CV is read on screen at /resume and also as a two-page PDF that gets forwarded internally.
- Contact routes:
  - cal.com/zangetsu for calls;
  - a contact form (/api/send via Resend);
  - email hello@christianpalladini.me;
  - LinkedIn, GitHub, X and /dev/null.

## Capabilities and Constraints

- Nuxt 4 with @nuxt/content, @nuxt/ui v4 and Tailwind 4, built as a static site with `nuxt generate`.
- **Bilingual (binding):** Italian is the default with no prefix, and English lives under /en. Both languages carry the same content, and `pnpm check:i18n` enforces parity.
- **Printable CV (binding):** /resume must keep producing a two-page A4 PDF per language (`pnpm pdf`, print.css, `pnpm check:print`).
- **Template repo (binding):** the code stays open source (MIT) and configurable through app.config.ts and nuxt.schema.ts. Personal data lives in config and content, not in components.
- Existing checks that must keep passing: `check:i18n`, `check:layout`, `check:masthead`, `check:print`.
- Pages: home (/), /works, /resume, plus their /en variants.

## Brand Commitments

- Name: Christian Palladini. The handle zangetsu is the site title.
- Voice: dry and first person, with short owned sentences. The Italian copy is the reference voice.
- The home page is no longer bound to show only the avatar. A real photo (/me.jpeg) is allowed.

## Evidence on Hand

- Work experience: Links Management & Technology (content/2.works-experience/linksmt.json).
- Projects: Sifer and Sintesi.
- Open-source projects: content/1.works/*.json.
- Certificate: Certified Vue.js Developer, VueSchool 2024 (content/3.certificates/vue.json).
- Photo: public/me.jpeg.
- What the site must not invent: testimonials, client logos, metrics or numbers beyond those already in the content files.

## Product Principles

1. The evaluator learns who he is, what role he plays and what he led within the first screen.
2. Booking a call and getting the CV are always within reach and carry equal weight.
3. Every claim on the site is backed by real content, such as a project, a period or a stack, never by adjectives.
4. Both languages are first-class: neither one is a translation added as an afterthought.
5. The site is a working template: design choices go through tokens and config, not hard-coded personal data.

## Accessibility & Inclusion

WCAG 2.1 AA: contrast, keyboard navigation, labelled form fields and correct heading structure in both languages. Respect `prefers-reduced-motion`.
