<script setup lang="ts">
// TODO: Replace with API call to fetch recent orders
const recentOrders = ref([
  { id: 'ORD-1234', customer: 'Rahul Sharma', items: 5, total: 850, status: 'delivered', date: '2024-01-15 14:30' },
  { id: 'ORD-1235', customer: 'Priya Patel', items: 3, total: 420, status: 'preparing', date: '2024-01-15 14:25' },
  { id: 'ORD-1236', customer: 'Amit Kumar', items: 8, total: 1250, status: 'confirmed', date: '2024-01-15 14:20' },
  { id: 'ORD-1237', customer: 'Sneha Reddy', items: 2, total: 320, status: 'out_for_delivery', date: '2024-01-15 14:15' },
  { id: 'ORD-1238', customer: 'Vikram Singh', items: 4, total: 680, status: 'pending', date: '2024-01-15 14:10' },
])

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
  <div class="card">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Recent Orders</h3>
      <NuxtLink to="/orders" class="text-sm text-primary-600 hover:text-primary-700 font-medium">
        View All
      </NuxtLink>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Order</th>
            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
            <th class="px-4 py-2 text-center text-xs font-semibold text-gray-600 uppercase">Items</th>
            <th class="px-4 py-2 text-right text-xs font-semibold text-gray-600 uppercase">Total</th>
            <th class="px-4 py-2 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
            <th class="px-4 py-2 text-right text-xs font-semibold text-gray-600 uppercase">Date</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="order in recentOrders" :key="order.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 text-sm font-medium text-primary-600">{{ order.id }}</td>
            <td class="px-4 py-3 text-sm text-gray-900">{{ order.customer }}</td>
            <td class="px-4 py-3 text-sm text-gray-600 text-center">{{ order.items }}</td>
            <td class="px-4 py-3 text-sm font-medium text-gray-900 text-right">
              &#8377;{{ order.total }}
            </td>
            <td class="px-4 py-3 text-center">
              <span class="badge" :class="getStatusBadgeClass(order.status)">
                {{ formatStatus(order.status) }}
              </span>
            </td>
            <td class="px-4 py-3 text-sm text-gray-500 text-right">{{ order.date }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
