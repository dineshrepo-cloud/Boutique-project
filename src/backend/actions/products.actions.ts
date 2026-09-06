"use server";

import { dataLayer } from "@/backend/db";

export async function getProductsAction(filter?: {
  categorySlug?: string;
  featured?: boolean;
  search?: string;
  maxPrice?: number;
}) {
  return await dataLayer.getProducts(filter);
}

export async function getProductBySlugAction(slug: string) {
  return await dataLayer.getProductBySlug(slug);
}

export async function getCategoriesAction() {
  return await dataLayer.getCategories();
}
