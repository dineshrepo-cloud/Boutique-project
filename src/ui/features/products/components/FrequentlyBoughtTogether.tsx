"use client";

import * as React from "react";
import Image from "next/image";
import { Plus, Check, ShoppingBag, Sparkles } from "lucide-react";
import { Product } from "@/backend/db/schema";
import { useCart } from "@/ui/features/cart/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/ui/primitives/button";
import { Badge } from "@/ui/primitives/badge";
import { Card } from "@/ui/primitives/card";
import { Checkbox } from "@/ui/primitives/checkbox";

interface FrequentlyBoughtTogetherProps {
  mainProduct: Product;
  bundleProduct: Product;
}

export function FrequentlyBoughtTogether({
  mainProduct,
  bundleProduct,
}: FrequentlyBoughtTogetherProps) {
  const { addItem } = useCart();
  const [includeMain, setIncludeMain] = React.useState(true);
  const [includeBundle, setIncludeBundle] = React.useState(true);
  const [added, setAdded] = React.useState(false);

  const rawTotal =
    (includeMain ? mainProduct.price : 0) +
    (includeBundle ? bundleProduct.price : 0);

  // 10% bundle privilege if both selected
  const isBundle = includeMain && includeBundle;
  const bundleDiscount = isBundle ? rawTotal * 0.1 : 0;
  const finalTotal = rawTotal - bundleDiscount;

  const handleAddBundle = () => {
    if (includeMain) addItem(mainProduct, 1);
    if (includeBundle) addItem(bundleProduct, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <Card className="p-6 border-border/80 bg-card shadow-unt-xs space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-sans text-lg font-bold tracking-tight text-foreground">
          Frequently Bought Together
        </h3>
        {isBundle && (
          <Badge variant="brand" size="sm" className="gap-1">
            <Sparkles className="h-3 w-3 text-amber-500" />
            Save 10% on this Bundle
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Visual Pair with Plus Icon */}
        <div className="lg:col-span-7 flex items-center gap-3">
          {/* Main Item */}
          <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-xl overflow-hidden bg-muted/30 border border-border/70 shrink-0">
            <Image
              src={mainProduct.image}
              alt={mainProduct.name}
              fill
              sizes="112px"
              className="object-cover"
            />
          </div>

          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0 text-muted-foreground font-bold">
            <Plus className="h-4 w-4" />
          </div>

          {/* Bundle Item */}
          <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-xl overflow-hidden bg-muted/30 border border-border/70 shrink-0">
            <Image
              src={bundleProduct.image}
              alt={bundleProduct.name}
              fill
              sizes="112px"
              className="object-cover"
            />
          </div>

          {/* Checkboxes List */}
          <div className="space-y-2 text-xs flex-1 min-w-0 pl-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <Checkbox
                checked={includeMain}
                onCheckedChange={(c) => setIncludeMain(Boolean(c))}
              />
              <span className="truncate text-foreground font-medium">
                <strong className="font-semibold">This item:</strong> {mainProduct.name} (
                {formatCurrency(mainProduct.price)})
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <Checkbox
                checked={includeBundle}
                onCheckedChange={(c) => setIncludeBundle(Boolean(c))}
              />
              <span className="truncate text-foreground font-medium">
                <strong className="font-semibold">Add-on item:</strong> {bundleProduct.name} (
                {formatCurrency(bundleProduct.price)})
              </span>
            </label>
          </div>
        </div>

        {/* Pricing & 1-Click Action */}
        <div className="lg:col-span-5 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-border/60 pt-4 lg:pt-0 lg:pl-6 space-y-3">
          <div>
            <span className="text-xs text-muted-foreground block">
              Total Price:
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">
                {formatCurrency(finalTotal)}
              </span>
              {bundleDiscount > 0 && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatCurrency(rawTotal)}
                </span>
              )}
            </div>
            {bundleDiscount > 0 && (
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium block">
                You save {formatCurrency(bundleDiscount)} with this bundle
              </span>
            )}
          </div>

          <Button
            type="button"
            variant="primary"
            size="md"
            disabled={!includeMain && !includeBundle}
            onClick={handleAddBundle}
            className="w-full gap-2 shadow-unt-xs"
          >
            {added ? (
              <>
                <Check className="h-4 w-4" />
                Both Items Added to Cart
              </>
            ) : (
              <>
                <ShoppingBag className="h-4 w-4" />
                Add Both Items to Cart
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
