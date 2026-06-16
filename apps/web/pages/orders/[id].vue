<script setup lang="ts">
import { formatDate, formatOrderNumber, formatPrice } from '~/utils/formatters'

definePageMeta({
  middleware: ['auth'],
})

const route = useRoute()
const orderId = route.params.id as string

// TODO: Fetch order from API based on orderId
const order = ref({
  id: orderId,
  orderNumber: 'BLK20240615001',
  status: 'on_the_way' as const,
  items: [
    { productId: '1', name: 'Fresh Bananas', image: 'https://via.placeholder.com/48x48/fef3c7/92400e?text=B', price: 45, quantity: 2, unit: '1 dozen' },
    { productId: '2', name: 'Amul Milk 1L', image: 'https://via.placeholder.com/48x48/dbeafe/1e40af?text=M', price: 65, quantity: 1, unit: '1 litre' },
    { productId: '3', name: 'Whole Wheat Bread', image: 'https://via.placeholder.com/48x48/fef3c7/92400e?text=Br', price: 45, quantity: 1, unit: '400g' },
  ],
  subtotal: 200,
  deliveryFee: 0,
  total: 200,
  paymentMethod: 'UPI',
  deliveryAddress: { id: '1', label: 'Home', fullAddress: '123 Main St, Koramangala, Bangalore 560034', city: 'Bangalore', pincode: '560034', isDefault: true },
  createdAt: '2024-06-15T10:30:00Z',
  deliveredAt: null,
})

const statusTimeline = computed(() => {
  const steps = [
    { key: 'pending', label: 'Order Placed', icon: 'mdi:check-circle', time: '10:30 AM', completed: true },
    { key: 'confirmed', label: 'Order Confirmed', icon: 'mdi:clipboard-check', time: '10:31 AM', completed: true },
    { key: 'picking', label: 'Being Packed', icon: 'mdi:package-variant', time: '10:33 AM', completed: true },
    { key: 'on_the_way', label: 'On the Way', icon: 'mdi:truck-delivery', time: '10:36 AM', completed: true },
    { key: 'delivered', label: 'Delivered', icon: 'mdi:check-circle', time: '', completed: false },
  ]

  const statusOrder = ['pending', 'confirmed', 'picking', 'on_the_way', 'delivered']
  const currentIndex = statusOrder.indexOf(order.value.status)

  return steps.map((step, idx) => ({
    ...step,
    completed: idx <= currentIndex,
  }))
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-4">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-6">
      <button class="p-2 hover:bg-gray-100 rounded-full" @click="$router.back()">
        <Icon name="mdi:arrow-left" class="w-5 h-5" />
      </button>
      <div>
        <h1 class="text-xl font-bold text-gray-900">
          Order {{ formatOrderNumber(order.orderNumber) }}
        </h1>
        <p class="text-sm text-gray-500">
          Placed on {{ formatDate(order.createdAt) }}
        </p>
      </div>
    </div>

    <!-- Status Timeline -->
    <section class="card mb-4">
      <h2 class="text-base font-bold text-gray-900 mb-4">
        Order Status
      </h2>
      <div class="relative">
        <div class="space-y-4">
          <div
            v-for="(step, idx) in statusTimeline"
            :key="step.key"
            class="flex items-start gap-3"
          >
            <div class="flex flex-col items-center">
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                :class="step.completed ? 'bg-[#0c831f] text-white' : 'bg-gray-200 text-gray-400'"
              >
                <Icon :name="step.icon" class="w-4 h-4" />
              </div>
              <div v-if="idx < statusTimeline.length - 1" class="w-0.5 h-6 mt-1" :class="step.completed ? 'bg-[#0c831f]' : 'bg-gray-200'" />
            </div>
            <div class="pt-1">
              <p class="text-sm font-medium" :class="step.completed ? 'text-gray-900' : 'text-gray-400'">
                {{ step.label }}
              </p>
              <p v-if="step.time" class="text-xs text-gray-500">
                {{ step.time }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Order Items -->
    <section class="card mb-4">
      <h2 class="text-base font-bold text-gray-900 mb-4">
        Items
      </h2>
      <div class="space-y-3">
        <div v-for="item in order.items" :key="item.productId" class="flex items-center gap-3">
          <img :src="item.image" :alt="item.name" class="w-12 h-12 rounded object-contain bg-gray-50">
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">
              {{ item.name }}
            </p>
            <p class="text-xs text-gray-500">
              {{ item.unit }} x {{ item.quantity }}
            </p>
          </div>
          <span class="text-sm font-medium text-gray-900">{{ formatPrice(item.price * item.quantity) }}</span>
        </div>
      </div>
    </section>

    <!-- Payment Info -->
    <section class="card mb-4">
      <h2 class="text-base font-bold text-gray-900 mb-4">
        Payment Details
      </h2>
      <div class="space-y-2 text-sm">
        <div class="flex justify-between">
          <span class="text-gray-600">Payment Method</span>
          <span class="font-medium">{{ order.paymentMethod }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Subtotal</span>
          <span>{{ formatPrice(order.subtotal) }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Delivery Fee</span>
          <span :class="order.deliveryFee === 0 ? 'text-green-600' : ''">
            {{ order.deliveryFee === 0 ? 'FREE' : formatPrice(order.deliveryFee) }}
          </span>
        </div>
        <hr>
        <div class="flex justify-between font-bold">
          <span>Total</span>
          <span>{{ formatPrice(order.total) }}</span>
        </div>
      </div>
    </section>

    <!-- Delivery Info -->
    <section class="card">
      <h2 class="text-base font-bold text-gray-900 mb-4">
        Delivery Address
      </h2>
      <div>
        <p class="text-sm font-medium text-gray-900">
          {{ order.deliveryAddress.label }}
        </p>
        <p class="text-sm text-gray-600">
          {{ order.deliveryAddress.fullAddress }}
        </p>
      </div>
    </section>
  </div>
</template>
