"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Truck,
  Lock,
  Sparkles,
  ShoppingBag,
  Zap,
  Check,
  Clock,
  Gift,
} from "lucide-react";
import { Product } from "@/backend/db/schema";
import { useCart } from "@/ui/features/cart/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/ui/primitives/button";
import { Badge } from "@/ui/primitives/badge";
import { Card } from "@/ui/primitives/card";
import { Checkbox } from "@/ui/primitives/checkbox";

interface AmazonBuyBoxProps {
  product: Product;
}

export function AmazonBuyBox({ product }: AmazonBuyBoxProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = React.useState(1);
  const [giftWrap, setGiftWrap] = React.useState(false);
  const [isAdding, setIsAdding] = React.useState(false);
  const [added, setAdded] = React.useState(false);

  const savings = product.compareAtPrice ? product.compareAtPrice - product.price : 0;
  const savingsPercent = product.compareAtPrice
    ? Math.round((savings / product.compareAtPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem(product, quantity);
    setTimeout(() => {
      setIsAdding(false);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }, 200);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    router.push("/checkout");
  };

  return (
    <Card className="p-5 border-border/80 bg-card shadow-unt-md space-y-4 sticky top-24">
      {/* Price & Savings */}
      <div className="space-y-1">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold text-foreground">
            {formatCurrency(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatCurrency(product.compareAtPrice)}
            </span>
          )}
        </div>
        {savings > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-error-600 dark:text-error-400 font-semibold">
            <Badge variant="error" size="sm">
              Save {formatCurrency(savings)} ({savingsPercent}%)
            </Badge>
          </div>
        )}
      </div>

      {/* Amazon Delivery Promise */}
      <div className="text-xs space-y-1 pt-1 border-t border-border/60">
        <div className="flex items-center gap-1.5 text-success-700 dark:text-success-400 font-semibold">
          <Truck className="h-4 w-4" />
          <span>FREE Express Delivery by Tomorrow</span>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Order within <strong className="text-foreground font-mono">2 hrs 45 mins</strong> for same-day dispatch.
        </p>
      </div>

      {/* Urgency Stock Availability */}
      <div className="space-y-1">
        <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 block">
          In Stock
        </span>
        <span className="text-[11px] text-muted-foreground block">
          Only {product.stock} units left in stock.
        </span>
      </div>

      {/* Quantity Dropdown */}
      <div className="flex items-center gap-3 text-xs">
        <label htmlFor="quantity-select" className="font-medium text-muted-foreground">
          Quantity:
        </label>
        <select
          id="quantity-select"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="h-8 rounded-lg border border-border bg-background px-3 text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-brand-500/20"
        >
          {Array.from({ length: Math.min(10, product.stock || 1) }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      {/* Action Buttons (Amazon Dual-CTA Pattern) */}
      <div className="space-y-2 pt-2">
        {/* Button 1: Add to Cart */}
        <Button
          type="button"
          variant="secondary-gray"
          size="lg"
          onClick={handleAddToCart}
          className="w-full h-11 text-xs sm:text-sm font-semibold gap-2 border-brand-300 shadow-unt-xs"
        >
          {added ? (
            <>
              <Check className="h-4 w-4 text-success-600" />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4 text-brand-600" />
              Add to Cart
            </>
          )}
        </Button>

        {/* Button 2: 1-Click Buy Now */}
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={handleBuyNow}
          className="w-full h-11 text-xs sm:text-sm font-semibold gap-2 shadow-unt-sm"
        >
          <Zap className="h-4 w-4 fill-amber-300 text-amber-300" />
          Buy Now (Instant Checkout)
        </Button>
      </div>

      {/* Gift Packaging Checkbox */}
      <div className="pt-2 border-t border-border/60">
        <label className="flex items-start gap-2 text-xs cursor-pointer select-none">
          <Checkbox
            id="gift-packaging"
            checked={giftWrap}
            onCheckedChange={(c) => setGiftWrap(Boolean(c))}
          />
          <span className="text-[11px] text-muted-foreground leading-tight">
            Add Luxury Presentation Gift Box &amp; Certificate (Free)
          </span>
        </label>
      </div>

      {/* Metadata Table (Ships From / Sold By) */}
      <div className="space-y-1.5 pt-2 border-t border-border/60 text-[11px]">
        <div className="flex justify-between text-muted-foreground">
          <span>Ships from</span>
          <span className="font-medium text-foreground">Yuka Trendz Fulfillment</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Sold by</span>
          <span className="font-medium text-foreground">Yuka Trendz Official</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Returns</span>
          <span className="font-medium text-foreground">7-Day Easy Return Policy</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Payment</span>
          <span className="font-medium text-foreground flex items-center gap-1">
            <Lock className="h-3 w-3 text-brand-600" /> 256-Bit SSL Encrypted
          </span>
        </div>
      </div>
    </Card>
  );
}
