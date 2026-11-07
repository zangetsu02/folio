<script setup lang="ts">
const { category, limit } = defineProps<{
  category?: string
  limit?: number
}>()

const { localized } = useLocalized()
const { t } = useI18n()

// Senza `category` mostra una selezione trasversale: serve alla home, che
// porta i progetti in prima pagina invece di lasciarli solo su /works.
const { data: works, error } = await useAsyncData(`works-${category ?? 'all'}-${limit ?? 0}`, () => {
  const query = queryCollection('works').order('date', 'DESC')

  if (category)
    query.where('category', '=', category)

  return limit ? query.limit(limit).all() : query.all()
})
if (error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Works not found',
    fatal: true,
  })
}
</script>

<template>
  <div>
    <div class="mt-4 grid grid-cols-1 font-normal gap-8 sm:grid-cols-2">
      <NuxtLink
        v-for="(work, index) in works"
        :key="work.name"
        :to="work.url"
        target="_blank"
        rel="noopener noreferrer"
        class="group relative flex cursor-pointer flex-col"
        data-animate
        :style="{ '--stagger': index }"
      >
        <div class="flex flex-1 flex-col min-w-0">
          <div class="flex items-start justify-between gap-3">
            <h3 class="font-display text-2xl text-pretty decoration-primary group-hover:underline sm:text-3xl">
              {{ work.name }}<span class="text-primary">.</span>
            </h3>
            <div class="flex shrink-0 items-center gap-1.5 pt-1.5">
              <span v-if="work.release" class="font-mono text-xs text-muted">
                {{ work.release }}
              </span>
              <UIcon
                name="lucide:arrow-up-right"
                class="size-4 text-muted opacity-50 transition-opacity group-hover:opacity-100"
              />
              <span class="sr-only">{{ t('a11y.newTab') }}</span>
            </div>
          </div>
          <span class="text-muted font-extralight text-sm sm:text-base">
            {{ localized(work.description) }}
          </span>
          <ul v-if="work.tech?.length" class="mt-2 flex flex-wrap gap-1">
            <li
              v-for="tech in work.tech"
              :key="tech"
              class="border border-(--ui-border) px-1.5 py-0.5 font-mono text-[11px] text-muted"
            >
              {{ tech }}
            </li>
          </ul>
        </div>
      </NuxtLink>
    </div>

    <p v-if="!works?.length" class="font-mono text-sm text-muted">
      {{ t('works.empty') }}
    </p>
  </div>
</template>
