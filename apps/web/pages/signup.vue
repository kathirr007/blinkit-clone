<template>
  <div class="card">
    <h2 class="text-xl font-bold text-gray-900 mb-6">Create Account</h2>

    <!-- Registration Form -->
    <div v-if="!otpSent">
      <div class="space-y-4 mb-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input v-model="form.name" type="text" placeholder="Enter your name" class="input-field" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <div class="flex gap-2">
            <div class="flex items-center px-3 bg-gray-100 rounded-lg border border-gray-300 text-sm text-gray-600">
              +91
            </div>
            <input v-model="form.phone" type="tel" maxlength="10" placeholder="10 digit number" class="input-field" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
          <input v-model="form.email" type="email" placeholder="Enter your email" class="input-field" />
        </div>
      </div>
      <button
        class="btn-primary w-full"
        :disabled="!isFormValid || loading"
        @click="sendOtp"
      >
        {{ loading ? 'Sending...' : 'Send OTP' }}
      </button>
    </div>

    <!-- OTP Verification -->
    <div v-else>
      <p class="text-sm text-gray-600 mb-4">
        OTP sent to <span class="font-medium">+91 {{ form.phone }}</span>
        <button @click="otpSent = false" class="text-[#0c831f] font-medium ml-2 hover:underline">Change</button>
      </p>
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
        <input
          v-model="otp"
          type="text"
          maxlength="6"
          placeholder="Enter 6 digit OTP"
          class="input-field text-center text-lg tracking-widest"
          @keyup.enter="verifyOtp"
        />
      </div>
      <button
        class="btn-primary w-full"
        :disabled="otp.length !== 6 || loading"
        @click="verifyOtp"
      >
        {{ loading ? 'Creating account...' : 'Verify & Create Account' }}
      </button>
    </div>

    <!-- Login link -->
    <div class="mt-6 pt-4 border-t border-gray-100 text-center">
      <p class="text-sm text-gray-600">
        Already have an account?
        <NuxtLink to="/login" class="text-[#0c831f] font-medium hover:underline">Login</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: ['guest'],
})

const { signup, verifyOtp: verifyOtpAction, loading } = useAuth()

const form = ref({
  name: '',
  phone: '',
  email: '',
})
const otp = ref('')
const otpSent = ref(false)

const isFormValid = computed(() => {
  return form.value.name.trim().length > 0 && form.value.phone.length === 10
})

async function sendOtp() {
  const result = await signup(form.value)
  if (result.success) {
    otpSent.value = true
  }
}

async function verifyOtp() {
  const result = await verifyOtpAction(form.value.phone, otp.value)
  if (result.success) {
    navigateTo('/')
  }
}
</script>
