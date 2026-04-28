<script setup lang="ts">
const { data: certificates, error } = await useAsyncData(`certificates`, () => {
  return queryCollection('certificates')
    .all()
})
if (error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Certificates not found',
    fatal: true,
  })
}
</script>

<template>
  <ul class="flex flex-col divide-y divide-(--ui-border) border-t border-b border-(--ui-border)">
    <li
      v-for="item in certificates"
      :key="item.name"
    >
      <NuxtLink
        :to="item.url"
        target="_blank"
        rel="noopener noreferrer"
        class="group flex items-center gap-3 py-3 text-muted hover:text-primary transition-colors"
      >
        <div class="flex flex-1 flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span class="text-sm text-highlighted group-hover:underline">
            {{ item.name }}
          </span>
          <span class="text-xs">·</span>
          <span class="text-xs">{{ item.issuer }}</span>
        </div>
        <span class="text-xs font-mono whitespace-nowrap">{{ item.date }}</span>
        <Icon name="lucide:arrow-up-right" class="size-4 opacity-50 group-hover:opacity-100 transition-opacity" />
      </NuxtLink>
    </li>
  </ul>
</template>
