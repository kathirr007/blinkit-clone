export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/image',
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
      title: 'Blinkit - Grocery Delivery in Minutes',
      meta: [
        { name: 'description', content: 'Get groceries delivered in minutes with Blinkit' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },
})
