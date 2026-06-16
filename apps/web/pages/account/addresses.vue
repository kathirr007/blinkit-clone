<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
})

const { success } = useNotification()

const showAddModal = ref(false)
const editingId = ref<string | null>(null)
const addressForm = ref({
  label: 'Home',
  fullAddress: '',
  landmark: '',
  city: '',
  pincode: '',
})

// TODO: Fetch addresses from API
const addresses = ref([
  { id: '1', label: 'Home', fullAddress: '123 Main St, Koramangala, Bangalore 560034', landmark: 'Near Central Park', city: 'Bangalore', pincode: '560034', isDefault: true },
  { id: '2', label: 'Office', fullAddress: '456 Tech Park, Whitefield, Bangalore 560066', landmark: 'Building A, 3rd Floor', city: 'Bangalore', pincode: '560066', isDefault: false },
])

function editAddress(address: any) {
  editingId.value = address.id
  addressForm.value = {
    label: address.label,
    fullAddress: address.fullAddress,
    landmark: address.landmark || '',
    city: address.city,
    pincode: address.pincode,
  }
  showAddModal.value = true
}

function deleteAddress(id: string) {
  // TODO: Call API to delete address
  addresses.value = addresses.value.filter(a => a.id !== id)
  success('Address deleted')
}

function setDefault(id: string) {
  // TODO: Call API to set default
  addresses.value.forEach(a => a.isDefault = a.id === id)
  success('Default address updated')
}

function saveAddress() {
  if (editingId.value) {
    // TODO: Call API to update address
    const idx = addresses.value.findIndex(a => a.id === editingId.value)
    if (idx > -1) {
      addresses.value[idx] = { ...addresses.value[idx], ...addressForm.value }
    }
    success('Address updated')
  }
  else {
    // TODO: Call API to create address
    addresses.value.push({
      id: Date.now().toString(),
      ...addressForm.value,
      isDefault: false,
    })
    success('Address added')
  }
  closeModal()
}

function closeModal() {
  showAddModal.value = false
  editingId.value = null
  addressForm.value = { label: 'Home', fullAddress: '', landmark: '', city: '', pincode: '' }
}
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-4">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-xl font-bold text-gray-900">
        Saved Addresses
      </h1>
      <button class="btn-primary text-sm" @click="showAddModal = true">
        <Icon name="mdi:plus" class="w-4 h-4 inline mr-1" />
        Add New
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="addresses.length === 0" class="text-center py-16">
      <Icon name="mdi:map-marker-outline" class="w-20 h-20 text-gray-300 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-700 mb-2">
        No saved addresses
      </h3>
      <p class="text-gray-500 mb-6">
        Add an address for faster checkout
      </p>
      <button class="btn-primary" @click="showAddModal = true">
        Add Address
      </button>
    </div>

    <!-- Addresses List -->
    <div v-else class="space-y-3">
      <div
        v-for="address in addresses"
        :key="address.id"
        class="card"
      >
        <div class="flex items-start justify-between">
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon
                :name="address.label === 'Home' ? 'mdi:home' : address.label === 'Office' ? 'mdi:office-building' : 'mdi:map-marker'"
                class="w-4 h-4 text-[#0c831f]"
              />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <p class="text-sm font-bold text-gray-900">
                  {{ address.label }}
                </p>
                <span v-if="address.isDefault" class="text-[10px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded">DEFAULT</span>
              </div>
              <p class="text-sm text-gray-600 mt-0.5">
                {{ address.fullAddress }}
              </p>
              <p v-if="address.landmark" class="text-xs text-gray-400 mt-0.5">
                Landmark: {{ address.landmark }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-1">
            <button class="p-2 hover:bg-gray-100 rounded-full transition-colors" @click="editAddress(address)">
              <Icon name="mdi:pencil" class="w-4 h-4 text-gray-500" />
            </button>
            <button class="p-2 hover:bg-red-50 rounded-full transition-colors" @click="deleteAddress(address.id)">
              <Icon name="mdi:delete" class="w-4 h-4 text-red-500" />
            </button>
          </div>
        </div>
        <button
          v-if="!address.isDefault"
          class="mt-3 text-xs text-[#0c831f] font-medium hover:underline"
          @click="setDefault(address.id)"
        >
          Set as default
        </button>
      </div>
    </div>

    <!-- Add/Edit Address Modal -->
    <Modal v-model="showAddModal">
      <template #title>
        {{ editingId ? 'Edit Address' : 'Add New Address' }}
      </template>
      <div class="space-y-3">
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Label</label>
          <div class="flex gap-2">
            <button
              v-for="label in ['Home', 'Office', 'Other']"
              :key="label"
              class="px-3 py-1.5 text-sm rounded-full border transition-colors"
              :class="addressForm.label === label ? 'border-[#0c831f] bg-green-50 text-[#0c831f] font-medium' : 'border-gray-200 text-gray-600'"
              @click="addressForm.label = label"
            >
              {{ label }}
            </button>
          </div>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Full Address</label>
          <textarea v-model="addressForm.fullAddress" class="input-field" rows="3" placeholder="House/Flat No., Street, Area" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Landmark (Optional)</label>
          <input v-model="addressForm.landmark" type="text" class="input-field" placeholder="Near...">
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">City</label>
            <input v-model="addressForm.city" type="text" class="input-field" placeholder="City">
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Pincode</label>
            <input v-model="addressForm.pincode" type="text" class="input-field" placeholder="Pincode" maxlength="6">
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex gap-3">
          <button class="btn-secondary flex-1" @click="closeModal">
            Cancel
          </button>
          <button class="btn-primary flex-1" @click="saveAddress">
            {{ editingId ? 'Update' : 'Save' }}
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>
