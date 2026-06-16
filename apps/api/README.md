# @blinkit/api - Backend API

NestJS backend powering the Blinkit clone. Handles authentication, product catalog, orders, payments, real-time tracking, and all business logic.

## Stack

- **NestJS 10** - Framework
- **Prisma** - ORM with PostgreSQL
- **Redis** - Caching (cart, categories, search suggestions)
- **Socket.IO** - Real-time order tracking & notifications
- **Passport + JWT** - Authentication
- **AWS SDK** - S3-compatible file uploads (MinIO in dev)

## Running

```bash
# From monorepo root
pnpm dev:api

# Or directly
cd apps/api
pnpm dev
```

Runs on http://localhost:3001 with global prefix `/api`.

## Module Overview

| Module | Path | Purpose |
|--------|------|---------|
| Auth | `/api/auth/*` | OTP login, JWT tokens, refresh, profile |
| Users | `/api/users/*` | User CRUD |
| Products | `/api/products/*` | Product catalog, filtering, search |
| Categories | `/api/categories/*` | Category tree, subcategories |
| Cart | `/api/cart/*` | Cart management with stock validation |
| Orders | `/api/orders/*` | Order lifecycle, status transitions |
| Payments | `/api/payments/*` | COD + online payment gateway |
| Addresses | `/api/addresses/*` | Delivery address CRUD |
| Search | `/api/search/*` | Full-text product search + suggestions |
| Reviews | `/api/products/:id/reviews` | Ratings & reviews |
| Notifications | `/api/notifications/*` | In-app notifications + WebSocket push |
| Delivery | `/api/delivery/*` | Partner assignment, live location |
| Inventory | `/api/admin/inventory/*` | Stock management + audit logs |
| Upload | `/api/upload/*` | Image upload to S3/MinIO |

## Architecture

```
src/
├── main.ts                 # App bootstrap (CORS, validation, prefix)
├── app.module.ts           # Root module wiring all features
├── common/                 # Shared utilities
│   ├── decorators/         # @CurrentUser, @Roles, @Public
│   ├── guards/             # RolesGuard
│   ├── filters/            # HttpExceptionFilter
│   ├── interceptors/       # TransformInterceptor (response wrapping)
│   ├── pipes/              # ValidationPipe config
│   └── dto/                # PaginationDto
├── config/                 # Environment configuration
├── prisma/                 # PrismaService (DB connection)
├── redis/                  # RedisService (cache layer)
└── modules/                # Feature modules (see table above)
    └── <module>/
        ├── <module>.module.ts
        ├── <module>.controller.ts
        ├── <module>.service.ts
        └── dto/            # Request validation DTOs
```

## Key Design Patterns

- **Global JWT Guard** - All routes are protected by default; use `@Public()` to opt out
- **Role-based access** - `@Roles(UserRole.ADMIN)` + `RolesGuard` for admin endpoints
- **Response wrapping** - All responses wrapped in `{ data, statusCode, timestamp }`
- **Redis caching** - Categories (5min), cart (5min), search suggestions (5min)
- **Order state machine** - Valid transitions enforced (e.g., PENDING → CONFIRMED, not PENDING → DELIVERED)

## Database

Schema lives in `prisma/schema.prisma` with 15 models. Key commands:

```bash
pnpm db:migrate       # Run migrations
pnpm db:seed          # Seed sample data
pnpm db:studio        # Open Prisma Studio GUI
npx prisma generate   # Regenerate client after schema changes
```
