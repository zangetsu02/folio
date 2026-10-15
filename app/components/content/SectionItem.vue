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
    <div class="mb-3 flex items-center gap-4">
      <ThornRule class="flex-1 text-(--ui-border)" />
      <span :class="numberSize" class="font-mono leading-none opacity-[9%]" aria-hidden="true">
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
