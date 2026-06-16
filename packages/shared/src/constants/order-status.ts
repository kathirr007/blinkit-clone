import { OrderStatus } from '../types/order'

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'Order Placed',
  [OrderStatus.CONFIRMED]: 'Confirmed',
  [OrderStatus.PREPARING]: 'Preparing',
  [OrderStatus.READY_FOR_PICKUP]: 'Ready for Pickup',
  [OrderStatus.OUT_FOR_DELIVERY]: 'Out for Delivery',
  [OrderStatus.DELIVERED]: 'Delivered',
  [OrderStatus.CANCELLED]: 'Cancelled',
  [OrderStatus.REFUNDED]: 'Refunded',
}

export const ORDER_STATUS_FLOW: OrderStatus[][] = [
  [OrderStatus.PENDING, OrderStatus.CONFIRMED],
  [OrderStatus.CONFIRMED, OrderStatus.PREPARING],
  [OrderStatus.PREPARING, OrderStatus.READY_FOR_PICKUP],
  [OrderStatus.READY_FOR_PICKUP, OrderStatus.OUT_FOR_DELIVERY],
  [OrderStatus.OUT_FOR_DELIVERY, OrderStatus.DELIVERED],
  [OrderStatus.PENDING, OrderStatus.CANCELLED],
  [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
  [OrderStatus.DELIVERED, OrderStatus.REFUNDED],
]
