<script setup lang="ts">
const { data: works, error } = await useAsyncData(`cv-side-projects`, () => {
  return queryCollection('works')
    .order('date', 'DESC')
    .all()
})
if (error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Side projects not found',
    fatal: true,
  })
}
</script>

<template>
  <ul class="flex flex-col divide-y divide-(--ui-border) border-t border-b border-(--ui-border)">
    <li v-for="item in works" :key="item.name + item.category">
      <NuxtLink
        :to="item.url"
        target="_blank"
        rel="noopener noreferrer"
        class="group flex flex-col gap-1 py-3 text-muted hover:text-primary transition-colors"
      >
        <div class="flex items-center gap-2">
          <span class="text-sm text-highlighted group-hover:underline">
            {{ item.name }}
          </span>
          <span class="px-1.5 py-0.5 border border-(--ui-border) text-[10px] font-mono uppercase tracking-wider">
            {{ item.category }}
          </span>
          <span class="ml-auto text-xs font-mono whitespace-nowrap">
            {{ item.release }}
          </span>
          <Icon name="lucide:arrow-up-right" class="size-4 opacity-50 group-hover:opacity-100 transition-opacity" />
        </div>
        <p class="text-sm text-muted leading-relaxed">
          {{ item.description }}
        </p>
      </NuxtLink>
    </li>
  </ul>
</template>
