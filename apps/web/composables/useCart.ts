export function useCart() {
  const cartStore = useCartStore()

  const items = computed(() => cartStore.items)
  const count = computed(() => cartStore.count)
  const subtotal = computed(() => cartStore.subtotal)
  const deliveryFee = computed(() => cartStore.deliveryFee)
  const total = computed(() => cartStore.total)
  const isEmpty = computed(() => cartStore.isEmpty)
  const loading = computed(() => cartStore.loading)

  function addItem(product: CartItem) {
    cartStore.addItem(product)
  }

  function removeItem(productId: string) {
    cartStore.removeItem(productId)
  }

  function updateQuantity(productId: string, quantity: number) {
    cartStore.updateQuantity(productId, quantity)
  }

  function clearCart() {
    cartStore.clearCart()
  }

  function isInCart(productId: string): boolean {
    return cartStore.items.some((item) => item.productId === productId)
  }

  function getItemQuantity(productId: string): number {
    const item = cartStore.items.find((item) => item.productId === productId)
    return item?.quantity ?? 0
  }

  return {
    items,
    count,
    subtotal,
    deliveryFee,
    total,
    isEmpty,
    loading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
  }
}
