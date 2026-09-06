"use client";

import { useState } from "react";
import { Product } from "@/backend/db/schema";
import { ProductCard } from "./ProductCard";
import { QuickViewModal } from "./QuickViewModal";

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
}

export function ProductGrid({
  products,
  emptyMessage = "No products found matching your criteria.",
}: ProductGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 p-12 text-center">
        <p className="text-base text-muted-foreground">{emptyMessage}</p>
        <span className="text-xs text-muted-foreground/60 mt-1">
          Try clearing your filters or exploring all categories.
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={(p) => setSelectedProduct(p)}
          />
        ))}
      </div>

      <QuickViewModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}
