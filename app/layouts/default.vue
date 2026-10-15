<script setup lang="ts">
import { LayoutGroup } from 'motion-v'

const route = useRoute()
</script>

<template>
  <UApp :tooltip="{ delayDuration: 0 }" class="relative">
    <Backdrop />

    <!-- Niente cornice: la scatola stringeva il contenuto due volte, col proprio
         padding sopra a quello della pagina, e con il binario a sinistra la
         colonna di testo restava troppo stretta. -->
    <main class="relative z-10 flex min-h-screen flex-col px-5 py-8 sm:px-10 sm:py-12 print:block print:p-0">
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
          <div class="flex flex-1 flex-col gap-8 print:block">
            <Rail />

            <div class="mx-auto flex w-full min-w-0 max-w-[88ch] flex-col print:max-w-none">
              <Motion layout class="flex-1">
                <slot />
              </Motion>

              <CopyLink v-if="route.path.includes('/writing/') && route.name !== 'writing'" />

              <footer class="mt-20 border-t border-(--ui-border) pt-6 text-xs text-muted print:hidden">
                This website is fully open-source, you can find the source code on
                <NuxtLink to="https://github.com/zangetsu02/folio" class="underline hover:text-primary transition-colors">
                  GitHub
                </NuxtLink>
              </footer>
            </div>
          </div>
        </Motion>
      </LayoutGroup>
    </main>
  </UApp>
</template>
