<script setup lang="ts">
definePageMeta({
  middleware: ['admin'],
})

// TODO: Replace with API calls to fetch dashboard stats
const stats = ref({
  totalOrders: 1284,
  revenueToday: '₹72,450',
  activeUsers: 342,
  pendingOrders: 12,
})
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">
        Dashboard
      </h1>
      <p class="text-sm text-gray-500 mt-1">
        Overview of your store performance
      </p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <CommonStatsCard
        icon="heroicons:shopping-cart"
        label="Total Orders"
        :value="stats.totalOrders"
        :trend="12.5"
        trend-label="vs last week"
        icon-bg="bg-blue-100"
      />
      <CommonStatsCard
        icon="heroicons:currency-rupee"
        label="Revenue Today"
        :value="stats.revenueToday"
        :trend="8.2"
        trend-label="vs yesterday"
        icon-bg="bg-green-100"
      />
      <CommonStatsCard
        icon="heroicons:users"
        label="Active Users"
        :value="stats.activeUsers"
        :trend="-2.4"
        trend-label="vs last hour"
        icon-bg="bg-purple-100"
      />
      <CommonStatsCard
        icon="heroicons:clock"
        label="Pending Orders"
        :value="stats.pendingOrders"
        :trend="0"
        trend-label="needs attention"
        icon-bg="bg-yellow-100"
      />
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <DashboardRevenueChart />
      <DashboardOrdersChart />
    </div>

    <!-- Recent Orders -->
    <DashboardRecentOrders />
  </div>
</template>
