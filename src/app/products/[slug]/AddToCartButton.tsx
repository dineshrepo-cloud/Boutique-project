"use client";

import { useState } from "react";
import { ShoppingBag, Check, Plus, Minus, ShieldCheck, AlertCircle } from "lucide-react";
import { Product } from "@/backend/db/schema";
import { useCart } from "@/ui/features/cart/context/CartContext";
import { Button } from "@/ui/primitives/button";
import { Badge } from "@/ui/primitives/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/ui/primitives/tooltip";

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAdd = () => {
    addItem(product, quantity);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 2000);
  };

  const isSoldOut = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          {/* Quantity Selector using shadcn Buttons */}
          <div className="flex items-center justify-between rounded-xl border border-border/80 bg-background/80 px-3 py-1.5 sm:w-36 shadow-xs">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="tertiary-gray"
                  size="icon"
                  className="h-8 w-8 rounded-lg"
                  disabled={quantity <= 1 || isSoldOut}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Decrease quantity</p>
              </TooltipContent>
            </Tooltip>

            <span className="font-semibold text-sm tabular-nums">{quantity}</span>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="tertiary-gray"
                  size="icon"
                  className="h-8 w-8 rounded-lg"
                  disabled={quantity >= product.stock || isSoldOut}
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{quantity >= product.stock ? "Maximum stock reached" : "Increase quantity"}</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Main Add Button using Untitled UI Button */}
          <Button
            variant={isSuccess ? "primary" : isSoldOut ? "secondary-gray" : "primary"}
            size="lg"
            disabled={isSoldOut}
            onClick={handleAdd}
            className="flex-1 h-12 gap-2 text-sm shadow-unt-sm"
          >
            {isSoldOut ? (
              <>
                <AlertCircle className="h-4 w-4 text-error-600" />
                Sold Out
              </>
            ) : isSuccess ? (
              <>
                <Check className="h-4 w-4" />
                Added to Cart
              </>
            ) : (
              <>
                <ShoppingBag className="h-4 w-4" />
                Add to Cart
              </>
            )}
          </Button>
        </div>

        {/* Dynamic Untitled UI Badge indicator */}
        <div className="flex items-center gap-2">
          {isSoldOut ? (
            <Badge variant="error" dot size="sm">
              Currently Out of Stock
            </Badge>
          ) : isLowStock ? (
            <Badge variant="warning" dot size="sm">
              Only {product.stock} left in stock - order soon
            </Badge>
          ) : (
            <Badge variant="success" dot size="sm" className="gap-1">
              <ShieldCheck className="h-3 w-3" />
              100% Verified Authentic
            </Badge>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
