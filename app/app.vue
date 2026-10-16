<script setup lang="ts">
// Il modulo non emette gli alternate da solo: senza questa chiamata il sito
// non dichiara a Google che italiano e inglese sono la stessa pagina.
useHead(useLocaleHead())
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
