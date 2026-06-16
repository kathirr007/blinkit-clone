<script setup lang="ts">
const route = useRoute()

const navItems = [
  { label: 'Dashboard', icon: 'heroicons:chart-bar', path: '/' },
  { label: 'Products', icon: 'heroicons:shopping-bag', path: '/products' },
  { label: 'Categories', icon: 'heroicons:folder', path: '/categories' },
  { label: 'Orders', icon: 'heroicons:receipt-percent', path: '/orders' },
  { label: 'Inventory', icon: 'heroicons:archive-box', path: '/inventory' },
  { label: 'Delivery', icon: 'heroicons:truck', path: '/delivery/partners' },
]

function isActive(path: string): boolean {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <aside class="w-64 bg-slate-900 text-white flex flex-col flex-shrink-0">
    <!-- Logo -->
    <div class="h-16 flex items-center px-6 border-b border-slate-700">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-sm">B</span>
        </div>
        <span class="text-lg font-bold">Blinkit Admin</span>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      <NuxtLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200"
        :class="[
          isActive(item.path)
            ? 'bg-primary-600 text-white'
            : 'text-slate-300 hover:bg-slate-800 hover:text-white',
        ]"
      >
        <Icon :name="item.icon" class="w-5 h-5" />
        <span>{{ item.label }}</span>
      </NuxtLink>
    </nav>

    <!-- Footer -->
    <div class="px-4 py-3 border-t border-slate-700">
      <p class="text-xs text-slate-400 text-center">
        Blinkit Admin v0.0.1
      </p>
    </div>
  </aside>
</template>
