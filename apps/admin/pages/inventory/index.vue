<script setup lang="ts">
definePageMeta({
  middleware: ['admin'],
})

const currentPage = ref(1)
const totalPages = ref(4)
const showUpdateModal = ref(false)
const selectedProduct = ref<any>(null)
const stockAction = ref<'increment' | 'decrement'>('increment')
const stockQuantity = ref(0)
const stockReason = ref('')

const columns = [
  { key: 'product', label: 'Product' },
  { key: 'sku', label: 'SKU' },
  { key: 'stock', label: 'Stock', align: 'center' as const },
  { key: 'reserved', label: 'Reserved', align: 'center' as const },
  { key: 'available', label: 'Available', align: 'center' as const },
  { key: 'alert', label: 'Status', align: 'center' as const },
  { key: 'actions', label: 'Actions', align: 'center' as const },
]

// TODO: Replace with API call to fetch inventory data
const inventory = ref([
  { id: '1', product: 'Amul Toned Milk 500ml', sku: 'MLK-001', stock: 150, reserved: 5, available: 145, threshold: 20, lowStock: false },
  { id: '2', product: 'Aashirvaad Atta 5kg', sku: 'GRN-012', stock: 8, reserved: 3, available: 5, threshold: 10, lowStock: true },
  { id: '3', product: 'Maggi Noodles 70g', sku: 'SNK-005', stock: 300, reserved: 12, available: 288, threshold: 50, lowStock: false },
  { id: '4', product: 'Surf Excel 1kg', sku: 'CLN-008', stock: 0, reserved: 0, available: 0, threshold: 15, lowStock: true },
  { id: '5', product: 'Britannia Good Day 120g', sku: 'BSC-021', stock: 89, reserved: 4, available: 85, threshold: 20, lowStock: false },
  { id: '6', product: 'Tata Salt 1kg', sku: 'GRN-003', stock: 200, reserved: 8, available: 192, threshold: 30, lowStock: false },
  { id: '7', product: 'Parle-G 80g', sku: 'BSC-001', stock: 5, reserved: 2, available: 3, threshold: 50, lowStock: true },
  { id: '8', product: 'Fortune Sunflower Oil 1L', sku: 'OIL-002', stock: 75, reserved: 6, available: 69, threshold: 15, lowStock: false },
  { id: '9', product: 'Red Label Tea 250g', sku: 'BEV-004', stock: 3, reserved: 1, available: 2, threshold: 10, lowStock: true },
  { id: '10', product: 'Vim Dishwash Bar', sku: 'CLN-015', stock: 45, reserved: 0, available: 45, threshold: 10, lowStock: false },
])

function openUpdateModal(product: any) {
  selectedProduct.value = product
  stockAction.value = 'increment'
  stockQuantity.value = 0
  stockReason.value = ''
  showUpdateModal.value = true
}

function updateStock() {
  if (!selectedProduct.value || stockQuantity.value <= 0) return

  // TODO: API call to update stock
  const product = inventory.value.find(p => p.id === selectedProduct.value.id)
  if (product) {
    if (stockAction.value === 'increment') {
      product.stock += stockQuantity.value
      product.available += stockQuantity.value
    }
    else {
      product.stock = Math.max(0, product.stock - stockQuantity.value)
      product.available = Math.max(0, product.available - stockQuantity.value)
    }
    product.lowStock = product.stock <= product.threshold
  }

  console.log('Stock update:', {
    productId: selectedProduct.value.id,
    action: stockAction.value,
    quantity: stockQuantity.value,
    reason: stockReason.value,
  })

  showUpdateModal.value = false
}

function handlePageChange(page: number) {
  currentPage.value = page
  // TODO: Fetch inventory for the new page
}
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          Inventory
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          Monitor and manage stock levels
        </p>
      </div>
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
          <Icon name="heroicons:exclamation-triangle" class="w-4 h-4" />
          <span class="font-medium">{{ inventory.filter(i => i.lowStock).length }} low stock items</span>
        </div>
      </div>
    </div>

    <!-- Inventory Table -->
    <CommonDataTable
      :columns="columns"
      :data="inventory"
      :current-page="currentPage"
      :total-pages="totalPages"
      empty-message="No inventory items found"
      @page-change="handlePageChange"
    >
      <template #cell-product="{ row }">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
            <Icon name="heroicons:cube" class="w-4 h-4 text-gray-400" />
          </div>
          <span class="font-medium text-gray-900" :class="{ 'text-red-600': row.lowStock }">
            {{ row.product }}
          </span>
        </div>
      </template>

      <template #cell-sku="{ row }">
        <span class="font-mono text-xs text-gray-600">{{ row.sku }}</span>
      </template>

      <template #cell-stock="{ row }">
        <span :class="row.stock === 0 ? 'text-red-600 font-bold' : row.lowStock ? 'text-yellow-600 font-medium' : ''">
          {{ row.stock }}
        </span>
      </template>

      <template #cell-reserved="{ row }">
        <span class="text-gray-600">{{ row.reserved }}</span>
      </template>

      <template #cell-available="{ row }">
        <span class="font-medium" :class="row.available === 0 ? 'text-red-600' : ''">
          {{ row.available }}
        </span>
      </template>

      <template #cell-alert="{ row }">
        <span v-if="row.stock === 0" class="badge-danger">Out of Stock</span>
        <span v-else-if="row.lowStock" class="badge-warning">Low Stock</span>
        <span v-else class="badge-success">In Stock</span>
      </template>

      <template #cell-actions="{ row }">
        <div class="flex items-center justify-center" @click.stop>
          <button
            class="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title="Update stock"
            @click="openUpdateModal(row)"
          >
            <Icon name="heroicons:pencil-square" class="w-4 h-4" />
          </button>
        </div>
      </template>
    </CommonDataTable>

    <!-- Update Stock Modal -->
    <Teleport to="body">
      <div v-if="showUpdateModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50" @click="showUpdateModal = false" />
        <div class="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-1">
            Update Stock
          </h3>
          <p class="text-sm text-gray-500 mb-4">
            {{ selectedProduct?.product }}
          </p>

          <div class="space-y-4">
            <!-- Current Stock Info -->
            <div class="bg-gray-50 rounded-lg p-3 flex justify-between text-sm">
              <span class="text-gray-500">Current Stock</span>
              <span class="font-medium">{{ selectedProduct?.stock }} units</span>
            </div>

            <!-- Action -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Action</label>
              <div class="flex gap-3">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input v-model="stockAction" type="radio" value="increment" class="text-primary-600">
                  <span class="text-sm">Add Stock</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input v-model="stockAction" type="radio" value="decrement" class="text-primary-600">
                  <span class="text-sm">Remove Stock</span>
                </label>
              </div>
            </div>

            <!-- Quantity -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input v-model.number="stockQuantity" type="number" class="input-field" min="1" placeholder="Enter quantity">
            </div>

            <!-- Reason -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Reason</label>
              <select v-model="stockReason" class="input-field">
                <option value="">
                  Select reason
                </option>
                <option value="restock">
                  Restock / New Shipment
                </option>
                <option value="damaged">
                  Damaged / Expired
                </option>
                <option value="correction">
                  Stock Correction
                </option>
                <option value="return">
                  Customer Return
                </option>
                <option value="other">
                  Other
                </option>
              </select>
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-3 pt-2">
              <button class="btn-secondary" @click="showUpdateModal = false">
                Cancel
              </button>
              <button class="btn-primary" :disabled="stockQuantity <= 0" @click="updateStock">
                Update Stock
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
