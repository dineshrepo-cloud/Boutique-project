"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { useCart } from "@/ui/features/cart/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/ui/primitives/button";
import { Badge } from "@/ui/primitives/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/primitives/card";
import { Alert, AlertDescription, AlertTitle } from "@/ui/primitives/alert";
import { Progress } from "@/ui/primitives/progress";
import { Separator } from "@/ui/primitives/separator";

export default function CartPage() {
  const { items, subtotal, itemCount, updateQuantity, removeItem, clearCart } =
    useCart();

  const complimentaryShippingThreshold = 2000;
  const progressToFreeShipping = Math.min(
    100,
    (subtotal / complimentaryShippingThreshold) * 100
  );
  const shippingFee = subtotal >= complimentaryShippingThreshold ? 0 : 75;
  const estimatedTotal = subtotal + shippingFee;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="h-20 w-20 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground mx-auto mb-6">
          <ShoppingBag className="h-9 w-9 opacity-50" />
        </div>
        <Badge variant="gray" size="sm" className="mb-2">
          Shopping Cart
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-sans font-bold tracking-tight text-foreground">
          Your Shopping Cart is Empty
        </h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto leading-relaxed">
          You currently have no items in your cart. Explore our collection of fine timepieces, leather goods, and fragrances.
        </p>
        <Button variant="primary" className="mt-8 gap-2 shadow-unt-xs" asChild>
          <Link href="/products">
            Start Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-8 mb-8 border-b border-border/60 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-semibold tracking-widest text-primary">
              Your Items
            </span>
            <Badge variant="brand" size="sm">
              {itemCount} {itemCount === 1 ? "Item" : "Items"}
            </Badge>
          </div>
          <h1 className="font-sans text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Shopping Cart
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="tertiary-gray"
            size="sm"
            onClick={clearCart}
            className="text-xs hover:text-error-600"
          >
            Clear Cart
          </Button>
          <Button variant="secondary-gray" size="sm" asChild>
            <Link href="/products" className="gap-1.5 text-xs">
              <ArrowLeft className="h-3.5 w-3.5" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left: Bag Items List */}
        <div className="lg:col-span-7 space-y-6">
          {/* Free Courier Progress Card */}
          <Card className="p-4 bg-card/60 shadow-xs">
            <div className="flex items-center justify-between text-xs mb-2 font-medium">
              <span className="flex items-center gap-1.5 text-foreground">
                <Sparkles className="h-4 w-4 text-amber-500" />
                Free Express Delivery Qualification
              </span>
              <span className="font-semibold text-primary">
                {subtotal >= complimentaryShippingThreshold
                  ? "Unlocked"
                  : `${formatCurrency(complimentaryShippingThreshold - subtotal)} away`}
              </span>
            </div>
            <Progress value={progressToFreeShipping} className="h-1.5" />
          </Card>

          {/* Itemized Piece Rows */}
          <Card className="p-6 divide-y divide-border/50">
            {items.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedSize || "default"}`}
                className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-5 items-start sm:items-center"
              >
                <div className="relative h-24 w-24 rounded-xl overflow-hidden border border-border/70 bg-muted/30 shrink-0">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="font-medium text-sm text-foreground hover:text-primary transition-colors line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-muted-foreground capitalize mt-0.5">
                        {item.product.categorySlug.replace("-", " ")}
                      </p>
                      {item.selectedSize && (
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Size / Specification: {item.selectedSize}
                        </p>
                      )}
                    </div>
                    <span className="font-semibold text-sm text-foreground font-mono">
                      {formatCurrency(item.product.price * item.quantity)}
                    </span>
                  </div>

                  {/* Quantity Stepper & Removal */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-border/70 rounded-lg overflow-hidden bg-background">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="p-1.5 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100 text-muted-foreground transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-3 text-xs font-semibold font-mono text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="p-1.5 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100 text-muted-foreground transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <Button
                      variant="tertiary-gray"
                      size="sm"
                      className="h-8 text-xs text-muted-foreground hover:text-error-600 gap-1"
                      onClick={() => removeItem(item.product.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Remove</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </Card>

          {/* Authentic Quality Alert */}
          <Alert variant="brand">
            <ShieldCheck className="h-4 w-4" />
            <AlertTitle className="font-semibold text-xs">
              100% Genuine &amp; Authentic Guarantee
            </AlertTitle>
            <AlertDescription className="text-xs leading-relaxed">
              Every item is quality-inspected and packaged securely in luxury presentation boxes with authentic certificates.
            </AlertDescription>
          </Alert>
        </div>

        {/* Right: Order Pricing & Checkout Trigger */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 shadow-unt-xs border-border/70 space-y-6">
            <CardHeader className="p-0">
              <CardTitle className="font-sans text-lg font-bold tracking-tight text-foreground">
                Order Summary
              </CardTitle>
            </CardHeader>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</span>
                <span className="font-medium text-foreground">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              <div className="flex justify-between text-muted-foreground">
                <span>Delivery Fee</span>
                <span className="font-medium text-foreground">
                  {shippingFee === 0 ? "Free" : formatCurrency(shippingFee)}
                </span>
              </div>

              <div className="flex justify-between text-muted-foreground items-center">
                <span>Packaging &amp; Quality Check</span>
                <Badge variant="success" size="sm">Included</Badge>
              </div>

              <Separator className="my-2" />

              <div className="flex justify-between text-base font-semibold pt-1">
                <span>Total Amount</span>
                <span className="text-primary text-xl">
                  {formatCurrency(estimatedTotal)}
                </span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full h-12 text-sm font-semibold gap-2 shadow-unt-sm rounded-xl"
              asChild
            >
              <Link href="/checkout">
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </Card>

          {/* Delivery Assurance */}
          <div className="p-4 rounded-xl border border-border/60 bg-card/60 text-xs space-y-1.5">
            <span className="font-semibold text-foreground block">
              Free Delivery Benefits
            </span>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Orders over ₹2,000 receive complimentary express insured courier delivery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
