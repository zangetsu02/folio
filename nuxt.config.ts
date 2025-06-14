// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  experimental: {
    viewTransition: true,
  },

  site: {
    defaultLocale: 'en',
    indexable: true,
  },

  $development: {
    site: {
      url: 'http://localhost:3000',
    },
  },

  $production: {
    site: {
      url: 'https://christianpalladini.me',
    },
  },

  routeRules: {
    '/': { isr: true },
  },

  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/content',
    '@nuxt/ui',
    '@nuxt/fonts',
    'motion-v/nuxt',
    '@nuxt/scripts',
    '@nuxtjs/seo',
    '@nuxt/image',
    '@nuxthub/core',
  ],

  hub: {
    workers: true,
  },

  css: ['~/assets/css/main.css'],

  colorMode: {
    preference: 'dark',
    fallback: 'dark',
  },

  content: {
    build: {
      markdown: {
        highlight: {
          langs: [
            'ts',
            'js',
            'json',
            'vue',
            'dockerfile',
            'docker',
            'yaml',
            'css',
          ],
          theme: {
            light: 'github-light',
            dark: 'github-dark',
            default: 'github-dark',
          },
        },
      },
    },
    preview: {
      api: 'https://api.nuxt.studio',
    },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/sitemap.xml',
        '/works',
        '/about',
        '/timeline',
        '/writing',
      ],
      ignore: ['/notes', '/notes/**'],
    },
  },
})
