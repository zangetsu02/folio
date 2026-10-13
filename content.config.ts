import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: [
        {
          include: '**/*.md',
          prefix: '/',
        },
      ],
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
        description: z.string().nonempty(),
        // enum e non string: una categoria scritta male fa fallire la build
        // invece di produrre in silenzio una sezione vuota su /works
        category: z.enum(['libraries', 'tools', 'themes']),
        release: z.string().optional(),
        date: z.string().nonempty(),
        url: z.string(),
        repo: z.string().optional(),
        // opzionale: i progetti senza logo disegnano un monogramma
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
        employmentType: z.string().nonempty(),
        location: z.string().nonempty(),
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
        summary: z.array(z.string().nonempty()),
        projects: z
          .array(
            z.object({
              name: z.string().nonempty(),
              description: z.string().nonempty(),
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
