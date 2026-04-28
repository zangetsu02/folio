<script setup lang="ts">
const { profile, socials } = useAppConfig()
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <NuxtImg
      v-if="profile.linkedinPicture"
      :src="profile.linkedinPicture"
      alt="Christian Palladini"
      width="208"
      height="208"
      sizes="416"
      format="webp"
      class="size-44 saturate-0 object-cover"
    />

    <div class="flex flex-col items-center text-center">
      <h3 class="font-display text-3xl tracking-tight">
        {{ profile.name }}<span class="text-primary">.</span>
      </h3>
      <div class="text-muted">
        {{ profile.workTitle }}
      </div>
    </div>

    <div class="flex flex-col items-center gap-1 text-sm">
      <span class="font-extralight text-muted">Rome, Latium, Italy</span>
      <NuxtLink external :to="`mailto:${profile.email}`" class="link text-primary">
        {{ profile.email }}
      </NuxtLink>
    </div>

    <div class="flex items-center gap-4 text-muted">
      <NuxtLink
        :to="socials.twitter"
        external
        target="_blank"
        rel="noopener noreferrer"
        aria-label="X / Twitter"
        class="hover:text-primary transition-colors"
      >
        <Icon name="simple-icons:x" class="size-5" />
      </NuxtLink>

      <NuxtLink
        :to="socials.linkedin"
        external
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
        class="hover:text-primary transition-colors"
      >
        <Icon name="simple-icons:linkedin" class="size-5" />
      </NuxtLink>

      <NuxtLink
        :to="socials.github"
        external
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
        class="hover:text-primary transition-colors"
      >
        <Icon name="simple-icons:github" class="size-5" />
      </NuxtLink>
    </div>
  </div>
</template>
