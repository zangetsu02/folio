<script setup lang="ts">
import type { Collections } from '@nuxt/content'

defineProps<{
  posts: Collections['writing'][]
}>()
</script>

<template>
  <div class="mt-6 flex flex-col gap-6">
    <NuxtLink
      v-for="(post, index) in posts"
      :key="post.title"
      :to="post.path"
      class="group relative flex flex-col gap-1 max-w-prose"
      data-animate
      :style="{ '--stagger': index }"
      :aria-label="`Read ${post.title}`"
    >
      <span class="font-mono text-xs text-muted">
        {{ new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' }) }}
      </span>
      <h3 class="font-display text-3xl decoration-primary group-hover:underline">
        {{ post.title }}<span class="text-primary">.</span>
      </h3>
      <p class="text-sm font-extralight text-muted line-clamp-2">
        {{ post.description }}
      </p>
    </NuxtLink>
  </div>
</template>
