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
        class="group relative flex items-start gap-4 cursor-pointer"
        data-animate
        :aria-label="`Open ${work.name}`"
        :style="{ '--stagger': index }"
      >
        <NuxtImg
          v-if="work.logo"
          width="80"
          height="80"
          class="size-20 shrink-0 object-contain saturate-0 transition duration-300 group-hover:saturate-100"
          :src="work.logo"
          :alt="`${work.name} logo`"
        />
        <div
          v-else
          class="flex size-20 shrink-0 items-center justify-center border border-(--ui-border) font-display text-4xl text-muted transition-colors group-hover:border-primary group-hover:text-primary"
          aria-hidden="true"
        >
          {{ work.name.charAt(0) }}
        </div>

        <div class="flex flex-1 flex-col min-w-0">
          <div class="flex items-baseline justify-between gap-2">
            <h3 class="font-display text-3xl decoration-primary truncate group-hover:underline">
              {{ work.name }}<span class="text-primary">.</span>
            </h3>
            <div class="flex items-center gap-1.5 shrink-0">
              <span v-if="work.release" class="font-mono text-xs text-muted">
                {{ work.release }}
              </span>
              <UIcon
                name="lucide:arrow-up-right"
                class="size-4 text-muted opacity-0 transition-opacity group-hover:opacity-100"
              />
            </div>
          </div>
          <span class="text-[--ui-text-muted] font-extralight text-sm sm:text-base line-clamp-2">
            {{ work.description }}
          </span>
          <ul v-if="work.tech?.length" class="mt-2 flex flex-wrap gap-1">
            <li
              v-for="t in work.tech"
              :key="t"
              class="border border-(--ui-border) px-1.5 py-0.5 font-mono text-[10px] text-muted"
            >
              {{ t }}
            </li>
          </ul>
        </div>
      </NuxtLink>
    </div>

    <p v-if="!works?.length" class="font-mono text-sm text-muted">
      Nothing here yet.
    </p>
  </div>
</template>
