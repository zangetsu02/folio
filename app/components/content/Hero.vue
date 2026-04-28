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
        class="size-16 rounded-full object-cover"
      />
      <div class="flex flex-col">
        <h3 class="font-display text-2xl tracking-tight">
          <slot name="title" mdc-unwrap="p" />
        </h3>
        <div class="*:mb-0 *:text-primary">
          <slot name="job" mdc-unwrap="p" />
        </div>
      </div>
    </div>
    <p class="max-w-[600px] text-pretty text-muted text-sm font-extralight sm:text-base">
      <slot mdc-unwrap="p" />
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
