<template>
  <header class="bg-[#0c831f] sticky top-0 z-50">
    <!-- Top section -->
    <div class="max-w-7xl mx-auto px-4 py-2">
      <div class="flex items-center justify-between gap-4">
        <!-- Logo & Delivery info -->
        <div class="flex items-center gap-3">
          <NuxtLink to="/" class="flex-shrink-0">
            <h1 class="text-2xl font-extrabold text-white">blinkit</h1>
          </NuxtLink>
          <div class="hidden sm:block border-l border-green-400 pl-3">
            <p class="text-xs font-bold text-white">Delivery in 10 minutes</p>
            <p class="text-xs text-green-200 flex items-center gap-1">
              <Icon name="mdi:map-marker" class="w-3 h-3" />
              <span class="truncate max-w-[200px]">{{ deliveryAddress }}</span>
              <Icon name="mdi:chevron-down" class="w-3 h-3" />
            </p>
          </div>
        </div>

        <!-- Search bar (desktop) -->
        <div class="hidden md:flex flex-1 max-w-xl mx-4">
          <SearchBar />
        </div>

        <!-- Cart button -->
        <button
          @click="navigateTo('/cart')"
          class="relative flex items-center gap-2 bg-[#2a9d3f] hover:bg-[#248a36] text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Icon name="mdi:cart" class="w-5 h-5" />
          <span class="text-sm font-medium hidden sm:inline">My Cart</span>
          <span
            v-if="cartCount > 0"
            class="absolute -top-1 -right-1 bg-yellow-400 text-green-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
          >
            {{ cartCount }}
          </span>
        </button>
      </div>
    </div>

    <!-- Mobile search -->
    <div class="md:hidden px-4 pb-2">
      <SearchBar />
    </div>
  </header>
</template>

<script setup lang="ts">
const { count: cartCount } = useCart()

// TODO: Get from user's saved addresses
const deliveryAddress = ref('Select delivery address')
</script>
