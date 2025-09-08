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
  <div>
    <div
      v-for="work in works"
      :key="work.name"
      class="group relative flex items-center gap-2"
    >
      <div class="flex flex-col">
        <h3>
          {{ work.name }} - <span class="text-muted">{{ work.role }}</span>
        </h3>
        <span class="text-muted  sm:text-base">
          {{ periodLabel(work) }}
        </span>

        <ul v-if="work.summary?.length" class="mt-3 list-disc space-y-1 pl-5">
          <li v-for="(item, idx) in work.summary" :key="idx">
            {{ item }}
          </li>
        </ul>

        <h3 class="font-bold mt-3 ">
          Used Technologies:
        </h3>
        <ul v-if="work.tech?.length" class="mt-3 list-disc space-y-1 pl-5">
          <li
            v-for="(t, idx) in work.tech"
            :key="idx"
          >
            {{ t }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
