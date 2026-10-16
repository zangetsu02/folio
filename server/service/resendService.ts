import { Resend } from 'resend'
import { escapeHtml } from '~~/server/utils/validation'

// Costruito su richiesta, non al caricamento del modulo: il costruttore di Resend
// lancia se la chiave manca, e Nitro importa i route server in modo eager — una
// chiave assente in locale faceva cadere l'intero sito, non solo l'invio mail.
function getResend() {
  const apiKey = process.env.NUXT_PRIVATE_RESEND_API_KEY
  if (!apiKey)
    throw createError({ statusCode: 503, statusMessage: 'Email service is not configured' })

  return new Resend(apiKey)
}

// Da env e non cablato: l'id precedente veniva dal progetto da cui questo e'
// stato forkato, quindi ogni fork scriveva nell'audience di un estraneo.
// Lo trovi su https://resend.com/audiences
function getAudienceId() {
  const id = process.env.NUXT_PRIVATE_RESEND_AUDIENCE_ID
  if (!id)
    throw createError({ statusCode: 503, statusMessage: 'Newsletter audience is not configured' })
  return id
}

interface SendMailDto {
  email: string
  message: string
  name: string
}

export async function sendSubscribeEmail(email: string) {
  try {
    await getResend().emails.send({
      from: 'Zangetsu <hello@christianpalladini.me>',
      to: [email],
      subject: 'Welcome to Zangetsu newsletter!',
      html: `
            <h1>Welcome to Zangetsu newsletter!</h1>
            <p>
                You've just subscribed to Zangetsu newsletter with this email: <strong>${escapeHtml(email)}</strong>.
            </p>
            <p>
                You can unsubscribe at any time by clicking on the link below the future emails you'll receive.
            </p>
            <p>
                See you soon!
            </p>
      `,
    })
  }
  catch (error) {
    console.error(error)
  }
}

export async function sendContactEmail({ email, message, name }: SendMailDto) {
  // fuori dal try: altrimenti il 503 di getResend() finirebbe nel catch e
  // uscirebbe come 500 generico
  const resend = getResend()
  try {
    await resend.emails.send({
      from: 'Zangetsu <hello@christianpalladini.me>',
      to: ['christian.palladini2@gmail.com'],
      subject: 'New message from christianpalladini.me',
      html: `
            <h3>New message from christianpalladini.me</h3>
            <p>
                You've just received a new message from ${name ? escapeHtml(name) : 'a visitor'} with this email: <strong>${escapeHtml(email)}</strong>.
            </p>
            <p>
                <strong>Message:</strong>
                <p>${escapeHtml(message)}</p>
            </p>
      `,
    })
  }
  catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    })
  }
}

export async function addContactToList(email: string) {
  return await getResend().contacts.create({
    email,
    audienceId: getAudienceId(),
  })
}
