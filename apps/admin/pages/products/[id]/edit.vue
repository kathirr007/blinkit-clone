<script setup lang="ts">
definePageMeta({
  middleware: ['admin'],
})

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const productId = route.params.id as string

// TODO: Fetch product data from API
const form = reactive({
  name: 'Amul Toned Milk 500ml',
  description: 'Fresh toned milk from Amul, pasteurized and homogenized.',
  sku: 'MLK-001',
  category: 'dairy',
  brand: 'Amul',
  price: 27,
  mrp: 30,
  discount: 10,
  unit: '500ml',
  weight: '500',
  images: [] as File[],
  variants: [
    { name: 'Size', value: '500ml', price: 27 },
    { name: 'Size', value: '1L', price: 52 },
  ],
  stock: 150,
  lowStockThreshold: 20,
  status: 'active',
})

function addVariant() {
  form.variants.push({ name: '', value: '', price: 0 })
}

function removeVariant(index: number) {
  form.variants.splice(index, 1)
}

function handleImageUpload(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files) {
    form.images = Array.from(target.files)
  }
}

async function handleSubmit() {
  loading.value = true
  try {
    // TODO: API call to update product
    console.log('Updating product:', productId, form)
    router.push('/products')
  } catch (error) {
    console.error('Failed to update product:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button @click="router.back()" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Icon name="heroicons:arrow-left" class="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Edit Product</h1>
          <p class="text-sm text-gray-500 mt-1">Update product details</p>
        </div>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Basic Info Section -->
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input v-model="form.name" type="text" class="input-field" placeholder="e.g. Amul Toned Milk 500ml" required />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea v-model="form.description" class="input-field" rows="3" placeholder="Product description..."></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">SKU</label>
            <input v-model="form.sku" type="text" class="input-field" placeholder="e.g. MLK-001" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select v-model="form.category" class="input-field">
              <option value="">Select category</option>
              <option value="dairy">Dairy & Breakfast</option>
              <option value="fruits">Fruits & Vegetables</option>
              <option value="snacks">Snacks & Munchies</option>
              <option value="beverages">Cold Drinks & Juices</option>
              <option value="grocery">Instant & Frozen Food</option>
              <option value="cleaning">Cleaning Essentials</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Brand</label>
            <input v-model="form.brand" type="text" class="input-field" placeholder="e.g. Amul" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Unit</label>
            <input v-model="form.unit" type="text" class="input-field" placeholder="e.g. 500ml, 1kg" />
          </div>
        </div>
      </div>

      <!-- Pricing Section -->
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Pricing</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Selling Price (INR)</label>
            <input v-model.number="form.price" type="number" class="input-field" min="0" step="0.01" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">MRP (INR)</label>
            <input v-model.number="form.mrp" type="number" class="input-field" min="0" step="0.01" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
            <input v-model.number="form.discount" type="number" class="input-field" min="0" max="100" />
          </div>
        </div>
      </div>

      <!-- Images Section -->
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Images</h2>
        <!-- Existing images placeholder -->
        <div class="flex gap-3 mb-4">
          <div class="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
            <Icon name="heroicons:photo" class="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-600 transition-colors">
          <p class="text-sm text-gray-600 mb-2">Upload new images</p>
          <input
            type="file"
            accept="image/*"
            multiple
            class="hidden"
            id="image-upload"
            @change="handleImageUpload"
          />
          <label for="image-upload" class="btn-secondary cursor-pointer inline-block text-sm">
            Choose Files
          </label>
        </div>
      </div>

      <!-- Variants Section -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Variants</h2>
          <button type="button" class="btn-secondary text-sm" @click="addVariant">
            <Icon name="heroicons:plus" class="w-4 h-4 inline mr-1" />
            Add Variant
          </button>
        </div>
        <div class="space-y-3">
          <div v-for="(variant, index) in form.variants" :key="index" class="flex items-center gap-3">
            <input v-model="variant.name" type="text" class="input-field flex-1" placeholder="Variant name (e.g. Size)" />
            <input v-model="variant.value" type="text" class="input-field flex-1" placeholder="Value (e.g. 500ml)" />
            <input v-model.number="variant.price" type="number" class="input-field w-32" placeholder="Price" min="0" />
            <button
              v-if="form.variants.length > 1"
              type="button"
              class="p-2 text-red-500 hover:bg-red-50 rounded-lg"
              @click="removeVariant(index)"
            >
              <Icon name="heroicons:x-mark" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Inventory Section -->
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Inventory</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
            <input v-model.number="form.stock" type="number" class="input-field" min="0" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Low Stock Threshold</label>
            <input v-model.number="form.lowStockThreshold" type="number" class="input-field" min="0" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select v-model="form.status" class="input-field">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-end gap-3">
        <button type="button" class="btn-secondary" @click="router.back()">Cancel</button>
        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? 'Saving...' : 'Update Product' }}
        </button>
      </div>
    </form>
  </div>
</template>
