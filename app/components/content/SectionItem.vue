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

// Ancora per i redirect dalle rotte assorbite nella home.
const slug = computed(() =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
</script>

<template>
  <Motion layout class="flex flex-col gap-2" data-animate :style="{ '--stagger': number, '--delay': `${number * 0.05}s` }">
    <!-- `section-mark` e' l'appiglio con cui print.css toglie la decorazione:
         agganciarla alle utility l'ha gia' fatta smettere di combaciare una volta. -->
    <div class="section-mark mb-3 flex items-center gap-4">
      <ThornRule class="flex-1 text-(--ui-border)" />
      <!-- 22%: sotto, il numerale ha lo stesso peso dei punti del fondo e sparisce. -->
      <span :class="numberSize" class="font-mono leading-none opacity-[22%]" aria-hidden="true">
        {{ number }}
      </span>
    </div>

    <h2 :id="slug" class="w-fit scroll-mt-24" :class="sizeTitle">
      {{ title }}<span class="text-primary">.</span>
    </h2>

    <div :class="size" class="text-pretty font-light">
      <slot />
    </div>
  </Motion>
</template>
