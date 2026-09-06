import { dataLayer } from "@/backend/db";
import { ProductFilters } from "@/ui/features/products/components/ProductFilters";
import { ProductGrid } from "@/ui/features/products/components/ProductGrid";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Products | Yuka Trendz",
  description:
    "Explore our collection of luxury timepieces, leather accessories, and bespoke perfumery.",
};

interface BoutiqueCatalogPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
  }>;
}

export default async function BoutiqueCatalogPage({
  searchParams,
}: BoutiqueCatalogPageProps) {
  const resolvedSearchParams = await searchParams;
  const categorySlug = resolvedSearchParams.category;
  const search = resolvedSearchParams.search;

  const [products, categories] = await Promise.all([
    dataLayer.getProducts({
      categorySlug: categorySlug || undefined,
      search: search || undefined,
    }),
    dataLayer.getCategories(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header */}
      <div className="max-w-2xl mb-8">
        <span className="text-xs uppercase font-semibold tracking-widest text-primary">
          Our Collection
        </span>
        <h1 className="text-3xl sm:text-4xl font-sans font-bold tracking-tight text-foreground mt-1">
          All Products
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Handcrafted and quality-verified. Browse our curated collection of luxury pieces below.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <ProductFilters categories={categories} totalCount={products.length} />

      {/* Products Grid */}
      <ProductGrid products={products} />
    </div>
  );
}
