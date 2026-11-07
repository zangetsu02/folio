<script setup lang="ts">
import { LayoutGroup } from 'motion-v'

import { resumePdf } from '~/utils/locales'

const route = useRoute()
const { socials } = useAppConfig()
const { t, locale } = useI18n()
</script>

<template>
  <UApp :tooltip="{ delayDuration: 0 }" class="relative">
    <a href="#content" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-(--ui-bg) focus:px-3 focus:py-2 font-mono text-xs">
      {{ t('a11y.skip') }}
    </a>
    <Backdrop />

    <main id="content" class="relative z-10 flex min-h-screen flex-col px-5 py-8 sm:px-10 sm:py-12 print:block print:p-0">
      <LayoutGroup id="main-layout">
        <Motion
          layout
          :transition="{
            type: 'tween',
            ease: 'easeInOut',
            duration: 0.2,
          }"
          class="mx-auto flex w-full max-w-[100rem] flex-1 flex-col"
        >
          <div class="mx-auto flex w-full min-w-0 max-w-[88ch] flex-1 flex-col print:max-w-none">
            <Masthead />

            <Motion layout class="flex-1">
              <slot />
            </Motion>

            <CopyLink v-if="route.path.includes('/writing/') && route.name !== 'writing'" />

            <footer class="mt-20 flex flex-col gap-5 border-t border-(--ui-border) pt-6 text-xs text-muted print:hidden">
              <div class="flex items-center gap-4 font-mono text-xs">
                <NuxtLink :to="socials.twitter" external target="_blank" rel="noopener noreferrer" class="hover:text-primary transition-colors">
                  X
                </NuxtLink>
                <NuxtLink :to="socials.github" external target="_blank" rel="noopener noreferrer" class="hover:text-primary transition-colors">
                  GitHub
                </NuxtLink>
                <NuxtLink :to="socials.linkedin" external target="_blank" rel="noopener noreferrer" class="hover:text-primary transition-colors">
                  LinkedIn
                </NuxtLink>
                <NuxtLink :to="socials.devnull" external target="_blank" rel="noopener noreferrer" class="hover:text-primary transition-colors">
                  /dev/null
                </NuxtLink>
                <NuxtLink v-if="route.path.endsWith('/resume')" :to="resumePdf(locale)" external target="_blank" class="hover:text-primary transition-colors">
                  {{ t('cv.download') }}
                </NuxtLink>
              </div>

              <div class="flex items-end justify-between gap-6">
                <p class="max-w-prose">
                  {{ t('footer.openSource') }}
                  <NuxtLink to="https://github.com/zangetsu02/folio" class="underline hover:text-primary transition-colors">
                    GitHub
                  </NuxtLink>
                </p>
                <Sigil class="shrink-0 text-muted" :size="40" />
              </div>
            </footer>
          </div>
        </Motion>
      </LayoutGroup>
    </main>
  </UApp>
</template>
