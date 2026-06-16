<script setup lang="ts">
definePageMeta({
  middleware: ['admin'],
})

const router = useRouter()
const searchQuery = ref('')
const currentPage = ref(1)
const totalPages = ref(5)
const showDeleteDialog = ref(false)
const selectedProduct = ref<any>(null)

const columns = [
  { key: 'image', label: 'Image', width: '60px' },
  { key: 'name', label: 'Name' },
  { key: 'sku', label: 'SKU' },
  { key: 'price', label: 'Price', align: 'right' as const },
  { key: 'stock', label: 'Stock', align: 'center' as const },
  { key: 'status', label: 'Status', align: 'center' as const },
  { key: 'actions', label: 'Actions', align: 'center' as const },
]

// TODO: Replace with API call to fetch products
const products = ref([
  { id: '1', image: '/placeholder.jpg', name: 'Amul Toned Milk 500ml', sku: 'MLK-001', price: 27, stock: 150, status: 'active' },
  { id: '2', image: '/placeholder.jpg', name: 'Aashirvaad Atta 5kg', sku: 'GRN-012', price: 289, stock: 45, status: 'active' },
  { id: '3', image: '/placeholder.jpg', name: 'Maggi Noodles 70g', sku: 'SNK-005', price: 14, stock: 300, status: 'active' },
  { id: '4', image: '/placeholder.jpg', name: 'Surf Excel 1kg', sku: 'CLN-008', price: 199, stock: 0, status: 'inactive' },
  { id: '5', image: '/placeholder.jpg', name: 'Britannia Good Day 120g', sku: 'BSC-021', price: 35, stock: 89, status: 'active' },
  { id: '6', image: '/placeholder.jpg', name: 'Tata Salt 1kg', sku: 'GRN-003', price: 24, stock: 200, status: 'active' },
  { id: '7', image: '/placeholder.jpg', name: 'Parle-G 80g', sku: 'BSC-001', price: 10, stock: 500, status: 'active' },
  { id: '8', image: '/placeholder.jpg', name: 'Fortune Sunflower Oil 1L', sku: 'OIL-002', price: 145, stock: 75, status: 'active' },
])

function confirmDelete(product: any) {
  selectedProduct.value = product
  showDeleteDialog.value = true
}

function deleteProduct() {
  // TODO: API call to delete product
  products.value = products.value.filter(p => p.id !== selectedProduct.value?.id)
  showDeleteDialog.value = false
  selectedProduct.value = null
}

function handlePageChange(page: number) {
  currentPage.value = page
  // TODO: Fetch products for the new page
}
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Products</h1>
        <p class="text-sm text-gray-500 mt-1">Manage your product catalog</p>
      </div>
      <NuxtLink to="/products/create" class="btn-primary flex items-center gap-2">
        <Icon name="heroicons:plus" class="w-5 h-5" />
        Add Product
      </NuxtLink>
    </div>

    <!-- Search & Filters -->
    <div class="card">
      <div class="flex items-center gap-4">
        <div class="relative flex-1 max-w-md">
          <Icon name="heroicons:magnifying-glass" class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search products by name or SKU..."
            class="input-field pl-10"
          />
        </div>
      </div>
    </div>

    <!-- Products Table -->
    <CommonDataTable
      :columns="columns"
      :data="products"
      :current-page="currentPage"
      :total-pages="totalPages"
      empty-message="No products found"
      @page-change="handlePageChange"
      @row-click="(row) => router.push(`/products/${row.id}/edit`)"
    >
      <template #cell-image="{ row }">
        <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
          <Icon name="heroicons:photo" class="w-5 h-5 text-gray-400" />
        </div>
      </template>

      <template #cell-name="{ row }">
        <span class="font-medium text-gray-900">{{ row.name }}</span>
      </template>

      <template #cell-sku="{ row }">
        <span class="text-gray-600 font-mono text-xs">{{ row.sku }}</span>
      </template>

      <template #cell-price="{ row }">
        <span class="font-medium">&#8377;{{ row.price }}</span>
      </template>

      <template #cell-stock="{ row }">
        <span
          :class="row.stock === 0 ? 'text-red-600 font-medium' : row.stock < 50 ? 'text-yellow-600' : 'text-gray-900'"
        >
          {{ row.stock }}
        </span>
      </template>

      <template #cell-status="{ row }">
        <span
          class="badge"
          :class="row.status === 'active' ? 'badge-success' : 'badge-gray'"
        >
          {{ row.status }}
        </span>
      </template>

      <template #cell-actions="{ row }">
        <div class="flex items-center justify-center gap-2" @click.stop>
          <NuxtLink
            :to="`/products/${row.id}/edit`"
            class="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            <Icon name="heroicons:pencil-square" class="w-4 h-4" />
          </NuxtLink>
          <button
            class="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            @click="confirmDelete(row)"
          >
            <Icon name="heroicons:trash" class="w-4 h-4" />
          </button>
        </div>
      </template>
    </CommonDataTable>

    <!-- Delete Confirmation -->
    <CommonConfirmDialog
      :show="showDeleteDialog"
      title="Delete Product"
      :message="`Are you sure you want to delete '${selectedProduct?.name}'? This action cannot be undone.`"
      confirm-text="Delete"
      @confirm="deleteProduct"
      @cancel="showDeleteDialog = false"
    />
  </div>
</template>
