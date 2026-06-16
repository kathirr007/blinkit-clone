import { defineStore } from 'pinia'

interface AdminUser {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'SUPER_ADMIN'
  avatar?: string
}

interface AuthState {
  user: AdminUser | null
  token: string | null
  isAuthenticated: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
  }),

  getters: {
    isAdmin: (state) => state.user?.role === 'ADMIN' || state.user?.role === 'SUPER_ADMIN',
  },

  actions: {
    async login(email: string, password: string) {
      // TODO: Replace with actual API call
      try {
        // Mock API call
        const response = {
          user: {
            id: '1',
            name: 'Admin User',
            email,
            role: 'ADMIN' as const,
          },
          token: 'mock-admin-token-' + Date.now(),
        }

        this.user = response.user
        this.token = response.token
        this.isAuthenticated = true

        // Store token in localStorage
        if (import.meta.client) {
          localStorage.setItem('admin_token', response.token)
          localStorage.setItem('admin_user', JSON.stringify(response.user))
        }

        return { success: true }
      } catch (error: any) {
        return { success: false, error: error.message || 'Login failed' }
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false

      if (import.meta.client) {
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_user')
      }
    },

    initAuth() {
      if (import.meta.client) {
        const token = localStorage.getItem('admin_token')
        const user = localStorage.getItem('admin_user')

        if (token && user) {
          this.token = token
          this.user = JSON.parse(user)
          this.isAuthenticated = true
        }
      }
    },
  },
})
