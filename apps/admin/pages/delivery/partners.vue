<script setup lang="ts">
definePageMeta({
  middleware: ['admin'],
})

const showAddModal = ref(false)
const newPartner = reactive({
  name: '',
  phone: '',
  email: '',
  vehicle: 'bike',
})

// TODO: Replace with API call to fetch delivery partners
const partners = ref([
  { id: '1', name: 'Ravi Kumar', phone: '+91 98765 11111', vehicle: 'Bike', status: 'active', activeOrders: 2, totalDeliveries: 456, rating: 4.5 },
  { id: '2', name: 'Suresh Yadav', phone: '+91 98765 22222', vehicle: 'Bike', status: 'active', activeOrders: 1, totalDeliveries: 312, rating: 4.7 },
  { id: '3', name: 'Karthik M', phone: '+91 98765 33333', vehicle: 'Scooter', status: 'active', activeOrders: 3, totalDeliveries: 589, rating: 4.3 },
  { id: '4', name: 'Deepak Singh', phone: '+91 98765 44444', vehicle: 'Bike', status: 'inactive', activeOrders: 0, totalDeliveries: 234, rating: 4.1 },
  { id: '5', name: 'Manoj Tiwari', phone: '+91 98765 55555', vehicle: 'Scooter', status: 'active', activeOrders: 0, totalDeliveries: 178, rating: 4.8 },
  { id: '6', name: 'Ajay Verma', phone: '+91 98765 66666', vehicle: 'Bike', status: 'active', activeOrders: 1, totalDeliveries: 645, rating: 4.6 },
])

function addPartner() {
  // TODO: API call to add delivery partner
  console.log('Adding partner:', newPartner)
  showAddModal.value = false
  newPartner.name = ''
  newPartner.phone = ''
  newPartner.email = ''
  newPartner.vehicle = 'bike'
}

function togglePartnerStatus(partner: any) {
  // TODO: API call to update partner status
  partner.status = partner.status === 'active' ? 'inactive' : 'active'
}
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Delivery Partners</h1>
        <p class="text-sm text-gray-500 mt-1">Manage delivery personnel</p>
      </div>
      <button class="btn-primary flex items-center gap-2" @click="showAddModal = true">
        <Icon name="heroicons:plus" class="w-5 h-5" />
        Add Partner
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="card">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-green-100 rounded-lg">
            <Icon name="heroicons:user-group" class="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p class="text-sm text-gray-500">Active Partners</p>
            <p class="text-xl font-bold text-gray-900">{{ partners.filter(p => p.status === 'active').length }}</p>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-blue-100 rounded-lg">
            <Icon name="heroicons:truck" class="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p class="text-sm text-gray-500">On Delivery</p>
            <p class="text-xl font-bold text-gray-900">{{ partners.reduce((sum, p) => sum + p.activeOrders, 0) }}</p>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <Icon name="heroicons:star" class="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <p class="text-sm text-gray-500">Avg Rating</p>
            <p class="text-xl font-bold text-gray-900">
              {{ (partners.reduce((sum, p) => sum + p.rating, 0) / partners.length).toFixed(1) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Partners List -->
    <div class="card">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Partner</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Phone</th>
              <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Vehicle</th>
              <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Active Orders</th>
              <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Total Deliveries</th>
              <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Rating</th>
              <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="partner in partners" :key="partner.id" class="hover:bg-gray-50">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span class="text-primary-600 text-xs font-medium">{{ partner.name.charAt(0) }}</span>
                  </div>
                  <span class="text-sm font-medium text-gray-900">{{ partner.name }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ partner.phone }}</td>
              <td class="px-4 py-3 text-sm text-gray-600 text-center">{{ partner.vehicle }}</td>
              <td class="px-4 py-3 text-center">
                <span
                  class="text-sm font-medium"
                  :class="partner.activeOrders > 0 ? 'text-primary-600' : 'text-gray-400'"
                >
                  {{ partner.activeOrders }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-600 text-center">{{ partner.totalDeliveries }}</td>
              <td class="px-4 py-3 text-center">
                <div class="flex items-center justify-center gap-1">
                  <Icon name="heroicons:star-solid" class="w-3.5 h-3.5 text-yellow-500" />
                  <span class="text-sm font-medium">{{ partner.rating }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-center">
                <span
                  class="badge"
                  :class="partner.status === 'active' ? 'badge-success' : 'badge-gray'"
                >
                  {{ partner.status }}
                </span>
              </td>
              <td class="px-4 py-3 text-center">
                <button
                  class="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  @click="togglePartnerStatus(partner)"
                  :title="partner.status === 'active' ? 'Deactivate' : 'Activate'"
                >
                  <Icon
                    :name="partner.status === 'active' ? 'heroicons:pause' : 'heroicons:play'"
                    class="w-4 h-4"
                  />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Partner Modal -->
    <Teleport to="body">
      <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50" @click="showAddModal = false"></div>
        <div class="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Add Delivery Partner</h3>
          <form @submit.prevent="addPartner" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input v-model="newPartner.name" type="text" class="input-field" placeholder="Enter full name" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input v-model="newPartner.phone" type="tel" class="input-field" placeholder="+91 98765 XXXXX" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
              <input v-model="newPartner.email" type="email" class="input-field" placeholder="email@example.com" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
              <select v-model="newPartner.vehicle" class="input-field">
                <option value="bike">Bike</option>
                <option value="scooter">Scooter</option>
                <option value="bicycle">Bicycle</option>
              </select>
            </div>
            <div class="flex justify-end gap-3 pt-2">
              <button type="button" class="btn-secondary" @click="showAddModal = false">Cancel</button>
              <button type="submit" class="btn-primary">Add Partner</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>
