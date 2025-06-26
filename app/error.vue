<template>
  <UApp class="relative flex h-screen flex-col items-center justify-center">
    <Spotlight />
    <div class="size-full flex flex-col items-center justify-center">
      <h1 class="text-center text-7xl">
        404
      </h1>
      <p class="text-center">
        I think you're lost, let's go back
        <ProseA to="/" class="link">
          home
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
