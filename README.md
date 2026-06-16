# Blinkit Clone - Quick Commerce App

A full-featured quick commerce application built as a monorepo with Nuxt 3, NestJS, and PostgreSQL. Delivers groceries in minutes with real-time order tracking, multi-role access, and a complete admin dashboard.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Customer Frontend | Nuxt 3, Vue 3, TypeScript, Tailwind CSS, Pinia |
| Admin Dashboard | Nuxt 3, Vue 3, Tailwind CSS, Chart.js |
| Backend API | NestJS, TypeScript, Prisma ORM |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Real-time | Socket.IO (WebSocket) |
| File Storage | MinIO (S3-compatible) |
| Package Manager | pnpm (workspaces) |
| Containerization | Docker Compose |

## Project Structure

```
blinkit-clone/
├── apps/
│   ├── api/                        # NestJS Backend API
│   │   ├── prisma/
│   │   │   ├── schema.prisma      # Database schema (15 models)
│   │   │   └── seed.ts            # Seed data (users, categories, products)
│   │   └── src/
│   │       ├── common/            # Shared decorators, guards, pipes, filters
│   │       ├── config/            # App configuration
│   │       ├── prisma/            # Prisma service (DB access)
│   │       ├── redis/             # Redis service (caching)
│   │       └── modules/
│   │           ├── auth/          # JWT + OTP authentication
│   │           ├── users/         # User management
│   │           ├── products/      # Product CRUD + filtering
│   │           ├── categories/    # Category tree management
│   │           ├── cart/          # Cart with Redis caching
│   │           ├── orders/        # Order lifecycle management
│   │           ├── payments/      # Payment processing (COD + gateway)
│   │           ├── addresses/     # Delivery address CRUD
│   │           ├── search/        # Full-text product search
│   │           ├── reviews/       # Product ratings & reviews
│   │           ├── notifications/ # WebSocket push notifications
│   │           ├── delivery/      # Delivery partner tracking
│   │           ├── inventory/     # Stock management
│   │           └── upload/        # S3 file uploads
│   │
│   ├── web/                        # Nuxt 3 Customer Storefront
│   │   ├── assets/css/            # Tailwind CSS + custom styles
│   │   ├── components/common/     # Shared UI components
│   │   ├── composables/           # Vue composables (useAuth, useCart, etc.)
│   │   ├── layouts/               # App layouts (default, auth, checkout)
│   │   ├── middleware/            # Route guards (auth, guest)
│   │   ├── pages/                 # File-based routing
│   │   │   ├── index.vue         # Home (banners, categories, deals)
│   │   │   ├── login.vue         # Phone + OTP login
│   │   │   ├── signup.vue        # Registration
│   │   │   ├── search.vue        # Product search with filters
│   │   │   ├── category/         # Category listing & products
│   │   │   ├── product/          # Product detail page
│   │   │   ├── cart.vue          # Shopping cart
│   │   │   ├── checkout/         # Address + payment flow
│   │   │   ├── orders/           # Order history & detail
│   │   │   ├── track/            # Real-time delivery tracking
│   │   │   └── account/          # Profile & address management
│   │   ├── plugins/              # API client plugin
│   │   ├── stores/               # Pinia state management
│   │   ├── types/                # TypeScript interfaces
│   │   └── utils/                # Formatters & helpers
│   │
│   └── admin/                      # Nuxt 3 Admin Dashboard
│       ├── components/
│       │   ├── common/            # DataTable, StatsCard, Sidebar, etc.
│       │   └── dashboard/         # Charts (Revenue, Orders)
│       ├── layouts/               # Admin layout with sidebar
│       ├── middleware/            # Admin role guard
│       ├── pages/
│       │   ├── index.vue         # Dashboard (stats, charts)
│       │   ├── products/         # Product CRUD
│       │   ├── categories/       # Category management
│       │   ├── orders/           # Order management & status updates
│       │   ├── inventory/        # Stock levels & alerts
│       │   └── delivery/         # Partner & assignment management
│       ├── plugins/              # API client
│       └── stores/               # Admin auth store
│
├── packages/
│   └── shared/                     # Shared TypeScript package
│       └── src/
│           ├── types/             # Shared interfaces (User, Product, Order, etc.)
│           └── constants/         # App constants, order status labels, roles
│
├── docker/
│   └── docker-compose.dev.yml     # PostgreSQL, Redis, MinIO
│
├── .env.example                   # Environment variables template
├── pnpm-workspace.yaml            # Monorepo workspace config
├── tsconfig.base.json             # Shared TypeScript config
├── package.json                   # Root scripts
└── README.md
```

## Features

### Customer App (Port 3000)

- **Authentication** - Phone-first login with OTP verification, JWT tokens with auto-refresh
- **Home Page** - Hero banners, category grid, deals section, trending products
- **Product Catalog** - Browse by category, filter by price/brand, sort options
- **Product Detail** - Image gallery, variants (size/weight), reviews, add to cart
- **Search** - Full-text search with autocomplete suggestions
- **Cart** - Add/remove items, quantity management, stock validation
- **Checkout** - Address selection, delivery slot picker, order summary
- **Payment** - Cash on Delivery, UPI, Card (gateway integration ready)
- **Order Tracking** - Real-time status updates via WebSocket, delivery partner location
- **Order History** - View past orders, status timeline, reorder
- **Account** - Profile management, saved addresses

### Admin Dashboard (Port 3002)

- **Dashboard** - Revenue charts, order stats, low-stock alerts, recent orders
- **Product Management** - CRUD with image upload, variants, pricing
- **Category Management** - Hierarchical tree, drag-to-reorder
- **Order Management** - Status updates, delivery partner assignment
- **Inventory** - Stock levels, low-stock alerts, stock adjustment with audit log
- **Delivery** - Partner list, active assignment tracking

### Backend API (Port 3001)

- **14 modules** covering all business logic
- **Role-based access** - Customer, Admin, Delivery Partner
- **Real-time** - WebSocket gateway for order tracking and notifications
- **Caching** - Redis for cart, categories, search suggestions
- **File uploads** - S3-compatible (MinIO locally, AWS S3 in production)
- **Order numbers** - Sequential format `BLK-YYYYMMDD-NNNNN` via Redis atomic counter
- **Inventory** - Stock reservation on order, release on cancellation

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 9
- Docker & Docker Compose

### Setup

```bash
# Clone the repository
git clone <repo-url> blinkit-clone
cd blinkit-clone

# Install dependencies
pnpm install

# Start infrastructure (PostgreSQL, Redis, MinIO)
pnpm docker:up

# Run database migrations
pnpm db:migrate

# Seed sample data (categories, products, users)
pnpm db:seed

# Start all apps in development mode
pnpm dev
```

### Access

| App | URL |
|-----|-----|
| Customer Storefront | http://localhost:3000 |
| Backend API | http://localhost:3001/api |
| Admin Dashboard | http://localhost:3002 |
| MinIO Console | http://localhost:9001 |
| Prisma Studio | Run `pnpm db:studio` |

### Seed Users

| Role | Phone | Password |
|------|-------|----------|
| Admin | 9999999999 | admin123 |
| Customer | 7777777777 | password123 |
| Delivery Partner | 8888888888 | (OTP only) |

> In development, OTP is always `123456` for any phone number.

## Scripts

```bash
# Development
pnpm dev              # Start all apps (api + web + admin)
pnpm dev:api          # Start only the API
pnpm dev:web          # Start only the customer app
pnpm dev:admin        # Start only the admin dashboard

# Database
pnpm db:migrate       # Run Prisma migrations
pnpm db:seed          # Seed sample data
pnpm db:studio        # Open Prisma Studio (GUI)

# Infrastructure
pnpm docker:up        # Start Docker containers
pnpm docker:down      # Stop Docker containers

# Build & Quality
pnpm build            # Build all apps
pnpm lint             # Lint all apps
pnpm format           # Format code with Prettier
```

## Database Schema

15 models covering the complete e-commerce domain:

```
User ─── Address, Cart, Order, Review, Notification, RefreshToken, Otp
Category ─── Product (self-referencing tree)
Product ─── ProductImage, ProductVariant, Inventory, CartItem, OrderItem, Review
Order ─── OrderItem, Payment, DeliveryAssignment, OrderStatusHistory
Inventory ─── InventoryLog
Banner, Deal (promotional content)
```

## API Endpoints

### Public
- `POST /api/auth/send-otp` - Send OTP to phone
- `POST /api/auth/verify-otp` - Verify OTP & get tokens
- `GET /api/products` - List products (paginated, filterable)
- `GET /api/products/:slug` - Product detail
- `GET /api/categories` - Category tree
- `GET /api/search?q=` - Search products
- `GET /api/banners` - Active banners

### Authenticated (Customer)
- `GET/POST/PATCH/DELETE /api/cart/items` - Cart management
- `GET/POST/PATCH/DELETE /api/addresses` - Address CRUD
- `POST /api/orders` - Place order
- `GET /api/orders` - Order history
- `GET /api/orders/:id/track` - Tracking info
- `POST /api/payments/initiate` - Start payment
- `POST /api/products/:id/reviews` - Submit review

### Admin
- `POST/PATCH/DELETE /api/admin/products` - Product management
- `POST/PATCH/DELETE /api/admin/categories` - Category management
- `PATCH /api/admin/orders/:id/status` - Update order status
- `PATCH /api/admin/inventory/:productId` - Update stock
- `POST /api/admin/delivery/assign` - Assign delivery partner

### WebSocket Events
- `order:status_updated` - Real-time order status changes
- `delivery:location_updated` - Live delivery partner location
- `notification:new` - Push notifications

## Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| Phone-first auth | Matches Blinkit UX; OTP is the primary flow, password optional |
| Redis cart caching | Fast reads for frequently accessed cart data; 5-min TTL |
| PostgreSQL search | `ILIKE` with indexes avoids Elasticsearch complexity for MVP |
| Socket.IO rooms | User rooms for notifications, order rooms for tracking |
| Prisma ORM | Type-safe DB access with migrations and seeding |
| MinIO for dev | S3-compatible; same code works with AWS S3 in production |
| Order number via Redis | Atomic counter ensures unique sequential numbers per day |
| Stock reservation | Reserved on order placement, released on cancellation/delivery |

## Environment Variables

See [.env.example](.env.example) for all available configuration options.

Key variables:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_HOST` / `REDIS_PORT` - Redis connection
- `JWT_SECRET` / `JWT_REFRESH_SECRET` - Token signing keys
- `S3_ENDPOINT` / `S3_ACCESS_KEY` / `S3_SECRET_KEY` - File storage
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` - Payment gateway (optional)

## License

Private project - not for redistribution.
