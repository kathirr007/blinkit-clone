<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const authStore = useAuthStore()
const router = useRouter()

const form = reactive({
  email: '',
  password: '',
})

const loading = ref(false)
const error = ref('')

async function handleLogin() {
  error.value = ''
  loading.value = true

  try {
    const result = await authStore.login(form.email, form.password)
    if (result.success) {
      router.push('/')
    } else {
      error.value = result.error || 'Login failed'
    }
  } catch (e: any) {
    error.value = e.message || 'An unexpected error occurred'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="w-full max-w-md">
    <!-- Logo -->
    <div class="text-center mb-8">
      <div class="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
        <span class="text-white text-2xl font-bold">B</span>
      </div>
      <h1 class="text-2xl font-bold text-gray-900">Blinkit Admin</h1>
      <p class="text-sm text-gray-500 mt-1">Sign in to manage your store</p>
    </div>

    <!-- Login Form -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <form @submit.prevent="handleLogin" class="space-y-5">
        <!-- Error Alert -->
        <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
          <Icon name="heroicons:exclamation-circle" class="w-5 h-5 text-red-600 flex-shrink-0" />
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>

        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
            Email or Phone
          </label>
          <input
            id="email"
            v-model="form.email"
            type="text"
            placeholder="admin@blinkit.com"
            class="input-field"
            required
          />
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="Enter your password"
            class="input-field"
            required
          />
        </div>

        <!-- Submit -->
        <button
          type="submit"
          class="btn-primary w-full flex items-center justify-center gap-2"
          :disabled="loading"
        >
          <div v-if="loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>{{ loading ? 'Signing in...' : 'Sign In' }}</span>
        </button>
      </form>
    </div>

    <!-- Footer -->
    <p class="text-center text-xs text-gray-400 mt-6">
      Access restricted to authorized administrators only.
    </p>
  </div>
</template>
