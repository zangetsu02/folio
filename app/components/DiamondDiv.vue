<script setup lang="ts">
const {
  as = 'div',
  top = true,
  bottom = true,
} = defineProps<{
  as?: string
  top?: boolean
  bottom?: boolean
}>()
</script>

<template>
  <component :is="as" class="relative -mb-px -ml-px border border-default p-4" v-bind="$attrs">
    <template v-if="top">
      <span class="diamond right-[-4.5px] bottom-[-4.5px]" />
      <span class="diamond left-[-4.5px] bottom-[-4.5px]" />
    </template>

    <template v-if="bottom">
      <span class="diamond right-[-4.5px] top-[-4.5px]" />
      <span class="diamond left-[-4.5px] top-[-4.5px]" />
    </template>

    <div class="relative z-10 flex h-full flex-col justify-center">
      <slot />
    </div>
  </component>
</template>

<style scoped>
@reference "../assets/css/main.css";

.diamond {
  @apply absolute size-2 rotate-45 rounded-[1px] border border-blue-200 dark:border-blue-300/25 bg-white dark:bg-black ;
}
</style>
