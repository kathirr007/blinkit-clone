export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'nuxt-icon',
  ],
  runtimeConfig: {
    public: {
      apiBase: process.env.API_URL || 'http://localhost:3001/api',
      wsUrl: process.env.WS_URL || 'http://localhost:3001',
    },
  },
  tailwindcss: {
    cssPath: '~/assets/css/main.css',
  },
  pinia: {
    storesDirs: ['./stores/**'],
  },
  app: {
    head: {
      title: 'Blinkit Admin',
      meta: [
        { name: 'description', content: 'Blinkit Admin Dashboard' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },
})
