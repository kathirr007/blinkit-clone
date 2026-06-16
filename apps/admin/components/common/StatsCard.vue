<script setup lang="ts">
interface Props {
  icon: string
  label: string
  value: string | number
  trend?: number
  trendLabel?: string
  iconBg?: string
}

withDefaults(defineProps<Props>(), {
  iconBg: 'bg-primary-100',
  trendLabel: 'vs last period',
})
</script>

<template>
  <div class="card">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <p class="text-sm font-medium text-gray-500">
          {{ label }}
        </p>
        <p class="mt-1 text-2xl font-bold text-gray-900">
          {{ value }}
        </p>
        <div v-if="trend !== undefined" class="mt-2 flex items-center gap-1">
          <Icon
            :name="trend >= 0 ? 'heroicons:arrow-trending-up' : 'heroicons:arrow-trending-down'"
            class="w-4 h-4"
            :class="trend >= 0 ? 'text-green-600' : 'text-red-600'"
          />
          <span
            class="text-xs font-medium"
            :class="trend >= 0 ? 'text-green-600' : 'text-red-600'"
          >
            {{ Math.abs(trend) }}%
          </span>
          <span class="text-xs text-gray-400">{{ trendLabel }}</span>
        </div>
      </div>
      <div class="p-3 rounded-lg" :class="iconBg">
        <Icon :name="icon" class="w-6 h-6 text-primary-600" />
      </div>
    </div>
  </div>
</template>
