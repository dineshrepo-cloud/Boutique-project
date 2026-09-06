"use client";

import { useState } from "react";
import { Loader2, ShieldCheck, QrCode, Smartphone, ArrowRight, Check } from "lucide-react";
import { Button } from "@/ui/primitives/button";
import { Input } from "@/ui/primitives/input";
import { Label } from "@/ui/primitives/label";
import { Badge } from "@/ui/primitives/badge";
import { Alert, AlertDescription, AlertTitle } from "@/ui/primitives/alert";
import { formatCurrency } from "@/lib/utils";

interface DigitalWalletPayProps {
  totalAmount: number;
  onAuthorize: () => Promise<void>;
  isProcessing: boolean;
}

export function DigitalWalletPay({
  totalAmount,
  onAuthorize,
  isProcessing,
}: DigitalWalletPayProps) {
  const [activeWallet, setActiveWallet] = useState<"upi" | "gpay" | "phonepe" | "paytm" | null>(null);
  const [upiId, setUpiId] = useState("connoisseur@okhdfcbank");

  const handlePay = async (wallet: "upi" | "gpay" | "phonepe" | "paytm") => {
    setActiveWallet(wallet);
    await onAuthorize();
    setActiveWallet(null);
  };

  return (
    <div className="space-y-6">
      <Alert variant="success">
        <ShieldCheck className="h-4 w-4 text-success-600" />
        <AlertTitle className="text-xs font-semibold">
          Instant NPCI Unified Payments Interface (UPI)
        </AlertTitle>
        <AlertDescription className="text-xs">
          Real-time INR settlement authorized via your secure bank UPI PIN. Zero surcharge fees.
        </AlertDescription>
      </Alert>

      {/* UPI ID Instant Collect */}
      <div className="p-4 rounded-xl border border-border/80 bg-card/60 space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="upi-id" className="text-xs font-semibold flex items-center gap-1.5">
            <Smartphone className="h-4 w-4 text-brand-600" />
            Enter UPI VPA / ID
          </Label>
          <Badge variant="brand" size="sm" className="text-[10px]">
            Instant Collect
          </Badge>
        </div>

        <div className="flex gap-2">
          <Input
            id="upi-id"
            placeholder="e.g. yourname@okhdfcbank"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            className="h-10 text-xs font-mono"
          />
          <Button
            type="button"
            variant="primary"
            size="sm"
            disabled={isProcessing || !upiId.trim()}
            onClick={() => handlePay("upi")}
            className="h-10 px-4 text-xs font-semibold shrink-0 gap-1.5 shadow-unt-xs"
          >
            {isProcessing && activeWallet === "upi" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <span>Verify &amp; Pay</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-muted-foreground">
          <span>Popular handles:</span>
          {["@okhdfcbank", "@okaxis", "@ybl", "@paytm"].map((handle) => (
            <button
              key={handle}
              type="button"
              onClick={() => {
                const prefix = upiId.split("@")[0] || "connoisseur";
                setUpiId(`${prefix}${handle}`);
              }}
              className="px-2 py-0.5 rounded-md bg-muted/60 hover:bg-muted font-mono text-[10px] text-foreground transition-colors cursor-pointer"
            >
              {handle}
            </button>
          ))}
        </div>
      </div>

      {/* 1-Click Fast UPI Apps */}
      <div className="space-y-2.5">
        <span className="text-xs font-semibold text-muted-foreground block">
          Or pay directly using supported UPI apps:
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Google Pay */}
          <Button
            type="button"
            variant="secondary-gray"
            disabled={isProcessing}
            onClick={() => handlePay("gpay")}
            className="h-12 bg-white hover:bg-gray-100 hover:text-gray-900 text-gray-900 border border-border shadow-unt-xs rounded-xl flex items-center justify-center gap-2 text-xs font-semibold transition-all"
          >
            {isProcessing && activeWallet === "gpay" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <span className="font-bold text-sm">G Pay</span>
                <span className="text-[10px] text-muted-foreground">UPI</span>
              </>
            )}
          </Button>

          {/* PhonePe */}
          <Button
            type="button"
            variant="secondary-gray"
            disabled={isProcessing}
            onClick={() => handlePay("phonepe")}
            className="h-12 bg-[#5f259f]/10 hover:bg-[#5f259f]/20 hover:text-[#5f259f] text-[#5f259f] dark:text-purple-400 border border-[#5f259f]/30 shadow-unt-xs rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold transition-all"
          >
            {isProcessing && activeWallet === "phonepe" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <span className="font-bold text-sm">PhonePe</span>
                <span className="text-[10px] opacity-80">UPI</span>
              </>
            )}
          </Button>

          {/* Paytm */}
          <Button
            type="button"
            variant="secondary-gray"
            disabled={isProcessing}
            onClick={() => handlePay("paytm")}
            className="h-12 bg-[#002e6e]/10 hover:bg-[#002e6e]/20 hover:text-[#002e6e] text-[#002e6e] dark:text-sky-400 border border-[#002e6e]/30 shadow-unt-xs rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold transition-all"
          >
            {isProcessing && activeWallet === "paytm" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <span className="font-bold text-sm">Paytm</span>
                <span className="text-[10px] opacity-80">UPI</span>
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="pt-2 text-center text-[11px] text-muted-foreground">
        Authorized amount: <strong className="text-foreground font-mono">{formatCurrency(totalAmount)}</strong>
      </div>
    </div>
  );
}
