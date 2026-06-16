export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const api = $fetch.create({
    baseURL: config.public.apiBase as string,
    onRequest({ options }) {
      // Inject auth token if available
      if (authStore.token) {
        const headers = new Headers(options.headers)
        headers.set('Authorization', `Bearer ${authStore.token}`)
        options.headers = headers
      }
    },
    onResponseError({ response }) {
      // Handle 401 unauthorized
      if (response.status === 401) {
        authStore.logout()
        navigateTo('/login')
      }
    },
  })

  return {
    provide: {
      api,
    },
  }
})
