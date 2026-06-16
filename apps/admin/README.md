# @blinkit/admin - Admin Dashboard

Nuxt 3 admin panel for managing products, orders, inventory, and delivery operations.

## Stack

- **Nuxt 3** - Vue 3 framework
- **Tailwind CSS** - Dashboard styling (dark sidebar + light content)
- **Chart.js + vue-chartjs** - Revenue and order analytics
- **Pinia** - Auth state management

## Running

```bash
# From monorepo root
pnpm dev:admin

# Or directly
cd apps/admin
pnpm dev
```

Runs on http://localhost:3002.

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/login` | Admin Login | Email/phone + password |
| `/` | Dashboard | Stats cards, revenue chart, order chart, recent orders |
| `/products` | Product List | Search, filter, paginated table |
| `/products/create` | Create Product | Multi-section form (info, pricing, images, variants) |
| `/products/[id]/edit` | Edit Product | Pre-filled product form |
| `/categories` | Categories | Tree view with CRUD modal |
| `/orders` | Order List | Filter by status, view details |
| `/orders/[id]` | Order Detail | Timeline, status update, assign delivery |
| `/inventory` | Inventory | Stock levels, low-stock alerts, adjust stock |
| `/delivery/partners` | Delivery Partners | List partners + active count |
| `/delivery/assignments` | Assignments | Active delivery tracking |

## Architecture

```
apps/admin/
├── app.vue
├── nuxt.config.ts
├── tailwind.config.ts
├── assets/css/main.css
├── layouts/
│   ├── default.vue         # Sidebar (256px) + TopBar + content
│   └── auth.vue            # Centered login layout
├── components/
│   ├── common/
│   │   ├── Sidebar.vue     # Navigation (slate-900 bg)
│   │   ├── TopBar.vue      # Search, notifications, user menu
│   │   ├── DataTable.vue   # Reusable table with slots + pagination
│   │   ├── StatsCard.vue   # Metric card with icon + trend
│   │   └── ConfirmDialog.vue
│   └── dashboard/
│       ├── RevenueChart.vue   # Line chart (last 7 days)
│       ├── OrdersChart.vue    # Bar chart (by status)
│       └── RecentOrders.vue   # Latest 5 orders table
├── middleware/
│   └── admin.ts            # Requires authenticated ADMIN role
├── plugins/
│   └── api.ts              # API client with auth headers
├── stores/
│   └── auth.ts             # Admin auth (login, logout, role check)
└── pages/                  # File-based routing (see table above)
```

## Design

- **Sidebar**: `slate-900` background with white text, active link highlighted in green
- **Content area**: `gray-50` background
- **Status badges**: Green (delivered), Yellow (preparing), Blue (confirmed), Red (cancelled), Gray (pending)
- **Data tables**: Striped rows, hover states, pagination controls
- **Charts**: Revenue line chart, orders bar chart with color-coded statuses

## Access Control

All pages except `/login` require the `admin` middleware which verifies:
1. User is authenticated (has valid JWT)
2. User has `ADMIN` role

Login with seed admin: phone `9999999999`, password `admin123`.
