<script setup lang="ts">
import { LOCALES } from '~/utils/locales'

const { profile } = useAppConfig()
const route = useRoute()

const { t, locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const localePath = useLocalePath()
const other = computed(() => LOCALES.find(code => code !== locale.value) ?? locale.value)

// localePath e non il path nudo: NuxtLink non aggiunge il prefisso di lingua,
// e chi legge in inglese finirebbe sulle pagine italiane.
const nav = computed(() => [
  { label: t('nav.works'), to: localePath('/works') },
  { label: t('nav.resume'), to: localePath('/resume') },
])

function isActive(to: string) {
  return route.path === to || route.path.startsWith(`${to}/`)
}
</script>

<template>
  <!-- Testata e non barra: scorre via col contenuto, come il frontespizio di
       un documento. -->
  <header class="mb-14 flex flex-col gap-6 print:hidden">
    <div>
      <NuxtLink
        :to="localePath('/')"
        class="font-display text-2xl leading-none tracking-tight transition-colors hover:text-primary sm:text-3xl"
      >
        christian&thinsp;/&thinsp;zangetsu
      </NuxtLink>
      <!-- my-0: la regola globale `p { my-5 }` staccherebbe il sottotitolo dal nome. -->
      <p class="my-0 mt-1.5 text-sm text-muted">
        {{ profile.workTitle }} · {{ t('masthead.city') }}
      </p>
    </div>

    <div class="flex items-baseline justify-between gap-6 border-t border-(--ui-border) pt-3">
      <nav class="flex flex-wrap items-baseline gap-x-6 gap-y-2 font-mono text-xs">
        <NuxtLink
          v-for="(item, index) in nav"
          :key="item.to"
          :to="item.to"
          class="transition-colors hover:text-primary"
          :class="isActive(item.to) ? 'text-highlighted' : 'text-muted'"
        >
          <span class="opacity-55">{{ String(index + 1).padStart(2, '0') }}</span>
          {{ item.label }}
        </NuxtLink>
      </nav>

      <!-- Un link vero e non un bottone: il crawler lo segue, e la pagina
           nell'altra lingua resta condivisibile. -->
      <NuxtLink
        :to="switchLocalePath(other)"
        data-locale-switch
        class="font-mono text-xs text-muted transition-colors hover:text-primary"
      >
        {{ t('locale.switch') }}
      </NuxtLink>
      <ThemeSelector />
    </div>
  </header>
</template>
