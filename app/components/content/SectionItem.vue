<script setup lang="ts">
interface SectionItemProps {
  title: string
  /** Ancora stabile fra le lingue: i link e i redirect puntano qui, non al titolo. */
  id?: string
  number: number
  size?: string
  sizeTitle?: string
  numberSize?: string
}

const {
  title,
  id,
  size = 'measure',
  sizeTitle = 'font-display text-3xl sm:text-4xl',
  numberSize = 'text-5xl sm:text-6xl',
} = defineProps<SectionItemProps>()
</script>

<template>
  <Motion layout class="flex flex-col gap-2" data-animate :style="{ '--stagger': number, '--delay': `${number * 0.05}s` }">
    <!-- `section-mark` e' l'appiglio con cui print.css toglie la decorazione:
         agganciarla alle utility l'ha gia' fatta smettere di combaciare una volta. -->
    <div class="section-mark mb-3 flex items-center gap-4">
      <ThornRule class="flex-1 text-(--ui-border)" />
      <!-- Il fondo stampa a 24/255, cioe' il 9.4%: sotto quella soglia il numerale sparisce dentro il retino. -->
      <span :class="numberSize" class="font-mono leading-none opacity-[22%]" aria-hidden="true">
        {{ number }}
      </span>
    </div>

    <h2 :id class="w-fit" :class="sizeTitle">
      {{ title }}<span class="text-primary">.</span>
    </h2>

    <div :class="size" class="text-pretty font-light">
      <slot />
    </div>
  </Motion>
</template>
