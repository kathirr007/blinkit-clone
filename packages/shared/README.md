# @blinkit/shared - Shared Package

Shared TypeScript types, constants, and validators used across all apps in the monorepo.

## Usage

Referenced as a workspace dependency in other packages:

```json
{
  "dependencies": {
    "@blinkit/shared": "workspace:*"
  }
}
```

Import in any app:

```typescript
import { DELIVERY_FEE, IProduct, OrderStatus } from '@blinkit/shared'
```

## Contents

### Types (`src/types/`)

| File | Exports |
|------|---------|
| `user.ts` | `UserRole` enum, `IUser`, `ILoginResponse` |
| `product.ts` | `IProduct`, `IProductImage`, `IProductVariant` |
| `category.ts` | `ICategory` (self-referencing with children) |
| `cart.ts` | `ICart`, `ICartItem` |
| `order.ts` | `OrderStatus`, `PaymentMethod`, `PaymentStatus` enums, `IOrder`, `IOrderItem` |
| `address.ts` | `IAddress` |
| `payment.ts` | `IPayment` |
| `review.ts` | `IReview` |
| `delivery.ts` | `IDeliveryAssignment` |

### Constants (`src/constants/`)

| File | Exports |
|------|---------|
| `app.ts` | `DELIVERY_FEE_THRESHOLD` (499), `DELIVERY_FEE` (25), `MIN_ORDER_VALUE` (99), `MAX_CART_ITEMS` (50), `OTP_EXPIRY_MINUTES` (5), `DEFAULT_PAGE_SIZE` (20) |
| `order-status.ts` | `ORDER_STATUS_LABELS` (display names), `ORDER_STATUS_FLOW` (valid transitions) |
| `roles.ts` | `ROLES` constant object |

## Structure

```
packages/shared/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts            # Barrel export
    ├── types/
    │   ├── index.ts
    │   ├── user.ts
    │   ├── product.ts
    │   ├── category.ts
    │   ├── cart.ts
    │   ├── order.ts
    │   ├── address.ts
    │   ├── payment.ts
    │   ├── review.ts
    │   └── delivery.ts
    └── constants/
        ├── index.ts
        ├── app.ts
        ├── order-status.ts
        └── roles.ts
```
