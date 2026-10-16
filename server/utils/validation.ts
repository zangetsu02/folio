import type { H3Event } from 'h3'
import type { ZodType } from 'zod'
import * as z from 'zod'

/** I limiti esistono per il corpo della mail, non per l'utente: senza, il body e' illimitato. */
const MAX_NAME = 80
const MAX_EMAIL = 254
const MAX_MESSAGE = 4000

export const contactSchema = z.object({
  name: z.string().trim().max(MAX_NAME).optional().default(''),
  email: z.string().trim().email().max(MAX_EMAIL),
  message: z.string().trim().min(1).max(MAX_MESSAGE),
})

export const subscribeSchema = z.object({
  email: z.string().trim().email().max(MAX_EMAIL),
})

/**
 * Valida il body contro lo schema.
 *
 * Lo zod del form vive nel browser e chiunque puo' saltarlo chiamando l'endpoint
 * a mano: la validazione che conta e' questa.
 */
export async function readValidatedJson<T>(event: H3Event, schema: ZodType<T>): Promise<T> {
  const parsed = schema.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Invalid payload',
      data: parsed.error.flatten().fieldErrors,
    })
  }
  return parsed.data
}

/**
 * Neutralizza il testo dell'utente prima di interpolarlo in una mail HTML.
 *
 * Senza, un `message` con `<img src=x onerror=…>` arriva come HTML vivo nella
 * casella di chi riceve.
 */
export function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
