<script setup lang="ts">
import type { Locale } from '~/utils/locales'

const route = useRoute()
const { locale } = useI18n()

// Lo slug non porta il prefisso di lingua: e' gia' il path nella collection
// della lingua corrente.
const contentPath = computed(() => `/${([] as string[]).concat(route.params.slug ?? []).join('/')}`)

const { data: page } = await useAsyncData(() => `${locale.value}:${contentPath.value}`, () =>
  queryCollection(`content_${locale.value}` as `content_${Locale}`).path(contentPath.value).first())

if (!page.value)
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })

const { seo, socials, profile } = useAppConfig()
const mdcVars = ref({ ...seo, ...profile, ...socials, date: page.value?.date })

const isWriting = computed(() => route.path.includes('/writing/') || route.path.includes('/notes/'))

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
  </div>
</template>
