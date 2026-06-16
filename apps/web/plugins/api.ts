export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const api = $fetch.create({
    baseURL: config.public.apiBase as string,
    onRequest({ options }) {
      if (authStore.accessToken) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${authStore.accessToken}`,
        }
      }
    },
    async onResponseError({ response }) {
      if (response.status === 401 && authStore.refreshToken) {
        try {
          await authStore.refreshTokens()
          // Retry logic would need to be handled at the call site
        } catch {
          authStore.logout()
          navigateTo('/login')
        }
      }
    },
  })

  return {
    provide: {
      api,
    },
  }
})
