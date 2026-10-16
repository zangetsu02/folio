<script setup lang="ts">
interface SectionItemProps {
  title: string
  number: number
  size?: string
  sizeTitle?: string
  numberSize?: string
}

const {
  title,
  size = 'measure',
  sizeTitle = 'font-display text-3xl sm:text-4xl',
  numberSize = 'text-5xl sm:text-6xl',
} = defineProps<SectionItemProps>()

// Serve ai redirect dalle vecchie rotte: /about atterra su #how-i-got-here.
const slug = computed(() =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
</script>

<template>
  <Motion layout class="flex flex-col gap-2" data-animate :style="{ '--stagger': number, '--delay': `${number * 0.05}s` }">
    <!-- Il numerale sta sul divisore, non sul titolo: in absolute sopra un h2
         con w-fit finiva sopra le parole. -->
    <!-- `section-mark` e' un appiglio stabile per la stampa: la regola che
         nascondeva il numerale era attaccata a `.cv h2 span.absolute`, cioe'
         alla posizione nel markup e alle utility, e ha smesso di combaciare
         in silenzio appena il numerale si e' spostato. -->
    <div class="section-mark mb-3 flex items-center gap-4">
      <ThornRule class="flex-1 text-(--ui-border)" />
      <!-- 22% e non 9%: il fondo a retino stampa i suoi punti con lo stesso
           inchiostro a 24/255, cioe' il 9.4%. A 9% il numerale aveva
           esattamente il peso dei puntini dietro e spariva dentro il fondo. -->
      <span :class="numberSize" class="font-mono leading-none opacity-[22%]" aria-hidden="true">
        {{ number }}
      </span>
    </div>

    <!-- scroll-mt: la testa sticky coprirebbe il titolo arrivando da un'ancora. -->
    <h2 :id="slug" class="w-fit scroll-mt-24" :class="sizeTitle">
      {{ title }}<span class="text-primary">.</span>
    </h2>

    <div :class="size" class="text-pretty font-light">
      <slot />
    </div>
  </Motion>
</template>
