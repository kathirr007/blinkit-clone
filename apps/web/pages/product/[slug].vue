<script setup lang="ts">
import { formatPrice, getDiscountPercentage } from '~/utils/formatters'

const route = useRoute()
const { addItem, updateQuantity, getItemQuantity } = useCart()

const slug = route.params.slug as string
const selectedImage = ref(0)
const selectedVariant = ref('1')

// TODO: Fetch product from API based on slug
const product = ref({
  id: '1',
  name: 'Fresh Organic Bananas',
  slug: 'fresh-organic-bananas',
  brand: 'Fresh Farm Organics',
  description: 'These premium organic bananas are sourced directly from certified organic farms. Rich in potassium, fiber, and natural sugars, they make for a perfect healthy snack. Each bunch is hand-picked to ensure the best quality and freshness delivered to your doorstep.',
  price: 45,
  compareAtPrice: 60,
  unit: '1 dozen (approx. 1.2 kg)',
  images: [
    'https://via.placeholder.com/400x400/fef3c7/92400e?text=Banana+1',
    'https://via.placeholder.com/400x400/fef9c3/854d0e?text=Banana+2',
    'https://via.placeholder.com/400x400/fde68a/92400e?text=Banana+3',
  ],
  categoryId: '1',
  categoryName: 'Fruits & Vegetables',
  inStock: true,
  rating: 4.3,
  reviewCount: 128,
})

const variants = ref([
  { id: '1', label: '1 dozen' },
  { id: '2', label: '2 dozen' },
  { id: '3', label: '500g' },
])

const reviews = ref([
  { id: '1', userName: 'Rahul M.', rating: 5, comment: 'Fresh and tasty bananas. Delivered within 10 minutes!' },
  { id: '2', userName: 'Priya S.', rating: 4, comment: 'Good quality. A couple were slightly green but ripened in a day.' },
  { id: '3', userName: 'Amit K.', rating: 4, comment: 'Regular purchase. Always fresh and well-packed.' },
])

const cartQuantity = computed(() => getItemQuantity(product.value.id))

function handleAddToCart() {
  addItem({
    productId: product.value.id,
    name: product.value.name,
    image: product.value.images[0],
    price: product.value.price,
    compareAtPrice: product.value.compareAtPrice,
    unit: product.value.unit,
    quantity: 1,
  })
}
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-4">
    <div class="lg:grid lg:grid-cols-2 lg:gap-8">
      <!-- Image Section -->
      <div class="mb-6 lg:mb-0">
        <div class="card">
          <!-- Main Image -->
          <div class="relative aspect-square flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden mb-3">
            <img :src="product.images[selectedImage]" :alt="product.name" class="max-w-full max-h-full object-contain">
            <span v-if="product.compareAtPrice" class="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
              {{ getDiscountPercentage(product.price, product.compareAtPrice) }}% OFF
            </span>
          </div>
          <!-- Thumbnail strip -->
          <div class="flex gap-2 overflow-x-auto">
            <button
              v-for="(img, idx) in product.images"
              :key="idx"
              class="w-16 h-16 rounded-lg border-2 overflow-hidden flex-shrink-0 transition-colors"
              :class="selectedImage === idx ? 'border-[#0c831f]' : 'border-gray-200'"
              @click="selectedImage = idx"
            >
              <img :src="img" class="w-full h-full object-contain">
            </button>
          </div>
        </div>
      </div>

      <!-- Product Info -->
      <div>
        <div class="mb-4">
          <p class="text-sm text-gray-500 mb-1">
            {{ product.brand }}
          </p>
          <h1 class="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
            {{ product.name }}
          </h1>
          <p class="text-sm text-gray-500">
            {{ product.unit }}
          </p>
        </div>

        <!-- Rating -->
        <div class="flex items-center gap-2 mb-4">
          <div class="flex items-center bg-green-600 text-white text-xs font-bold px-1.5 py-0.5 rounded gap-0.5">
            <span>{{ product.rating }}</span>
            <Icon name="mdi:star" class="w-3 h-3" />
          </div>
          <span class="text-sm text-gray-500">{{ product.reviewCount }} reviews</span>
        </div>

        <!-- Price -->
        <div class="flex items-baseline gap-3 mb-6">
          <span class="text-2xl font-bold text-gray-900">{{ formatPrice(product.price) }}</span>
          <span v-if="product.compareAtPrice" class="text-lg text-gray-400 line-through">{{ formatPrice(product.compareAtPrice) }}</span>
          <span v-if="product.compareAtPrice" class="text-sm font-bold text-blue-600">
            {{ getDiscountPercentage(product.price, product.compareAtPrice) }}% off
          </span>
        </div>

        <!-- Variant Selector -->
        <div v-if="variants.length > 1" class="mb-6">
          <h3 class="text-sm font-semibold text-gray-700 mb-2">
            Select Variant
          </h3>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="variant in variants"
              :key="variant.id"
              class="px-4 py-2 rounded-lg border text-sm font-medium transition-colors"
              :class="selectedVariant === variant.id
                ? 'border-[#0c831f] bg-green-50 text-[#0c831f]'
                : 'border-gray-200 text-gray-700 hover:border-gray-300'"
              @click="selectedVariant = variant.id"
            >
              {{ variant.label }}
            </button>
          </div>
        </div>

        <!-- Add to Cart -->
        <div class="flex items-center gap-4 mb-6">
          <div v-if="cartQuantity > 0" class="flex items-center border border-[#0c831f] rounded-lg overflow-hidden">
            <button
              class="px-4 py-3 text-[#0c831f] hover:bg-green-50 transition-colors"
              @click="updateQuantity(product.id, cartQuantity - 1)"
            >
              <Icon name="mdi:minus" class="w-5 h-5" />
            </button>
            <span class="px-6 py-3 bg-[#0c831f] text-white font-bold">{{ cartQuantity }}</span>
            <button
              class="px-4 py-3 text-[#0c831f] hover:bg-green-50 transition-colors"
              @click="updateQuantity(product.id, cartQuantity + 1)"
            >
              <Icon name="mdi:plus" class="w-5 h-5" />
            </button>
          </div>
          <button
            v-else
            class="btn-primary text-base px-8 py-3"
            @click="handleAddToCart"
          >
            Add to Cart
          </button>
        </div>

        <!-- Description -->
        <div class="border-t border-gray-100 pt-4">
          <h3 class="text-base font-bold text-gray-900 mb-2">
            Description
          </h3>
          <p class="text-sm text-gray-600 leading-relaxed">
            {{ product.description }}
          </p>
        </div>

        <!-- Reviews Section -->
        <div class="border-t border-gray-100 pt-4 mt-4">
          <h3 class="text-base font-bold text-gray-900 mb-4">
            Reviews ({{ product.reviewCount }})
          </h3>
          <div class="space-y-4">
            <div v-for="review in reviews" :key="review.id" class="border-b border-gray-50 pb-3">
              <div class="flex items-center gap-2 mb-1">
                <div class="flex items-center bg-green-600 text-white text-[10px] font-bold px-1 py-0.5 rounded gap-0.5">
                  <span>{{ review.rating }}</span>
                  <Icon name="mdi:star" class="w-2.5 h-2.5" />
                </div>
                <span class="text-sm font-medium text-gray-700">{{ review.userName }}</span>
              </div>
              <p class="text-sm text-gray-600">
                {{ review.comment }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
