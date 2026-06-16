<script setup lang="ts">
import { formatPrice } from '~/utils/formatters'

definePageMeta({
  layout: 'checkout',
  middleware: ['auth'],
})

const { total, clearCart } = useCart()
const { success } = useNotification()

const selectedMethod = ref('cod')
const upiId = ref('')
const loading = ref(false)
const cardDetails = ref({
  number: '',
  expiry: '',
  cvv: '',
  name: '',
})

const paymentMethods = [
  { id: 'cod', label: 'Cash on Delivery', description: 'Pay when your order arrives', icon: 'mdi:cash' },
  { id: 'upi', label: 'UPI', description: 'Google Pay, PhonePe, Paytm', icon: 'mdi:cellphone' },
  { id: 'card', label: 'Credit/Debit Card', description: 'Visa, Mastercard, Rupay', icon: 'mdi:credit-card' },
]

async function placeOrder() {
  loading.value = true
  try {
    // TODO: Call API to create order
    // const { $api } = useNuxtApp()
    // const response = await $api('/orders', {
    //   method: 'POST',
    //   body: { paymentMethod: selectedMethod.value, ... }
    // })

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    clearCart()
    success('Order placed successfully!')
    navigateTo('/orders')
  }
  catch (error) {
    console.error('Order placement failed', error)
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-xl font-bold text-gray-900">
      Payment
    </h1>

    <!-- Payment Methods -->
    <section class="card">
      <h2 class="text-base font-bold text-gray-900 mb-4">
        Select Payment Method
      </h2>
      <div class="space-y-3">
        <label
          v-for="method in paymentMethods"
          :key="method.id"
          class="flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors"
          :class="selectedMethod === method.id ? 'border-[#0c831f] bg-green-50' : 'border-gray-200 hover:border-gray-300'"
        >
          <input
            v-model="selectedMethod"
            type="radio"
            :value="method.id"
            class="text-[#0c831f] focus:ring-[#0c831f]"
          >
          <Icon :name="method.icon" class="w-6 h-6 text-gray-600" />
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900">{{ method.label }}</p>
            <p class="text-xs text-gray-500">{{ method.description }}</p>
          </div>
        </label>
      </div>
    </section>

    <!-- UPI Section -->
    <section v-if="selectedMethod === 'upi'" class="card">
      <h2 class="text-base font-bold text-gray-900 mb-4">
        Enter UPI ID
      </h2>
      <input
        v-model="upiId"
        type="text"
        placeholder="yourname@paytm"
        class="input-field"
      >
    </section>

    <!-- Card Section -->
    <section v-if="selectedMethod === 'card'" class="card">
      <h2 class="text-base font-bold text-gray-900 mb-4">
        Card Details
      </h2>
      <div class="space-y-3">
        <input v-model="cardDetails.number" type="text" placeholder="Card Number" class="input-field" maxlength="19">
        <div class="grid grid-cols-2 gap-3">
          <input v-model="cardDetails.expiry" type="text" placeholder="MM/YY" class="input-field" maxlength="5">
          <input v-model="cardDetails.cvv" type="password" placeholder="CVV" class="input-field" maxlength="3">
        </div>
        <input v-model="cardDetails.name" type="text" placeholder="Cardholder Name" class="input-field">
      </div>
    </section>

    <!-- Order Total -->
    <section class="card">
      <div class="flex justify-between items-center">
        <span class="text-base font-bold text-gray-900">Total Amount</span>
        <span class="text-xl font-bold text-[#0c831f]">{{ formatPrice(total) }}</span>
      </div>
    </section>

    <!-- Place Order Button -->
    <button
      class="btn-primary w-full py-3 text-base"
      :disabled="!selectedMethod || loading"
      @click="placeOrder"
    >
      {{ loading ? 'Placing Order...' : `Place Order - ${formatPrice(total)}` }}
    </button>
  </div>
</template>
