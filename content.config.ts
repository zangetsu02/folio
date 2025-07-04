import { defineCollection, defineContentConfig, z } from '@nuxt/content'
import { asSeoCollection } from '@nuxtjs/seo/content'

export default defineContentConfig({
  collections: {
    content: defineCollection(
      asSeoCollection({
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
          date: z.string().nonempty(),
          image: z.string().nonempty(),
        }),
      }),
    ),
    writing: defineCollection(
      asSeoCollection({
        type: 'page',
        source: '2.writing/*.md',
        schema: z.object({
          title: z.string().nonempty(),
          description: z.string().nonempty(),
          date: z.string().nonempty(),
          draft: z.boolean().default(false),
        }),
      }),
    ),
    playground: defineCollection(
      asSeoCollection({
        type: 'page',
        source: '3.playground/*.md',
        schema: z.object({
          title: z.string().nonempty(),
          description: z.string().nonempty(),
          date: z.string().nonempty(),
          draft: z.boolean().default(false),
        }),
      }),
    ),
    works: defineCollection({
      type: 'data',
      source: '1.works/*.json',
      schema: z.object({
        name: z.string().nonempty(),
        description: z.string().nonempty(),
        category: z.string().nonempty(),
        release: z.string().optional(),
        date: z.string().nonempty(),
        url: z.string(),
        screenshotUrl: z.string().optional(),
        screenshotOptions: z.object({
          delay: z.number(),
        }),
      }),
    }),
  },
})
