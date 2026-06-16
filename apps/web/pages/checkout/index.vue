<template>
  <div class="space-y-6">
    <h1 class="text-xl font-bold text-gray-900">Checkout</h1>

    <!-- Address Selection -->
    <section class="card">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-base font-bold text-gray-900">Delivery Address</h2>
        <button class="text-sm text-[#0c831f] font-medium hover:underline" @click="showAddAddress = true">
          + Add New
        </button>
      </div>
      <div class="space-y-3">
        <label
          v-for="address in addresses"
          :key="address.id"
          class="flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors"
          :class="selectedAddress === address.id ? 'border-[#0c831f] bg-green-50' : 'border-gray-200 hover:border-gray-300'"
        >
          <input
            type="radio"
            :value="address.id"
            v-model="selectedAddress"
            class="mt-1 text-[#0c831f] focus:ring-[#0c831f]"
          />
          <div>
            <p class="text-sm font-medium text-gray-900">{{ address.label }}</p>
            <p class="text-sm text-gray-600">{{ address.fullAddress }}</p>
            <p v-if="address.landmark" class="text-xs text-gray-400">Landmark: {{ address.landmark }}</p>
          </div>
        </label>
      </div>
    </section>

    <!-- Delivery Slot -->
    <section class="card">
      <h2 class="text-base font-bold text-gray-900 mb-4">Delivery Slot</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <button
          v-for="slot in deliverySlots"
          :key="slot.id"
          class="p-3 rounded-lg border text-center transition-colors"
          :class="selectedSlot === slot.id ? 'border-[#0c831f] bg-green-50' : 'border-gray-200 hover:border-gray-300'"
          @click="selectedSlot = slot.id"
        >
          <p class="text-sm font-medium text-gray-900">{{ slot.label }}</p>
          <p class="text-xs text-gray-500">{{ slot.time }}</p>
        </button>
      </div>
    </section>

    <!-- Order Summary -->
    <section class="card">
      <h2 class="text-base font-bold text-gray-900 mb-4">Order Summary</h2>
      <div class="space-y-2 text-sm">
        <div class="flex justify-between">
          <span class="text-gray-600">Items ({{ count }})</span>
          <span class="font-medium">{{ formatPrice(subtotal) }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Delivery Fee</span>
          <span :class="deliveryFee === 0 ? 'text-green-600 font-medium' : 'font-medium'">
            {{ deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee) }}
          </span>
        </div>
        <hr />
        <div class="flex justify-between text-base font-bold">
          <span>Total</span>
          <span>{{ formatPrice(total) }}</span>
        </div>
      </div>
    </section>

    <!-- Continue Button -->
    <button
      class="btn-primary w-full py-3 text-base"
      :disabled="!selectedAddress || !selectedSlot"
      @click="navigateTo('/checkout/payment')"
    >
      Continue to Payment
    </button>

    <!-- Add Address Modal -->
    <Modal v-model="showAddAddress">
      <template #title>Add New Address</template>
      <div class="space-y-3">
        <input v-model="newAddress.label" type="text" placeholder="Label (Home, Office...)" class="input-field" />
        <textarea v-model="newAddress.fullAddress" placeholder="Full address" class="input-field" rows="3"></textarea>
        <input v-model="newAddress.landmark" type="text" placeholder="Landmark (optional)" class="input-field" />
        <input v-model="newAddress.pincode" type="text" placeholder="Pincode" class="input-field" maxlength="6" />
      </div>
      <template #footer>
        <div class="flex gap-3">
          <button class="btn-secondary flex-1" @click="showAddAddress = false">Cancel</button>
          <button class="btn-primary flex-1" @click="addAddress">Save Address</button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { formatPrice } from '~/utils/formatters'

definePageMeta({
  layout: 'checkout',
  middleware: ['auth'],
})

const { count, subtotal, deliveryFee, total } = useCart()

const selectedAddress = ref('')
const selectedSlot = ref('')
const showAddAddress = ref(false)

const newAddress = ref({
  label: '',
  fullAddress: '',
  landmark: '',
  pincode: '',
})

// TODO: Fetch addresses from API
const addresses = ref([
  { id: '1', label: 'Home', fullAddress: '123 Main St, Koramangala, Bangalore 560034', landmark: 'Near Park', city: 'Bangalore', pincode: '560034', isDefault: true },
  { id: '2', label: 'Office', fullAddress: '456 Tech Park, Whitefield, Bangalore 560066', landmark: 'Building A', city: 'Bangalore', pincode: '560066', isDefault: false },
])

const deliverySlots = ref([
  { id: '1', label: 'Express', time: '10 minutes' },
  { id: '2', label: 'Morning', time: '9 AM - 11 AM' },
  { id: '3', label: 'Afternoon', time: '12 PM - 2 PM' },
  { id: '4', label: 'Evening', time: '5 PM - 7 PM' },
  { id: '5', label: 'Night', time: '8 PM - 10 PM' },
])

// Select default address
onMounted(() => {
  const defaultAddr = addresses.value.find(a => a.isDefault)
  if (defaultAddr) selectedAddress.value = defaultAddr.id
})

function addAddress() {
  // TODO: Save address via API
  const id = Date.now().toString()
  addresses.value.push({
    id,
    label: newAddress.value.label,
    fullAddress: newAddress.value.fullAddress,
    landmark: newAddress.value.landmark,
    city: '',
    pincode: newAddress.value.pincode,
    isDefault: false,
  })
  selectedAddress.value = id
  showAddAddress.value = false
  newAddress.value = { label: '', fullAddress: '', landmark: '', pincode: '' }
}
</script>
