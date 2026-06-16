<template>
  <div class="max-w-4xl mx-auto px-4 py-4">
    <h1 class="text-xl font-bold text-gray-900 mb-4">My Orders</h1>

    <!-- Empty State -->
    <div v-if="orders.length === 0" class="text-center py-16">
      <Icon name="mdi:receipt-text-outline" class="w-20 h-20 text-gray-300 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-700 mb-2">No orders yet</h3>
      <p class="text-gray-500 mb-6">Looks like you haven't ordered anything yet</p>
      <NuxtLink to="/" class="btn-primary inline-block">Start Shopping</NuxtLink>
    </div>

    <!-- Orders List -->
    <div v-else class="space-y-4">
      <div
        v-for="order in orders"
        :key="order.id"
        class="card hover:shadow-md transition-shadow cursor-pointer"
        @click="navigateTo(`/orders/${order.id}`)"
      >
        <div class="flex items-start justify-between mb-3">
          <div>
            <p class="text-sm font-bold text-gray-900">Order {{ formatOrderNumber(order.orderNumber) }}</p>
            <p class="text-xs text-gray-500">{{ formatDate(order.createdAt) }}</p>
          </div>
          <span
            class="text-xs font-bold px-2 py-1 rounded-full"
            :class="statusClasses(order.status)"
          >
            {{ statusLabel(order.status) }}
          </span>
        </div>
        <div class="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <span>{{ order.items.length }} items</span>
          <span class="text-gray-300">|</span>
          <span class="font-medium text-gray-900">{{ formatPrice(order.total) }}</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="flex -space-x-2">
            <img
              v-for="(item, idx) in order.items.slice(0, 3)"
              :key="idx"
              :src="item.image"
              class="w-8 h-8 rounded-full border-2 border-white object-cover"
            />
            <div v-if="order.items.length > 3" class="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center">
              <span class="text-[10px] font-bold text-gray-500">+{{ order.items.length - 3 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatPrice, formatDate, formatOrderNumber } from '~/utils/formatters'

definePageMeta({
  middleware: ['auth'],
})

// TODO: Fetch orders from API
const orders = ref([
  {
    id: 'ord-1',
    orderNumber: 'BLK20240615001',
    status: 'delivered' as const,
    items: [
      { productId: '1', name: 'Fresh Bananas', image: 'https://via.placeholder.com/40x40/fef3c7/92400e?text=B', price: 45, quantity: 2, unit: '1 dozen' },
      { productId: '2', name: 'Amul Milk', image: 'https://via.placeholder.com/40x40/dbeafe/1e40af?text=M', price: 65, quantity: 1, unit: '1 litre' },
      { productId: '3', name: 'Bread', image: 'https://via.placeholder.com/40x40/fef3c7/92400e?text=Br', price: 45, quantity: 1, unit: '400g' },
    ],
    subtotal: 200,
    deliveryFee: 0,
    total: 200,
    paymentMethod: 'UPI',
    deliveryAddress: { id: '1', label: 'Home', fullAddress: '123 Main St, Bangalore', city: 'Bangalore', pincode: '560034', isDefault: true },
    createdAt: '2024-06-15T10:30:00Z',
    deliveredAt: '2024-06-15T10:42:00Z',
  },
  {
    id: 'ord-2',
    orderNumber: 'BLK20240614002',
    status: 'on_the_way' as const,
    items: [
      { productId: '4', name: 'Maggi Noodles', image: 'https://via.placeholder.com/40x40/fecaca/991b1b?text=Mg', price: 56, quantity: 2, unit: 'Pack of 4' },
      { productId: '5', name: 'Tomatoes', image: 'https://via.placeholder.com/40x40/fecaca/991b1b?text=T', price: 40, quantity: 1, unit: '500g' },
    ],
    subtotal: 152,
    deliveryFee: 25,
    total: 177,
    paymentMethod: 'COD',
    deliveryAddress: { id: '2', label: 'Office', fullAddress: '456 Tech Park, Bangalore', city: 'Bangalore', pincode: '560066', isDefault: false },
    createdAt: '2024-06-14T18:15:00Z',
  },
  {
    id: 'ord-3',
    orderNumber: 'BLK20240613003',
    status: 'cancelled' as const,
    items: [
      { productId: '6', name: 'Eggs', image: 'https://via.placeholder.com/40x40/fef9c3/854d0e?text=E', price: 54, quantity: 1, unit: '6 pieces' },
    ],
    subtotal: 54,
    deliveryFee: 25,
    total: 79,
    paymentMethod: 'Card',
    deliveryAddress: { id: '1', label: 'Home', fullAddress: '123 Main St, Bangalore', city: 'Bangalore', pincode: '560034', isDefault: true },
    createdAt: '2024-06-13T14:00:00Z',
  },
])

function statusClasses(status: string): string {
  switch (status) {
    case 'delivered': return 'bg-green-100 text-green-800'
    case 'on_the_way': return 'bg-blue-100 text-blue-800'
    case 'picking': return 'bg-yellow-100 text-yellow-800'
    case 'confirmed': return 'bg-purple-100 text-purple-800'
    case 'pending': return 'bg-gray-100 text-gray-800'
    case 'cancelled': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function statusLabel(status: string): string {
  switch (status) {
    case 'delivered': return 'Delivered'
    case 'on_the_way': return 'On the way'
    case 'picking': return 'Being packed'
    case 'confirmed': return 'Confirmed'
    case 'pending': return 'Pending'
    case 'cancelled': return 'Cancelled'
    default: return status
  }
}
</script>
