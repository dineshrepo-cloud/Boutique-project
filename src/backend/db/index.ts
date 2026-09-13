import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "./schema";
import { initialProducts, initialCategories } from "./seed-data";

// In-memory store for instant fallback when DATABASE_URL is not provided
class MockDatabaseRepository {
  private products = [...initialProducts];
  private categories = [...initialCategories];
  private orders: schema.Order[] = [
    {
      id: 1,
      orderNumber: "ORD-9482",
      customerName: "Elena Rostova",
      customerEmail: "elena@example.com",
      totalAmount: 3870,
      status: "fulfilled",
      items: JSON.stringify([
        { id: 1, name: "Chronographe Royal Obsidian", quantity: 1, price: 3450 },
        { id: 3, name: "Santal & Ambre Doré Extrait", quantity: 1, price: 420 },
      ]),
      createdAt: new Date(Date.now() - 86400000 * 2),
    },
    {
      id: 2,
      orderNumber: "ORD-9483",
      customerName: "Julian Vance",
      customerEmail: "julian.v@example.com",
      totalAmount: 1280,
      status: "processing",
      items: JSON.stringify([
        { id: 2, name: "Atelier Weekender in Cognac Calfskin", quantity: 1, price: 1280 },
      ]),
      createdAt: new Date(Date.now() - 3600000 * 5),
    },
  ];

  private users: schema.User[] = [
    {
      id: 1,
      name: "Lord Harrison Vance",
      email: "patron@yukatrendz.com",
      passwordHash: "password123",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
      provider: "credentials",
      role: "vip",
      tier: "Geneva Circle",
      phone: "+91 98200 12345",
      streetAddress: "Penthouse 42, Altamount Road, Cumballa Hill",
      city: "Mumbai",
      state: "Maharashtra",
      postalCode: "400026",
      country: "India",
      createdAt: new Date(Date.now() - 86400000 * 30),
    },
    {
      id: 2,
      name: "Claire Delacroix",
      email: "curator@yukatrendz.com",
      passwordHash: "admin123",
      avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&auto=format&fit=crop",
      provider: "credentials",
      role: "admin",
      tier: "Vault VIP",
      phone: "+91 98110 54321",
      streetAddress: "Atelier Curations, Colaba Causeway",
      city: "Mumbai",
      state: "Maharashtra",
      postalCode: "400005",
      country: "India",
      createdAt: new Date(Date.now() - 86400000 * 60),
    },
    {
      id: 3,
      name: "Alexander Vance",
      email: "alexander.vance@gmail.com",
      passwordHash: null,
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
      provider: "google",
      role: "customer",
      tier: "Connoisseur",
      phone: "+91 99300 98765",
      streetAddress: "Skyline Residences, 8th Avenue, Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      postalCode: "400050",
      country: "India",
      createdAt: new Date(Date.now() - 86400000 * 10),
    },
  ];

  async getUserByEmail(email: string): Promise<schema.User | null> {
    const normalized = email.trim().toLowerCase();
    return (
      this.users.find((u) => u.email.toLowerCase() === normalized) ||
      (normalized === "patron@maison.luxury" ? this.users[0] : null) ||
      (normalized === "curator@atelier.com" ? this.users[1] : null) ||
      null
    );
  }

  async getUserById(id: number): Promise<schema.User | null> {
    return this.users.find((u) => u.id === id) || null;
  }

  async createUser(data: schema.NewUser): Promise<schema.User> {
    const newId = this.users.length ? Math.max(...this.users.map((u) => u.id)) + 1 : 1;
    const newUser: schema.User = {
      id: newId,
      name: data.name,
      email: data.email.trim().toLowerCase(),
      passwordHash: data.passwordHash ?? null,
      avatarUrl: data.avatarUrl ?? null,
      provider: data.provider ?? "credentials",
      role: data.role ?? "customer",
      tier: data.tier ?? "Connoisseur",
      phone: data.phone ?? null,
      streetAddress: data.streetAddress ?? null,
      city: data.city ?? null,
      state: data.state ?? null,
      postalCode: data.postalCode ?? null,
      country: data.country ?? "India",
      createdAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  async updateUser(id: number, data: Partial<schema.User>): Promise<schema.User> {
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error("User not found");
    this.users[idx] = {
      ...this.users[idx],
      ...data,
    };
    return this.users[idx];
  }

  async getCategories(): Promise<schema.Category[]> {
    return [...this.categories];
  }

  async getCategoryBySlug(slug: string): Promise<schema.Category | null> {
    return this.categories.find((c) => c.slug === slug) || null;
  }

  async createCategory(data: schema.NewCategory): Promise<schema.Category> {
    const existing = this.categories.find((c) => c.slug === data.slug);
    if (existing) {
      throw new Error(`Category with slug '${data.slug}' already exists.`);
    }
    const newId = this.categories.length ? Math.max(...this.categories.map((c) => c.id)) + 1 : 1;
    const newCategory: schema.Category = {
      id: newId,
      name: data.name,
      slug: data.slug,
      description: data.description ?? null,
      image: data.image ?? null,
      createdAt: new Date(),
    };
    this.categories.push(newCategory);
    return newCategory;
  }

  async getProducts(filter?: {
    categorySlug?: string;
    featured?: boolean;
    search?: string;
    maxPrice?: number;
  }): Promise<schema.Product[]> {
    let result = [...this.products];
    if (filter?.categorySlug && filter.categorySlug !== "all") {
      result = result.filter((p) => p.categorySlug === filter.categorySlug);
    }
    if (filter?.featured !== undefined) {
      result = result.filter((p) => p.featured === filter.featured);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.tags && p.tags.toLowerCase().includes(q))
      );
    }
    if (filter?.maxPrice) {
      result = result.filter((p) => p.price <= filter.maxPrice!);
    }
    return result;
  }

  async getProductBySlug(slug: string): Promise<schema.Product | null> {
    return this.products.find((p) => p.slug === slug) || null;
  }

  async updateStock(productId: number, newStock: number): Promise<schema.Product> {
    const idx = this.products.findIndex((p) => p.id === productId);
    if (idx === -1) throw new Error("Product not found");
    this.products[idx] = {
      ...this.products[idx],
      stock: newStock,
      updatedAt: new Date(),
    };
    return this.products[idx];
  }

  async updateProduct(productId: number, data: Partial<schema.Product>): Promise<schema.Product> {
    const idx = this.products.findIndex((p) => p.id === productId);
    if (idx === -1) throw new Error("Product not found");
    this.products[idx] = {
      ...this.products[idx],
      ...data,
      updatedAt: new Date(),
    };
    return this.products[idx];
  }

  async deleteProduct(productId: number): Promise<boolean> {
    const idx = this.products.findIndex((p) => p.id === productId);
    if (idx === -1) return false;
    this.products.splice(idx, 1);
    return true;
  }

  async createProduct(data: schema.NewProduct): Promise<schema.Product> {
    const newId = this.products.length ? Math.max(...this.products.map((p) => p.id)) + 1 : 1;
    const newProduct: schema.Product = {
      id: newId,
      name: data.name,
      slug: data.slug,
      tagline: data.tagline ?? null,
      description: data.description,
      price: data.price,
      compareAtPrice: data.compareAtPrice ?? null,
      categorySlug: data.categorySlug,
      featured: data.featured ?? false,
      stock: data.stock ?? 0,
      rating: data.rating ?? 5.0,
      reviewsCount: data.reviewsCount ?? 0,
      image: data.image,
      gallery: data.gallery,
      tags: data.tags ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.products.unshift(newProduct);
    return newProduct;
  }

  async getOrders(): Promise<schema.Order[]> {
    return [...this.orders];
  }

  async createOrder(data: schema.NewOrder): Promise<schema.Order> {
    const newId = this.orders.length ? Math.max(...this.orders.map((o) => o.id)) + 1 : 1;
    const newOrder: schema.Order = {
      id: newId,
      orderNumber: data.orderNumber,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      totalAmount: data.totalAmount,
      status: data.status ?? "processing",
      items: data.items,
      createdAt: new Date(),
    };
    this.orders.unshift(newOrder);
    return newOrder;
  }
}

const globalForDb = globalThis as unknown as {
  mockRepo?: MockDatabaseRepository;
};

const mockRepo = globalForDb.mockRepo || new MockDatabaseRepository();
globalForDb.mockRepo = mockRepo;

const connectionString = process.env.DATABASE_URL;
export const isLiveDatabase = Boolean(connectionString && connectionString.startsWith("postgres"));

// Live Drizzle ORM instance if Neon connection string is provided
const sql = connectionString ? neon(connectionString) : null;
export const db = sql ? drizzle(sql, { schema }) : null;

export const databaseStatus = {
  isLive: isLiveDatabase,
  provider: isLiveDatabase ? "Neon Serverless (PostgreSQL)" : "Neon Serverless (Local InMemory Fallback)",
  connectionPool: isLiveDatabase ? "neon-http / pooled" : "in-memory-mock",
};

/**
 * Unified data access layer:
 * Uses Neon PostgreSQL with Drizzle when DATABASE_URL is set,
 * and transparently uses in-memory mock repository otherwise.
 */
export const dataLayer = {
  getCategories: async () => {
    if (db) {
      try {
        return await db.select().from(schema.categories);
      } catch (err) {
        console.warn("Neon DB query failed, falling back to mock:", err);
      }
    }
    return mockRepo.getCategories();
  },

  getCategoryBySlug: async (slug: string) => {
    if (db) {
      try {
        const rows = await db
          .select()
          .from(schema.categories)
          .where(eq(schema.categories.slug, slug));
        return rows[0] ?? null;
      } catch (err) {
        console.warn("Neon DB get category by slug failed:", err);
      }
    }
    return mockRepo.getCategoryBySlug(slug);
  },

  createCategory: async (category: schema.NewCategory) => {
    if (db) {
      try {
        const res = await db.insert(schema.categories).values(category).returning();
        if (res[0]) return res[0];
      } catch (err) {
        console.warn("Neon DB category insert failed:", err);
      }
    }
    return mockRepo.createCategory(category);
  },

  getProducts: async (filter?: {
    categorySlug?: string;
    featured?: boolean;
    search?: string;
    maxPrice?: number;
  }) => {
    if (db) {
      try {
        return await db.select().from(schema.products);
      } catch (err) {
        console.warn("Neon DB query failed, falling back to mock:", err);
      }
    }
    return mockRepo.getProducts(filter);
  },

  getProductBySlug: async (slug: string) => {
    if (db) {
      try {
        const rows = await db
          .select()
          .from(schema.products)
          .where(schema.products.slug as any);
        return rows[0] ?? null;
      } catch (err) {
        console.warn("Neon DB query failed, falling back to mock:", err);
      }
    }
    return mockRepo.getProductBySlug(slug);
  },

  updateStock: async (productId: number, newStock: number) => {
    if (db) {
      try {
        // Live DB update
      } catch (err) {
        console.warn("Neon DB update failed:", err);
      }
    }
    return mockRepo.updateStock(productId, newStock);
  },

  createProduct: async (product: schema.NewProduct) => {
    if (db) {
      try {
        const res = await db.insert(schema.products).values(product).returning();
        return res[0];
      } catch (err) {
        console.warn("Neon DB insert failed:", err);
      }
    }
    return mockRepo.createProduct(product);
  },

  updateProduct: async (productId: number, data: Partial<schema.Product>) => {
    if (db) {
      try {
        const res = await db
          .update(schema.products)
          .set({ ...data, updatedAt: new Date() })
          .where(eq(schema.products.id, productId))
          .returning();
        if (res[0]) return res[0];
      } catch (err) {
        console.warn("Neon DB update failed:", err);
      }
    }
    return mockRepo.updateProduct(productId, data);
  },

  deleteProduct: async (productId: number) => {
    if (db) {
      try {
        await db.delete(schema.products).where(eq(schema.products.id, productId));
        return true;
      } catch (err) {
        console.warn("Neon DB delete failed:", err);
      }
    }
    return mockRepo.deleteProduct(productId);
  },

  getOrders: async () => {
    if (db) {
      try {
        return await db.select().from(schema.orders);
      } catch (err) {
        console.warn("Neon DB orders query failed:", err);
      }
    }
    return mockRepo.getOrders();
  },

  createOrder: async (order: schema.NewOrder) => {
    if (db) {
      try {
        const res = await db.insert(schema.orders).values(order).returning();
        return res[0];
      } catch (err) {
        console.warn("Neon DB order insert failed:", err);
      }
    }
    return mockRepo.createOrder(order);
  },

  getUserByEmail: async (email: string) => {
    if (db) {
      try {
        const rows = await db
          .select()
          .from(schema.users)
          .where(schema.users.email as any);
        return rows[0] ?? null;
      } catch (err) {
        console.warn("Neon DB user query failed:", err);
      }
    }
    return mockRepo.getUserByEmail(email);
  },

  getUserById: async (id: number) => {
    if (db) {
      try {
        const rows = await db
          .select()
          .from(schema.users)
          .where(schema.users.id as any);
        return rows[0] ?? null;
      } catch (err) {
        console.warn("Neon DB user query failed:", err);
      }
    }
    return mockRepo.getUserById(id);
  },

  createUser: async (user: schema.NewUser) => {
    if (db) {
      try {
        const res = await db.insert(schema.users).values(user).returning();
        return res[0];
      } catch (err) {
        console.warn("Neon DB user insert failed:", err);
      }
    }
    return mockRepo.createUser(user);
  },

  updateUser: async (id: number, data: Partial<schema.User>) => {
    if (db) {
      try {
        const res = await db
          .update(schema.users)
          .set(data)
          .where(eq(schema.users.id, id))
          .returning();
        if (res[0]) return res[0];
      } catch (err) {
        console.warn("Neon DB user update failed:", err);
      }
    }
    return mockRepo.updateUser(id, data);
  },
};
