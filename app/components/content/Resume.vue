<template>
  <div class="cv grid grid-cols-1 gap-3 md:grid-cols-6 md:grid-rows-1">
    <div class="col-span-1 md:col-span-2">
      <CvInfo />
    </div>

    <div class="col-span-1 md:col-span-4 md:col-start-3">
      <div class="flex flex-col gap-8">
        <section-item
          :number="1"
          title="About"
          size="max-w-full"
          size-title="text-xl md:text-2xl"
          number-size="text-2xl sm:text-3xl md:text-4xl"
        >
          Software Engineer specializing in designing and developing scalable web applications and enterprise systems.
          Adept at combining modern frontend ecosystems with solid backend architectures.
          Experienced in modernizing complex legacy platforms through microservices, domain modeling, and clean architecture practices.
          Committed to crafting solutions that are user-focused, maintainable, and aligned with long-term business goals.
        </section-item>

        <section-item
          :number="2"
          title="Work Experience"
          size="max-w-full"
          size-title="text-xl md:text-2xl"
          number-size="text-2xl sm:text-3xl md:text-4xl"
        >
          <CvWorkExperience />
        </section-item>

        <section-item
          :number="3"
          title="Certificates"
          size="max-w-full"
          size-title="text-xl md:text-2xl"
          number-size="text-2xl sm:text-3xl md:text-4xl"
        >
          <CvCertificates />
        </section-item>

        <section-item
          :number="4"
          title="Languages"
          size="max-w-full"
          size-title="text-xl md:text-2xl"
          number-size="text-2xl sm:text-3xl md:text-4xl"
        >
          <b class="font-bold">Italian</b> (Native speaker)<br>
          <b class="font-bold">English</b> (B2)
        </section-item>
      </div>
    </div>
  </div>
</template>
