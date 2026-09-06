import { pgTable, serial, text, integer, timestamp, boolean, doublePrecision } from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  tagline: text("tagline"),
  description: text("description").notNull(),
  price: doublePrecision("price").notNull(),
  compareAtPrice: doublePrecision("compare_at_price"),
  categorySlug: text("category_slug").notNull(),
  featured: boolean("featured").default(false).notNull(),
  stock: integer("stock").default(0).notNull(),
  rating: doublePrecision("rating").default(5.0).notNull(),
  reviewsCount: integer("reviews_count").default(0).notNull(),
  image: text("image").notNull(),
  gallery: text("gallery").notNull(), // JSON stringified array of URLs
  tags: text("tags"), // comma-separated
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  totalAmount: doublePrecision("total_amount").notNull(),
  status: text("status").default("processing").notNull(), // processing, fulfilled, shipped, cancelled
  items: text("items").notNull(), // JSON stringified order items
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"), // null for OAuth users
  avatarUrl: text("avatar_url"),
  provider: text("provider").default("credentials").notNull(), // 'credentials' | 'google'
  role: text("role").default("customer").notNull(), // 'customer' | 'vip' | 'admin'
  tier: text("tier").default("Connoisseur").notNull(), // 'Connoisseur' | 'Vault VIP' | 'Geneva Circle'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
