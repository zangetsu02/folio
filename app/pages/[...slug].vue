<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('content').path(route.path).first())

if (!page.value)
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })

const { seo, socials, profile } = useAppConfig()
const mdcVars = ref({ ...seo, ...profile, ...socials, date: page.value?.date })

const isWriting = computed(() => route.path.includes('/writing/') || route.path.includes('/notes/') || route.path.includes('/playground/'))

const contentClasses = {
  writing: 'enter-content mb-4 mt-8',
  default: 'mb-4 mt-8 flex flex-1 flex-col justify-around gap-8 sm:gap-12',
}
</script>

<template>
  <div v-if="page">
    <FolioMeta :page :is-writing />
    <Toc v-if="isWriting" :links="page.body.toc?.links!" />
    <ContentRenderer :value="page" :class="isWriting ? contentClasses.writing : contentClasses.default" :data="mdcVars" />
    <!-- <Toaster position="top-center" close-button /> -->
  </div>
</template>
