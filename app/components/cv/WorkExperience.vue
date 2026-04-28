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
    <article
      v-for="work in works"
      :key="work.name"
      class="group relative pl-5 border-l border-(--ui-border) hover:border-primary transition-colors"
    >
      <span class="absolute -left-1.5 top-1.5 size-3 bg-(--ui-bg) border border-(--ui-border) group-hover:border-primary group-hover:bg-primary transition-colors" />

      <header class="flex flex-col gap-1">
        <div class="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <h3 class="text-base font-medium text-highlighted">
            {{ work.role }}
          </h3>
          <span class="text-muted">·</span>
          <span class="text-base text-muted">{{ work.name }}</span>
        </div>

        <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-muted">
          <span>{{ periodLabel(work) }}</span>
          <span class="size-1 bg-(--ui-border)" />
          <span>{{ work.location }}</span>
          <span class="size-1 bg-(--ui-border)" />
          <span>{{ work.employmentType }}</span>
          <span
            v-if="work.isCurrent"
            class="px-1.5 py-0.5 bg-primary text-(--ui-bg) text-[10px] uppercase tracking-wider"
          >
            Current
          </span>
        </div>
      </header>

      <ul v-if="work.summary?.length" class="mt-4 list-disc space-y-1.5 pl-4 marker:text-muted text-sm leading-relaxed">
        <li v-for="(item, idx) in work.summary" :key="idx">
          {{ item }}
        </li>
      </ul>

      <div v-if="work.projects?.length" class="mt-4">
        <p class="mb-2 text-xs font-mono uppercase tracking-wider text-muted">
          Projects
        </p>
        <ul class="flex flex-col divide-y divide-(--ui-border) border-t border-b border-(--ui-border)">
          <li v-for="(project, idx) in work.projects" :key="idx" class="py-2.5 flex flex-col gap-1.5">
            <h4 class="text-sm font-medium text-highlighted">
              {{ project.name }}
            </h4>
            <p class="text-sm text-muted leading-relaxed">
              {{ project.description }}
            </p>
            <ul v-if="project.tech?.length" class="flex flex-wrap gap-1">
              <li
                v-for="(t, tIdx) in project.tech"
                :key="tIdx"
                class="px-1.5 py-0.5 border border-(--ui-border) text-[10px] font-mono text-muted"
              >
                {{ t }}
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </article>
  </div>
</template>
