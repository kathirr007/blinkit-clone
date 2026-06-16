<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg'
  fullPage?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  fullPage: false,
})

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'w-4 h-4'
    case 'lg': return 'w-10 h-10'
    default: return 'w-6 h-6'
  }
})

const containerClass = computed(() => {
  return props.fullPage ? 'min-h-[50vh]' : ''
})
</script>

<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <div
      class="animate-spin rounded-full border-2 border-gray-300 border-t-[#0c831f]"
      :class="sizeClass"
    />
  </div>
</template>
