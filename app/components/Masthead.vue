<script setup lang="ts">
const { profile } = useAppConfig()
const route = useRoute()

const nav = [
  { label: 'Works', to: '/works' },
  { label: 'Resume', to: '/resume' },
]

function isActive(to: string) {
  return route.path === to || route.path.startsWith(`${to}/`)
}
</script>

<template>
  <!--
    Testata, non barra: sta in cima alla pagina e scorre via col contenuto.
    Un libro non ha una riga che ti insegue mentre leggi, e la metafora del
    sito e' il documento.

    Prima era una fascia fissa con la foto a 40px: a quella dimensione il
    ritratto diventava un quadrato scuro illeggibile, e il resto -- marchio a
    sinistra, voci a destra, bordo e blur -- era la forma di default di
    qualsiasi template. Qui non c'e' nessuna immagine: solo il serif del nome,
    il mono numerato delle voci e un filetto, che sono gli stessi materiali di
    tutto il resto del sito.
  -->
  <header class="mb-14 flex flex-col gap-6 print:hidden">
    <div>
      <NuxtLink
        to="/"
        class="font-display text-2xl leading-none tracking-tight transition-colors hover:text-primary sm:text-3xl"
      >
        christian&thinsp;/&thinsp;zangetsu
      </NuxtLink>
      <!-- my-0: la regola globale `p { my-5 }` in main.css staccherebbe il
           sottotitolo dal nome di venti pixel. -->
      <p class="my-0 mt-1.5 text-sm text-muted">
        {{ profile.workTitle }} · Rome
      </p>
    </div>

    <div class="flex items-baseline justify-between gap-6 border-t border-(--ui-border) pt-3">
      <nav class="flex flex-wrap items-baseline gap-x-6 gap-y-2 font-mono text-xs">
        <NuxtLink
          v-for="(item, index) in nav"
          :key="item.to"
          :to="item.to"
          class="transition-colors hover:text-primary"
          :class="isActive(item.to) ? 'text-highlighted' : 'text-muted'"
        >
          <span class="opacity-55">{{ String(index + 1).padStart(2, '0') }}</span>
          {{ item.label }}
        </NuxtLink>
      </nav>

      <ThemeSelector />
    </div>
  </header>
</template>
