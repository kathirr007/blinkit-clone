export interface IAddress {
  id: string
  userId: string
  label: string
  fullName: string
  phone: string
  addressLine1: string
  addressLine2?: string
  landmark?: string
  city: string
  state: string
  pincode: string
  latitude?: number
  longitude?: number
  isDefault: boolean
}
