import type { H3Event } from 'h3'
import { addContactToList, sendSubscribeEmail } from '~~/server/service/resendService'
import { readValidatedJson, subscribeSchema } from '~~/server/utils/validation'

export default defineEventHandler(async (event: H3Event) => {
  const { email } = await readValidatedJson(event, subscribeSchema)

  const contact = await addContactToList(email)
  if (contact.error)
    throw createError({ statusCode: 400, statusMessage: 'Bad Request' })

  await sendSubscribeEmail(email)
  return { statusCode: 200, statusMessage: 'OK' }
})
