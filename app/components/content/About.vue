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
      label: 'relative w-fit text-2xl sm:text-2xl font-normal',
    }"
  >
    <template #trailing="{ item }">
      <span v-if="item.label === 'About me'" class="absolute -bottom-0.5 -right-3 text-5xl font-normal opacity-[9%] sm:text-6xl">
        1
      </span>
    </template>

    <template #about>
      <div data-animate style="--stagger: 2;">
        <slot name="about" />
      </div>
    </template>
  </UTabs>
</template>
