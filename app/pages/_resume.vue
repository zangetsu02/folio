<script setup lang="ts">
definePageMeta({
  layout: 'blank',
  colorMode: 'light',
})
</script>

<template>
  <div class="resume-page">
    <Resume />
  </div>
</template>

<style>
:root:has(.resume-page) {
  font-size: 11pt;
  --ui-text-muted: rgb(60, 60, 60) !important;
  --ui-border: rgb(160, 160, 160) !important;
}

html:has(.resume-page),
body:has(.resume-page) {
  background: var(--ui-bg);
  margin: 0;
}

.resume-page {
  padding: 12mm 14mm;
  background: var(--ui-bg);
  color: var(--ui-text);
}

.resume-page [data-animate] {
  animation: none !important;
  opacity: 1 !important;
  transform: none !important;
}

.resume-page h2 span.absolute {
  opacity: 0.25 !important;
}

/* PDF-only / web-only visibility */
.resume-page .web-only {
  display: none !important;
}

.resume-page .pdf-only {
  display: flex !important;
}

/* Header layout: aside becomes horizontal, content stacks below at full width */
.resume-page .cv {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.resume-page .cv > :first-child aside {
  display: grid;
  grid-template-columns: 6rem 1fr;
  grid-auto-rows: auto;
  column-gap: 1.25rem;
  row-gap: 0.35rem;
  position: static;
  align-items: start;
}

.resume-page .cv > :first-child aside > img {
  grid-row: 1 / span 3;
  width: 6rem !important;
  height: 6rem !important;
  align-self: center;
}

/* The 3 info blocks (heading, contacts, socials) flow into column 2 */
.resume-page .cv > :first-child aside > :not(img) {
  grid-column: 2;
}

.resume-page .cv > :first-child aside > div:nth-of-type(2) {
  border-top: none !important;
  padding-top: 0 !important;
}

/* Tighter section spacing in the PDF (web uses gap-12 = 3rem, too generous for print) */
.resume-page .cv > :last-child > .flex.flex-col {
  gap: 1.25rem !important;
}

/* Tighter article spacing inside Work Experience */
.resume-page article {
  padding-top: 0;
  padding-bottom: 0;
}

/* Tighter list rows for divided lists (Languages, Certificates, Side Projects) */
.resume-page .py-3 {
  padding-top: 0.4rem !important;
  padding-bottom: 0.4rem !important;
}

.resume-page .py-2\.5 {
  padding-top: 0.35rem !important;
  padding-bottom: 0.35rem !important;
}

/* Reduce mt-4 spacing inside Work Experience cards */
.resume-page article .mt-4 {
  margin-top: 0.6rem !important;
}

/* Less verbose summary list */
.resume-page article > ul.mt-4 {
  margin-top: 0.4rem !important;
}

.resume-page [data-animate],
.resume-page article,
.resume-page header,
.resume-page li {
  break-inside: avoid;
  page-break-inside: avoid;
}

.resume-page h2 {
  break-after: avoid;
  page-break-after: avoid;
}
</style>

