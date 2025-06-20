<script setup lang="ts">
const { category } = defineProps<{
  category?: string
}>()

const { data: works, error } = await useAsyncData(`works-${category}`, () => {
  return queryCollection('works')
    .where('category', '=', category)
    .order('date', 'DESC')
    .all()
})
if (error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Works not found',
    fatal: true,
  })
}
</script>

<template>
  <div>
    <div class="mt-4 grid grid-cols-1 font-normal gap-8 sm:grid-cols-2">
      <NuxtLink
        v-for="(work, index) in works"
        :key="work.name"
        :to="work.url"
        target="_blank"
        class="group relative flex items-center gap-2 cursor-pointer"
        data-animate
        :aria-label="`Open ${work.name}`"
        :style="{ '--stagger': index }"
      >
        <NuxtImg
          width="80"
          height="80"
          class="saturate-0"
          src="/assets/works/dark-discord-theme-logo.png"
        />
        <div class="flex flex-col">
          <div class="absolute right-0 top-0 font-serif text-5xl italic opacity-15 sm:text-3xl">
            {{ work.release }}
          </div>
          <h3 class="font-serif italic text-2xl decoration-primary group-hover:underline">
            {{ work.name }}<span class="text-primary">.</span>
          </h3>
          <span class="text-[--ui-text-muted] font-extralight sm:text-base">
            {{ work.description }}
          </span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
