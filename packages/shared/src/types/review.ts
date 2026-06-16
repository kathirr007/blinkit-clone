export interface IReview {
  id: string
  userId: string
  productId: string
  rating: number
  title?: string
  comment?: string
  isVerified: boolean
  createdAt: string
}
