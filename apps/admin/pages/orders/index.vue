<script setup lang="ts">
definePageMeta({
  middleware: ['admin'],
})

const router = useRouter()
const activeTab = ref('all')
const currentPage = ref(1)
const totalPages = ref(8)

const tabs = [
  { key: 'all', label: 'All', count: 224 },
  { key: 'pending', label: 'Pending', count: 12 },
  { key: 'confirmed', label: 'Confirmed', count: 25 },
  { key: 'preparing', label: 'Preparing', count: 18 },
  { key: 'out_for_delivery', label: 'Out for Delivery', count: 8 },
  { key: 'delivered', label: 'Delivered', count: 156 },
  { key: 'cancelled', label: 'Cancelled', count: 5 },
]

const columns = [
  { key: 'orderNumber', label: 'Order #' },
  { key: 'customer', label: 'Customer' },
  { key: 'items', label: 'Items', align: 'center' as const },
  { key: 'total', label: 'Total', align: 'right' as const },
  { key: 'status', label: 'Status', align: 'center' as const },
  { key: 'date', label: 'Date', align: 'right' as const },
  { key: 'actions', label: 'Actions', align: 'center' as const },
]

// TODO: Replace with API call to fetch orders
const orders = ref([
  { id: '1', orderNumber: 'ORD-1234', customer: 'Rahul Sharma', items: 5, total: 850, status: 'delivered', date: '2024-01-15 14:30' },
  { id: '2', orderNumber: 'ORD-1235', customer: 'Priya Patel', items: 3, total: 420, status: 'preparing', date: '2024-01-15 14:25' },
  { id: '3', orderNumber: 'ORD-1236', customer: 'Amit Kumar', items: 8, total: 1250, status: 'confirmed', date: '2024-01-15 14:20' },
  { id: '4', orderNumber: 'ORD-1237', customer: 'Sneha Reddy', items: 2, total: 320, status: 'out_for_delivery', date: '2024-01-15 14:15' },
  { id: '5', orderNumber: 'ORD-1238', customer: 'Vikram Singh', items: 4, total: 680, status: 'pending', date: '2024-01-15 14:10' },
  { id: '6', orderNumber: 'ORD-1239', customer: 'Anita Desai', items: 6, total: 920, status: 'delivered', date: '2024-01-15 14:05' },
  { id: '7', orderNumber: 'ORD-1240', customer: 'Rajesh Gupta', items: 2, total: 180, status: 'cancelled', date: '2024-01-15 14:00' },
  { id: '8', orderNumber: 'ORD-1241', customer: 'Meera Joshi', items: 7, total: 1100, status: 'preparing', date: '2024-01-15 13:55' },
  { id: '9', orderNumber: 'ORD-1242', customer: 'Suresh Nair', items: 3, total: 450, status: 'confirmed', date: '2024-01-15 13:50' },
  { id: '10', orderNumber: 'ORD-1243', customer: 'Kavita Menon', items: 4, total: 560, status: 'delivered', date: '2024-01-15 13:45' },
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

function handlePageChange(page: number) {
  currentPage.value = page
  // TODO: Fetch orders for the new page
}

function viewOrder(order: any) {
  router.push(`/orders/${order.id}`)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Orders</h1>
      <p class="text-sm text-gray-500 mt-1">Manage and track customer orders</p>
    </div>

    <!-- Status Tabs -->
    <div class="border-b border-gray-200">
      <nav class="flex gap-0 -mb-px overflow-x-auto">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
          :class="[
            activeTab === tab.key
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
          <span
            class="ml-1.5 px-1.5 py-0.5 text-xs rounded-full"
            :class="activeTab === tab.key ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'"
          >
            {{ tab.count }}
          </span>
        </button>
      </nav>
    </div>

    <!-- Orders Table -->
    <CommonDataTable
      :columns="columns"
      :data="orders"
      :current-page="currentPage"
      :total-pages="totalPages"
      empty-message="No orders found"
      @page-change="handlePageChange"
      @row-click="viewOrder"
    >
      <template #cell-orderNumber="{ row }">
        <span class="font-medium text-primary-600">{{ row.orderNumber }}</span>
      </template>

      <template #cell-customer="{ row }">
        <span class="text-gray-900">{{ row.customer }}</span>
      </template>

      <template #cell-items="{ row }">
        <span class="text-gray-600">{{ row.items }} items</span>
      </template>

      <template #cell-total="{ row }">
        <span class="font-medium">&#8377;{{ row.total }}</span>
      </template>

      <template #cell-status="{ row }">
        <span class="badge" :class="getStatusBadgeClass(row.status)">
          {{ formatStatus(row.status) }}
        </span>
      </template>

      <template #cell-date="{ row }">
        <span class="text-gray-500 text-xs">{{ row.date }}</span>
      </template>

      <template #cell-actions="{ row }">
        <div class="flex items-center justify-center" @click.stop>
          <NuxtLink
            :to="`/orders/${row.id}`"
            class="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            <Icon name="heroicons:eye" class="w-4 h-4" />
          </NuxtLink>
        </div>
      </template>
    </CommonDataTable>
  </div>
</template>
