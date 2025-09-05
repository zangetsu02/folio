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
  <ul class="mt-3 list-disc space-y-1 pl-5">
    <li
      v-for="item in certificates"
      :key="item.name"
    >
      <div class="flex flex-col">
        <NuxtLink :to="item.url" target="_blank" class="hover:underline">
          {{ item.name }}
        </NuxtLink>
      </div>
    </li>
  </ul>
</template>
