<script setup lang="ts">
const { profile, socials } = useAppConfig()
</script>

<template>
  <div class="flex flex-col items-center gap-2 mb-2">
    <NuxtImg
      v-if="profile.linkedinPicture"
      :src="profile.linkedinPicture"
      alt="Christian Palladini"
      width="120"
      height="120"
      sizes="200"
      format="webp"
      class="mb-2 size-52  object-cover"
    />
  </div>

  <div class="flex flex-col items-center">
    <h3 class="text-2xl">
      {{ profile.name }}
    </h3>
    <div class="text-pretty text-muted text-lg">
      {{ profile.workTitle }}
    </div>

    <div class="mt-4 text-pretty text-muted text-sm font-extralight sm:text-base">
      Rome, Latium, Italy
    </div>
    <div class="mt-2 text-primary text-sm link">
      <NuxtLink external>
        {{ profile.email }}
      </NuxtLink>
    </div>

    <div class="mt-4 flex items-center gap-4 text-muted">
      <NuxtLink
        :to="socials.twitter"
        external
        target="_blank"
        rel="noopener noreferrer"
        class="hover:text-primary transition-colors"
      >
        <Icon name="simple-icons:x" class="size-5" />
      </NuxtLink>

      <NuxtLink
        :to="socials.linkedin"
        external
        target="_blank"
        rel="noopener noreferrer"
        class="hover:text-primary transition-colors"
      >
        <Icon name="simple-icons:linkedin" class="size-5" />
      </NuxtLink>

      <NuxtLink
        :to="socials.github"
        external
        target="_blank"
        rel="noopener noreferrer"
        class="hover:text-primary transition-colors"
      >
        <Icon name="simple-icons:github" class="size-5" />
      </NuxtLink>
    </div>
  </div>
</template>
