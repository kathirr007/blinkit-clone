<script setup lang="ts">
const authStore = useAuthStore()
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <CommonSidebar />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top Bar -->
      <CommonTopBar />

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto bg-gray-50 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
