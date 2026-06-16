<script setup lang="ts">
const authStore = useAuthStore()
const router = useRouter()

const showDropdown = ref(false)

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}

async function logout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
    <!-- Left: Page Title / Search -->
    <div class="flex items-center gap-4">
      <div class="relative">
        <Icon name="heroicons:magnifying-glass" class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search..."
          class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-600 focus:border-primary-600 outline-none w-64"
        >
      </div>
    </div>

    <!-- Right: Notifications + User -->
    <div class="flex items-center gap-4">
      <!-- Notification Bell -->
      <button class="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
        <Icon name="heroicons:bell" class="w-5 h-5" />
        <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
      </button>

      <!-- Admin Avatar + Dropdown -->
      <div class="relative">
        <button
          class="flex items-center gap-2 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors"
          @click="toggleDropdown"
        >
          <div class="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
            <span class="text-white text-sm font-medium">A</span>
          </div>
          <span class="text-sm font-medium text-gray-700">Admin</span>
          <Icon name="heroicons:chevron-down" class="w-4 h-4 text-gray-500" />
        </button>

        <!-- Dropdown -->
        <div
          v-if="showDropdown"
          class="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
        >
          <button
            class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <Icon name="heroicons:user" class="w-4 h-4" />
            Profile
          </button>
          <button
            class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <Icon name="heroicons:cog-6-tooth" class="w-4 h-4" />
            Settings
          </button>
          <hr class="my-1 border-gray-200">
          <button
            class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
            @click="logout"
          >
            <Icon name="heroicons:arrow-right-on-rectangle" class="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
