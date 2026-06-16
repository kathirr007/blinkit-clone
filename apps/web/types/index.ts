export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface User {
  id: string
  name: string
  phone: string
  email?: string
  avatar?: string
}

export interface Product {
  id: string
  name: string
  slug: string
  brand: string
  description: string
  price: number
  compareAtPrice?: number
  unit: string
  image: string
  images: string[]
  categoryId: string
  categoryName: string
  inStock: boolean
  rating: number
  reviewCount: number
}

export interface Category {
  id: string
  name: string
  slug: string
  image: string
  productCount: number
}

export interface CartItem {
  productId: string
  name: string
  image: string
  price: number
  compareAtPrice?: number
  unit: string
  quantity: number
}

export interface Address {
  id: string
  label: string
  fullAddress: string
  landmark?: string
  city: string
  pincode: string
  isDefault: boolean
}

export interface Order {
  id: string
  orderNumber: string
  status: 'pending' | 'confirmed' | 'picking' | 'on_the_way' | 'delivered' | 'cancelled'
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  total: number
  paymentMethod: string
  deliveryAddress: Address
  createdAt: string
  deliveredAt?: string
}

export interface OrderItem {
  productId: string
  name: string
  image: string
  price: number
  quantity: number
  unit: string
}
