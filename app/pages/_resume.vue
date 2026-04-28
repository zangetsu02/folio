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
  font-size: 13px;
  --ui-text-muted: rgb(60, 60, 60) !important;
  --ui-border: rgb(160, 160, 160) !important;
}

.resume-page {
  padding: 0.5rem 0.75rem;
  background: var(--ui-bg);
  color: var(--ui-text);
  min-height: 100vh;
}

.resume-page [data-animate] {
  animation: none !important;
  opacity: 1 !important;
  transform: none !important;
}

.resume-page h2 span.absolute {
  opacity: 0.25 !important;
}

.resume-page .cv {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 1.5rem;
}

.resume-page .cv > :first-child {
  grid-column: span 4 / span 4;
}

.resume-page .cv > :last-child {
  grid-column: span 8 / span 8;
}

.resume-page aside {
  position: static;
  gap: 0.75rem !important;
}

.resume-page aside img {
  width: 8rem !important;
  height: 8rem !important;
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
