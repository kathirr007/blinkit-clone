<script setup lang="ts">
definePageMeta({
  middleware: ['admin'],
})

const router = useRouter()
const loading = ref(false)

const form = reactive({
  name: '',
  description: '',
  sku: '',
  category: '',
  brand: '',
  price: 0,
  mrp: 0,
  discount: 0,
  unit: '',
  weight: '',
  images: [] as File[],
  variants: [{ name: '', value: '', price: 0 }],
  stock: 0,
  lowStockThreshold: 10,
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
    // TODO: API call to create product
    console.log('Creating product:', form)
    router.push('/products')
  }
  catch (error) {
    console.error('Failed to create product:', error)
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors" @click="router.back()">
          <Icon name="heroicons:arrow-left" class="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">
            Create Product
          </h1>
          <p class="text-sm text-gray-500 mt-1">
            Add a new product to your catalog
          </p>
        </div>
      </div>
    </div>

    <form class="space-y-6" @submit.prevent="handleSubmit">
      <!-- Basic Info Section -->
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">
          Basic Information
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input v-model="form.name" type="text" class="input-field" placeholder="e.g. Amul Toned Milk 500ml" required>
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea v-model="form.description" class="input-field" rows="3" placeholder="Product description..." />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">SKU</label>
            <input v-model="form.sku" type="text" class="input-field" placeholder="e.g. MLK-001" required>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select v-model="form.category" class="input-field">
              <option value="">
                Select category
              </option>
              <option value="dairy">
                Dairy & Breakfast
              </option>
              <option value="fruits">
                Fruits & Vegetables
              </option>
              <option value="snacks">
                Snacks & Munchies
              </option>
              <option value="beverages">
                Cold Drinks & Juices
              </option>
              <option value="grocery">
                Instant & Frozen Food
              </option>
              <option value="cleaning">
                Cleaning Essentials
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Brand</label>
            <input v-model="form.brand" type="text" class="input-field" placeholder="e.g. Amul">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Unit</label>
            <input v-model="form.unit" type="text" class="input-field" placeholder="e.g. 500ml, 1kg">
          </div>
        </div>
      </div>

      <!-- Pricing Section -->
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">
          Pricing
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Selling Price (INR)</label>
            <input v-model.number="form.price" type="number" class="input-field" min="0" step="0.01" required>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">MRP (INR)</label>
            <input v-model.number="form.mrp" type="number" class="input-field" min="0" step="0.01">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
            <input v-model.number="form.discount" type="number" class="input-field" min="0" max="100">
          </div>
        </div>
      </div>

      <!-- Images Section -->
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">
          Images
        </h2>
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-600 transition-colors">
          <Icon name="heroicons:cloud-arrow-up" class="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p class="text-sm text-gray-600 mb-2">
            Drag & drop images here, or click to browse
          </p>
          <p class="text-xs text-gray-400 mb-4">
            PNG, JPG up to 5MB each. Max 5 images.
          </p>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            multiple
            class="hidden"
            @change="handleImageUpload"
          >
          <label for="image-upload" class="btn-secondary cursor-pointer inline-block">
            Choose Files
          </label>
        </div>
        <div v-if="form.images.length > 0" class="mt-4 flex gap-2 flex-wrap">
          <div v-for="(img, index) in form.images" :key="index" class="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
            {{ img.name }}
          </div>
        </div>
      </div>

      <!-- Variants Section -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">
            Variants
          </h2>
          <button type="button" class="btn-secondary text-sm" @click="addVariant">
            <Icon name="heroicons:plus" class="w-4 h-4 inline mr-1" />
            Add Variant
          </button>
        </div>
        <div class="space-y-3">
          <div v-for="(variant, index) in form.variants" :key="index" class="flex items-center gap-3">
            <input v-model="variant.name" type="text" class="input-field flex-1" placeholder="Variant name (e.g. Size)">
            <input v-model="variant.value" type="text" class="input-field flex-1" placeholder="Value (e.g. 500ml)">
            <input v-model.number="variant.price" type="number" class="input-field w-32" placeholder="Price" min="0">
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
        <h2 class="text-lg font-semibold text-gray-900 mb-4">
          Inventory
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
            <input v-model.number="form.stock" type="number" class="input-field" min="0" required>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Low Stock Threshold</label>
            <input v-model.number="form.lowStockThreshold" type="number" class="input-field" min="0">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select v-model="form.status" class="input-field">
              <option value="active">
                Active
              </option>
              <option value="inactive">
                Inactive
              </option>
              <option value="draft">
                Draft
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-end gap-3">
        <button type="button" class="btn-secondary" @click="router.back()">
          Cancel
        </button>
        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? 'Saving...' : 'Create Product' }}
        </button>
      </div>
    </form>
  </div>
</template>
