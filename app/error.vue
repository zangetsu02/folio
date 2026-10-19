<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <UApp class="relative flex h-screen flex-col items-center justify-center">
    <Backdrop />

    <div class="relative z-10 size-full flex flex-col items-center justify-center">
      <h1 class="text-center text-7xl">
        404
      </h1>
      <p class="text-center">
        {{ t('error.lost') }}
        <ProseA :to="localePath('/')" class="link">
          {{ t('error.home') }}
        </ProseA>.
      </p>
    </div>
  </UApp>
</template>

<style>
html, body, #__nuxt, #__layout {
  height: 100%;
}
</style>
