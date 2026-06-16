<template>
  <div class="min-h-screen bg-white flex flex-col items-center justify-center px-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <NuxtLink to="/" class="inline-block">
          <h1 class="text-4xl font-extrabold text-[#0c831f]">blinkit</h1>
          <p class="text-sm text-gray-500 mt-1">Grocery delivery in minutes</p>
        </NuxtLink>
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
