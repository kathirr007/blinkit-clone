<script setup lang="ts">
definePageMeta({
  middleware: ['admin'],
})

interface Category {
  id: string
  name: string
  slug: string
  image?: string
  parent?: string
  children?: Category[]
  productCount: number
}

// TODO: Replace with API call to fetch categories
const categories = ref<Category[]>([
  {
    id: '1',
    name: 'Dairy & Breakfast',
    slug: 'dairy-breakfast',
    productCount: 45,
    children: [
      { id: '1a', name: 'Milk', slug: 'milk', productCount: 12 },
      { id: '1b', name: 'Bread & Pav', slug: 'bread-pav', productCount: 8 },
      { id: '1c', name: 'Butter & Cheese', slug: 'butter-cheese', productCount: 15 },
      { id: '1d', name: 'Eggs', slug: 'eggs', productCount: 10 },
    ],
  },
  {
    id: '2',
    name: 'Fruits & Vegetables',
    slug: 'fruits-vegetables',
    productCount: 80,
    children: [
      { id: '2a', name: 'Fresh Fruits', slug: 'fresh-fruits', productCount: 35 },
      { id: '2b', name: 'Fresh Vegetables', slug: 'fresh-vegetables', productCount: 45 },
    ],
  },
  {
    id: '3',
    name: 'Snacks & Munchies',
    slug: 'snacks-munchies',
    productCount: 120,
    children: [
      { id: '3a', name: 'Chips & Crisps', slug: 'chips-crisps', productCount: 30 },
      { id: '3b', name: 'Biscuits & Cookies', slug: 'biscuits-cookies', productCount: 40 },
      { id: '3c', name: 'Namkeen & Bhujia', slug: 'namkeen-bhujia', productCount: 25 },
      { id: '3d', name: 'Chocolates', slug: 'chocolates', productCount: 25 },
    ],
  },
  {
    id: '4',
    name: 'Cold Drinks & Juices',
    slug: 'cold-drinks-juices',
    productCount: 55,
    children: [
      { id: '4a', name: 'Soft Drinks', slug: 'soft-drinks', productCount: 20 },
      { id: '4b', name: 'Juices', slug: 'juices', productCount: 15 },
      { id: '4c', name: 'Water', slug: 'water', productCount: 10 },
      { id: '4d', name: 'Energy Drinks', slug: 'energy-drinks', productCount: 10 },
    ],
  },
  {
    id: '5',
    name: 'Cleaning Essentials',
    slug: 'cleaning-essentials',
    productCount: 65,
    children: [
      { id: '5a', name: 'Detergents', slug: 'detergents', productCount: 20 },
      { id: '5b', name: 'Dishwash', slug: 'dishwash', productCount: 15 },
      { id: '5c', name: 'Floor Cleaners', slug: 'floor-cleaners', productCount: 15 },
      { id: '5d', name: 'Bathroom Cleaners', slug: 'bathroom-cleaners', productCount: 15 },
    ],
  },
])

const showModal = ref(false)
const editingCategory = ref<Category | null>(null)
const modalForm = reactive({
  name: '',
  slug: '',
  parent: '',
})

function openCreateModal(parentId?: string) {
  editingCategory.value = null
  modalForm.name = ''
  modalForm.slug = ''
  modalForm.parent = parentId || ''
  showModal.value = true
}

function openEditModal(category: Category) {
  editingCategory.value = category
  modalForm.name = category.name
  modalForm.slug = category.slug
  modalForm.parent = ''
  showModal.value = true
}

function handleSave() {
  if (editingCategory.value) {
    // TODO: API call to update category
    console.log('Updating category:', editingCategory.value.id, modalForm)
  } else {
    // TODO: API call to create category
    console.log('Creating category:', modalForm)
  }
  showModal.value = false
}

function deleteCategory(category: Category) {
  // TODO: API call to delete category
  console.log('Deleting category:', category.id)
}

const expandedCategories = ref<Set<string>>(new Set(['1', '2', '3', '4', '5']))

function toggleExpand(id: string) {
  if (expandedCategories.value.has(id)) {
    expandedCategories.value.delete(id)
  } else {
    expandedCategories.value.add(id)
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Categories</h1>
        <p class="text-sm text-gray-500 mt-1">Manage product categories</p>
      </div>
      <button class="btn-primary flex items-center gap-2" @click="openCreateModal()">
        <Icon name="heroicons:plus" class="w-5 h-5" />
        Add Category
      </button>
    </div>

    <!-- Category Tree -->
    <div class="card">
      <div class="space-y-1">
        <div v-for="category in categories" :key="category.id">
          <!-- Parent Category -->
          <div
            class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 group"
          >
            <div class="flex items-center gap-3">
              <button
                class="p-1 hover:bg-gray-200 rounded transition-colors"
                @click="toggleExpand(category.id)"
              >
                <Icon
                  :name="expandedCategories.has(category.id) ? 'heroicons:chevron-down' : 'heroicons:chevron-right'"
                  class="w-4 h-4 text-gray-500"
                />
              </button>
              <Icon name="heroicons:folder" class="w-5 h-5 text-primary-600" />
              <span class="font-medium text-gray-900">{{ category.name }}</span>
              <span class="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {{ category.productCount }} products
              </span>
            </div>
            <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                class="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                @click="openCreateModal(category.id)"
                title="Add subcategory"
              >
                <Icon name="heroicons:plus" class="w-4 h-4" />
              </button>
              <button
                class="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                @click="openEditModal(category)"
                title="Edit"
              >
                <Icon name="heroicons:pencil-square" class="w-4 h-4" />
              </button>
              <button
                class="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                @click="deleteCategory(category)"
                title="Delete"
              >
                <Icon name="heroicons:trash" class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Children -->
          <div
            v-if="category.children && expandedCategories.has(category.id)"
            class="ml-10 space-y-0.5"
          >
            <div
              v-for="child in category.children"
              :key="child.id"
              class="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 group"
            >
              <div class="flex items-center gap-3">
                <Icon name="heroicons:folder-open" class="w-4 h-4 text-gray-400" />
                <span class="text-sm text-gray-700">{{ child.name }}</span>
                <span class="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  {{ child.productCount }}
                </span>
              </div>
              <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  class="p-1 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded"
                  @click="openEditModal(child)"
                >
                  <Icon name="heroicons:pencil-square" class="w-3.5 h-3.5" />
                </button>
                <button
                  class="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                  @click="deleteCategory(child)"
                >
                  <Icon name="heroicons:trash" class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50" @click="showModal = false"></div>
        <div class="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            {{ editingCategory ? 'Edit Category' : 'Create Category' }}
          </h3>
          <form @submit.prevent="handleSave" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
              <input v-model="modalForm.name" type="text" class="input-field" placeholder="e.g. Dairy & Breakfast" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input v-model="modalForm.slug" type="text" class="input-field" placeholder="e.g. dairy-breakfast" />
            </div>
            <div v-if="!editingCategory">
              <label class="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
              <select v-model="modalForm.parent" class="input-field">
                <option value="">None (Top Level)</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>
            <div class="flex justify-end gap-3 pt-2">
              <button type="button" class="btn-secondary" @click="showModal = false">Cancel</button>
              <button type="submit" class="btn-primary">
                {{ editingCategory ? 'Update' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>
