<script setup lang="ts">
defineProps<{
  year: string
  title: string
}>()
</script>

<template>
  <article class="group relative border-l border-(--ui-border) pl-5 pb-8 transition-colors last:pb-0 hover:border-primary">
    <span class="absolute -left-1.5 top-1.5 size-3 border border-(--ui-border) bg-(--ui-bg) transition-colors group-hover:border-primary group-hover:bg-primary" />
    <header class="flex flex-col gap-1">
      <span class="font-mono text-xs text-muted">{{ year }}</span>
      <h3 class="font-display text-xl text-highlighted">
        {{ title }}
      </h3>
    </header>
    <!-- measure qui e non sulla sezione: il corpo e' text-sm, e 88ch
         calcolati sul font del genitore diventano 98 caratteri a 14px. -->
    <div class="measure mt-2 text-sm leading-relaxed text-muted *:my-0">
      <slot />
    </div>
  </article>
</template>
