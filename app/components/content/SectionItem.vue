<script setup lang="ts">
interface SectionItemProps {
  title: string
  number: number
  size?: string
  sizeTitle?: string
  numberSize?: string
}

const {
  size = 'max-w-[600px]',
  sizeTitle = 'font-display text-3xl sm:text-4xl',
  numberSize = 'text-5xl sm:text-6xl',
} = defineProps<SectionItemProps>()
</script>

<template>
  <Motion layout class="flex flex-col gap-2" data-animate :style="{ '--stagger': number, '--delay': `${number * 0.05}s` }">
    <h2 class="relative w-fit" :class="sizeTitle">
      {{ title }}<span class="text-primary">.</span>
      <span :class="numberSize" class="absolute font-mono -bottom-0.5 -right-10 opacity-[9%] ">
        {{ number }}
      </span>
    </h2>
    <div :class="size" class="text-pretty font-light">
      <slot />
    </div>
  </Motion>
</template>
