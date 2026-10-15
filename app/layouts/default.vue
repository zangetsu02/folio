<script setup lang="ts">
import { LayoutGroup } from 'motion-v'

const route = useRoute()
const { socials } = useAppConfig()
</script>

<template>
  <UApp :tooltip="{ delayDuration: 0 }" class="relative">
    <Backdrop />

    <!-- Fuori da <main>: lo sticky si aggancia alla viewport, e il padding
         orizzontale e la larghezza interna replicano quelli del contenuto,
         cosi' la fascia e la colonna sono allineate. -->
    <Masthead class="relative" />

    <!-- Niente cornice: la scatola stringeva il contenuto due volte, col proprio
         padding sopra a quello della pagina. -->
    <main class="relative z-10 flex min-h-screen flex-col px-5 pb-8 pt-10 sm:px-10 sm:pb-12 print:block print:p-0">
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
            <Motion layout class="flex-1">
              <slot />
            </Motion>

            <CopyLink v-if="route.path.includes('/writing/') && route.name !== 'writing'" />

            <!-- Social e sigillo stavano nel binario: senza di lui finiscono qui,
                 invece che in una fascia di navigazione dove non c'entrano. -->
            <footer class="mt-20 flex flex-col gap-5 border-t border-(--ui-border) pt-6 text-xs text-muted print:hidden">
              <div class="flex items-center gap-4 font-mono text-[10.5px]">
                <NuxtLink :to="socials.twitter" external target="_blank" rel="noopener noreferrer" class="hover:text-primary transition-colors">
                  X
                </NuxtLink>
                <NuxtLink :to="socials.github" external target="_blank" rel="noopener noreferrer" class="hover:text-primary transition-colors">
                  GitHub
                </NuxtLink>
                <NuxtLink :to="socials.linkedin" external target="_blank" rel="noopener noreferrer" class="hover:text-primary transition-colors">
                  LinkedIn
                </NuxtLink>
                <NuxtLink v-if="route.path === '/resume'" to="/resume.pdf" external target="_blank" class="hover:text-primary transition-colors">
                  Download PDF
                </NuxtLink>
              </div>

              <div class="flex items-end justify-between gap-6">
                <p class="max-w-prose">
                  This website is fully open-source, you can find the source code on
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
