"use client";

import Link from "next/link";
import { ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/ui/primitives/sheet";
import { Button } from "@/ui/primitives/button";
import { Separator } from "@/ui/primitives/separator";
import { Badge } from "@/ui/primitives/badge";
import { Progress } from "@/ui/primitives/progress";
import { useCart } from "../context/CartContext";
import { CartItemRow } from "./CartItemRow";
import { formatCurrency } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, setIsOpen, subtotal, itemCount } = useCart();

  const complimentaryShippingThreshold = 2000;
  const progressToFreeShipping = Math.min(
    100,
    (subtotal / complimentaryShippingThreshold) * 100
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-sans font-bold tracking-tight flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-brand-600" />
              Shopping Cart
              {itemCount > 0 && (
                <Badge variant="brand" size="sm">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </Badge>
              )}
            </SheetTitle>
          </div>

          {/* Free Shipping Progress using Untitled UI Progress */}
          <div className="mt-3 rounded-xl bg-card border border-border/70 p-3 shadow-unt-xs">
            <div className="flex items-center justify-between text-xs mb-2 font-medium">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                Free Express Delivery
              </span>
              <span className="font-semibold text-foreground">
                {subtotal >= complimentaryShippingThreshold
                  ? "Unlocked"
                  : `${formatCurrency(complimentaryShippingThreshold - subtotal)} away`}
              </span>
            </div>
            <Progress value={progressToFreeShipping} className="h-1.5" />
          </div>
        </SheetHeader>

        {/* Item List or Empty State */}
        <div className="flex-1 overflow-y-auto px-1 py-2">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="h-16 w-16 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground mb-4">
                <ShoppingBag className="h-7 w-7 opacity-50" />
              </div>
              <h3 className="text-base font-medium">Your cart is currently empty</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                Explore our curated collections of rare timepieces, bespoke leather, and artisanal perfumes.
              </p>
              <Button
                variant="secondary-gray"
                size="sm"
                className="mt-6"
                onClick={() => setIsOpen(false)}
                asChild
              >
                <Link href="/products">Browse Collections</Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {items.map((item) => (
                <CartItemRow
                  key={`${item.product.id}-${item.selectedSize || "default"}`}
                  item={item}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer & Checkout */}
        {items.length > 0 && (
          <SheetFooter className="mt-auto border-t border-border/60 pt-4 flex-col gap-3">
            <div className="space-y-1.5 text-sm w-full">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="text-foreground font-medium">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery Fee</span>
                <span className="text-foreground font-medium">
                  {subtotal >= complimentaryShippingThreshold
                    ? "Free"
                    : formatCurrency(75)}
                </span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-base font-semibold">
                <span>Total Amount</span>
                <span className="text-brand-600 text-lg">
                  {formatCurrency(
                    subtotal +
                      (subtotal >= complimentaryShippingThreshold ? 0 : 75)
                  )}
                </span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full mt-2 group"
              onClick={() => setIsOpen(false)}
              asChild
            >
              <Link href="/checkout">
                Proceed to Checkout
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 ml-1" />
              </Link>
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
