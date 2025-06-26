export default defineAppConfig({
  global: {
    meetingLink: 'https://cal.com/zangetsu',
  },
  profile: {
    email: 'hello@christianpalladini.me',
    phone: '(+33) 6 21 56 22 18',
    pictureDark: 'https://avatars.githubusercontent.com/zangetsu02',
    pictureLight: 'https://avatars.githubusercontent.com/zangetsu02',
  },
  seo: {
    title: 'zangetsu',
    description:
      'Software engineer, designer & OSS Contributor based in Rome.',
    url: 'https://christianpalladini.me',
    lang: 'en',
  },
  socials: {
    github: 'https://github.com/zangetsu02',
    twitter: 'https://x.com/_zangetsu02',
    linkedin: 'https://www.linkedin.com/in/christian-palladini/',
  },
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      href: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      href: '/favicon-16x16.png',
    },
  ],
  ui: {
    colors: {
      neutral: 'neutral',
    },
    icons: {
      loading: 'lucide:loader',
    },
    input: {
      slots: {
        base: 'bg-primary rounded-none ring-0 px-2 py-1 focus:outline-none resize-none caret-primary',
      },
    },
    textarea: {
      slots: {
        base: 'bg-primary rounded-none ring-0 px-2 py-1 focus:outline-none resize-none caret-primary',
      },
    },
    button: {
      compoundVariants: [
        {
          color: 'primary',
          variant: 'solid',
          class: 'dark:bg-[#1D1D1D] dark:text-[#FAFAFA] bg-[#F2F1EF] text-[#121212] hover:bg-[#F2F1EF] dark:hover:bg-[#1D1D1D]',
        },
        {
          color: 'secondary',
          variant: 'solid',
          class: 'dark:bg-[#FAFAFA] dark:text-[#18181B] bg-[#18181B] text-[#FAFAFA] hover:bg-[#18181B] dark:hover:bg-[#FAFAFA]',
        },
      ],
    },
  },
})
