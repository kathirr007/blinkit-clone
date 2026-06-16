<script setup lang="ts">
// TODO: Fetch categories from API
const categories = ref([
  { id: '1', name: 'Fruits & Vegetables', slug: 'fruits-vegetables', image: 'https://via.placeholder.com/80x80/4ade80/ffffff?text=FV', productCount: 120 },
  { id: '2', name: 'Dairy, Bread & Eggs', slug: 'dairy-bread-eggs', image: 'https://via.placeholder.com/80x80/fbbf24/ffffff?text=DB', productCount: 85 },
  { id: '3', name: 'Snacks & Munchies', slug: 'snacks-munchies', image: 'https://via.placeholder.com/80x80/f97316/ffffff?text=SN', productCount: 200 },
  { id: '4', name: 'Cold Drinks & Juices', slug: 'cold-drinks-juices', image: 'https://via.placeholder.com/80x80/3b82f6/ffffff?text=CD', productCount: 75 },
  { id: '5', name: 'Cleaning Essentials', slug: 'cleaning-essentials', image: 'https://via.placeholder.com/80x80/8b5cf6/ffffff?text=CL', productCount: 95 },
  { id: '6', name: 'Instant & Frozen Food', slug: 'instant-frozen-food', image: 'https://via.placeholder.com/80x80/ec4899/ffffff?text=IF', productCount: 60 },
  { id: '7', name: 'Tea, Coffee & More', slug: 'tea-coffee', image: 'https://via.placeholder.com/80x80/14b8a6/ffffff?text=TC', productCount: 45 },
  { id: '8', name: 'Baby Care', slug: 'baby-care', image: 'https://via.placeholder.com/80x80/f43f5e/ffffff?text=BC', productCount: 55 },
  { id: '9', name: 'Personal Care', slug: 'personal-care', image: 'https://via.placeholder.com/80x80/06b6d4/ffffff?text=PC', productCount: 150 },
  { id: '10', name: 'Atta, Rice & Dal', slug: 'atta-rice-dal', image: 'https://via.placeholder.com/80x80/eab308/ffffff?text=AR', productCount: 80 },
  { id: '11', name: 'Masala & Dry Fruits', slug: 'masala-dry-fruits', image: 'https://via.placeholder.com/80x80/d97706/ffffff?text=MD', productCount: 110 },
  { id: '12', name: 'Sweet Cravings', slug: 'sweet-cravings', image: 'https://via.placeholder.com/80x80/a855f7/ffffff?text=SC', productCount: 40 },
])
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-4">
    <h1 class="text-xl font-bold text-gray-900 mb-4">
      All Categories
    </h1>

    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <NuxtLink
        v-for="category in categories"
        :key="category.id"
        :to="`/category/${category.slug}`"
        class="card hover:shadow-md transition-shadow text-center"
      >
        <div class="w-20 h-20 mx-auto mb-3 rounded-full bg-green-50 flex items-center justify-center overflow-hidden">
          <img :src="category.image" :alt="category.name" class="w-14 h-14 object-contain">
        </div>
        <h3 class="text-sm font-medium text-gray-900 mb-1">
          {{ category.name }}
        </h3>
        <p class="text-xs text-gray-500">
          {{ category.productCount }} products
        </p>
      </NuxtLink>
    </div>
  </div>
</template>
