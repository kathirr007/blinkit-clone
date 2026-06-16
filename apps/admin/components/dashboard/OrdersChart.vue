<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// TODO: Replace with API call to fetch order status data
const chartData = {
  labels: ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
  datasets: [
    {
      label: 'Orders',
      data: [12, 25, 18, 8, 156, 5],
      backgroundColor: [
        '#9ca3af', // gray - pending
        '#3b82f6', // blue - confirmed
        '#f59e0b', // yellow - preparing
        '#8b5cf6', // purple - out for delivery
        '#0c831f', // green - delivered
        '#ef4444', // red - cancelled
      ],
      borderRadius: 6,
    },
  ],
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
}
</script>

<template>
  <div class="card">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Orders by Status</h3>
      <span class="text-sm text-gray-500">Today</span>
    </div>
    <div class="h-64">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
