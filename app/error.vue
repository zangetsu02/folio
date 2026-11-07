<script setup lang="ts">
import type { NuxtError } from '#app'

const { error } = defineProps<{ error: NuxtError }>()

const { t } = useI18n()
const localePath = useLocalePath()
const notFound = computed(() => error.statusCode === 404)
</script>

<template>
  <UApp class="relative">
    <Backdrop />

    <main class="relative z-10 grid min-h-screen place-items-center px-5">
      <div class="flex flex-col items-center gap-2 text-center">
        <h1 class="font-display text-7xl">
          {{ error.statusCode }}<span class="text-primary">.</span>
        </h1>
        <p>
          {{ notFound ? t('error.lost') : t('error.generic') }}
          <ProseA :to="localePath('/')" class="link">
            {{ t('error.home') }}
          </ProseA>.
        </p>
      </div>
    </main>
  </UApp>
</template>
