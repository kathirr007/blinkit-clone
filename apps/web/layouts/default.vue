<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    <main class="pb-20 lg:pb-0">
      <slot />
    </main>
    <BottomNav />
  </div>
</template>
