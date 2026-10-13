<script setup lang="ts">
import { LayoutGroup } from 'motion-v'

const route = useRoute()
</script>

<template>
  <UApp :tooltip="{ delayDuration: 0 }" class="relative">
    <Spotlight class="print:hidden" />
    <main class="flex min-h-screen flex-col p-3 sm:p-12 print:block print:p-0">
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
          <CrossedDiv class="p-4 sm:p-6 print:border-0 print:p-0">
            <!-- Binario fisso a sinistra, contenuto a destra: a schermo largo
                 il testo prima stava in ~600px dentro una cornice da 1280px e
                 la meta' destra restava vuota. -->
            <div class="flex flex-1 flex-col gap-8 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-10 print:block">
              <Rail />

              <div class="flex min-w-0 flex-col">
                <Motion layout class="flex-1">
                  <slot />
                </Motion>

                <CopyLink v-if="route.path.includes('/writing/') && route.name !== 'writing'" />
              </div>
            </div>
          </CrossedDiv>
        </Motion>
      </LayoutGroup>

      <span class="mt-2 text-xs text-center text-muted print:hidden">
        This website is fully open-source, you can find the source code on <NuxtLink to="https://github.com/zangetsu02/folio" class="underline">GitHub</NuxtLink>
      </span>
    </main>
  </UApp>
</template>
