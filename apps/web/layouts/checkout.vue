<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
        <button class="p-2 hover:bg-gray-100 rounded-full transition-colors" @click="$router.back()">
          <Icon name="mdi:arrow-left" class="w-5 h-5 text-gray-700" />
        </button>
        <NuxtLink to="/">
          <h1 class="text-xl font-extrabold text-[#0c831f]">
            blinkit
          </h1>
        </NuxtLink>
      </div>
    </header>
    <main class="max-w-4xl mx-auto px-4 py-6">
      <slot />
    </main>
  </div>
</template>
