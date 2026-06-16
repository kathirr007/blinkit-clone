import { defineStore } from 'pinia'

interface CartItem {
  productId: string
  name: string
  image: string
  price: number
  compareAtPrice?: number
  unit: string
  quantity: number
}

interface CartState {
  items: CartItem[]
  loading: boolean
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: [],
    loading: false,
  }),

  getters: {
    count: state => state.items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: state => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    deliveryFee: (state) => {
      const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      // Free delivery above ₹199
      return subtotal >= 199 ? 0 : 25
    },
    total(): number {
      return this.subtotal + this.deliveryFee
    },
    isEmpty: state => state.items.length === 0,
  },

  actions: {
    async fetchCart() {
      this.loading = true
      try {
        // TODO: Fetch cart from API for authenticated users
        // const { $api } = useNuxtApp()
        // const response = await $api('/cart')
        // this.items = response.data.items
      }
      catch (error) {
        console.error('Failed to fetch cart', error)
      }
      finally {
        this.loading = false
      }
    },

    addItem(product: CartItem) {
      const existingIndex = this.items.findIndex(item => item.productId === product.productId)

      if (existingIndex > -1) {
        // Optimistic update
        this.items[existingIndex].quantity += 1
      }
      else {
        this.items.push({ ...product, quantity: 1 })
      }

      // TODO: Sync with API
      // const { $api } = useNuxtApp()
      // $api('/cart/add', { method: 'POST', body: { productId: product.productId, quantity: 1 } })
      //   .catch(() => { /* rollback */ })
    },

    removeItem(productId: string) {
      const index = this.items.findIndex(item => item.productId === productId)
      if (index > -1) {
        const removed = this.items.splice(index, 1)
        // TODO: Sync with API, rollback on error
        // const { $api } = useNuxtApp()
        // $api('/cart/remove', { method: 'POST', body: { productId } })
        //   .catch(() => { this.items.splice(index, 0, ...removed) })
      }
    },

    updateQuantity(productId: string, quantity: number) {
      const item = this.items.find(item => item.productId === productId)
      if (item) {
        const previousQuantity = item.quantity
        if (quantity <= 0) {
          this.removeItem(productId)
          return
        }
        item.quantity = quantity

        // TODO: Sync with API, rollback on error
        // const { $api } = useNuxtApp()
        // $api('/cart/update', { method: 'PUT', body: { productId, quantity } })
        //   .catch(() => { item.quantity = previousQuantity })
      }
    },

    clearCart() {
      this.items = []
      // TODO: Sync with API
    },
  },
})
