<script setup lang="ts">
import type { WorksExperienceCollectionItem } from '@nuxt/content'

const { data: works, error } = await useAsyncData(`works-experience`, () => {
  return queryCollection('worksExperience')
    .all()
})
if (error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Works experience not found',
    fatal: true,
  })
}

function periodLabel(work: WorksExperienceCollectionItem) {
  const start = `${work.start.month} ${work.start.year}`
  const end = work.isCurrent
    ? 'Present'
    : work.end
      ? `${work.end.month} ${work.end.year}`
      : ''
  return end ? `${start} — ${end}` : start
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <div
      v-for="(work, index) in works"
      :key="work.name"
      data-animate
      :style="{ '--stagger': index }"
      class="flex flex-col gap-3 sm:flex-row sm:gap-6"
    >
      <div class="font-mono text-xs text-muted sm:w-36 sm:shrink-0 sm:pt-1">
        {{ periodLabel(work) }}
      </div>

      <div class="flex flex-col gap-2 flex-1">
        <h3 class="text-base font-medium">
          {{ work.role }}
          <span class="text-muted font-extralight">— {{ work.name }}</span>
        </h3>

        <ul v-if="work.summary?.length" class="list-disc space-y-1 pl-5 text-sm font-extralight text-muted">
          <li v-for="(item, idx) in work.summary" :key="idx">
            {{ item }}
          </li>
        </ul>

        <ul v-if="work.tech?.length" class="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs font-mono text-muted">
          <li v-for="(t, idx) in work.tech" :key="idx">
            {{ t }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
