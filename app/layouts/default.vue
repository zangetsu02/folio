<script setup lang="ts">
import { LayoutGroup } from 'motion-v'

const route = useRoute()
const router = useRouter()
</script>

<template>
  <UApp :tooltip="{ delayDuration: 0 }" class="relative">
    <!-- <div class="pointer-events-none absolute -top-56 z-40 size-44 rounded-full opacity-50 blur-[200px] dark:bg-white dark:blur-[200px] sm:size-72" /> -->
    <Spotlight />
    <main class="flex min-h-screen flex-col p-3 sm:p-12">
      <LayoutGroup id="main-layout">
        <Motion
          layout
          :transition="{
            type: 'tween',
            ease: 'easeInOut',
            duration: 0.2,
          }"
          class="flex size-full mx-auto max-w-7xl bg-grid-white flex-1 flex-col gap-3 "
        >
          <CrossedDiv class="p-4 sm:p-6">
            <div class="flex w-full min-h-3" :class="route.path !== '/' ? 'justify-between' : 'justify-end'">
              <NuxtLink v-if="route.path !== '/'" aria-label="Go back to home page" class="group cursor-pointer" to="/">
                <span class="hover:text-primary hover:underline">
                  go back<span class="text-primary">.</span>
                </span>
              </NuxtLink>
              <ThemeSelector />
            </div>
            <Motion layout class="flex-1">
              <slot />
            </Motion>

            <CopyLink v-if="route.path.includes('/writing/') && route.name !== 'writing'" />

            <Motion
              layout
              class="flex items-end justify-end"
              :class="route.path !== '/' ? 'cursor-pointer' : 'cursor-default'"
              @click="router.push('/')"
            />
          </CrossedDiv>
        </Motion>
      </LayoutGroup>

      <span class="mt-2 text-xs text-center text-muted">
        This website is fully open-source, you can find the source code on <NuxtLink to="https://github.com/zangetsu02/folio" class="underline">GitHub</NuxtLink>
      </span>
    </main>
  </UApp>
</template>
