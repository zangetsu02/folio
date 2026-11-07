<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <!-- L'h1 delle pagine senza hero: chi arriva da un link deve sapere dove e'. -->
  <div class="flex flex-col gap-3" data-animate style="--stagger: 0">
    <h1 class="font-display text-3xl tracking-tight sm:text-5xl">
      {{ title }}<span class="text-primary">.</span>
    </h1>
    <p class="measure my-0 text-pretty text-sm font-light text-muted sm:text-base">
      <slot mdc-unwrap="p" />
    </p>
  </div>
</template>
