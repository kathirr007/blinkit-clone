<template>
  <div
    class="flex items-center bg-white rounded-lg px-3 py-2 gap-2 w-full cursor-pointer"
    @click="navigateTo('/search')"
  >
    <Icon name="mdi:magnify" class="w-5 h-5 text-gray-400 flex-shrink-0" />
    <span class="text-sm text-gray-400">Search for products...</span>
  </div>
</template>

<script setup lang="ts">
</script>
