<script setup lang="ts">
const { global } = useAppConfig()
</script>

<template>
  <div class="flex flex-col gap-6" data-animate style="--stagger: 1">
    <h1 class="font-display max-w-[20ch] text-pretty text-3xl leading-[1.14] tracking-tight sm:text-5xl">
      <slot name="title" mdc-unwrap="p" />
    </h1>

    <p class="max-w-[58ch] text-pretty text-sm font-light text-muted sm:text-base">
      <slot mdc-unwrap="p" />
    </p>

    <div class="mt-1 flex flex-wrap gap-3">
      <UButton to="/#let-s-talk" size="lg">
        Send me a message
      </UButton>
      <UButton :to="global.meetingLink" color="secondary" size="lg">
        Make a call
      </UButton>
    </div>
  </div>
</template>
