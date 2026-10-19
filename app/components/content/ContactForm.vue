<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'

const { t } = useI18n()

const schema = z.object({
  email: z.string().email(t('contact.invalidEmail')),
  message: z.string().min(2, t('contact.tooShort')),
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
    toast.add({ title: t('contact.required'), color: 'error' })
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
    toast.add({ title: t('contact.sent'), color: 'success' })
  }
  catch {
    toast.add({ title: t('contact.failed'), color: 'error' })
  }
}
</script>

<template>
  <UForm :schema :state class="mt-6 flex flex-col gap-4" @submit.prevent="onSubmit" @keydown.enter.prevent="onSubmit">
    <UFormField name="name">
      <UInput v-model="state.name" :placeholder="t('contact.name')" class="w-full" />
    </UFormField>
    <UFormField name="email">
      <UInput v-model="state.email" type="email" :placeholder="t('contact.email')" class="w-full" />
    </UFormField>
    <UFormField name="message">
      <UTextarea v-model="state.message" autoresize :placeholder="t('contact.message')" :rows="4" class="w-full rounded-none" />
    </UFormField>
    <UButton type="submit" color="secondary" :label="t('contact.send')" class="rounded-none" loading-auto block />
  </UForm>
</template>
