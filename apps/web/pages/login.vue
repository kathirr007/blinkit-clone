<template>
  <div class="card">
    <h2 class="text-xl font-bold text-gray-900 mb-6">Login</h2>

    <!-- Phone Input Step -->
    <div v-if="!otpSent">
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
        <div class="flex gap-2">
          <div class="flex items-center px-3 bg-gray-100 rounded-lg border border-gray-300 text-sm text-gray-600">
            +91
          </div>
          <input
            v-model="phone"
            type="tel"
            maxlength="10"
            placeholder="Enter 10 digit number"
            class="input-field"
            @keyup.enter="sendOtp"
          />
        </div>
      </div>
      <button
        class="btn-primary w-full"
        :disabled="phone.length !== 10 || loading"
        @click="sendOtp"
      >
        {{ loading ? 'Sending...' : 'Send OTP' }}
      </button>
    </div>

    <!-- OTP Verification Step -->
    <div v-else>
      <p class="text-sm text-gray-600 mb-4">
        OTP sent to <span class="font-medium">+91 {{ phone }}</span>
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
        {{ loading ? 'Verifying...' : 'Verify OTP' }}
      </button>
      <p class="text-center text-sm text-gray-500 mt-3">
        Didn't receive? <button class="text-[#0c831f] font-medium hover:underline" @click="sendOtp">Resend OTP</button>
      </p>
    </div>

    <!-- Sign up link -->
    <div class="mt-6 pt-4 border-t border-gray-100 text-center">
      <p class="text-sm text-gray-600">
        Don't have an account?
        <NuxtLink to="/signup" class="text-[#0c831f] font-medium hover:underline">Sign up</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: ['guest'],
})

const { login, verifyOtp: verifyOtpAction, loading } = useAuth()
const route = useRoute()

const phone = ref('')
const otp = ref('')
const otpSent = ref(false)

async function sendOtp() {
  const result = await login(phone.value)
  if (result.success) {
    otpSent.value = true
  }
}

async function verifyOtp() {
  const result = await verifyOtpAction(phone.value, otp.value)
  if (result.success) {
    const redirect = (route.query.redirect as string) || '/'
    navigateTo(redirect)
  }
}
</script>
