<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="cv grid grid-cols-1 gap-8 md:gap-12 md:grid-cols-6">
    <div class="col-span-1 md:col-span-2">
      <CvInfo />
    </div>

    <div class="col-span-1 md:col-span-4 md:col-start-3">
      <div class="flex flex-col gap-12">
        <SectionItem
          :number="1"
          :title="t('cv.about')"
          size="measure"
          size-title="text-xl md:text-2xl"
          number-size="text-2xl sm:text-3xl md:text-4xl"
        >
          <!-- Prosa d'autore: vive in content/{it,en}/resume.md, dove si rivede
               in un file di testo invece che dentro un JSON di messaggi. -->
          <slot />
        </SectionItem>

        <SectionItem
          :number="2"
          :title="t('cv.experience')"
          size="bleed"
          size-title="text-xl md:text-2xl"
          number-size="text-2xl sm:text-3xl md:text-4xl"
        >
          <CvWorkExperience />
        </SectionItem>

        <SectionItem
          :number="3"
          :title="t('cv.sideProjects')"
          size="bleed"
          size-title="text-xl md:text-2xl"
          number-size="text-2xl sm:text-3xl md:text-4xl"
        >
          <CvSideProjects />
        </SectionItem>

        <SectionItem
          :number="4"
          :title="t('cv.certificates')"
          size="bleed"
          size-title="text-xl md:text-2xl"
          number-size="text-2xl sm:text-3xl md:text-4xl"
        >
          <CvCertificates />
        </SectionItem>

        <SectionItem
          :number="5"
          :title="t('cv.languages')"
          size="bleed"
          size-title="text-xl md:text-2xl"
          number-size="text-2xl sm:text-3xl md:text-4xl"
        >
          <ul class="flex flex-col divide-y divide-(--ui-border) border-t border-b border-(--ui-border)">
            <li class="flex items-center justify-between py-3 text-sm">
              <span class="text-highlighted font-medium">{{ t('cv.italian') }}</span>
              <span class="text-xs font-mono text-muted">{{ t('cv.native') }}</span>
            </li>
            <li class="flex items-center justify-between py-3 text-sm">
              <span class="text-highlighted font-medium">{{ t('cv.english') }}</span>
              <span class="text-xs font-mono text-muted">{{ t('cv.b2') }}</span>
            </li>
          </ul>
        </SectionItem>
      </div>
    </div>
  </div>
</template>
