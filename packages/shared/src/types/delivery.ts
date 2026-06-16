export interface IDeliveryAssignment {
  id: string
  orderId: string
  deliveryPartnerId: string
  status: string
  currentLatitude?: number
  currentLongitude?: number
  pickedUpAt?: string
  deliveredAt?: string
}
