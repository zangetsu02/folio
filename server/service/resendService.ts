import process from 'node:process'
import { Resend } from 'resend'

const resend = new Resend(process.env.NUXT_PRIVATE_RESEND_API_KEY)

// find your audience id here: https://resend.com/audiences
const nuxtLogAudienceId = '0874ddcb-4a9d-404d-bb43-a48c7f90c861'

interface SendMailDto {
  email: string
  message: string
  name: string
}

export async function sendSubscribeEmail(email: string) {
  try {
    await resend.emails.send({
      from: 'Zangetsu <hello@christianpalladini.me>',
      to: [email],
      subject: 'Welcome to Zangetsu newsletter!',
      html: `
            <h1>Welcome to Zangetsu newsletter!</h1>
            <p>
                You've just subscribed to Zangetsu newsletter with this email: <strong>${email}</strong>.
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
  try {
    await resend.emails.send({
      from: 'Zangetsu <hello@christianpalladini.me>',
      to: ['christian.palladini2@gmail.com'],
      subject: 'New message from christianpalladini.me',
      html: `
            <h3>New message from christianpalladini.me</h3>
            <p>
                You've just received a new message from ${name && name.length ? name : 'a visitor'} with this email: <strong>${email}</strong>.
            </p>
            <p>
                <strong>Message:</strong>
                <p>${message}</p>
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
  return await resend.contacts.create({
    email,
    audienceId: nuxtLogAudienceId,
  })
}
