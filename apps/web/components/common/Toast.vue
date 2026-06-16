<script setup lang="ts">
const { notifications, dismiss } = useNotification()

function typeClasses(type: string): string {
  switch (type) {
    case 'success': return 'bg-green-50 text-green-800 border border-green-200'
    case 'error': return 'bg-red-50 text-red-800 border border-red-200'
    case 'info': return 'bg-blue-50 text-blue-800 border border-blue-200'
    default: return 'bg-gray-50 text-gray-800 border border-gray-200'
  }
}

function typeIcon(type: string): string {
  switch (type) {
    case 'success': return 'mdi:check-circle'
    case 'error': return 'mdi:alert-circle'
    case 'info': return 'mdi:information'
    default: return 'mdi:information'
  }
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      <TransitionGroup name="toast">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[300px] max-w-md"
          :class="typeClasses(notification.type)"
        >
          <Icon :name="typeIcon(notification.type)" class="w-5 h-5 flex-shrink-0" />
          <p class="text-sm font-medium flex-1">
            {{ notification.message }}
          </p>
          <button class="p-1 hover:opacity-70" @click="dismiss(notification.id)">
            <Icon name="mdi:close" class="w-4 h-4" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
