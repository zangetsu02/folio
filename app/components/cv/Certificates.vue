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
  <ul class="flex flex-col gap-3">
    <li
      v-for="(item, index) in certificates"
      :key="item.name"
      data-animate
      :style="{ '--stagger': index }"
      class="flex flex-col gap-1 sm:flex-row sm:gap-6 sm:items-baseline"
    >
      <span class="font-mono text-xs text-muted sm:w-36 sm:shrink-0">
        {{ item.date }}
      </span>
      <div class="flex flex-1 flex-col">
        <NuxtLink
          :to="item.url"
          target="_blank"
          class="text-sm decoration-primary hover:underline"
        >
          {{ item.name }}
        </NuxtLink>
        <span class="text-xs font-extralight text-muted">{{ item.issuer }}</span>
      </div>
    </li>
  </ul>
</template>
