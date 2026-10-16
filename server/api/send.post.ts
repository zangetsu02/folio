import type { H3Event } from 'h3'
import { sendContactEmail } from '~~/server/service/resendService'
import { contactSchema, readValidatedJson } from '~~/server/utils/validation'

export default defineEventHandler(async (event: H3Event) => {
  const payload = await readValidatedJson(event, contactSchema)
  await sendContactEmail(payload)
  return { statusCode: 200, statusMessage: 'OK' }
})
