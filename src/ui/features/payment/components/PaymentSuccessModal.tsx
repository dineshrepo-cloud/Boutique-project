"use client";

import { CheckCircle2, Printer, ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/ui/primitives/dialog";
import { Button } from "@/ui/primitives/button";
import { Badge } from "@/ui/primitives/badge";
import { Separator } from "@/ui/primitives/separator";
import { formatCurrency } from "@/lib/utils";
import { PaymentReceipt } from "../types";

interface PaymentSuccessModalProps {
  receipt: PaymentReceipt | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PaymentSuccessModal({
  receipt,
  isOpen,
  onClose,
}: PaymentSuccessModalProps) {
  if (!receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl p-0 overflow-hidden sm:rounded-2xl">
        {/* Modal Top Header Banner */}
        <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-amber-600 p-6 text-white text-center">
          <div className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-3 shadow-inner">
            <CheckCircle2 className="h-8 w-8 text-white" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.25em] font-medium opacity-90 block">
            Payment Successful
          </span>
          <DialogTitle className="font-sans text-2xl sm:text-3xl text-white font-bold tracking-tight mt-1">
            Order Received
          </DialogTitle>
          <p className="text-xs text-white/80 mt-1">
            Thank you for your order! Your purchase has been confirmed and is being prepared for delivery.
          </p>
        </div>

        {/* Modal Body & Receipt Details */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-card border border-border/70 text-xs">
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">
                Order ID
              </span>
              <strong className="font-mono text-foreground text-sm font-semibold">
                {receipt.orderNumber}
              </strong>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">
                Transaction ID
              </span>
              <span className="font-mono text-muted-foreground truncate block text-xs">
                {receipt.transactionId}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">
                Customer Name
              </span>
              <span className="font-medium text-foreground truncate block">
                {receipt.customerName}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">
                Total Paid
              </span>
              <strong className="text-brand-600 text-sm font-bold">
                {formatCurrency(receipt.totalAmount)}
              </strong>
            </div>
          </div>

          {/* Fulfillment Timeline */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Order & Delivery Status
            </h4>
            <div className="space-y-3 border-l-2 border-brand-500/40 pl-4 ml-2 text-xs">
              <div className="relative">
                <div className="absolute -left-[21px] top-0.5 h-2.5 w-2.5 rounded-full bg-success-500 ring-4 ring-success-500/20" />
                <span className="font-medium text-foreground">
                  Order Confirmed
                </span>
                <p className="text-[11px] text-muted-foreground">
                  Your items have been allocated and packed.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-[21px] top-0.5 h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="font-medium text-foreground">
                  Quality Check & Packaging
                </span>
                <p className="text-[11px] text-muted-foreground">
                  Inspected for quality and prepared for courier handover.
                </p>
              </div>

              <div className="relative opacity-60">
                <div className="absolute -left-[21px] top-0.5 h-2.5 w-2.5 rounded-full bg-muted-foreground" />
                <span className="font-medium text-foreground">
                  Express Courier Delivery
                </span>
                <p className="text-[11px] text-muted-foreground">
                  Dispatched via insured express courier with tracking.
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Purchased Items Recap */}
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
              Ordered Items
            </span>
            {receipt.items.map((it) => (
              <div key={it.id} className="flex justify-between text-xs py-1">
                <span className="text-foreground font-medium">
                  {it.quantity}x {it.name}
                </span>
                <span className="font-mono text-muted-foreground">
                  {formatCurrency(it.price * it.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Action Buttons using Untitled UI */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              type="button"
              variant="secondary-gray"
              size="sm"
              onClick={handlePrint}
              className="gap-1.5 flex-1"
            >
              <Printer className="h-4 w-4" />
              Print Receipt
            </Button>
            <Button
              variant="primary"
              size="sm"
              asChild
              className="gap-1.5 flex-1"
              onClick={onClose}
            >
              <Link href="/products">
                Continue Shopping
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
