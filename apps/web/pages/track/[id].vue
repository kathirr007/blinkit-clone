<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
})

const route = useRoute()
const orderId = route.params.id

const order = ref({
  orderNumber: 'BLK-20240616-00002',
  status: 'OUT_FOR_DELIVERY',
  estimatedTime: '8 minutes',
})

const delivery = ref({
  partnerName: 'Raju Kumar',
  partnerPhone: '8888888888',
  latitude: 28.5595,
  longitude: 77.2069,
})

const statusSteps = [
  { key: 'CONFIRMED', label: 'Order Confirmed', icon: 'mdi:check-circle' },
  { key: 'PREPARING', label: 'Preparing', icon: 'mdi:food' },
  { key: 'OUT_FOR_DELIVERY', label: 'On the Way', icon: 'mdi:bike' },
  { key: 'DELIVERED', label: 'Delivered', icon: 'mdi:home-check' },
]

const currentStep = computed(() => {
  const idx = statusSteps.findIndex(s => s.key === order.value.status)
  return idx >= 0 ? idx : 0
})

// TODO: Connect WebSocket for real-time location updates
// const { socket } = useWebSocket()
// socket.emit('order:subscribe', orderId)
// socket.on('delivery:location_updated', (data) => { delivery.value = { ...delivery.value, ...data } })
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Map placeholder -->
    <div class="h-64 bg-gray-200 relative flex items-center justify-center">
      <div class="text-center text-gray-500">
        <Icon name="mdi:map-marker" class="text-4xl text-primary-600 mb-2" />
        <p class="text-sm">
          Live tracking map
        </p>
        <p class="text-xs text-gray-400">
          Lat: {{ delivery.latitude }}, Lng: {{ delivery.longitude }}
        </p>
      </div>
      <!-- Back button -->
      <NuxtLink
        :to="`/orders/${orderId}`"
        class="absolute top-4 left-4 bg-white rounded-full p-2 shadow-md"
      >
        <Icon name="mdi:arrow-left" class="text-xl" />
      </NuxtLink>
    </div>

    <!-- Tracking info -->
    <div class="px-4 -mt-6 relative z-10">
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-sm text-gray-500">
              Arriving in
            </p>
            <p class="text-2xl font-bold text-primary-700">
              {{ order.estimatedTime }}
            </p>
          </div>
          <span class="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
            {{ order.orderNumber }}
          </span>
        </div>

        <!-- Status steps -->
        <div class="flex items-center justify-between mb-6">
          <div
            v-for="(step, index) in statusSteps"
            :key="step.key"
            class="flex flex-col items-center flex-1"
          >
            <div
              :class="index <= currentStep ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-400'"
              class="w-10 h-10 rounded-full flex items-center justify-center mb-1"
            >
              <Icon :name="step.icon" class="text-lg" />
            </div>
            <p
              :class="index <= currentStep ? 'text-primary-700 font-medium' : 'text-gray-400'"
              class="text-xs text-center"
            >
              {{ step.label }}
            </p>
          </div>
        </div>

        <!-- Delivery partner -->
        <div class="border-t pt-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <Icon name="mdi:account" class="text-xl text-gray-500" />
              </div>
              <div>
                <p class="font-medium text-sm">
                  {{ delivery.partnerName }}
                </p>
                <p class="text-xs text-gray-500">
                  Delivery Partner
                </p>
              </div>
            </div>
            <a
              :href="`tel:${delivery.partnerPhone}`"
              class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center"
            >
              <Icon name="mdi:phone" class="text-primary-700" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
