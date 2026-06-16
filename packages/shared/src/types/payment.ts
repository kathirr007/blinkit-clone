import { PaymentMethod, PaymentStatus } from './order'

export interface IPayment {
  id: string
  orderId: string
  method: PaymentMethod
  status: PaymentStatus
  amount: number
  transactionId?: string
  paidAt?: string
}
