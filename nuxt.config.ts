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

  sitemap: {
    exclude: ['/writing', '/_resume'],
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
    // Le vecchie rotte possono essere in firme email, su LinkedIn o indicizzate.
    // 301 e non 404: il contenuto non e' sparito, si e' spostato nella home.
    '/about': { redirect: { to: '/#how-i-got-here', statusCode: 301 } },
    '/timeline': { redirect: { to: '/#how-i-got-here', statusCode: 301 } },
    '/contact': { redirect: { to: '/#let-s-talk', statusCode: 301 } },
    '/writing': { redirect: { to: '/', statusCode: 301 } },
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
    '@nuxt/image',
  ],

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
      ],
      // Rotte assorbite dalla home: reindirizzano (vedi routeRules), quindi non
      // vanno ne' prerenderizzate ne' pubblicate nel sitemap.
      ignore: ['/notes', '/notes/**', '/writing', '/about', '/timeline', '/contact', '/__og-image__/**'],
    },
  },

  ogImage: {
    enabled: false,
  },
})
