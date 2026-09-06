"use client";

import { useState } from "react";
import { Copy, Check, Building2, Sparkles } from "lucide-react";
import { Button } from "@/ui/primitives/button";
import { Badge } from "@/ui/primitives/badge";
import { Card } from "@/ui/primitives/card";
import { Alert, AlertDescription, AlertTitle } from "@/ui/primitives/alert";

export function BankWireDetails({ orderRef }: { orderRef: string }) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const wireDetails = [
    { label: "Beneficiary Name", value: "Yuka Trendz Private Limited" },
    { label: "Financial Institution", value: "HDFC Bank Ltd (Private Banking)" },
    { label: "Account Number (INR)", value: "5020 0081 9283 41" },
    { label: "IFSC Code", value: "HDFC0000060" },
    { label: "Account Type", value: "Current Account (INR Settlement)" },
    { label: "Remittance Reference", value: orderRef },
    { label: "Branch Address", value: "Fort Branch, Mumbai, Maharashtra 400001" },
  ];

  return (
    <div className="space-y-6">
      <Alert variant="brand">
        <Sparkles className="h-4 w-4 text-brand-600" />
        <AlertTitle className="text-xs font-semibold">Direct Bank Transfer (NEFT / RTGS / IMPS)</AlertTitle>
        <AlertDescription className="text-xs">
          Please transfer the exact order amount using the bank details below. Your items will be reserved for 2 business days while we confirm your payment.
        </AlertDescription>
      </Alert>

      <Card className="p-5 space-y-4 text-xs shadow-unt-xs">
        <div className="flex items-center justify-between pb-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-brand-600" />
            <span className="font-semibold text-foreground">
              Bank Account Details
            </span>
          </div>
          <Badge variant="success" dot size="sm">Verified Current Account</Badge>
        </div>

        <div className="space-y-3">
          {wireDetails.map((item) => (
            <div
              key={item.label}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-1.5 border-b border-border/40 last:border-0"
            >
              <span className="text-muted-foreground font-medium">{item.label}</span>
              <div className="flex items-center gap-2">
                <code className="font-mono text-foreground font-semibold bg-muted/60 px-2 py-0.5 rounded text-[11px]">
                  {item.value}
                </code>
                <Button
                  type="button"
                  variant="tertiary-gray"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => copyToClipboard(item.value, item.label)}
                  title={`Copy ${item.label}`}
                >
                  {copiedField === item.label ? (
                    <Check className="h-3 w-3 text-success-600" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
