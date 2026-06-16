<script setup lang="ts">
import { formatPrice, getDiscountPercentage } from '~/utils/formatters'

const route = useRoute()
const { addItem } = useCart()

const slug = route.params.slug as string
const sortBy = ref('popularity')
const currentPage = ref(1)
const selectedPriceRanges = ref<string[]>([])
const selectedBrands = ref<string[]>([])
const totalPages = ref(3)

// TODO: Fetch category name from API based on slug
const categoryName = computed(() => {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
})

const priceRanges = [
  { label: 'Under ₹50', value: '0-50' },
  { label: '₹50 - ₹100', value: '50-100' },
  { label: '₹100 - ₹200', value: '100-200' },
  { label: '₹200 - ₹500', value: '200-500' },
  { label: 'Above ₹500', value: '500+' },
]

const brands = ['Amul', 'Nestle', 'Britannia', 'Parle', 'ITC', 'Hindustan Unilever']

// TODO: Fetch products from API
const products = ref([
  { id: '1', name: 'Fresh Bananas', slug: 'fresh-bananas', brand: 'Fresh Farm', price: 45, compareAtPrice: 60, unit: '1 dozen', image: 'https://via.placeholder.com/150x150/fef3c7/92400e?text=Banana' },
  { id: '2', name: 'Amul Milk 1L', slug: 'amul-milk-1l', brand: 'Amul', price: 65, compareAtPrice: 72, unit: '1 litre', image: 'https://via.placeholder.com/150x150/dbeafe/1e40af?text=Milk' },
  { id: '3', name: 'Aashirvaad Atta 5kg', slug: 'aashirvaad-atta', brand: 'Aashirvaad', price: 299, compareAtPrice: 380, unit: '5 kg', image: 'https://via.placeholder.com/150x150/fef9c3/854d0e?text=Atta' },
  { id: '4', name: 'Maggi Noodles Pack', slug: 'maggi-noodles', brand: 'Nestle', price: 56, compareAtPrice: 70, unit: 'Pack of 4', image: 'https://via.placeholder.com/150x150/fecaca/991b1b?text=Maggi' },
  { id: '5', name: 'Organic Tomatoes', slug: 'organic-tomatoes', brand: 'Farm Fresh', price: 40, unit: '500 g', image: 'https://via.placeholder.com/150x150/fecaca/991b1b?text=Tomato' },
  { id: '6', name: 'Bread Whole Wheat', slug: 'bread-whole-wheat', brand: 'Harvest Gold', price: 45, unit: '400 g', image: 'https://via.placeholder.com/150x150/fef3c7/92400e?text=Bread' },
  { id: '7', name: 'Eggs (6 pack)', slug: 'eggs-6-pack', brand: 'Country Fresh', price: 54, unit: '6 pieces', image: 'https://via.placeholder.com/150x150/fef9c3/854d0e?text=Eggs' },
  { id: '8', name: 'Curd 400g', slug: 'curd-400g', brand: 'Amul', price: 35, unit: '400 g', image: 'https://via.placeholder.com/150x150/dbeafe/1e40af?text=Curd' },
])

const sortedProducts = computed(() => {
  const sorted = [...products.value]
  switch (sortBy.value) {
    case 'price_low': return sorted.sort((a, b) => a.price - b.price)
    case 'price_high': return sorted.sort((a, b) => b.price - a.price)
    case 'discount': return sorted.sort((a, b) => {
      const discA = getDiscountPercentage(a.price, a.compareAtPrice)
      const discB = getDiscountPercentage(b.price, b.compareAtPrice)
      return discB - discA
    })
    default: return sorted
  }
})

function addToCart(product: any) {
  addItem({
    productId: product.id,
    name: product.name,
    image: product.image,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    unit: product.unit,
    quantity: 1,
  })
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-4">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <h1 class="text-xl font-bold text-gray-900">
          {{ categoryName }}
        </h1>
        <p class="text-sm text-gray-500">
          {{ products.length }} products
        </p>
      </div>
      <!-- Sort -->
      <select v-model="sortBy" class="text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500">
        <option value="popularity">
          Popularity
        </option>
        <option value="price_low">
          Price: Low to High
        </option>
        <option value="price_high">
          Price: High to Low
        </option>
        <option value="discount">
          Discount
        </option>
      </select>
    </div>

    <div class="lg:flex lg:gap-6">
      <!-- Filters Sidebar (Desktop) -->
      <aside class="hidden lg:block w-56 flex-shrink-0">
        <div class="card sticky top-20">
          <h3 class="text-sm font-bold text-gray-900 mb-3">
            Filters
          </h3>

          <!-- Price Range -->
          <div class="mb-4">
            <h4 class="text-xs font-semibold text-gray-700 mb-2 uppercase">
              Price Range
            </h4>
            <div class="space-y-1">
              <label v-for="range in priceRanges" :key="range.label" class="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input v-model="selectedPriceRanges" type="checkbox" :value="range.value" class="rounded text-[#0c831f] focus:ring-[#0c831f]">
                {{ range.label }}
              </label>
            </div>
          </div>

          <!-- Brand -->
          <div>
            <h4 class="text-xs font-semibold text-gray-700 mb-2 uppercase">
              Brand
            </h4>
            <div class="space-y-1">
              <label v-for="brand in brands" :key="brand" class="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input v-model="selectedBrands" type="checkbox" :value="brand" class="rounded text-[#0c831f] focus:ring-[#0c831f]">
                {{ brand }}
              </label>
            </div>
          </div>
        </div>
      </aside>

      <!-- Product Grid -->
      <div class="flex-1">
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <div
            v-for="product in sortedProducts"
            :key="product.id"
            class="card hover:shadow-md transition-shadow cursor-pointer"
            @click="navigateTo(`/product/${product.slug}`)"
          >
            <div class="relative mb-2">
              <img :src="product.image" :alt="product.name" class="w-full h-28 sm:h-32 object-contain">
              <span v-if="product.compareAtPrice" class="absolute top-0 left-0 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                {{ getDiscountPercentage(product.price, product.compareAtPrice) }}% OFF
              </span>
            </div>
            <p class="text-xs text-gray-500 mb-0.5">
              {{ product.brand }}
            </p>
            <p class="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
              {{ product.name }}
            </p>
            <p class="text-xs text-gray-500 mb-2">
              {{ product.unit }}
            </p>
            <div class="flex items-center justify-between">
              <div>
                <span class="text-sm font-bold text-gray-900">{{ formatPrice(product.price) }}</span>
                <span v-if="product.compareAtPrice" class="text-xs text-gray-400 line-through ml-1">{{ formatPrice(product.compareAtPrice) }}</span>
              </div>
              <button
                class="bg-[#0c831f] text-white text-xs font-bold px-3 py-1.5 rounded hover:bg-[#0a6e1a] transition-colors"
                @click.stop="addToCart(product)"
              >
                ADD
              </button>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="flex justify-center mt-8 gap-2">
          <button
            v-for="page in totalPages"
            :key="page"
            class="w-8 h-8 rounded-lg text-sm font-medium transition-colors"
            :class="currentPage === page ? 'bg-[#0c831f] text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'"
            @click="currentPage = page"
          >
            {{ page }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
