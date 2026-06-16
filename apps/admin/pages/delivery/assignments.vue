<script setup lang="ts">
definePageMeta({
  middleware: ['admin'],
})

// TODO: Replace with API call to fetch active delivery assignments
const assignments = ref([
  {
    id: '1',
    orderNumber: 'ORD-1234',
    partner: 'Ravi Kumar',
    customer: 'Rahul Sharma',
    address: 'Prestige Lakeside Habitat, Bangalore',
    status: 'picked_up',
    assignedAt: '14:35',
    estimatedDelivery: '14:50',
    items: 5,
  },
  {
    id: '2',
    orderNumber: 'ORD-1237',
    partner: 'Ravi Kumar',
    customer: 'Sneha Reddy',
    address: 'Sobha Dream Acres, Bangalore',
    status: 'on_the_way',
    assignedAt: '14:20',
    estimatedDelivery: '14:40',
    items: 2,
  },
  {
    id: '3',
    orderNumber: 'ORD-1241',
    partner: 'Suresh Yadav',
    customer: 'Meera Joshi',
    address: 'Brigade Metropolis, Bangalore',
    status: 'picked_up',
    assignedAt: '14:00',
    estimatedDelivery: '14:20',
    items: 7,
  },
  {
    id: '4',
    orderNumber: 'ORD-1245',
    partner: 'Karthik M',
    customer: 'Arjun Nair',
    address: 'Mantri Pinnacle, Bangalore',
    status: 'assigned',
    assignedAt: '14:38',
    estimatedDelivery: '15:00',
    items: 3,
  },
  {
    id: '5',
    orderNumber: 'ORD-1246',
    partner: 'Karthik M',
    customer: 'Divya Rao',
    address: 'Salarpuria Sattva, Bangalore',
    status: 'on_the_way',
    assignedAt: '14:25',
    estimatedDelivery: '14:45',
    items: 4,
  },
  {
    id: '6',
    orderNumber: 'ORD-1248',
    partner: 'Karthik M',
    customer: 'Prakash Shetty',
    address: 'RMZ Galleria, Bangalore',
    status: 'assigned',
    assignedAt: '14:40',
    estimatedDelivery: '15:05',
    items: 6,
  },
  {
    id: '7',
    orderNumber: 'ORD-1250',
    partner: 'Ajay Verma',
    customer: 'Lakshmi Iyer',
    address: 'Purva Venezia, Bangalore',
    status: 'picked_up',
    assignedAt: '14:30',
    estimatedDelivery: '14:50',
    items: 3,
  },
])

function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'assigned': return 'badge-gray'
    case 'picked_up': return 'badge-info'
    case 'on_the_way': return 'badge-warning'
    case 'delivered': return 'badge-success'
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
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          Active Deliveries
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          Track ongoing delivery assignments
        </p>
      </div>
      <div class="flex items-center gap-2 text-sm bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg">
        <Icon name="heroicons:truck" class="w-4 h-4" />
        <span class="font-medium">{{ assignments.length }} active deliveries</span>
      </div>
    </div>

    <!-- Delivery Navigation -->
    <div class="flex gap-3">
      <NuxtLink to="/delivery/partners" class="btn-secondary text-sm">
        <Icon name="heroicons:user-group" class="w-4 h-4 inline mr-1" />
        Partners
      </NuxtLink>
      <NuxtLink to="/delivery/assignments" class="btn-primary text-sm">
        <Icon name="heroicons:map" class="w-4 h-4 inline mr-1" />
        Assignments
      </NuxtLink>
    </div>

    <!-- Assignments List -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div
        v-for="assignment in assignments"
        :key="assignment.id"
        class="card hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="text-sm font-semibold text-primary-600">{{ assignment.orderNumber }}</span>
            <span class="badge" :class="getStatusBadgeClass(assignment.status)">
              {{ formatStatus(assignment.status) }}
            </span>
          </div>
          <span class="text-xs text-gray-400">{{ assignment.items }} items</span>
        </div>

        <div class="space-y-2">
          <!-- Partner -->
          <div class="flex items-center gap-2 text-sm">
            <Icon name="heroicons:user" class="w-4 h-4 text-gray-400" />
            <span class="text-gray-700 font-medium">{{ assignment.partner }}</span>
          </div>

          <!-- Customer -->
          <div class="flex items-center gap-2 text-sm">
            <Icon name="heroicons:user-circle" class="w-4 h-4 text-gray-400" />
            <span class="text-gray-600">{{ assignment.customer }}</span>
          </div>

          <!-- Address -->
          <div class="flex items-center gap-2 text-sm">
            <Icon name="heroicons:map-pin" class="w-4 h-4 text-gray-400" />
            <span class="text-gray-600 truncate">{{ assignment.address }}</span>
          </div>

          <!-- Time Info -->
          <div class="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100 mt-2">
            <span>Assigned: {{ assignment.assignedAt }}</span>
            <span>ETA: {{ assignment.estimatedDelivery }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
