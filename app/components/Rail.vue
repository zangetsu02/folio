<script setup lang="ts">
const { profile, socials } = useAppConfig()
const route = useRoute()

const nav = [
  { label: 'Works', to: '/works' },
  { label: 'About', to: '/about' },
  { label: 'Resume', to: '/resume' },
  { label: 'Contact', to: '/contact' },
]

function isActive(to: string) {
  return route.path === to || route.path.startsWith(`${to}/`)
}
</script>

<template>
  <aside class="flex flex-col gap-4 lg:gap-7 lg:sticky lg:top-6 lg:self-start print:hidden">
    <div>
      <NuxtLink to="/" class="font-display text-2xl leading-[1.08] tracking-tight hover:text-primary transition-colors">
        christian&thinsp;/&thinsp;zangetsu
      </NuxtLink>
      <p class="mt-0.5 text-xs text-muted">
        {{ profile.workTitle }} · Rome
      </p>
    </div>

    <p class="hidden font-mono text-[10.5px] leading-[1.85] text-muted lg:block">
      <span class="text-highlighted">Java &amp; Spring</span> · Angular at work<br>
      <span class="text-highlighted">Vue</span> · Nuxt by choice<br>
      learning <span class="text-highlighted">Rust</span>
    </p>

    <nav class="-mt-2 flex flex-wrap gap-x-5 lg:mt-0 lg:flex-col lg:gap-x-0">
      <NuxtLink
        v-for="(item, index) in nav"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-2 py-1.5 text-sm transition-colors hover:text-primary lg:justify-between lg:gap-3 lg:border-b lg:border-(--ui-border)"
        :class="isActive(item.to) ? 'text-highlighted' : 'text-muted'"
      >
        {{ item.label }}
        <span class="hidden font-mono text-[10.5px] opacity-55 lg:inline">
          {{ String(index + 1).padStart(2, '0') }}
        </span>
      </NuxtLink>
    </nav>

    <div class="flex items-center gap-3 font-mono text-[10.5px] text-muted">
      <NuxtLink :to="socials.twitter" external target="_blank" rel="noopener noreferrer" class="hover:text-primary transition-colors">
        X
      </NuxtLink>
      <NuxtLink :to="socials.github" external target="_blank" rel="noopener noreferrer" class="hover:text-primary transition-colors">
        GitHub
      </NuxtLink>
      <NuxtLink :to="socials.linkedin" external target="_blank" rel="noopener noreferrer" class="hover:text-primary transition-colors">
        LinkedIn
      </NuxtLink>
      <ThemeSelector />
    </div>

    <div v-if="route.path === '/resume'" class="flex items-center gap-3">
      <NuxtLink
        v-if="route.path === '/resume'"
        to="/resume.pdf"
        external
        target="_blank"
        class="font-mono text-[10.5px] text-muted hover:text-primary transition-colors"
      >
        Download PDF
      </NuxtLink>
    </div>
  </aside>
</template>
