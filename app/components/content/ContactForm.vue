<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'

const schema = z.object({
  email: z.string().email('Invalid email'),
  message: z.string().min(2, 'Too short'),
  name: z.string().optional(),
})

type Schema = z.output<typeof schema>

const toast = useToast()

const state = reactive<Partial<Schema>>({
  email: undefined,
  message: undefined,
  name: undefined,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (!event.data.email || !event.data.message) {
    toast.add({ title: 'Please fill in all required fields.', color: 'error' })
    return
  }
  try {
    await $fetch('/api/send', {
      method: 'POST',
      body: {
        email: event.data.email,
        message: event.data.message,
        name: event.data.name,
      },
    })
    toast.add({ title: 'Your message has been sent!', color: 'success' })
  }
  catch {
    toast.add({ title: 'An error occurred while sending your message.', color: 'error' })
  }
}
</script>

<template>
  <UForm :schema :state class="mt-6 flex flex-col gap-4" @submit.prevent="onSubmit" @keydown.enter.prevent="onSubmit">
    <UFormField name="name">
      <UInput v-model="state.name" placeholder="Name" class="w-full" />
    </UFormField>
    <UFormField name="email">
      <UInput v-model="state.email" type="email" placeholder="Email" class="w-full" />
    </UFormField>
    <UFormField name="message">
      <UTextarea v-model="state.message" autoresize placeholder="Message" :rows="4" class="w-full rounded-none" />
    </UFormField>
    <UButton type="submit" color="secondary" label="Send" class="rounded-none" loading-auto block />
  </UForm>
</template>
