<template>
  <div class="max-w-7xl mx-auto px-4 py-4 space-y-6">
    <!-- Hero Banner / Carousel -->
    <section class="relative rounded-xl overflow-hidden bg-gradient-to-r from-[#0c831f] to-[#2aaa41] h-40 sm:h-56 flex items-center px-6 sm:px-10">
      <div class="text-white">
        <h2 class="text-2xl sm:text-3xl font-bold mb-2">Grocery delivery in minutes</h2>
        <p class="text-green-100 text-sm sm:text-base">Get fresh fruits, vegetables, and daily essentials delivered at your doorstep</p>
      </div>
      <!-- TODO: Implement carousel with API banners -->
    </section>

    <!-- Category Grid -->
    <section>
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-gray-900">Shop by Category</h3>
        <NuxtLink to="/category" class="text-sm text-[#0c831f] font-medium hover:underline">See all</NuxtLink>
      </div>
      <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
        <NuxtLink
          v-for="category in categories"
          :key="category.id"
          :to="`/category/${category.slug}`"
          class="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-green-50 transition-colors"
        >
          <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-green-50 flex items-center justify-center overflow-hidden">
            <img :src="category.image" :alt="category.name" class="w-10 h-10 object-contain" />
          </div>
          <span class="text-xs text-center font-medium text-gray-700 line-clamp-2">{{ category.name }}</span>
        </NuxtLink>
      </div>
    </section>

    <!-- Deal of the Day -->
    <section>
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <h3 class="text-lg font-bold text-gray-900">Deal of the Day</h3>
          <span class="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded">SALE</span>
        </div>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <div
          v-for="product in dealProducts"
          :key="product.id"
          class="card hover:shadow-md transition-shadow cursor-pointer"
          @click="navigateTo(`/product/${product.slug}`)"
        >
          <div class="relative mb-2">
            <img :src="product.image" :alt="product.name" class="w-full h-28 sm:h-32 object-contain" />
            <span v-if="product.compareAtPrice" class="absolute top-0 left-0 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              {{ getDiscountPercentage(product.price, product.compareAtPrice) }}% OFF
            </span>
          </div>
          <p class="text-xs text-gray-500 mb-0.5">{{ product.brand }}</p>
          <p class="text-sm font-medium text-gray-900 line-clamp-2 mb-1">{{ product.name }}</p>
          <p class="text-xs text-gray-500 mb-2">{{ product.unit }}</p>
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
    </section>

    <!-- Trending Products -->
    <section>
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-gray-900">Trending Products</h3>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <div
          v-for="product in trendingProducts"
          :key="product.id"
          class="card hover:shadow-md transition-shadow cursor-pointer"
          @click="navigateTo(`/product/${product.slug}`)"
        >
          <div class="relative mb-2">
            <img :src="product.image" :alt="product.name" class="w-full h-28 sm:h-32 object-contain" />
          </div>
          <p class="text-xs text-gray-500 mb-0.5">{{ product.brand }}</p>
          <p class="text-sm font-medium text-gray-900 line-clamp-2 mb-1">{{ product.name }}</p>
          <p class="text-xs text-gray-500 mb-2">{{ product.unit }}</p>
          <div class="flex items-center justify-between">
            <span class="text-sm font-bold text-gray-900">{{ formatPrice(product.price) }}</span>
            <button
              class="bg-[#0c831f] text-white text-xs font-bold px-3 py-1.5 rounded hover:bg-[#0a6e1a] transition-colors"
              @click.stop="addToCart(product)"
            >
              ADD
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { formatPrice, getDiscountPercentage } from '~/utils/formatters'

const { addItem } = useCart()

// TODO: Fetch categories from API
const categories = ref([
  { id: '1', name: 'Fruits & Vegetables', slug: 'fruits-vegetables', image: 'https://via.placeholder.com/64x64/4ade80/ffffff?text=FV' },
  { id: '2', name: 'Dairy & Bread', slug: 'dairy-bread', image: 'https://via.placeholder.com/64x64/fbbf24/ffffff?text=DB' },
  { id: '3', name: 'Snacks', slug: 'snacks', image: 'https://via.placeholder.com/64x64/f97316/ffffff?text=SN' },
  { id: '4', name: 'Beverages', slug: 'beverages', image: 'https://via.placeholder.com/64x64/3b82f6/ffffff?text=BV' },
  { id: '5', name: 'Cleaning', slug: 'cleaning', image: 'https://via.placeholder.com/64x64/8b5cf6/ffffff?text=CL' },
  { id: '6', name: 'Instant Food', slug: 'instant-food', image: 'https://via.placeholder.com/64x64/ec4899/ffffff?text=IF' },
  { id: '7', name: 'Personal Care', slug: 'personal-care', image: 'https://via.placeholder.com/64x64/14b8a6/ffffff?text=PC' },
  { id: '8', name: 'Baby Care', slug: 'baby-care', image: 'https://via.placeholder.com/64x64/f43f5e/ffffff?text=BC' },
])

// TODO: Fetch deal products from API
const dealProducts = ref([
  { id: '1', name: 'Fresh Bananas', slug: 'fresh-bananas', brand: 'Fresh Farm', price: 45, compareAtPrice: 60, unit: '1 dozen', image: 'https://via.placeholder.com/150x150/fef3c7/92400e?text=Banana' },
  { id: '2', name: 'Amul Milk 1L', slug: 'amul-milk-1l', brand: 'Amul', price: 65, compareAtPrice: 72, unit: '1 litre', image: 'https://via.placeholder.com/150x150/dbeafe/1e40af?text=Milk' },
  { id: '3', name: 'Aashirvaad Atta 5kg', slug: 'aashirvaad-atta', brand: 'Aashirvaad', price: 299, compareAtPrice: 380, unit: '5 kg', image: 'https://via.placeholder.com/150x150/fef9c3/854d0e?text=Atta' },
  { id: '4', name: 'Maggi Noodles Pack', slug: 'maggi-noodles', brand: 'Nestle', price: 56, compareAtPrice: 70, unit: 'Pack of 4', image: 'https://via.placeholder.com/150x150/fecaca/991b1b?text=Maggi' },
  { id: '5', name: 'Surf Excel Liquid', slug: 'surf-excel', brand: 'Surf Excel', price: 199, compareAtPrice: 250, unit: '1 litre', image: 'https://via.placeholder.com/150x150/e0e7ff/3730a3?text=Surf' },
])

// TODO: Fetch trending products from API
const trendingProducts = ref([
  { id: '6', name: 'Organic Tomatoes', slug: 'organic-tomatoes', brand: 'Farm Fresh', price: 40, unit: '500 g', image: 'https://via.placeholder.com/150x150/fecaca/991b1b?text=Tomato' },
  { id: '7', name: 'Bread Whole Wheat', slug: 'bread-whole-wheat', brand: 'Harvest Gold', price: 45, unit: '400 g', image: 'https://via.placeholder.com/150x150/fef3c7/92400e?text=Bread' },
  { id: '8', name: 'Eggs (6 pack)', slug: 'eggs-6-pack', brand: 'Country Fresh', price: 54, unit: '6 pieces', image: 'https://via.placeholder.com/150x150/fef9c3/854d0e?text=Eggs' },
  { id: '9', name: 'Onions', slug: 'onions', brand: 'Farm Fresh', price: 35, unit: '1 kg', image: 'https://via.placeholder.com/150x150/fde68a/92400e?text=Onion' },
  { id: '10', name: 'Curd 400g', slug: 'curd-400g', brand: 'Amul', price: 35, unit: '400 g', image: 'https://via.placeholder.com/150x150/dbeafe/1e40af?text=Curd' },
])

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
