import { defineStore } from 'pinia'

interface AuthState {
  user: {
    id: string
    name: string
    phone: string
    email?: string
    avatar?: string
  } | null
  accessToken: string | null
  refreshToken: string | null
  loading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    accessToken: typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null,
    refreshToken: typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null,
    loading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    isAdmin: (state) => false, // TODO: Implement admin role check
  },

  actions: {
    async login(phone: string) {
      this.loading = true
      try {
        // TODO: Call API to send OTP
        // const { $api } = useNuxtApp()
        // await $api('/auth/send-otp', { method: 'POST', body: { phone } })
        console.log('OTP sent to', phone)
        return { success: true }
      } catch (error: any) {
        return { success: false, error: error?.message || 'Failed to send OTP' }
      } finally {
        this.loading = false
      }
    },

    async verifyOtp(phone: string, otp: string) {
      this.loading = true
      try {
        // TODO: Call API to verify OTP
        // const { $api } = useNuxtApp()
        // const response = await $api('/auth/verify-otp', { method: 'POST', body: { phone, otp } })

        // Mock response
        const mockResponse = {
          user: { id: '1', name: 'Test User', phone, email: 'test@example.com' },
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
        }

        this.user = mockResponse.user
        this.accessToken = mockResponse.accessToken
        this.refreshToken = mockResponse.refreshToken

        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', mockResponse.accessToken)
          localStorage.setItem('refreshToken', mockResponse.refreshToken)
        }

        return { success: true }
      } catch (error: any) {
        return { success: false, error: error?.message || 'Invalid OTP' }
      } finally {
        this.loading = false
      }
    },

    async signup(data: { name: string; phone: string; email?: string }) {
      this.loading = true
      try {
        // TODO: Call API to register user
        // const { $api } = useNuxtApp()
        // await $api('/auth/register', { method: 'POST', body: data })
        console.log('User registered', data)
        return { success: true }
      } catch (error: any) {
        return { success: false, error: error?.message || 'Signup failed' }
      } finally {
        this.loading = false
      }
    },

    async refreshTokens() {
      try {
        // TODO: Call API to refresh tokens
        // const { $api } = useNuxtApp()
        // const response = await $api('/auth/refresh', { method: 'POST', body: { refreshToken: this.refreshToken } })
        console.log('Tokens refreshed')
        return { success: true }
      } catch (error) {
        this.logout()
        throw error
      }
    },

    async fetchProfile() {
      try {
        // TODO: Call API to get user profile
        // const { $api } = useNuxtApp()
        // const response = await $api('/auth/profile')
        // this.user = response.data
      } catch (error) {
        console.error('Failed to fetch profile', error)
      }
    },

    logout() {
      this.user = null
      this.accessToken = null
      this.refreshToken = null
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      }
    },
  },
})
