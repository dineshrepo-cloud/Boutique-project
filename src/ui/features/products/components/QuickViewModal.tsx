"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingBag, ArrowRight } from "lucide-react";
import { Product } from "@/backend/db/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/ui/primitives/dialog";
import { Button } from "@/ui/primitives/button";
import { Badge } from "@/ui/primitives/badge";
import { useCart } from "@/ui/features/cart/context/CartContext";
import { formatCurrency } from "@/lib/utils";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { addItem } = useCart();

  if (!product) return null;

  const handleAddToCart = () => {
    addItem(product, 1);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden sm:rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square md:aspect-auto w-full h-72 md:h-full bg-muted/40">
            <Image
              src={product.image}
              alt={`Photograph of ${product.name}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            {product.featured && (
              <div className="absolute top-3 left-3">
                <Badge variant="brand" size="sm">Boutique Exclusive</Badge>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-6 flex flex-col justify-between">
            <DialogHeader className="text-left space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="gray" size="sm">
                  {product.categorySlug}
                </Badge>
                <div
                  className="flex items-center gap-1 text-amber-500 text-xs font-medium"
                  aria-label={`Rating: ${product.rating.toFixed(1)} out of 5 stars`}
                >
                  <Star className="h-3 w-3 fill-amber-500" aria-hidden="true" />
                  <span aria-hidden="true">{product.rating.toFixed(1)}</span>
                </div>
              </div>

              <DialogTitle className="text-xl font-sans font-bold tracking-tight text-foreground">
                {product.name}
              </DialogTitle>

              <DialogDescription className="sr-only">
                Quick view modal for {product.name}. Check details and add to your shopping cart.
              </DialogDescription>

              {product.tagline && (
                <p className="text-xs text-brand-600 font-medium">
                  {product.tagline}
                </p>
              )}

              <p className="text-sm text-muted-foreground line-clamp-3 pt-2">
                {product.description}
              </p>
            </DialogHeader>

            <div className="mt-6 pt-4 border-t border-border/60">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="sr-only">Price: </span>
                <span className="text-2xl font-semibold text-foreground">
                  {formatCurrency(product.price)}
                </span>
                {product.compareAtPrice && (
                  <>
                    <span className="sr-only">, Original price: </span>
                    <span className="text-sm text-muted-foreground line-through" aria-hidden="true">
                      {formatCurrency(product.compareAtPrice)}
                    </span>
                  </>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  variant="primary"
                  className="w-full gap-2"
                  onClick={handleAddToCart}
                  aria-label={`Add ${product.name} to cart`}
                >
                  <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                  Add to Cart
                </Button>
                <Button
                  variant="secondary-gray"
                  className="w-full gap-2 text-xs"
                  asChild
                  onClick={onClose}
                >
                  <Link href={`/products/${product.slug}`}>
                    View Full Details
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
