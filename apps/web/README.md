# @blinkit/web - Customer Storefront

Nuxt 3 customer-facing application. Provides the shopping experience — browse products, manage cart, checkout, track orders in real-time.

## Stack

- **Nuxt 3** - Vue 3 framework with SSR/SSG support
- **Tailwind CSS** - Utility-first styling (Blinkit green theme)
- **Pinia** - State management
- **Socket.IO Client** - Real-time order tracking
- **VueUse** - Composition utilities

## Running

```bash
# From monorepo root
pnpm dev:web

# Or directly
cd apps/web
pnpm dev
```

Runs on http://localhost:3000.

## Pages

| Route | Page | Auth Required |
|-------|------|:---:|
| `/` | Home (banners, categories, deals, trending) | No |
| `/login` | Phone + OTP login | No |
| `/signup` | Registration | No |
| `/search` | Product search with filters | No |
| `/category` | All categories grid | No |
| `/category/[slug]` | Products in category + filters | No |
| `/product/[slug]` | Product detail (images, variants, reviews) | No |
| `/cart` | Shopping cart | No |
| `/checkout` | Address + delivery slot selection | Yes |
| `/checkout/payment` | Payment method + confirm | Yes |
| `/orders` | Order history list | Yes |
| `/orders/[id]` | Order detail + status timeline | Yes |
| `/track/[id]` | Real-time delivery tracking | Yes |
| `/account` | Profile management | Yes |
| `/account/addresses` | Saved addresses CRUD | Yes |

## Architecture

```
apps/web/
├── app.vue                 # Root component
├── nuxt.config.ts          # Nuxt configuration
├── tailwind.config.ts      # Theme (primary green, accent amber)
├── assets/css/main.css     # Tailwind + custom component classes
├── layouts/
│   ├── default.vue         # Header + BottomNav + CartDrawer
│   ├── auth.vue            # Centered branding layout
│   └── checkout.vue        # Minimal (logo + back button)
├── components/common/      # Reusable UI components
│   ├── AppHeader.vue       # Sticky header (logo, address, search, cart)
│   ├── BottomNav.vue       # Mobile tab navigation
│   ├── SearchBar.vue       # Search input
│   ├── LoadingSpinner.vue
│   ├── Toast.vue
│   └── Modal.vue
├── composables/            # Business logic hooks
│   ├── useAuth.ts          # Auth state + actions
│   ├── useCart.ts          # Cart operations
│   └── useNotification.ts  # Toast notifications
├── middleware/
│   ├── auth.ts             # Redirect to /login if not authenticated
│   └── guest.ts            # Redirect to / if already authenticated
├── plugins/
│   └── api.ts              # $fetch wrapper with auth headers + refresh
├── stores/                 # Pinia stores
│   ├── auth.ts             # User, tokens, login/logout
│   ├── cart.ts             # Cart items, optimistic updates
│   └── notification.ts     # Toast state
├── pages/                  # File-based routing (see table above)
├── types/                  # TypeScript interfaces
└── utils/
    └── formatters.ts       # Price, date, discount formatting
```

## UI Design

- **Primary color**: `#0c831f` (Blinkit green)
- **Mobile-first** responsive design
- **Bottom navigation** on mobile, header nav on desktop
- **Utility classes**: `.btn-primary`, `.btn-secondary`, `.input-field`, `.card`

## State Management

- **auth store** - User session, JWT tokens (persisted in localStorage)
- **cart store** - Cart items with optimistic add/remove and server sync
- **notification store** - Toast message queue with auto-dismiss
