"use client";

import { useState } from "react";
import Image from "next/image";
import { CartItem } from "@/ui/features/cart/types";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/primitives/card";
import { Input } from "@/ui/primitives/input";
import { Button } from "@/ui/primitives/button";
import { Separator } from "@/ui/primitives/separator";
import { Badge } from "@/ui/primitives/badge";
import { ShieldCheck, Lock, Sparkles, Tag, Check } from "lucide-react";

interface OrderSummarySidebarProps {
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  onApplyPromo: (code: string) => boolean;
}

export function OrderSummarySidebar({
  items,
  subtotal,
  shippingFee,
  discount,
  onApplyPromo,
}: OrderSummarySidebarProps) {
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    if (!promoCode) return;
    const success = onApplyPromo(promoCode.trim().toUpperCase());
    if (success) {
      setPromoApplied(true);
    } else {
      setPromoError("Invalid or expired concierge invitation code.");
    }
  };

  const finalTotal = Math.max(0, subtotal + shippingFee - discount);

  return (
    <div className="space-y-6">
      <Card className="shadow-unt-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="font-sans text-lg font-bold tracking-tight text-foreground">
              Order Summary
            </CardTitle>
            <Badge variant="brand" size="sm">
              {items.length} {items.length === 1 ? "Item" : "Items"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Reserved Pieces List */}
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {items.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedSize || "default"}`}
                className="flex items-center gap-3 py-2 border-b border-border/40 last:border-0"
              >
                <div className="relative h-14 w-14 rounded-lg overflow-hidden border border-border/60 bg-muted/30 shrink-0">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-medium text-foreground truncate">
                    {item.product.name}
                  </h4>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-0.5">
                    <span>Qty: {item.quantity}</span>
                    <span className="font-semibold text-foreground">
                      {formatCurrency(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Promo Code Input */}
          <form onSubmit={handleApplyPromo} className="pt-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Promo Code (e.g. YUKA10)"
                  value={promoCode}
                  disabled={promoApplied}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="pl-9 text-xs uppercase"
                />
              </div>
              <Button
                type="submit"
                variant="secondary-gray"
                size="sm"
                disabled={promoApplied || !promoCode}
                className="text-xs shrink-0"
              >
                {promoApplied ? <Check className="h-3.5 w-3.5 text-success-600" /> : "Apply"}
              </Button>
            </div>
            {promoApplied && (
              <p className="text-[11px] text-success-600 dark:text-success-400 mt-1 flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> 10% discount applied.
              </p>
            )}
            {promoError && (
              <p className="text-[11px] text-error-600 dark:text-error-400 mt-1">{promoError}</p>
            )}
          </form>

          <Separator className="my-2" />

          {/* Pricing Breakdown */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
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

            {discount > 0 && (
              <div className="flex justify-between text-success-600 dark:text-success-400">
                <span>Promo Discount</span>
                <span className="font-medium">-{formatCurrency(discount)}</span>
              </div>
            )}

            <div className="flex justify-between text-muted-foreground">
              <span>Taxes & GST</span>
              <Badge variant="success" size="sm">Included</Badge>
            </div>

            <Separator className="my-2" />

            <div className="flex justify-between text-base font-semibold pt-1">
              <span>Total Amount</span>
              <span className="text-brand-600 text-xl font-bold">
                {formatCurrency(finalTotal)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Trust Card */}
      <Card className="p-4 space-y-3 text-xs shadow-unt-xs">
        <div className="flex items-center gap-2.5 text-foreground font-medium">
          <ShieldCheck className="h-4 w-4 text-success-600" />
          <span>100% Secure Payment</span>
        </div>
        <p className="text-muted-foreground text-[11px] leading-relaxed">
          All transactions are encrypted with 256-bit SSL security. Your payment details are processed safely and securely.
        </p>
        <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] text-muted-foreground">
          <Badge variant="gray" size="sm">
            <Lock className="h-3 w-3 text-brand-600 mr-1" /> PCI-DSS Level 1
          </Badge>
          <Badge variant="gray" size="sm">SOC2 Type II</Badge>
          <Badge variant="gray" size="sm">Swiss FINMA</Badge>
        </div>
      </Card>
    </div>
  );
}
