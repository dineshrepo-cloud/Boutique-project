"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem } from "../types";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/ui/primitives/button";

export function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCart();
  const { product, quantity, selectedSize } = item;

  return (
    <div className="flex gap-4 py-4 border-b border-border/60">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted/30 border border-border/40">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h4 className="text-sm font-medium leading-tight text-foreground line-clamp-1">
              {product.name}
            </h4>
            <span className="text-sm font-semibold text-brand-600 ml-2">
              {formatCurrency(product.price * quantity)}
            </span>
          </div>
          {selectedSize && (
            <p className="text-xs text-muted-foreground mt-0.5">
              Size: {selectedSize}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            {formatCurrency(product.price)} each
          </p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center rounded-lg border border-border/70 bg-background/80 overflow-hidden">
            <Button
              variant="tertiary-gray"
              size="icon"
              className="h-7 w-7 rounded-none hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100"
              onClick={() => updateQuantity(product.id, quantity - 1)}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-xs font-medium">
              {quantity}
            </span>
            <Button
              variant="tertiary-gray"
              size="icon"
              className="h-7 w-7 rounded-none hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100"
              onClick={() => updateQuantity(product.id, quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <Button
            variant="tertiary-gray"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-error-600 hover:bg-error-50 dark:hover:bg-error-950/30"
            onClick={() => removeItem(product.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
