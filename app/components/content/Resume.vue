<script setup lang="ts">
import { CvCertificates } from '#components'
</script>

<template>
  <div class="grid grid-cols-6 grid-rows-1 gap-1">
    <div class="col-span-2">
      <CvInfo />
    </div>

    <div class="col-span-4 col-start-3">
      <div class="flex flex-col gap-8">
        <section-item :number="1" title="About" size="max-w-full">
          Software Engineer specializing in designing and developing scalable web applications and enterprise systems.
          Adept at combining modern frontend ecosystems (Nuxt 3, Vue 3, Tailwind CSS) with solid backend architectures (Java, Spring Boot, Hexagonal/DDD).
          Experienced in modernizing complex legacy platforms through microservices, domain modeling, and clean architecture practices.
          Committed to crafting solutions that are user-focused, maintainable, and aligned with long-term business goals.
        </section-item>

        <section-item :number="2" title="Work Experience" size="max-w-full">
          <CvWorkExperience />
        </section-item>

        <section-item :number="3" title="Certificates" size="max-w-full">
          <CvCertificates />
        </section-item>

        <section-item :number="4" title="Languages" size="max-w-full">
          <b class="font-bold">Italian</b> (Native speaker)
          <b class="font-bold">English</b> (B2)
        </section-item>
      </div>
    </div>
  </div>
</template>
