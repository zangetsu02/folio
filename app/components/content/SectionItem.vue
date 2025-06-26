<script setup lang="ts">
interface SectionItemProps {
  title: string
  number: number
  size?: string
}

const { size = 'max-w-[600px]' } = defineProps<SectionItemProps>()
</script>

<template>
  <Motion layout class="flex flex-col gap-2" data-animate :style="{ '--stagger': number, '--delay': `${number * 0.05}s` }">
    <h2 class="relative w-fit text-2xl sm:text-3xl">
      {{ title }}<span class="text-primary">.</span>
      <span class="absolute font-mono -bottom-0.5 -right-10 text-5xl opacity-[9%] sm:text-6xl">
        {{ number }}
      </span>
    </h2>
    <div :class="size" class="text-pretty font-light">
      <slot />
    </div>
  </Motion>
</template>
