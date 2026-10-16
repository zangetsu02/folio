<script setup lang="ts">
const { global, profile } = useAppConfig()
const colorMode = useColorMode()

const picture = computed(() =>
  colorMode.value === 'dark' ? profile.pictureDark : profile.pictureLight)
</script>

<template>
  <!-- La tavola sta di fianco al titolo, che e' su misura corta: riempie
       spazio gia' vuoto invece di aggiungerne sopra la tesi. -->
  <div class="flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-10" data-animate style="--stagger: 1">
    <div class="flex min-w-0 flex-1 flex-col gap-6">
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

    <Portrait :src="picture" :width="300" class="shrink-0" />
  </div>
</template>
