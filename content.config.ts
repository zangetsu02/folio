import { defineCollection, defineContentConfig, z } from '@nuxt/content'
import { WORK_CATEGORY_KEYS } from './app/utils/works'

/** Ogni lingua obbligatoria: una traduzione mancante fa fallire la build. */
function localizedString() {
  return z.object({ it: z.string().nonempty(), en: z.string().nonempty() })
}

function localizedStringArray() {
  return z.object({
    it: z.array(z.string().nonempty()).nonempty(),
    en: z.array(z.string().nonempty()).nonempty(),
  })
}

export default defineContentConfig({
  collections: {
    // Una collection per lingua, come da documentazione Nuxt Content: i nomi
    // dei file devono combaciare fra le due cartelle, e' cosi' che Content sa
    // che sono traduzioni l'una dell'altra.
    content_it: defineCollection({
      type: 'page',
      source: { include: 'it/**', prefix: '/' },
      schema: z.object({
        title: z.string().nonempty(),
        description: z.string().nonempty(),
        // opzionali davvero: nessuna pagina ha `date`, solo index.md ha `image`
        date: z.string().optional(),
        image: z.string().optional(),
      }),
    }),

    content_en: defineCollection({
      type: 'page',
      source: { include: 'en/**', prefix: '/' },
      schema: z.object({
        title: z.string().nonempty(),
        description: z.string().nonempty(),
        // opzionali davvero: nessuna pagina ha `date`, solo index.md ha `image`
        date: z.string().optional(),
        image: z.string().optional(),
      }),
    }),
    writing: defineCollection({
      type: 'page',
      source: '2.writing/*.md',
      schema: z.object({
        title: z.string().nonempty(),
        description: z.string().nonempty(),
        date: z.string().nonempty(),
        draft: z.boolean().default(false),
      }),
    }),
    works: defineCollection({
      type: 'data',
      source: '1.works/*.json',
      schema: z.object({
        name: z.string().nonempty(),
        description: localizedString(),
        // enum e non string: una categoria scritta male fa fallire la build
        // invece di produrre in silenzio una sezione vuota su /works
        category: z.enum(WORK_CATEGORY_KEYS),
        release: z.string().optional(),
        date: z.string().nonempty(),
        url: z.string(),
        repo: z.string().optional(),
        logo: z.string().optional(),
        tech: z.array(z.string().nonempty()).optional(),
      }),
    }),
    worksExperience: defineCollection({
      type: 'data',
      source: '2.works-experience/*.json',
      schema: z.object({
        company: z.string().nonempty(),
        role: z.string().nonempty(),
        name: z.string().nonempty(),
        employmentType: localizedString(),
        location: localizedString(),
        start: z.object({
          month: z.string().optional(),
          year: z.string().nonempty(),
        }),
        end: z
          .object({
            month: z.string().optional(),
            year: z.string().nonempty(),
          })
          .optional(),
        isCurrent: z.boolean(),
        summary: localizedStringArray(),
        projects: z
          .array(
            z.object({
              name: z.string().nonempty(),
              description: localizedString(),
              tech: z.array(z.string().nonempty()),
            }),
          )
          .optional(),
      }),
    }),
    certificates: defineCollection({
      type: 'data',
      source: '3.certificates/*.json',
      schema: z.object({
        name: z.string().nonempty(),
        date: z.string().nonempty(),
        issuer: z.string().nonempty(),
        url: z.string().nonempty(),
      }),
    }),
  },
})
