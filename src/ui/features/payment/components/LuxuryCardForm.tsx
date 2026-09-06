"use client";

import { useState } from "react";
import { ShieldCheck, HelpCircle, Lock } from "lucide-react";
import { Input } from "@/ui/primitives/input";
import { Label } from "@/ui/primitives/label";
import { Checkbox } from "@/ui/primitives/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/ui/primitives/tooltip";
import { CardDetails } from "../types";

interface LuxuryCardFormProps {
  details: CardDetails;
  onChange: (details: CardDetails) => void;
}

export function LuxuryCardForm({ details, onChange }: LuxuryCardFormProps) {
  const [isFocusedCvv, setIsFocusedCvv] = useState(false);

  // Detect card network
  const getCardBrand = (number: string) => {
    const clean = number.replace(/\s/g, "");
    if (/^4/.test(clean)) return "VISA";
    if (/^5[1-5]/.test(clean)) return "MASTERCARD";
    if (/^(508|60|65|81|82)/.test(clean)) return "RUPAY";
    if (/^3[47]/.test(clean)) return "AMEX";
    return "CREDIT / DEBIT";
  };

  const handleCardNumberChange = (val: string) => {
    // Keep only digits, limit to 16
    const digits = val.replace(/\D/g, "").slice(0, 16);
    // Format in groups of 4
    const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
    onChange({ ...details, cardNumber: formatted });
  };

  const handleExpiryChange = (val: string) => {
    // Keep only digits, limit to 4
    const digits = val.replace(/\D/g, "").slice(0, 4);
    let formatted = digits;
    if (digits.length >= 2) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    onChange({ ...details, expiryDate: formatted });
  };

  const handleCvvChange = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    onChange({ ...details, cvv: digits });
  };

  const brand = getCardBrand(details.cardNumber);

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Interactive 3D/Embossed Luxury Card Preview */}
        <div className="relative mx-auto w-full max-w-sm aspect-[1.586/1] rounded-2xl p-6 overflow-hidden shadow-2xl transition-all duration-500 bg-gradient-to-br from-neutral-900 via-stone-900 to-neutral-950 border border-amber-500/30 text-amber-100 select-none">
          {/* Subtle Metallic Sheen overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/15 via-transparent to-transparent pointer-events-none" />

          {/* Card Top Row: EMV Chip & Brand */}
          <div className="relative z-10 flex items-center justify-between">
            {/* Gold EMV Microchip */}
            <div className="relative h-9 w-12 rounded-md bg-gradient-to-tr from-amber-600 via-amber-300 to-yellow-500 border border-amber-400/50 shadow-inner flex items-center justify-center">
              <div className="w-full h-[1px] bg-amber-800/60 absolute top-3" />
              <div className="w-full h-[1px] bg-amber-800/60 absolute bottom-3" />
              <div className="h-full w-[1px] bg-amber-800/60 absolute left-4" />
              <div className="h-full w-[1px] bg-amber-800/60 absolute right-4" />
            </div>

            <div className="text-right">
              <span className="font-sans font-bold text-xs tracking-widest text-amber-400">
                YUKA TRENDZ
              </span>
              <span className="block text-[9px] uppercase tracking-wider text-neutral-400 font-mono">
                {brand}
              </span>
            </div>
          </div>

          {/* Card Middle: Embossed 16-Digit Number */}
          <div className="relative z-10 mt-6 sm:mt-8">
            <span className="block text-[9px] uppercase tracking-widest text-amber-500/70 font-mono mb-0.5">
              Card Number
            </span>
            <div className="font-mono text-lg sm:text-xl tracking-widest text-amber-200 drop-shadow-md">
              {details.cardNumber || "•••• •••• •••• ••••"}
            </div>
          </div>

          {/* Card Bottom: Holder Name & Expiry */}
          <div className="relative z-10 mt-4 flex items-end justify-between text-xs">
            <div>
              <span className="block text-[8px] uppercase tracking-wider text-amber-500/70 font-mono">
                Cardholder
              </span>
              <span className="font-mono text-sm tracking-wider uppercase text-neutral-200 truncate max-w-[180px] block">
                {details.cardholderName || "ESTEEMED CLIENT"}
              </span>
            </div>

            <div className="text-right">
              <span className="block text-[8px] uppercase tracking-wider text-amber-500/70 font-mono">
                Expires
              </span>
              <span className="font-mono text-sm tracking-wider text-neutral-200">
                {details.expiryDate || "MM/YY"}
              </span>
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="card-number">Card Number</Label>
            <div className="relative">
              <Input
                id="card-number"
                required
                placeholder="4000 1234 5678 9010"
                value={details.cardNumber}
                onChange={(e) => handleCardNumberChange(e.target.value)}
                className="font-mono tracking-wider text-sm pr-16 bg-background/60"
              />
              <span className="absolute right-3 top-2.5 text-xs font-mono font-bold text-amber-500">
                {brand}
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="card-name">Cardholder Name (as printed on card)</Label>
            <Input
              id="card-name"
              required
              placeholder="Elena Rostova"
              value={details.cardholderName}
              onChange={(e) =>
                onChange({ ...details, cardholderName: e.target.value })
              }
              className="uppercase text-sm bg-background/60"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="card-expiry">Expiration Date</Label>
              <Input
                id="card-expiry"
                required
                placeholder="MM/YY"
                value={details.expiryDate}
                onChange={(e) => handleExpiryChange(e.target.value)}
                className="font-mono text-sm bg-background/60 text-center"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="card-cvv">CVV / CVC</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="text-muted-foreground hover:text-foreground">
                      <HelpCircle className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>3 digits on card back (4 digits for Amex)</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="card-cvv"
                required
                type="password"
                placeholder="•••"
                value={details.cvv}
                onFocus={() => setIsFocusedCvv(true)}
                onBlur={() => setIsFocusedCvv(false)}
                onChange={(e) => handleCvvChange(e.target.value)}
                className="font-mono text-sm bg-background/60 text-center tracking-widest"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="save-vault"
              checked={details.saveToVault}
              onCheckedChange={(checked) =>
                onChange({ ...details, saveToVault: Boolean(checked) })
              }
            />
            <Label
              htmlFor="save-vault"
              className="text-xs font-normal cursor-pointer text-muted-foreground"
            >
              Save this card securely for future purchases
            </Label>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
