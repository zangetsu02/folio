import { DEFAULT_LOCALE, LOCALES, localizePath } from './app/utils/locales'

/** Tag BCP 47 e nomi nativi: servono solo qui, non meritano il modulo condiviso. */
const LANGUAGE_TAGS = { it: 'it-IT', en: 'en-GB' } as const
const LOCALE_NAMES = { it: 'Italiano', en: 'English' } as const

/** Un path in tutte le lingue: `/works` e `/en/works`. */
const everyLocale = (path: string) => LOCALES.map(locale => localizePath(path, locale))

/**
 * Rotte confluite nella home, con la sezione che le ha assorbite. Possono
 * essere in firme email, su LinkedIn o indicizzate: 301 e non 404, il
 * contenuto non e' sparito, si e' spostato.
 */
const ABSORBED = { '/about': '#timeline', '/timeline': '#timeline', '/contact': '#contact', '/writing': '' }

// i18n.baseUrl vince su site.url (Site Config): un valore solo per ambiente.
const DEV_URL = 'http://localhost:3000'
const PROD_URL = 'https://christianpalladini.me'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  experimental: {
    viewTransition: true,
  },

  site: {
    defaultLocale: DEFAULT_LOCALE,
    indexable: true,
  },

  sitemap: {
    exclude: [...everyLocale('/writing'), ...everyLocale('/_resume')],
  },

  $development: {
    site: {
      url: DEV_URL,
    },
    // Gli hreflang vogliono URL assolute: senza baseUrl il modulo le emette
    // relative, e Google non le accetta.
    i18n: {
      baseUrl: DEV_URL,
    },
  },

  $production: {
    site: {
      url: PROD_URL,
    },
    i18n: {
      baseUrl: PROD_URL,
    },
  },

  routeRules: {
    '/': { isr: true },
    ...Object.fromEntries(LOCALES.flatMap(locale => Object.entries(ABSORBED).map(([from, hash]) =>
      [localizePath(from, locale), { redirect: { to: localizePath('/', locale) + hash, statusCode: 301 } }]))),
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
    defaultLocale: DEFAULT_LOCALE,
    strategy: 'prefix_except_default',
    // Nessun redirect su Accept-Language: sorprende chi apre un link
    // condiviso e confonde i crawler. Il selettore in testata e' esplicito.
    detectBrowserLanguage: false,
    locales: LOCALES.map(code => ({
      code,
      language: LANGUAGE_TAGS[code],
      name: LOCALE_NAMES[code],
      file: `${code}.json`,
    })),
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
      // Esplicite anche se crawlLinks le troverebbe: /_resume non e' linkata da
      // nessuna parte, e le altre non devono dipendere da un link in pagina.
      routes: ['/sitemap.xml', ...['/', '/works', '/_resume'].flatMap(everyLocale)],
      // Rotte assorbite dalla home: reindirizzano (vedi routeRules), quindi non
      // vanno ne' prerenderizzate ne' pubblicate nel sitemap.
      ignore: ['/notes', '/notes/**', '/__og-image__/**', ...Object.keys(ABSORBED).flatMap(everyLocale)],
    },
  },

  ogImage: {
    enabled: false,
  },
})
