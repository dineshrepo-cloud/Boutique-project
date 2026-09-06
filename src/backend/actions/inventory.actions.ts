"use server";

import { revalidatePath } from "next/cache";
import { dataLayer } from "@/backend/db";
import { NewProduct, Product } from "@/backend/db/schema";
import { slugify } from "@/lib/utils";
import { getCurrentUserAction } from "@/backend/actions/auth.actions";

/**
 * Ensures the caller is authenticated and possesses 'admin' privileges.
 */
async function requireAdmin() {
  const { user } = await getCurrentUserAction();
  if (!user || user.role !== "admin") {
    throw new Error("Access denied: Curator Administrator authorization required to modify inventory vault assets.");
  }
  return user;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred during inventory operations.";
}

/**
 * Quick stock adjustment action (Administrator clearance required)
 */
export async function updateStockAction(productId: number, newStock: number) {
  try {
    await requireAdmin();
    const cleanStock = Math.max(0, Math.floor(newStock));
    const updated = await dataLayer.updateStock(productId, cleanStock);

    revalidatePath("/admin");
    revalidatePath("/admin/inventory");
    revalidatePath("/products");
    revalidatePath("/");
    return { success: true, product: updated };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

/**
 * Register a newly acquired piece into the vault (Administrator clearance required)
 */
export async function createProductAction(data: {
  name: string;
  tagline?: string;
  description: string;
  price: number;
  compareAtPrice?: number | null;
  categorySlug: string;
  stock: number;
  image: string;
  featured?: boolean;
}) {
  try {
    await requireAdmin();
    const slug = slugify(data.name) + "-" + Math.floor(1000 + Math.random() * 9000);
    const newProductData: NewProduct = {
      name: data.name.trim(),
      slug,
      tagline: data.tagline?.trim() || null,
      description: data.description.trim(),
      price: Number(data.price),
      compareAtPrice: data.compareAtPrice ? Number(data.compareAtPrice) : null,
      categorySlug: data.categorySlug,
      stock: Math.max(0, Number(data.stock)),
      image:
        data.image.trim() ||
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=900&auto=format&fit=crop",
      gallery: JSON.stringify([
        data.image.trim() ||
          "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=900&auto=format&fit=crop",
      ]),
      featured: Boolean(data.featured),
      rating: 5.0,
      reviewsCount: 1,
    };

    const created = await dataLayer.createProduct(newProductData);
    revalidatePath("/admin");
    revalidatePath("/admin/inventory");
    revalidatePath("/products");
    revalidatePath("/");
    return { success: true, product: created };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

/**
 * Full product information, discount prices, image, and inventory details update (Administrator clearance required)
 */
export async function updateProductAction(
  productId: number,
  data: {
    name?: string;
    tagline?: string | null;
    description?: string;
    price?: number;
    compareAtPrice?: number | null;
    categorySlug?: string;
    stock?: number;
    image?: string;
    featured?: boolean;
  }
) {
  try {
    await requireAdmin();

    const updates: Partial<Product> = {};

    if (data.name !== undefined) {
      updates.name = data.name.trim();
    }
    if (data.tagline !== undefined) {
      updates.tagline = data.tagline ? data.tagline.trim() : null;
    }
    if (data.description !== undefined) {
      updates.description = data.description.trim();
    }
    if (data.price !== undefined) {
      const parsedPrice = Number(data.price);
      if (isNaN(parsedPrice) || parsedPrice <= 0) {
        throw new Error("Product price must be a valid positive number.");
      }
      updates.price = parsedPrice;
    }
    if (data.compareAtPrice !== undefined) {
      if (data.compareAtPrice === null || data.compareAtPrice === 0 || isNaN(Number(data.compareAtPrice))) {
        updates.compareAtPrice = null;
      } else {
        updates.compareAtPrice = Number(data.compareAtPrice);
      }
    }
    if (data.categorySlug !== undefined) {
      updates.categorySlug = data.categorySlug;
    }
    if (data.stock !== undefined) {
      updates.stock = Math.max(0, Math.floor(Number(data.stock)));
    }
    if (data.image !== undefined) {
      const cleanImage = data.image.trim();
      if (cleanImage) {
        updates.image = cleanImage;
        updates.gallery = JSON.stringify([cleanImage]);
      }
    }
    if (data.featured !== undefined) {
      updates.featured = Boolean(data.featured);
    }

    const updated = await dataLayer.updateProduct(productId, updates);

    revalidatePath("/admin");
    revalidatePath("/admin/inventory");
    revalidatePath("/products");
    revalidatePath(`/products/${updated.slug}`);
    revalidatePath("/");
    return { success: true, product: updated };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}

/**
 * Archive / Retire a piece from the vault ledger (Administrator clearance required)
 */
export async function deleteProductAction(productId: number) {
  try {
    await requireAdmin();
    const success = await dataLayer.deleteProduct(productId);
    if (!success) {
      return { success: false, error: "Piece not found in vault registry." };
    }

    revalidatePath("/admin");
    revalidatePath("/admin/inventory");
    revalidatePath("/products");
    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}
