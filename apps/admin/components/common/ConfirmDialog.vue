<script setup lang="ts">
interface Props {
  show: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
}

withDefaults(defineProps<Props>(), {
  title: 'Confirm Action',
  message: 'Are you sure you want to proceed?',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  variant: 'danger',
})

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center"
    >
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black/50"
        @click="emit('cancel')"
      />

      <!-- Dialog -->
      <div class="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <!-- Icon -->
        <div class="flex items-center gap-3 mb-4">
          <div
            class="p-2 rounded-full"
            :class="{
              'bg-red-100': variant === 'danger',
              'bg-yellow-100': variant === 'warning',
              'bg-blue-100': variant === 'info',
            }"
          >
            <Icon
              name="heroicons:exclamation-triangle"
              class="w-6 h-6"
              :class="{
                'text-red-600': variant === 'danger',
                'text-yellow-600': variant === 'warning',
                'text-blue-600': variant === 'info',
              }"
            />
          </div>
          <h3 class="text-lg font-semibold text-gray-900">
            {{ title }}
          </h3>
        </div>

        <!-- Message -->
        <p class="text-sm text-gray-600 mb-6 ml-11">
          {{ message }}
        </p>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3">
          <button
            class="btn-secondary"
            @click="emit('cancel')"
          >
            {{ cancelText }}
          </button>
          <button
            class="px-4 py-2 rounded-lg font-medium text-white transition-colors duration-200"
            :class="{
              'bg-red-600 hover:bg-red-700': variant === 'danger',
              'bg-yellow-600 hover:bg-yellow-700': variant === 'warning',
              'bg-blue-600 hover:bg-blue-700': variant === 'info',
            }"
            @click="emit('confirm')"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
