export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  // Skip middleware for login page
  if (to.path === '/login') {
    return
  }

  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }

  // Check if user has admin role
  if (authStore.user?.role !== 'ADMIN') {
    return navigateTo('/login')
  }
})
