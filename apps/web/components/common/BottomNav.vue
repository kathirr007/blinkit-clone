<script setup lang="ts">
const route = useRoute()

const navItems = [
  { path: '/', icon: 'mdi:home', label: 'Home' },
  { path: '/category', icon: 'mdi:view-grid', label: 'Categories' },
  { path: '/orders', icon: 'mdi:receipt', label: 'Orders' },
  { path: '/account', icon: 'mdi:account', label: 'Account' },
]

function isActive(path: string): boolean {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-50">
    <div class="flex items-center justify-around py-2">
      <NuxtLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors"
        :class="isActive(item.path) ? 'text-[#0c831f]' : 'text-gray-500'"
      >
        <Icon :name="item.icon" class="w-5 h-5" />
        <span class="text-[10px] font-medium">{{ item.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>
