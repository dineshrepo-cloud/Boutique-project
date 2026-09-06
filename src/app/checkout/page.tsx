"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/ui/features/cart/context/CartContext";
import { useAuth } from "@/ui/features/auth/context/AuthContext";
import { LuxuryCardForm } from "@/ui/features/payment/components/LuxuryCardForm";
import { BankWireDetails } from "@/ui/features/payment/components/BankWireDetails";
import { DigitalWalletPay } from "@/ui/features/payment/components/DigitalWalletPay";
import { OrderSummarySidebar } from "@/ui/features/payment/components/OrderSummarySidebar";
import { PaymentSuccessModal } from "@/ui/features/payment/components/PaymentSuccessModal";
import { processPaymentAction } from "@/backend/actions/payment.actions";
import {
  PaymentMethodType,
  CardDetails,
  CustomerBillingDetails,
  PaymentReceipt,
} from "@/backend/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/ui/primitives/tabs";
import { Button } from "@/ui/primitives/button";
import { Input } from "@/ui/primitives/input";
import { Label } from "@/ui/primitives/label";
import { Textarea } from "@/ui/primitives/textarea";
import { Badge } from "@/ui/primitives/badge";
import { Card } from "@/ui/primitives/card";
import { Alert, AlertDescription } from "@/ui/primitives/alert";
import {
  CreditCard,
  Building2,
  Smartphone,
  ShieldCheck,
  Lock,
  ArrowLeft,
  Loader2,
  ShoppingBag,
  Truck,
  CheckCircle2,
  User as UserIcon,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type CourierSpeed = "standard" | "express";

export default function BoutiqueCheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const [isPending, startTransition] = useTransition();

  const [courierSpeed, setCourierSpeed] = useState<CourierSpeed>("standard");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("card");
  const [discount, setDiscount] = useState(0);
  const [receipt, setReceipt] = useState<PaymentReceipt | null>(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Calculate dynamic shipping fee
  const baseStandardFee = subtotal >= 2000 ? 0 : 75;
  const shippingFee = courierSpeed === "express" ? 120 : baseStandardFee;
  const grandTotal = Math.max(0, subtotal + shippingFee - discount);

  // Billing form state
  const [billing, setBilling] = useState<CustomerBillingDetails>({
    fullName: user ? user.name : "Elena Rostova",
    email: user ? user.email : "elena.rostova@yukatrendz.com",
    phone: "+41 22 819 21 00",
    addressLine1: "Rue du Rhône 42",
    city: "Genève",
    postalCode: "1204",
    country: "Switzerland",
    specialInstructions: "Deliver directly to private salon concierge.",
  });

  useEffect(() => {
    if (user) {
      setBilling((prev) => ({
        ...prev,
        fullName: user.name,
        email: user.email,
      }));
    }
  }, [user]);

  // Card form state
  const [card, setCard] = useState<CardDetails>({
    cardNumber: "4532 8921 7384 9281",
    cardholderName: user ? user.name.toUpperCase() : "ELENA ROSTOVA",
    expiryDate: "12/28",
    cvv: "892",
    saveToVault: true,
  });

  // Promo code handler
  const handleApplyPromo = (code: string): boolean => {
    if (code === "YUKA10" || code === "MAISON10" || code === "VIP10") {
      setDiscount(Math.round(subtotal * 0.1));
      return true;
    }
    return false;
  };

  // Submission handler
  const handleAuthorizePayment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage("");

    startTransition(async () => {
      const res = await processPaymentAction({
        paymentMethod,
        billingDetails: billing,
        cardDetails: paymentMethod === "card" ? card : undefined,
        items,
        subtotal,
        shippingFee,
        totalAmount: grandTotal,
        promoDiscount: discount,
      });

      if (res.success && res.receipt) {
        setReceipt(res.receipt);
        setSuccessModalOpen(true);
        clearCart();
      } else {
        setErrorMessage(res.error || "Payment authorization declined by issuing bank.");
      }
    });
  };

  if (items.length === 0 && !receipt) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="h-16 w-16 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground mx-auto mb-4">
          <ShoppingBag className="h-7 w-7 opacity-50" />
        </div>
        <h2 className="font-sans text-2xl font-bold tracking-tight text-foreground">Your Cart is Empty</h2>
        <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
          Please add items to your cart before proceeding to checkout.
        </p>
        <Button variant="primary" size="sm" className="mt-6 shadow-unt-xs" asChild>
          <Link href="/products">Explore Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Step Flow Breadcrumb */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-3">
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Cart
          </Link>

          {/* Workflow Step Indicator */}
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-success-600" /> 1. Cart
            </span>
            <span className="text-muted-foreground/50">/</span>
            <span className="flex items-center gap-1 font-semibold text-brand-600">
              2. Delivery
            </span>
            <span className="text-muted-foreground/50">/</span>
            <span className="flex items-center gap-1 font-semibold text-brand-600">
              3. Payment
            </span>
            <span className="text-muted-foreground/50">/</span>
            <span className="text-muted-foreground">4. Confirmation</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-1">
          <Badge variant="brand" size="sm">
            Yuka Trendz Checkout
          </Badge>
          <Badge variant="success" dot size="sm" className="hidden sm:inline-flex">
            256-Bit SSL Encrypted
          </Badge>
        </div>
        <h1 className="font-sans text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Delivery &amp; Payment
        </h1>
      </div>

      {/* Guest Sign-In Notice if not logged in */}
      {!user && (
        <Card className="p-4 mb-8 bg-muted/40 border-border/70 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 text-xs">
            <div className="h-8 w-8 rounded-lg bg-brand-500/10 text-brand-600 flex items-center justify-center shrink-0">
              <UserIcon className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Ordering as Guest</p>
              <p className="text-muted-foreground text-[11px]">
                Sign in to your Yuka Trendz account to access saved delivery addresses and member privileges.
              </p>
            </div>
          </div>
          <Button variant="secondary-gray" size="sm" asChild className="text-xs h-8">
            <Link href="/login?redirect=/checkout">Sign In to Account</Link>
          </Button>
        </Card>
      )}

      {errorMessage && (
        <Alert variant="error" className="mb-6">
          <ShieldCheck className="h-4 w-4 text-error-600" />
          <AlertDescription className="text-xs font-medium text-error-700 dark:text-error-300">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Main Grid: Form Left, Summary Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Column: Delivery & Payment Terminal */}
        <div className="lg:col-span-7 space-y-8">
          {/* Section 1: Delivery Address & Courier Logistics */}
          <Card className="p-6 space-y-5 shadow-unt-xs border-border/80">
            <div className="flex items-center justify-between">
              <h2 className="font-sans text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                <Truck className="h-5 w-5 text-brand-600" />
                1. Delivery Address
              </h2>
              <Badge variant="gray" size="sm" className="text-[10px]">
                Insured Delivery
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="b-name">Full Recipient Name *</Label>
                <Input
                  id="b-name"
                  required
                  placeholder="Elena Rostova"
                  value={billing.fullName}
                  onChange={(e) =>
                    setBilling({ ...billing, fullName: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="b-email">Email Address *</Label>
                <Input
                  id="b-email"
                  type="email"
                  required
                  placeholder="client@domain.com"
                  value={billing.email}
                  onChange={(e) =>
                    setBilling({ ...billing, email: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="b-phone">Contact Telephone *</Label>
                <Input
                  id="b-phone"
                  required
                  placeholder="+41 22 819 21 00"
                  value={billing.phone}
                  onChange={(e) =>
                    setBilling({ ...billing, phone: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="b-addr">Shipping Address *</Label>
                <Input
                  id="b-addr"
                  required
                  placeholder="Rue du Rhône 42"
                  value={billing.addressLine1}
                  onChange={(e) =>
                    setBilling({ ...billing, addressLine1: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="b-city">City / Canton *</Label>
                <Input
                  id="b-city"
                  required
                  placeholder="Genève"
                  value={billing.city}
                  onChange={(e) =>
                    setBilling({ ...billing, city: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="b-country">Country *</Label>
                <Input
                  id="b-country"
                  required
                  placeholder="Switzerland"
                  value={billing.country}
                  onChange={(e) =>
                    setBilling({ ...billing, country: e.target.value })
                  }
                />
              </div>

              {/* Courier Selection Radio Cards */}
              <div className="sm:col-span-2 space-y-2 pt-2">
                <Label className="text-xs font-semibold">Select Delivery Speed</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCourierSpeed("standard")}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      courierSpeed === "standard"
                        ? "border-brand-500 bg-brand-50/40 dark:bg-brand-950/20 ring-2 ring-brand-500/20"
                        : "border-border/80 hover:border-gray-400 hover:bg-gray-50/80 dark:hover:bg-gray-800/40 bg-card"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-xs text-foreground">
                        Standard Delivery
                      </span>
                      <span className="text-xs font-bold text-brand-600">
                        {baseStandardFee === 0 ? "Free" : formatCurrency(baseStandardFee)}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      3-5 business days. Insured delivery with order tracking.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCourierSpeed("express")}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      courierSpeed === "express"
                        ? "border-brand-500 bg-brand-50/40 dark:bg-brand-950/20 ring-2 ring-brand-500/20"
                        : "border-border/80 hover:border-gray-400 hover:bg-gray-50/80 dark:hover:bg-gray-800/40 bg-card"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-xs text-foreground">
                        Express Delivery
                      </span>
                      <span className="text-xs font-bold text-brand-600">
                        {formatCurrency(120)}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      1-2 business days. Priority express courier dispatch.
                    </p>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 sm:col-span-2 pt-1">
                <Label htmlFor="b-notes">Delivery Instructions (Optional)</Label>
                <Textarea
                  id="b-notes"
                  rows={2}
                  placeholder="Apartment number, landmark, gate code, or delivery instructions..."
                  value={billing.specialInstructions}
                  onChange={(e) =>
                    setBilling({
                      ...billing,
                      specialInstructions: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </Card>

          {/* Section 2: Payment Terminal */}
          <Card className="p-6 space-y-6 shadow-unt-xs border-border/80">
            <div className="flex items-center justify-between">
              <h2 className="font-sans text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                <Lock className="h-5 w-5 text-brand-600" />
                2. Payment Method
              </h2>
              <Badge variant="gray" size="sm" className="font-mono text-[10px]">
                PCI-DSS Compliant
              </Badge>
            </div>

            <Tabs
              value={paymentMethod}
              onValueChange={(v) => setPaymentMethod(v as PaymentMethodType)}
            >
              <TabsList className="grid grid-cols-3 w-full h-11 bg-muted/60 p-1 rounded-xl">
                <TabsTrigger
                  value="card"
                  className="gap-2 text-xs font-medium"
                >
                  <CreditCard className="h-4 w-4" />
                  <span className="hidden sm:inline">Cards (RuPay / Visa / MC)</span>
                  <span className="sm:hidden">Card</span>
                </TabsTrigger>
                <TabsTrigger
                  value="wire"
                  className="gap-2 text-xs font-medium"
                >
                  <Building2 className="h-4 w-4" />
                  <span className="hidden sm:inline">NEFT / RTGS Wire</span>
                  <span className="sm:hidden">Bank Wire</span>
                </TabsTrigger>
                <TabsTrigger
                  value="wallet"
                  className="gap-2 text-xs font-medium"
                >
                  <Smartphone className="h-4 w-4" />
                  <span className="hidden sm:inline">UPI / NetBanking</span>
                  <span className="sm:hidden">UPI</span>
                </TabsTrigger>
              </TabsList>

              {/* Card Terminal Tab */}
              <TabsContent value="card" className="pt-4">
                <LuxuryCardForm details={card} onChange={setCard} />
                <div className="pt-6">
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    disabled={isPending}
                    onClick={() => handleAuthorizePayment()}
                    className="w-full h-12 text-sm font-semibold gap-2 shadow-unt-sm rounded-xl"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Authorizing Payment with Banking Gateway...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4" />
                        Complete Payment ({formatCurrency(grandTotal)})
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>

              {/* Bank Wire Tab */}
              <TabsContent value="wire" className="pt-4">
                <BankWireDetails orderRef={`YT-WIRE-${Math.floor(1000 + Math.random() * 9000)}`} />
                <div className="pt-6">
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    disabled={isPending}
                    onClick={() => handleAuthorizePayment()}
                    className="w-full h-12 text-sm font-semibold gap-2 shadow-unt-sm rounded-xl"
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Building2 className="h-4 w-4" />
                        Confirm Bank Wire Order ({formatCurrency(grandTotal)})
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>

              {/* Digital Wallet Tab */}
              <TabsContent value="wallet" className="pt-4">
                <DigitalWalletPay
                  totalAmount={grandTotal}
                  isProcessing={isPending}
                  onAuthorize={() => handleAuthorizePayment()}
                />
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* Right Column: Order Summary & Guarantee Badges */}
        <div className="lg:col-span-5">
          <div className="sticky top-24">
            <OrderSummarySidebar
              items={items}
              subtotal={subtotal}
              shippingFee={shippingFee}
              discount={discount}
              onApplyPromo={handleApplyPromo}
            />
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <PaymentSuccessModal
        receipt={receipt}
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
      />
    </div>
  );
}
