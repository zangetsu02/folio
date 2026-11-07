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
  <!-- Testata e non barra: una riga sola che scorre via col contenuto. Nome a
       sinistra, pagine e preferenze a destra. -->
  <header class="mb-14 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 sm:gap-x-8 border-b border-(--ui-border) pb-4 print:hidden">
    <NuxtLink
      :to="localePath('/')"
      class="font-display text-xl leading-none tracking-tight transition-colors hover:text-primary sm:text-2xl"
    >
      {{ profile.name }}
    </NuxtLink>

    <div class="flex items-center gap-x-4 text-sm sm:gap-x-6">
      <nav class="flex items-center gap-x-4 sm:gap-x-6">
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="-my-3 py-3 underline-offset-[6px] transition-colors hover:text-primary"
          :class="isActive(item.to) ? 'text-highlighted underline decoration-primary' : 'text-muted'"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <!-- Un link vero e non un bottone: il crawler lo segue, e la pagina
           nell'altra lingua resta condivisibile. -->
      <NuxtLink
        :to="switchLocalePath(other)"
        :hreflang="other"
        :aria-label="t('locale.switch')"
        data-locale-switch
        class="-my-3 py-3 font-mono text-xs uppercase text-muted transition-colors hover:text-primary"
      >
        {{ other }}
      </NuxtLink>
      <ThemeSelector />
    </div>
  </header>
</template>
