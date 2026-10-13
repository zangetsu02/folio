<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'

const route = useRoute()
const router = useRouter()

const items = ref<TabsItem[]>([
  {
    label: 'About me',
    value: 'about',
    slot: 'about',
    to: '/about',
  },
  {
    label: 'Timeline',
    value: 'timeline',
    slot: 'timeline',
    to: '/timeline',
  },
])

const active = computed({
  get() {
    return route.path === '/timeline' ? 'timeline' : 'about'
  },
  set(tab) {
    router.push(tab === 'timeline' ? '/timeline' : '/about')
  },
})
</script>

<template>
  <UTabs
    v-model="active"
    size="md"
    variant="link"
    :items
    class="w-full"
    :ui="{
      trigger: 'data-[state=active]:text-highlighted',
      label: 'relative w-fit font-display text-3xl sm:text-4xl font-normal tracking-tight',
    }"
  >
    <template #trailing="{ item }">
      <span aria-hidden="true" class="absolute -bottom-0.5 -right-3 text-5xl font-normal opacity-[9%] sm:text-6xl">
        {{ item.value === 'about' ? 1 : 2 }}
      </span>
    </template>

    <template #about>
      <div data-animate style="--stagger: 2;">
        <slot name="about" />
      </div>
    </template>

    <template #timeline>
      <div data-animate style="--stagger: 2;">
        <slot name="timeline" />
      </div>
    </template>
  </UTabs>
</template>
