export default defineAppConfig({
  global: {
    meetingLink: 'https://todo.com',
  },
  profile: {
    email: 'christian.palladini2@gmail.com',
    phone: '(+33) 6 21 56 22 18',
    pictureDark: 'https://media.licdn.com/dms/image/v2/C4D03AQFtSgjLZrGXVQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1662145465629?e=1755129600&v=beta&t=A8ec7iRNhZyCTd1HASogkeM0YULCIQ6HJg80HETlAag',
    pictureLight: 'https://media.licdn.com/dms/image/v2/C4D03AQFtSgjLZrGXVQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1662145465629?e=1755129600&v=beta&t=A8ec7iRNhZyCTd1HASogkeM0YULCIQ6HJg80HETlAag',
  },
  seo: {
    title: 'Christian Palladini',
    description: 'Frontend Architect, Designer & OSS Contributor based in Rome.',
    url: 'https://christianpalladini.me',
    lang: 'en',
  },
  socials: {
    github: 'https://github.com/zangetsu02',
    twitter: 'https://x.com/c_palladini',
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
    {
      rel: 'manifest',
      href: '/site.webmanifest',
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
      base: 'bg-primary rounded-none ring-0 px-2 py-1 focus:outline-none resize-none caret-primary',
    },
    textarea: {
      base: 'bg-primary rounded-none ring-0 px-2 py-1 focus:outline-none resize-none caret-primary',
    },
  },
})
