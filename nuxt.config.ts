// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  experimental: {
    viewTransition: true,
  },

  site: {
    defaultLocale: 'it',
    indexable: true,
  },

  sitemap: {
    exclude: ['/writing', '/_resume', '/en/writing', '/en/_resume'],
  },

  $development: {
    site: {
      url: 'http://localhost:3000',
    },
    // Gli hreflang vogliono URL assolute: senza baseUrl il modulo le emette
    // relative, e Google non le accetta.
    i18n: {
      baseUrl: 'http://localhost:3000',
    },
  },

  $production: {
    site: {
      url: 'https://christianpalladini.me',
    },
    i18n: {
      baseUrl: 'https://christianpalladini.me',
    },
  },

  routeRules: {
    '/': { isr: true },
    // Le vecchie rotte possono essere in firme email, su LinkedIn o indicizzate.
    // 301 e non 404: il contenuto non e' sparito, si e' spostato nella home.
    '/about': { redirect: { to: '/#come-ci-sono-arrivato', statusCode: 301 } },
    '/timeline': { redirect: { to: '/#come-ci-sono-arrivato', statusCode: 301 } },
    '/contact': { redirect: { to: '/#parliamone', statusCode: 301 } },
    '/writing': { redirect: { to: '/', statusCode: 301 } },
    '/en/about': { redirect: { to: '/en#how-i-got-here', statusCode: 301 } },
    '/en/timeline': { redirect: { to: '/en#how-i-got-here', statusCode: 301 } },
    '/en/contact': { redirect: { to: '/en#let-s-talk', statusCode: 301 } },
    '/en/writing': { redirect: { to: '/en', statusCode: 301 } },
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
    '@vueuse/nuxt',
    '@nuxtjs/seo',
    '@nuxtjs/i18n',
    '@nuxt/image',
  ],

  i18n: {
    defaultLocale: 'it',
    strategy: 'prefix_except_default',
    // Nessun redirect su Accept-Language: sorprende chi apre un link
    // condiviso e confonde i crawler. Il selettore in testata e' esplicito.
    detectBrowserLanguage: false,
    locales: [
      { code: 'it', language: 'it-IT', name: 'Italiano', file: 'it.json' },
      { code: 'en', language: 'en-GB', name: 'English', file: 'en.json' },
    ],
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
        '/_resume',
        '/en',
        '/en/works',
        '/en/_resume',
      ],
      // Rotte assorbite dalla home: reindirizzano (vedi routeRules), quindi non
      // vanno ne' prerenderizzate ne' pubblicate nel sitemap.
      ignore: ['/notes', '/notes/**', '/writing', '/about', '/timeline', '/contact', '/en/writing', '/en/about', '/en/timeline', '/en/contact', '/__og-image__/**'],
    },
  },

  ogImage: {
    enabled: false,
  },
})
