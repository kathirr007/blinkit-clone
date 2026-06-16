export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const user = computed(() => authStore.user)
  const loading = computed(() => authStore.loading)

  async function login(phone: string) {
    return await authStore.login(phone)
  }

  async function verifyOtp(phone: string, otp: string) {
    return await authStore.verifyOtp(phone, otp)
  }

  async function signup(data: { name: string; phone: string; email?: string }) {
    return await authStore.signup(data)
  }

  async function logout() {
    await authStore.logout()
    router.push('/login')
  }

  async function refreshToken() {
    return await authStore.refreshTokens()
  }

  function requireAuth() {
    if (!isAuthenticated.value) {
      router.push('/login')
      return false
    }
    return true
  }

  return {
    isAuthenticated,
    user,
    loading,
    login,
    verifyOtp,
    signup,
    logout,
    refreshToken,
    requireAuth,
  }
}
