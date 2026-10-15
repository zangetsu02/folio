<script setup lang="ts">
const { profile } = useAppConfig()
const route = useRoute()
const colorMode = useColorMode()

const picture = computed(() =>
  colorMode.value === 'dark' ? profile.pictureDark : profile.pictureLight,
)

const nav = [
  { label: 'Works', to: '/works' },
  { label: 'Resume', to: '/resume' },
]

function isActive(to: string) {
  return route.path === to || route.path.startsWith(`${to}/`)
}
</script>

<template>
  <!-- Il binario laterale occupava 14rem e circa un terzo dell'altezza,
       identico su ogni pagina: su /writing conteneva piu' roba della pagina.
       Qui diventa una fascia bassa, cosi' la pagina comincia subito.
       La larghezza interna e' la stessa della colonna di contenuto, percio'
       il bordo inferiore e il testo sotto risultano allineati. -->
  <header class="sticky top-0 z-20 bg-(--ui-bg)/85 px-5 backdrop-blur-sm sm:px-10 print:hidden">
    <div class="mx-auto flex max-w-[88ch] items-center gap-4 border-b border-(--ui-border) py-3">
      <NuxtImg
        v-if="picture"
        :src="picture"
        :alt="profile.name"
        width="80"
        height="80"
        sizes="40px"
        format="webp"
        class="size-10 shrink-0 border border-(--ui-border) object-cover"
      />

      <div class="min-w-0 flex-1">
        <NuxtLink to="/" class="font-display text-lg leading-tight tracking-tight transition-colors hover:text-primary">
          christian&thinsp;/&thinsp;zangetsu
        </NuxtLink>
        <!-- my-0: la regola globale `p { my-5 }` in main.css aggiungerebbe
             40px alla fascia, che e' quasi il doppio della sua altezza utile. -->
        <p class="my-0 truncate text-[11px] leading-tight text-muted">
          {{ profile.workTitle }} · Rome
        </p>
      </div>

      <nav class="flex items-center gap-4">
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="text-sm transition-colors hover:text-primary"
          :class="isActive(item.to) ? 'text-highlighted' : 'text-muted'"
        >
          {{ item.label }}
        </NuxtLink>
        <ThemeSelector />
      </nav>
    </div>
  </header>
</template>
