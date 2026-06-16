<template>
  <div class="max-w-2xl mx-auto px-4 py-4">
    <h1 class="text-xl font-bold text-gray-900 mb-6">My Account</h1>

    <!-- Profile Card -->
    <div class="card mb-6">
      <div class="flex items-center gap-4 mb-6">
        <div class="w-16 h-16 rounded-full bg-[#0c831f] flex items-center justify-center text-white text-xl font-bold">
          {{ userInitials }}
        </div>
        <div>
          <h2 class="text-lg font-bold text-gray-900">{{ profile.name }}</h2>
          <p class="text-sm text-gray-500">{{ profile.phone }}</p>
        </div>
      </div>

      <!-- Edit Form -->
      <div v-if="isEditing" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input v-model="editForm.name" type="text" class="input-field" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input :value="profile.phone" type="tel" class="input-field bg-gray-50" disabled />
          <p class="text-xs text-gray-400 mt-1">Phone number cannot be changed</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input v-model="editForm.email" type="email" class="input-field" />
        </div>
        <div class="flex gap-3">
          <button class="btn-secondary flex-1" @click="cancelEdit">Cancel</button>
          <button class="btn-primary flex-1" @click="saveProfile">Save Changes</button>
        </div>
      </div>

      <!-- Profile Info -->
      <div v-else class="space-y-3">
        <div class="flex justify-between items-center py-2 border-b border-gray-50">
          <div>
            <p class="text-xs text-gray-500">Name</p>
            <p class="text-sm font-medium text-gray-900">{{ profile.name }}</p>
          </div>
        </div>
        <div class="flex justify-between items-center py-2 border-b border-gray-50">
          <div>
            <p class="text-xs text-gray-500">Phone</p>
            <p class="text-sm font-medium text-gray-900">{{ profile.phone }}</p>
          </div>
        </div>
        <div class="flex justify-between items-center py-2 border-b border-gray-50">
          <div>
            <p class="text-xs text-gray-500">Email</p>
            <p class="text-sm font-medium text-gray-900">{{ profile.email || 'Not added' }}</p>
          </div>
        </div>
        <button class="btn-secondary w-full mt-4" @click="startEdit">Edit Profile</button>
      </div>
    </div>

    <!-- Quick Links -->
    <div class="card">
      <h3 class="text-base font-bold text-gray-900 mb-3">Quick Links</h3>
      <div class="space-y-1">
        <NuxtLink to="/orders" class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
          <div class="flex items-center gap-3">
            <Icon name="mdi:receipt" class="w-5 h-5 text-gray-500" />
            <span class="text-sm font-medium text-gray-700">My Orders</span>
          </div>
          <Icon name="mdi:chevron-right" class="w-5 h-5 text-gray-400" />
        </NuxtLink>
        <NuxtLink to="/account/addresses" class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
          <div class="flex items-center gap-3">
            <Icon name="mdi:map-marker" class="w-5 h-5 text-gray-500" />
            <span class="text-sm font-medium text-gray-700">Saved Addresses</span>
          </div>
          <Icon name="mdi:chevron-right" class="w-5 h-5 text-gray-400" />
        </NuxtLink>
        <button @click="handleLogout" class="flex items-center justify-between p-3 rounded-lg hover:bg-red-50 transition-colors w-full">
          <div class="flex items-center gap-3">
            <Icon name="mdi:logout" class="w-5 h-5 text-red-500" />
            <span class="text-sm font-medium text-red-600">Logout</span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
})

const { user, logout } = useAuth()
const { success } = useNotification()

const isEditing = ref(false)

// TODO: Fetch profile from API
const profile = ref({
  name: 'Test User',
  phone: '+91 9876543210',
  email: 'test@example.com',
})

const editForm = ref({
  name: '',
  email: '',
})

const userInitials = computed(() => {
  return profile.value.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

function startEdit() {
  editForm.value = {
    name: profile.value.name,
    email: profile.value.email,
  }
  isEditing.value = true
}

function cancelEdit() {
  isEditing.value = false
}

function saveProfile() {
  // TODO: Call API to update profile
  profile.value.name = editForm.value.name
  profile.value.email = editForm.value.email
  isEditing.value = false
  success('Profile updated successfully')
}

async function handleLogout() {
  await logout()
}
</script>
