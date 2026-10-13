<script setup lang="ts">
const { profile, global } = useAppConfig()
</script>

<template>
  <div class="flex flex-col gap-4" data-animate style="--stagger: 1">
    <div class="flex items-center gap-3">
      <NuxtImg
        v-if="profile.pictureDark && profile.pictureLight"
        :src="profile.pictureLight"
        alt="Christian Palladini"
        width="80"
        height="80"
        sizes="160"
        format="webp"
        class="size-20 rounded-full object-cover sm:size-24"
      />
      <div class="flex flex-col">
        <h1 class="font-display text-4xl tracking-tight sm:text-5xl">
          <slot name="title" mdc-unwrap="p" />
        </h1>
        <div class="*:mb-0 *:text-primary">
          <slot name="job" mdc-unwrap="p" />
        </div>
      </div>
    </div>
    <p class="max-w-[600px] text-pretty text-muted text-sm font-extralight sm:text-base">
      <slot mdc-unwrap="p" />
    </p>
    <p class="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-muted">
      <span class="inline-block size-1.5 shrink-0 bg-primary" aria-hidden="true" />
      <span>Java &amp; Spring and Angular at work</span>
      <span class="text-(--ui-border)">/</span>
      <span>Vue and Nuxt by choice</span>
      <span class="text-(--ui-border)">/</span>
      <span>learning Rust</span>
    </p>
    <div class="mt-2 flex flex-wrap gap-3">
      <UButton
        to="/contact"
        size="lg"
      >
        Send me a message
      </UButton>
      <UButton
        :to="global.meetingLink"
        color="secondary"
        size="lg"
      >
        Make a call
      </UButton>
    </div>
  </div>
</template>
