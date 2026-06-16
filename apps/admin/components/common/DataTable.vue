<script setup lang="ts">
interface Column {
  key: string
  label: string
  width?: string
  align?: 'left' | 'center' | 'right'
}

interface Props {
  columns: Column[]
  data: any[]
  loading?: boolean
  currentPage?: number
  totalPages?: number
  emptyMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  currentPage: 1,
  totalPages: 1,
  emptyMessage: 'No data available',
})

const emit = defineEmits<{
  (e: 'pageChange', page: number): void
  (e: 'rowClick', row: any): void
}>()

function goToPage(page: number) {
  if (page >= 1 && page <= props.totalPages) {
    emit('pageChange', page)
  }
}

const visiblePages = computed(() => {
  const pages: number[] = []
  const start = Math.max(1, props.currentPage - 2)
  const end = Math.min(props.totalPages, props.currentPage + 2)
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th
              v-for="col in columns"
              :key="col.key"
              class="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider"
              :class="[
                col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left',
              ]"
              :style="col.width ? { width: col.width } : {}"
            >
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <!-- Loading State -->
          <tr v-if="loading">
            <td :colspan="columns.length" class="px-4 py-12 text-center">
              <div class="flex flex-col items-center gap-2">
                <div class="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
                <span class="text-sm text-gray-500">Loading...</span>
              </div>
            </td>
          </tr>

          <!-- Empty State -->
          <tr v-else-if="data.length === 0">
            <td :colspan="columns.length" class="px-4 py-12 text-center">
              <div class="flex flex-col items-center gap-2">
                <Icon name="heroicons:inbox" class="w-12 h-12 text-gray-300" />
                <span class="text-sm text-gray-500">{{ emptyMessage }}</span>
              </div>
            </td>
          </tr>

          <!-- Data Rows -->
          <tr
            v-for="(row, index) in data"
            v-else
            :key="index"
            class="hover:bg-gray-50 cursor-pointer transition-colors"
            @click="emit('rowClick', row)"
          >
            <td
              v-for="col in columns"
              :key="col.key"
              class="px-4 py-3 text-sm"
              :class="[
                col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left',
              ]"
            >
              <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
                {{ row[col.key] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div
      v-if="totalPages > 1"
      class="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50"
    >
      <p class="text-sm text-gray-600">
        Page {{ currentPage }} of {{ totalPages }}
      </p>
      <div class="flex items-center gap-1">
        <button
          class="px-3 py-1 text-sm rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          Prev
        </button>
        <button
          v-for="page in visiblePages"
          :key="page"
          class="px-3 py-1 text-sm rounded-md border transition-colors"
          :class="[
            page === currentPage
              ? 'bg-primary-600 text-white border-primary-600'
              : 'border-gray-300 hover:bg-gray-100',
          ]"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
        <button
          class="px-3 py-1 text-sm rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>
