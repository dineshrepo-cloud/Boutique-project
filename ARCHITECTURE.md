# Industry-Standard Architecture & Framework Specification

> **Yuka Trendz Boutique Application**  
> *Stack: Next.js (App Router), React 19, TypeScript, Untitled UI Design System (Radix-Free), Tailwind CSS v4, Neon Serverless PostgreSQL, Drizzle ORM.*

---

## 1. Architectural Overview & Core Principles

This application is built according to **Clean Architecture** principles and the **React Server Components (RSC) Paradigm**. The codebase enforces a strict separation between presentation (`src/ui/*`), infrastructure & persistence (`src/backend/*`), and routing & page composition (`src/app/*`).

```
                  ┌─────────────────────────────────────────┐
                  │          App Router (src/app)           │
                  │  Pages, Layouts, Server-Side Data Fetch │
                  └────────────────────┬────────────────────┘
                                       │
                ┌──────────────────────┴──────────────────────┐
                ▼                                             ▼
  ┌───────────────────────────┐                 ┌───────────────────────────┐
  │     UI Layer (src/ui)     │                 │ Backend Layer (src/backend│
  │  • Untitled UI Primitives │                 │  • Persistence (Neon DB)  │
  │  • Layout & Nav Shells    │                 │  • Drizzle ORM Schemas    │
  │  • Domain Features & PLG  │                 │  • Server Actions & DTOs  │
  │  • Auth & Cart Contexts   │                 │  • Cryptographic Auth     │
  └───────────────────────────┘                 └───────────────────────────┘
```

### Foundational Principles
1. **Clean Separation of Concerns**:
   - `src/ui/*`: Presentation, client-side event handling, and Untitled UI component primitives. **Never** imports database drivers or accesses server secrets.
   - `src/backend/*`: Neon PostgreSQL connections, Drizzle schemas, Next.js Server Actions (`'use server'`), HMAC session signing, and data persistence.
   - `src/app/*`: Route handlers, layouts, page composition, and metadata.
2. **Zero Radix UI Dependencies**:
   - All 11 component primitives in `src/ui/primitives/` (`Button`, `Dialog`, `Sheet`, `Tabs`, `Select`, `Checkbox`, `Label`, `Progress`, `Tooltip`, `Separator`, `DropdownMenu`) are 100% native React implementations styled with official Untitled UI design tokens.
3. **Strict Type Safety**:
   - Zero `any` types across the entire codebase.
   - Domain models derived directly from Drizzle ORM table schemas (`User`, `Product`, `Category`, `Order`).
4. **Server First**:
   - React Server Components (RSC) are the default. Client components (`"use client"`) are pushed to the leaves of the render tree.

---

## 2. Directory Hierarchy & Code Organization

```
src/
├── backend/                             # 🟢 DEDICATED BACKEND & SERVER LAYER
│   ├── auth/                            # Cryptographic Authentication & Sessions
│   │   └── session.ts                   # HMAC SHA-256 session token signing & verification
│   ├── db/                              # Database & Persistence (Neon + Drizzle)
│   │   ├── index.ts                     # Unified Data Layer & fallback repository
│   │   ├── schema.ts                    # Drizzle ORM schemas (categories, products, orders, users)
│   │   └── seed-data.ts                 # Master boutique catalog seed data
│   ├── actions/                         # Next.js Server Actions ('use server')
│   │   ├── auth.actions.ts              # Basic Auth, Google OAuth, sign-out, session verification
│   │   ├── products.actions.ts          # Catalog search & product queries
│   │   ├── inventory.actions.ts         # Vault stock adjustments & creations
│   │   └── payment.actions.ts           # Order placement & simulated settlement
│   ├── types/                           # Backend DTOs & domain contracts
│   └── index.ts                         # Primary backend barrel export
│
├── ui/                                  # 🔵 DEDICATED UI & FRONTEND LAYER
│   ├── primitives/                      # Standardized Untitled UI Components (Radix-Free)
│   │   ├── button.tsx, dialog.tsx, card.tsx, input.tsx, select.tsx,
│   │   ├── sheet.tsx, tabs.tsx, checkbox.tsx, label.tsx, progress.tsx,
│   │   ├── tooltip.tsx, separator.tsx, alert.tsx, badge.tsx, dropdown-menu.tsx
│   ├── layout/                          # Global Shell & Navigation
│   │   ├── Header.tsx                   # Amazon-style 2-tier mega navigation bar
│   │   ├── Footer.tsx                   # Client concierge links & provenance trust footer
│   │   ├── StatusBanner.tsx             # Luxury announcement bar with private concierge
│   │   ├── ThemeToggle.tsx              # Dark/light mode theme toggle
│   │   ├── DeliveryModal.tsx            # Global luxury delivery destination selector
│   │   └── DepartmentsDrawer.tsx        # "All Departments" slide-over drawer
│   ├── providers/                       # Root Theme & Style Providers
│   │   └── ThemeProvider.tsx            # next-themes color-scheme provider
│   ├── features/                        # Domain-Driven Client Feature Modules
│   │   ├── auth/                        # User Authentication:
│   │   │   ├── context/AuthContext.tsx  # React client authentication context & hooks
│   │   │   └── components/LoginForm.tsx # Untitled UI Login & Register form with Google OAuth
│   │   ├── cart/                        # Shopping Bag: CartDrawer, CartItemRow, CartContext
│   │   ├── products/                    # Catalog: ProductCard, ProductGrid, ProductFilters,
│   │   │                                # AmazonBuyBox, FrequentlyBoughtTogether, CustomerReviews
│   │   ├── inventory/                   # Operations: AddProductDialog, InventoryTable
│   │   ├── payment/                     # Settlement: LuxuryCardForm, OrderSummarySidebar, PaymentSuccessModal
│   │   └── plg/                         # Product-Led Growth Modules:
│   │       ├── ReferralModal.tsx        # Viral "Give $150, Get $150" referral engine
│   │       └── BespokeMatcherQuiz.tsx   # Interactive self-serve onboarding curation quiz
│   └── index.ts                         # Primary UI barrel export
│
├── app/                                 # 🌐 APP ROUTER (Routing, Layouts, Page Composition)
│   ├── admin/page.tsx                   # Vault Operations & Inventory Ledger (RSC)
│   ├── cart/page.tsx                    # Bag Review (Client Component)
│   ├── checkout/page.tsx                # Payment & Order Confirmation with user auto-fill
│   ├── login/page.tsx                   # Member Authentication Portal (Basic Auth + Google)
│   ├── products/page.tsx                # Catalog & Faceted Search (RSC)
│   ├── products/[slug]/page.tsx         # 3-Column Amazon PDP with Sticky Buy Box (RSC)
│   ├── page.tsx                         # Homepage: Hero quad-cards, carousels, trust bar
│   ├── globals.css                      # Design tokens, Tailwind v4 @theme, Slate scale
│   └── layout.tsx                       # Root HTML shell, AuthProvider, CartProvider, ThemeProvider
│
└── lib/                                 # Shared General Utilities
    └── utils.ts                         # cn() helper, formatCurrency(), slugify()
```

---

## 3. Design System & Typography Architecture

### A. Untitled UI Design System
- **Neutral Palette**: Clean Slate ramp (`--gray-25: #f8fafc` through `--gray-950: #020617`).
- **Brand Palette**: Warm artisanal horlogerie gold/amber (`--brand-50` to `--brand-900`).
- **Semantic Mappings**:
  - Light canvas: `#f8fafc` (Slate 50)
  - Elevated card surfaces: `#ffffff`
  - High-contrast typography: `#0f172a` (Slate 900)
  - Subtle borders: `#e2e8f0` (Slate 200)
  - Secondary fills: `#f1f5f9` (Slate 100)
- **Focus Rings**: Soft 4px Untitled UI focus rings (`box-shadow: 0 0 0 4px rgba(184, 129, 50, 0.2)`).
- **Shadow System**: `.shadow-unt-xs`, `.shadow-unt-sm`, `.shadow-unt-md`, `.shadow-unt-lg`, `.shadow-unt-xl`.

### B. Typography Stack (Geist Sans / Inter)
- Configured in `src/app/globals.css` via Tailwind v4 `@theme`:
  ```css
  @theme {
    --font-sans: var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    --font-serif: var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    --font-mono: var(--font-geist-mono), monospace;
  }
  ```
- **Zero Times New Roman Fallbacks**: `--font-serif` is mapped to modern sans-serif as an architectural fail-safe, and all headings use `font-sans font-bold tracking-tight` for clean, professional legibility.

---

## 4. Authentication Architecture

### A. Dual Authentication Protocols
1. **Basic Auth (Email & Password)**:
   - Input validation and password hashing verification.
   - Pre-seeded VIP and Curator demo credentials for testing (`patron@maison.luxury` / `curator@atelier.com`).
2. **Google Sign-In**:
   - Official multi-color Google branding button with one-click instant session provisioning.
   - Seamlessly provisions new member accounts or connects existing accounts.

### B. Cryptographic Session Tokens
- Implemented in `src/backend/auth/session.ts` using Node.js native `crypto`.
- **HMAC SHA-256 Signatures**: Prevents token tampering.
- **Timing-Safe Equality**: `crypto.timingSafeEqual` eliminates side-channel timing attacks.
- **Cookie Security**:
  - Name: `maison_session`
  - `httpOnly: true` (inaccessible to browser scripts)
  - `sameSite: "lax"` (cross-site request forgery protection)
  - `maxAge: 7 days` (sliding session expiration)

---

## 5. Amazon-Caliber E-Commerce Architecture & PLG

### A. 2-Tier Mega Navigation Header
- **Tier 1 (Main Mega Bar)**:
  - Delivery Destination Selector: "Deliver to Geneva (1204)" opens global luxury delivery modal.
  - Category Search Engine: Multi-category dropdown integrated with keyword search.
  - User Authentication Dropdown: Displays user avatar, name, Connoisseur tier badge, and account menu.
  - Live Bag Indicator: Shows real-time item counter and subtotal.
- **Tier 2 (Secondary Utility Strip)**:
  - "All Departments" slide-over drawer trigger.
  - Direct salon links: Today's Vault Drops, Haute Horlogerie, Bespoke Leather, Rare Perfumery, Silk Tailoring.
  - VIP Referral trigger: "Refer a Connoisseur (Earn $150)".

### B. Product Detail Page (PDP)
- **3-Column Amazon Layout**:
  - Column 1: Multi-image gallery with zoom-on-hover.
  - Column 2: Titles, customer ratings, price breakdown with savings badges, bullet specifications.
  - Column 3: **Amazon Sticky Buy Box** ([AmazonBuyBox.tsx](file:///d:/Boutique%20project/Boutique-project/src/ui/features/products/components/AmazonBuyBox.tsx)) with real-time delivery countdown, stock scarcity alerts, 1-click "Buy Now", and gift packaging options.
- **Frequently Acquired Together Bundle** ([FrequentlyBoughtTogether.tsx](file:///d:/Boutique%20project/Boutique-project/src/ui/features/products/components/FrequentlyBoughtTogether.tsx)):
  - Real-time 10% bundle discount calculator with checkboxes to customize accessories.
- **Customer Reviews & Star Breakdown** ([CustomerReviews.tsx](file:///d:/Boutique%20project/Boutique-project/src/ui/features/products/components/CustomerReviews.tsx)):
  - 5-star distribution progress bars and verified buyer provenance tags.

### C. Product-Led Growth (PLG) Viral Loops
1. **Viral Referral Engine** ([ReferralModal.tsx](file:///d:/Boutique%20project/Boutique-project/src/ui/features/plg/ReferralModal.tsx)):
   - "Give $150, Unlock $150" invitation loop with 1-click copyable VIP links and gamified milestone rewards.
2. **Self-Serve Onboarding Quiz** ([BespokeMatcherQuiz.tsx](file:///d:/Boutique%20project/Boutique-project/src/ui/features/plg/BespokeMatcherQuiz.tsx)):
   - 3-step interactive preference matcher recommending personalized pieces with first-consignment voucher codes.

---

## 6. Neon Serverless PostgreSQL Data Layer

### A. Dual-Mode Resilient Architecture
- **When `DATABASE_URL` is set**: Uses `@neondatabase/serverless` with Drizzle ORM over pooled WebSockets/HTTP connections.
- **When `DATABASE_URL` is absent**: Transparently runs on an in-memory repository store populated with initial boutique seed data, guaranteeing zero crashes in local dev or CI.

### B. Drizzle ORM Schemas
- `categories`: Curated luxury salons (timepieces, leather goods, fragrance, apparel).
- `products`: Numbered pieces, prices, comparison pricing, stock, rating, and gallery images.
- `orders`: Transaction ledger, customer info, order numbers, fulfilled status, and item snapshots.
- `users`: Member profiles, passkeys, roles, tiers, and OAuth provider linkages.

---

## 7. Developer & Engineering Workflow

### Standard Commands

| Task | Command | Description |
| :--- | :--- | :--- |
| **Development Server** | `npm run dev` | Starts local Next.js dev server on port 3000 |
| **Type Check** | `.\node_modules\.bin\tsc.cmd --noEmit` | Strict TypeScript verification (0 errors required) |
| **Production Build** | `npm run build` | Compiles optimized static & dynamic bundles |
| **Database Push** | `npx drizzle-kit push` | Applies schema migrations directly to Neon PostgreSQL |
| **Database Studio** | `npx drizzle-kit studio` | Opens local visual database GUI to inspect tables |
