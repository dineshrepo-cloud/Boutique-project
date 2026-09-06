"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, Star, Eye, Check } from "lucide-react";
import { useState } from "react";
import { Product } from "@/backend/db/schema";
import { useCart } from "@/ui/features/cart/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/ui/primitives/button";
import { Badge } from "@/ui/primitives/badge";
import { Card } from "@/ui/primitives/card";

export function ProductCard({
  product,
  onQuickView,
}: {
  product: Product;
  onQuickView?: (product: Product) => void;
}) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [imgSrc, setImgSrc] = useState(product.image);

  const fallbackImage = "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=900&auto=format&fit=crop";

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  const isLowStock = product.stock > 0 && product.stock <= 8;

  return (
    <Card className="group relative flex flex-col overflow-hidden transition-all duration-300 hover:shadow-unt-lg border-border/70 hover:border-brand-500/40">
      {/* Image Container with Hover zoom */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted/40">
        <Image
          src={imgSrc || fallbackImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          onError={() => setImgSrc(fallbackImage)}
        />

        {/* Top Badges - Untitled UI Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5 z-10">
          {product.featured && (
            <Badge variant="brand" size="sm">
              Yuka Exclusive
            </Badge>
          )}
          {isLowStock && (
            <Badge variant="error" size="sm" dot>
              Only {product.stock} Left
            </Badge>
          )}
        </div>

        {/* Quick View Button overlay - Accessible on hover AND keyboard focus-within */}
        {onQuickView && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-within:opacity-100 group-focus-within:opacity-100 bg-black/25 backdrop-blur-[2px]">
            <Button
              variant="secondary-gray"
              size="sm"
              className="gap-1.5 shadow-unt-md focus-visible:ring-4 focus-visible:ring-brand-500/50 bg-white text-gray-900 border-gray-200 hover:bg-gray-100 hover:text-gray-950 hover:border-gray-300"
              onClick={handleQuickViewClick}
              aria-label={`Quick look preview for ${product.name}`}
            >
              <Eye className="h-4 w-4" aria-hidden="true" />
              Quick Look
            </Button>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between mb-2">
            <Badge variant="gray" size="sm">
              {product.categorySlug.replace("-", " ")}
            </Badge>
            <div
              className="flex items-center gap-1 text-amber-500 font-medium text-xs"
              aria-label={`Rating: ${product.rating.toFixed(1)} out of 5 stars from ${product.reviewsCount} reviews`}
            >
              <Star className="h-3.5 w-3.5 fill-amber-500" aria-hidden="true" />
              <span aria-hidden="true">{product.rating.toFixed(1)}</span>
              <span className="text-muted-foreground/60" aria-hidden="true">({product.reviewsCount})</span>
            </div>
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline"
          >
            <h2 className="font-medium text-base text-foreground leading-snug line-clamp-1">
              {product.name}
            </h2>
          </Link>

          {product.tagline && (
            <p className="text-xs text-muted-foreground/80 mt-1 line-clamp-1">
              {product.tagline}
            </p>
          )}
        </div>

        {/* Price & Action */}
        <div className="mt-4 flex items-center justify-between pt-3 border-t border-border/50">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="sr-only">Current price: </span>
              <span className="text-lg font-semibold text-foreground">
                {formatCurrency(product.price)}
              </span>
              {product.compareAtPrice && (
                <>
                  <span className="sr-only">, Original price: </span>
                  <span className="text-xs text-muted-foreground line-through" aria-hidden="true">
                    {formatCurrency(product.compareAtPrice)}
                  </span>
                </>
              )}
            </div>
          </div>

          <Button
            size="sm"
            variant={isAdded ? "primary" : "secondary-gray"}
            className="rounded-full px-3 transition-all"
            onClick={handleQuickAdd}
            aria-label={isAdded ? `${product.name} added to cart` : `Add ${product.name} to cart`}
          >
            {isAdded ? (
              <>
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="text-xs">Added</span>
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="text-xs">Add</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
