<script setup lang="ts">
import { formatPrice } from '~/utils/formatters'

const { items, count, subtotal, deliveryFee, total, isEmpty, updateQuantity } = useCart()
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-4">
    <h1 class="text-xl font-bold text-gray-900 mb-4">
      My Cart
    </h1>

    <!-- Empty Cart -->
    <div v-if="isEmpty" class="text-center py-16">
      <Icon name="mdi:cart-outline" class="w-20 h-20 text-gray-300 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-700 mb-2">
        Your cart is empty
      </h3>
      <p class="text-gray-500 mb-6">
        Add items to get started
      </p>
      <NuxtLink to="/" class="btn-primary inline-block">
        Browse Products
      </NuxtLink>
    </div>

    <!-- Cart Items -->
    <div v-else class="lg:grid lg:grid-cols-3 lg:gap-6">
      <!-- Items List -->
      <div class="lg:col-span-2 space-y-3 mb-6 lg:mb-0">
        <div
          v-for="item in items"
          :key="item.productId"
          class="card flex gap-3"
        >
          <img :src="item.image" :alt="item.name" class="w-16 h-16 object-contain rounded flex-shrink-0">
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 line-clamp-1">
              {{ item.name }}
            </p>
            <p class="text-xs text-gray-500">
              {{ item.unit }}
            </p>
            <div class="flex items-center justify-between mt-2">
              <span class="text-sm font-bold text-gray-900">{{ formatPrice(item.price * item.quantity) }}</span>
              <div class="flex items-center border border-[#0c831f] rounded overflow-hidden">
                <button
                  class="px-2 py-1 text-[#0c831f] hover:bg-green-50 transition-colors"
                  @click="updateQuantity(item.productId, item.quantity - 1)"
                >
                  <Icon name="mdi:minus" class="w-4 h-4" />
                </button>
                <span class="px-3 py-1 bg-[#0c831f] text-white text-sm font-bold min-w-[2rem] text-center">
                  {{ item.quantity }}
                </span>
                <button
                  class="px-2 py-1 text-[#0c831f] hover:bg-green-50 transition-colors"
                  @click="updateQuantity(item.productId, item.quantity + 1)"
                >
                  <Icon name="mdi:plus" class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cart Summary -->
      <div class="lg:col-span-1">
        <div class="card sticky top-20">
          <h3 class="text-base font-bold text-gray-900 mb-4">
            Bill Details
          </h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Subtotal</span>
              <span class="font-medium">{{ formatPrice(subtotal) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Delivery Fee</span>
              <span :class="deliveryFee === 0 ? 'text-green-600 font-medium' : 'font-medium'">
                {{ deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee) }}
              </span>
            </div>
            <div v-if="deliveryFee > 0" class="text-xs text-green-600">
              Free delivery on orders above ₹199
            </div>
            <hr class="my-2">
            <div class="flex justify-between text-base font-bold">
              <span>Total</span>
              <span>{{ formatPrice(total) }}</span>
            </div>
          </div>
          <button
            class="btn-primary w-full mt-4"
            @click="navigateTo('/checkout')"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
