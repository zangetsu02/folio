<script setup lang="ts">
const { profile, socials, seo } = useAppConfig()
</script>

<template>
  <aside class="flex flex-col gap-6 md:sticky md:top-8">
    <NuxtImg
      v-if="profile.linkedinPicture"
      :src="profile.linkedinPicture"
      alt="Christian Palladini"
      width="240"
      height="240"
      sizes="240"
      format="webp"
      class="self-center size-44 sm:size-52 object-cover border border-(--ui-border) grayscale hover:grayscale-0 transition-all duration-500"
    />

    <div class="flex flex-col gap-0.5">
      <h3 class="text-2xl font-medium leading-tight">
        {{ profile.name }}
      </h3>
      <span class="text-muted text-base leading-tight">
        {{ profile.workTitle }}
      </span>
    </div>

    <div class="flex flex-col gap-2 text-sm">
      <div class="flex items-center gap-2 text-muted">
        <Icon name="lucide:map-pin" class="size-4 shrink-0" />
        <span>Rome, Latium, Italy</span>
      </div>
      <NuxtLink
        :to="`mailto:${profile.email}`"
        external
        class="flex items-center gap-2 text-muted hover:text-primary transition-colors"
      >
        <Icon name="lucide:mail" class="size-4 shrink-0" />
        <span class="truncate">{{ profile.email }}</span>
      </NuxtLink>
      <NuxtLink
        to="/resume.pdf"
        external
        target="_blank"
        class="web-only flex items-center gap-2 text-muted hover:text-primary transition-colors"
      >
        <Icon name="lucide:file-down" class="size-4 shrink-0" />
        <span>Download PDF</span>
      </NuxtLink>
      <NuxtLink
        :to="seo.url"
        external
        target="_blank"
        class="pdf-only flex items-center gap-2 text-muted hover:text-primary transition-colors"
      >
        <Icon name="lucide:globe" class="size-4 shrink-0" />
        <span class="truncate">{{ seo.url.replace(/^https?:\/\//, '') }}</span>
      </NuxtLink>
    </div>

    <div class="flex items-center gap-3 pt-2 border-t border-(--ui-border) text-muted">
      <NuxtLink
        :to="socials.twitter"
        external
        target="_blank"
        rel="noopener noreferrer"
        aria-label="X / Twitter"
        class="hover:text-primary transition-colors"
      >
        <Icon name="simple-icons:x" class="size-4" />
      </NuxtLink>

      <NuxtLink
        :to="socials.linkedin"
        external
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
        class="hover:text-primary transition-colors"
      >
        <Icon name="simple-icons:linkedin" class="size-4" />
      </NuxtLink>

      <NuxtLink
        :to="socials.github"
        external
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
        class="hover:text-primary transition-colors"
      >
        <Icon name="simple-icons:github" class="size-4" />
      </NuxtLink>
    </div>
  </aside>
</template>
