import { UserRole } from '../types/user'

export const ROLES = {
  CUSTOMER: UserRole.CUSTOMER,
  ADMIN: UserRole.ADMIN,
  DELIVERY_PARTNER: UserRole.DELIVERY_PARTNER,
} as const
