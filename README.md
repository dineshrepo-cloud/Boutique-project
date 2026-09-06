# Maison Atelier Boutique — Scalable UI Architecture

A luxury boutique e-commerce web application engineered with an industry-standard **Feature-Sliced Clean Architecture**, **Next.js (App Router)**, **shadcn/ui** design system, and **Neon Serverless PostgreSQL** with **Drizzle ORM**.

---

## 🏛️ Architecture & Technical Specification

For an in-depth breakdown of the project structure, component hierarchy, routing model, Turbopack bundling, and Neon database integration, please read:

👉 **[ARCHITECTURE.md](./ARCHITECTURE.md)**

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.17+ (v22 recommended)
- npm 9+

### 2. Installation
```bash
npm install
```

### 3. Environment Configuration (Optional)
To connect a live Neon Serverless PostgreSQL database, create a `.env.local` file:
```env
DATABASE_URL=postgres://[user]:[password]@[endpoint]-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
```
*(Note: If `DATABASE_URL` is omitted, the application automatically uses a zero-crash local in-memory fallback store with full luxury seed data).*

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build Verification
```bash
npm run build
```

---

## 📦 Key Highlights

- **Standardized shadcn/ui**: Button, Card, Badge, Dialog, Sheet, Table, Select, Tabs, Progress, Tooltip, Alert, Checkbox, Label, Textarea, Input.
- **Next.js App Router**: React 19 Server Components for 0 KB client JS overhead on content pages, combined with Client Component interactive leaves.
- **Neon Serverless + Drizzle ORM**: Type-safe schema with connection pooling and scale-to-zero serverless database.
- **Turbopack Bundling**: Sub-50ms HMR, automatic route-level code splitting, and tree-shaking.
- **Interactive Living Styleguide**: Available at `/architecture`.
