<script setup lang="ts">
import type { ContentCollectionItem } from '@nuxt/content'

const { page, isWriting } = defineProps<{
  page: ContentCollectionItem
  isWriting: boolean
}>()

const route = useRoute()
const { link, seo, profile } = useAppConfig()

function getPageSEO() {
  return {
    title: isWriting ? page?.title : page?.title || seo.title,
    description: isWriting ? page?.description : page?.description || seo.description,
  }
}

function getTitleTemplate(title: string | undefined) {
  if (route.path === '/')
    return title || `${seo.title} | Software engineer`
  if (isWriting)
    return title
  return `${title} | ${seo.title} - Software engineer`
}

const pageSEO = getPageSEO()

// nuxt-og-image e' disabilitato (nuxt.config.ts): generare le anteprime per
// pagina rompe il prerender della home. L'immagine va quindi dichiarata a mano,
// altrimenti ogni condivisione esce senza anteprima e twitterCard
// 'summary_large_image' mostra un riquadro vuoto.
const ogImageUrl = new URL(page.image ?? '/og/index.png', seo.url).href

useSeoMeta({
  ogSiteName: seo.title,
  ogType: isWriting ? 'article' : 'website',
  author: profile.name,
  title: pageSEO.title,
  description: pageSEO.description,
  twitterTitle: pageSEO.title,
  twitterDescription: pageSEO.description,
  twitterCard: 'summary_large_image',
  ogImage: ogImageUrl,
  twitterImage: ogImageUrl,
})

useHead({
  title: page.title,
  titleTemplate: getTitleTemplate,
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'charset', content: 'utf-8' },
    { name: 'robots', content: 'index, follow' },
    { name: 'color-scheme', content: 'light dark' },
  ],
  link,
})
</script>

<template>
  <slot />
</template>
