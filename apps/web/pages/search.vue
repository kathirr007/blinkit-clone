<script setup lang="ts">
import { formatPrice } from '~/utils/formatters'

const searchInput = ref<HTMLInputElement>()
const query = ref('')
const recentSearches = ref<string[]>([])

// Mock data for search
const mockProducts = [
  { id: '1', name: 'Fresh Bananas', slug: 'fresh-bananas', brand: 'Fresh Farm', price: 45, unit: '1 dozen', image: 'https://via.placeholder.com/150x150/fef3c7/92400e?text=Banana' },
  { id: '2', name: 'Amul Milk 1L', slug: 'amul-milk-1l', brand: 'Amul', price: 65, unit: '1 litre', image: 'https://via.placeholder.com/150x150/dbeafe/1e40af?text=Milk' },
  { id: '3', name: 'Aashirvaad Atta 5kg', slug: 'aashirvaad-atta', brand: 'Aashirvaad', price: 299, unit: '5 kg', image: 'https://via.placeholder.com/150x150/fef9c3/854d0e?text=Atta' },
  { id: '4', name: 'Maggi Noodles Pack', slug: 'maggi-noodles', brand: 'Nestle', price: 56, unit: 'Pack of 4', image: 'https://via.placeholder.com/150x150/fecaca/991b1b?text=Maggi' },
  { id: '5', name: 'Organic Tomatoes', slug: 'organic-tomatoes', brand: 'Farm Fresh', price: 40, unit: '500 g', image: 'https://via.placeholder.com/150x150/fecaca/991b1b?text=Tomato' },
  { id: '6', name: 'Bread Whole Wheat', slug: 'bread-whole-wheat', brand: 'Harvest Gold', price: 45, unit: '400 g', image: 'https://via.placeholder.com/150x150/fef3c7/92400e?text=Bread' },
]

// Load recent searches from localStorage
onMounted(() => {
  searchInput.value?.focus()
  const stored = localStorage.getItem('recentSearches')
  if (stored) {
    recentSearches.value = JSON.parse(stored)
  }
})

// TODO: Replace with API search
const searchResults = computed(() => {
  if (!query.value) return []
  const q = query.value.toLowerCase()
  return mockProducts.filter(
    p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q),
  )
})

function onSearch() {
  // TODO: Debounce and call search API
}

function clearSearch() {
  query.value = ''
  searchInput.value?.focus()
}

function clearRecent() {
  recentSearches.value = []
  localStorage.removeItem('recentSearches')
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-4">
    <!-- Search Input -->
    <div class="flex items-center gap-3 bg-white rounded-lg border border-gray-200 px-4 py-3 mb-4 shadow-sm">
      <Icon name="mdi:magnify" class="w-5 h-5 text-gray-400" />
      <input
        ref="searchInput"
        v-model="query"
        type="text"
        placeholder="Search for products..."
        class="flex-1 outline-none text-sm"
        @input="onSearch"
      >
      <button v-if="query" class="p-1 hover:bg-gray-100 rounded" @click="clearSearch">
        <Icon name="mdi:close" class="w-4 h-4 text-gray-400" />
      </button>
    </div>

    <!-- Recent Searches -->
    <div v-if="!query && recentSearches.length > 0" class="mb-6">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-sm font-semibold text-gray-700">
          Recent Searches
        </h3>
        <button class="text-xs text-gray-400 hover:text-gray-600" @click="clearRecent">
          Clear all
        </button>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="search in recentSearches"
          :key="search"
          class="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full text-sm text-gray-700 transition-colors"
          @click="query = search; onSearch()"
        >
          <Icon name="mdi:clock-outline" class="w-3.5 h-3.5 text-gray-400" />
          {{ search }}
        </button>
      </div>
    </div>

    <!-- Search Results -->
    <div v-if="query && searchResults.length > 0">
      <p class="text-sm text-gray-500 mb-3">
        {{ searchResults.length }} results for "{{ query }}"
      </p>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        <div
          v-for="product in searchResults"
          :key="product.id"
          class="card hover:shadow-md transition-shadow cursor-pointer"
          @click="navigateTo(`/product/${product.slug}`)"
        >
          <img :src="product.image" :alt="product.name" class="w-full h-28 object-contain mb-2">
          <p class="text-xs text-gray-500">
            {{ product.brand }}
          </p>
          <p class="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
            {{ product.name }}
          </p>
          <p class="text-xs text-gray-500 mb-2">
            {{ product.unit }}
          </p>
          <div class="flex items-center justify-between">
            <span class="text-sm font-bold">{{ formatPrice(product.price) }}</span>
            <button
              class="bg-[#0c831f] text-white text-xs font-bold px-3 py-1.5 rounded"
              @click.stop
            >
              ADD
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- No Results -->
    <div v-else-if="query && searchResults.length === 0" class="text-center py-12">
      <Icon name="mdi:magnify" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <p class="text-gray-500">
        No products found for "{{ query }}"
      </p>
      <p class="text-sm text-gray-400 mt-1">
        Try a different search term
      </p>
    </div>

    <!-- Empty state when no query -->
    <div v-else-if="!query && recentSearches.length === 0" class="text-center py-12">
      <Icon name="mdi:magnify" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <p class="text-gray-500">
        Search for groceries, fruits, snacks and more
      </p>
    </div>
  </div>
</template>
