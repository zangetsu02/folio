<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'

const schema = z.object({
  email: z.string().email('Invalid email'),
})

type Schema = z.output<typeof schema>

const toast = useToast()

const state = reactive<Partial<Schema>>({
  email: undefined,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    await $fetch('/api/subscribe', {
      method: 'POST',
      body: {
        email: event.data.email,
      },
    })
    await new Promise(resolve => setTimeout(resolve, 2000))

    toast.add({ title: 'Your message has been sent!', color: 'success' })
  }
  catch {
    toast.add({ title: 'An error occurred while sending your message.', color: 'error' })
  }
  state.email = undefined
}

const { data: posts, error } = await useAsyncData('writings', () => queryCollection('writing').order('date', 'DESC').all())

if (error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Writing not found',
    fatal: true,
  })
}
</script>

<template>
  <div class="flex font-normal flex-col gap-8">
    <List v-if="posts" :posts />
    <div class="mt-10 flex flex-col gap-1">
      <UForm :state :schema class="flex flex-col gap-4 sm:flex-row" @submit.prevent="onSubmit" @keydown.enter.prevent="onSubmit">
        <UFormField
          name="email"
          required
          description="Subscribe to get notified about new articles"
          class="flex flex-col gap-2"
        >
          <UFieldGroup>
            <UInput
              v-model="state.email"
              type="email"
              placeholder="Email*"
              class="w-64"
            />
            <UButton
              type="submit"
              color="secondary"
              class="rounded-none"
              loading-auto
              label="Subscribe"
            />
          </UFieldGroup>
        </UFormField>
      </UForm>
    </div>
  </div>
</template>
