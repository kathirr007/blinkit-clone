<script setup lang="ts">
definePageMeta({
  middleware: ['admin'],
})

const route = useRoute()
const router = useRouter()
const orderId = route.params.id as string

// TODO: Replace with API call to fetch order details
const order = ref({
  id: orderId,
  orderNumber: 'ORD-1234',
  status: 'preparing',
  date: '2024-01-15 14:30',
  customer: {
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    email: 'rahul@example.com',
  },
  address: {
    line1: 'Flat 203, Tower B',
    line2: 'Prestige Lakeside Habitat',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560103',
  },
  items: [
    { id: '1', name: 'Amul Toned Milk 500ml', quantity: 2, price: 27, total: 54 },
    { id: '2', name: 'Britannia Good Day 120g', quantity: 1, price: 35, total: 35 },
    { id: '3', name: 'Maggi Noodles 70g', quantity: 3, price: 14, total: 42 },
    { id: '4', name: 'Tata Salt 1kg', quantity: 1, price: 24, total: 24 },
    { id: '5', name: 'Aashirvaad Atta 5kg', quantity: 1, price: 289, total: 289 },
  ],
  payment: {
    method: 'UPI',
    transactionId: 'TXN-789456123',
    subtotal: 444,
    deliveryFee: 25,
    discount: 0,
    total: 469,
    status: 'paid',
  },
  timeline: [
    { status: 'placed', time: '14:30', date: '2024-01-15', completed: true },
    { status: 'confirmed', time: '14:31', date: '2024-01-15', completed: true },
    { status: 'preparing', time: '14:35', date: '2024-01-15', completed: true },
    { status: 'out_for_delivery', time: '', date: '', completed: false },
    { status: 'delivered', time: '', date: '', completed: false },
  ],
  deliveryPartner: null,
})

const newStatus = ref(order.value.status)

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'out_for_delivery', label: 'Out for Delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

function updateStatus() {
  // TODO: API call to update order status
  order.value.status = newStatus.value
  console.log('Updating order status to:', newStatus.value)
}

function assignDeliveryPartner() {
  // TODO: Open assignment modal / API call
  console.log('Assigning delivery partner for order:', orderId)
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'delivered': return 'text-green-600'
    case 'preparing': return 'text-yellow-600'
    case 'confirmed': return 'text-blue-600'
    case 'cancelled': return 'text-red-600'
    case 'out_for_delivery': return 'text-purple-600'
    default: return 'text-gray-600'
  }
}

function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'delivered': return 'badge-success'
    case 'preparing': return 'badge-warning'
    case 'confirmed': return 'badge-info'
    case 'cancelled': return 'badge-danger'
    case 'out_for_delivery': return 'bg-purple-100 text-purple-800'
    default: return 'badge-gray'
  }
}

function formatStatus(status: string): string {
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button @click="router.back()" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Icon name="heroicons:arrow-left" class="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <div class="flex items-center gap-3">
            <h1 class="text-2xl font-bold text-gray-900">{{ order.orderNumber }}</h1>
            <span class="badge" :class="getStatusBadgeClass(order.status)">
              {{ formatStatus(order.status) }}
            </span>
          </div>
          <p class="text-sm text-gray-500 mt-1">Placed on {{ order.date }}</p>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-3">
        <button class="btn-secondary flex items-center gap-2" @click="assignDeliveryPartner">
          <Icon name="heroicons:truck" class="w-4 h-4" />
          Assign Partner
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Order Items -->
        <div class="card">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Item</th>
                <th class="px-4 py-2 text-center text-xs font-semibold text-gray-600 uppercase">Qty</th>
                <th class="px-4 py-2 text-right text-xs font-semibold text-gray-600 uppercase">Price</th>
                <th class="px-4 py-2 text-right text-xs font-semibold text-gray-600 uppercase">Total</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="item in order.items" :key="item.id">
                <td class="px-4 py-3 text-sm text-gray-900">{{ item.name }}</td>
                <td class="px-4 py-3 text-sm text-gray-600 text-center">{{ item.quantity }}</td>
                <td class="px-4 py-3 text-sm text-gray-600 text-right">&#8377;{{ item.price }}</td>
                <td class="px-4 py-3 text-sm font-medium text-gray-900 text-right">&#8377;{{ item.total }}</td>
              </tr>
            </tbody>
          </table>

          <!-- Payment Summary -->
          <div class="mt-4 pt-4 border-t border-gray-200">
            <div class="flex justify-end">
              <div class="w-64 space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Subtotal</span>
                  <span class="text-gray-900">&#8377;{{ order.payment.subtotal }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Delivery Fee</span>
                  <span class="text-gray-900">&#8377;{{ order.payment.deliveryFee }}</span>
                </div>
                <div v-if="order.payment.discount > 0" class="flex justify-between text-sm">
                  <span class="text-gray-500">Discount</span>
                  <span class="text-green-600">-&#8377;{{ order.payment.discount }}</span>
                </div>
                <div class="flex justify-between text-sm font-semibold pt-2 border-t border-gray-200">
                  <span class="text-gray-900">Total</span>
                  <span class="text-gray-900">&#8377;{{ order.payment.total }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Status Timeline -->
        <div class="card">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Order Timeline</h2>
          <div class="space-y-4">
            <div v-for="(step, index) in order.timeline" :key="index" class="flex items-start gap-3">
              <div class="flex flex-col items-center">
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center"
                  :class="step.completed ? 'bg-primary-600' : 'bg-gray-200'"
                >
                  <Icon
                    :name="step.completed ? 'heroicons:check' : 'heroicons:clock'"
                    class="w-4 h-4"
                    :class="step.completed ? 'text-white' : 'text-gray-400'"
                  />
                </div>
                <div
                  v-if="index < order.timeline.length - 1"
                  class="w-0.5 h-8 mt-1"
                  :class="step.completed ? 'bg-primary-600' : 'bg-gray-200'"
                ></div>
              </div>
              <div class="pt-1">
                <p class="text-sm font-medium" :class="step.completed ? 'text-gray-900' : 'text-gray-400'">
                  {{ formatStatus(step.status) }}
                </p>
                <p v-if="step.time" class="text-xs text-gray-500">
                  {{ step.date }} at {{ step.time }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="space-y-6">
        <!-- Update Status -->
        <div class="card">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Update Status</h2>
          <div class="space-y-3">
            <select v-model="newStatus" class="input-field">
              <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
            <button class="btn-primary w-full" @click="updateStatus">
              Update Status
            </button>
          </div>
        </div>

        <!-- Customer Info -->
        <div class="card">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Customer</h2>
          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Icon name="heroicons:user" class="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ order.customer.name }}</p>
                <p class="text-xs text-gray-500">{{ order.customer.email }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <Icon name="heroicons:phone" class="w-4 h-4" />
              {{ order.customer.phone }}
            </div>
          </div>
        </div>

        <!-- Delivery Address -->
        <div class="card">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Delivery Address</h2>
          <div class="text-sm text-gray-600 space-y-1">
            <p>{{ order.address.line1 }}</p>
            <p>{{ order.address.line2 }}</p>
            <p>{{ order.address.city }}, {{ order.address.state }}</p>
            <p class="font-medium">{{ order.address.pincode }}</p>
          </div>
        </div>

        <!-- Payment Info -->
        <div class="card">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Payment</h2>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">Method</span>
              <span class="font-medium text-gray-900">{{ order.payment.method }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Transaction ID</span>
              <span class="font-mono text-xs text-gray-900">{{ order.payment.transactionId }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Status</span>
              <span class="badge-success">{{ order.payment.status }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
