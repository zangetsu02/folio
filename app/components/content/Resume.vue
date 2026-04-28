<template>
  <div class="cv grid grid-cols-1 gap-8 md:gap-12 md:grid-cols-6">
    <div class="col-span-1 md:col-span-2">
      <CvInfo />
    </div>

    <div class="col-span-1 md:col-span-4 md:col-start-3">
      <div class="flex flex-col gap-12">
        <SectionItem
          :number="1"
          title="About"
          size="max-w-full"
          size-title="text-xl md:text-2xl"
          number-size="text-2xl sm:text-3xl md:text-4xl"
        >
          <p class="leading-relaxed">
            Software Engineer specializing in designing and developing scalable web applications and enterprise systems.
            Adept at combining modern frontend ecosystems with solid backend architectures.
            Experienced in modernizing complex legacy platforms through microservices, domain modeling, and clean architecture practices.
            Committed to crafting solutions that are user-focused, maintainable, and aligned with long-term business goals.
          </p>
        </SectionItem>

        <SectionItem
          :number="2"
          title="Work Experience"
          size="max-w-full"
          size-title="text-xl md:text-2xl"
          number-size="text-2xl sm:text-3xl md:text-4xl"
        >
          <CvWorkExperience />
        </SectionItem>

        <SectionItem
          :number="3"
          title="Certificates"
          size="max-w-full"
          size-title="text-xl md:text-2xl"
          number-size="text-2xl sm:text-3xl md:text-4xl"
        >
          <CvCertificates />
        </SectionItem>

        <SectionItem
          :number="4"
          title="Languages"
          size="max-w-full"
          size-title="text-xl md:text-2xl"
          number-size="text-2xl sm:text-3xl md:text-4xl"
        >
          <ul class="flex flex-col divide-y divide-(--ui-border) border-t border-b border-(--ui-border)">
            <li class="flex items-center justify-between py-3 text-sm">
              <span class="text-highlighted font-medium">Italian</span>
              <span class="text-xs font-mono text-muted">Native speaker</span>
            </li>
            <li class="flex items-center justify-between py-3 text-sm">
              <span class="text-highlighted font-medium">English</span>
              <span class="text-xs font-mono text-muted">B2 · Upper-Intermediate</span>
            </li>
          </ul>
        </SectionItem>
      </div>
    </div>
  </div>
</template>
