import React, { Suspense } from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowLeft, ShieldCheck, Lock, Award, Sparkles } from "lucide-react";
import { LoginForm } from "@/ui/features/auth/components/LoginForm";
import { Badge } from "@/ui/primitives/badge";

export const metadata: Metadata = {
  title: "Vault Access & Member Sign In | Yuka Trendz",
  description:
    "Secure authentication portal for private collectors, haute horlogerie allocations, and bespoke commissions via basic auth or Google sign-in.",
};

export default function LoginPage() {
  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      {/* Background Decorative Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-brand-500/10 via-amber-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Return to Boutique Link */}
      <div className="max-w-md mx-auto w-full mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Return to Boutique Hub</span>
        </Link>

        <Badge variant="gray" size="sm" className="text-[10px]">
          v2.4 Vault Security
        </Badge>
      </div>

      {/* Main Authentication Component wrapped in Suspense */}
      <Suspense
        fallback={
          <div className="max-w-md mx-auto p-12 text-center text-xs text-muted-foreground">
            Loading authentication portal...
          </div>
        }
      >
        <LoginForm />
      </Suspense>

      {/* Trust & Provenance Reassurance Strip */}
      <div className="max-w-md mx-auto w-full mt-8 pt-6 border-t border-border/60 grid grid-cols-3 gap-2 text-center text-[11px] text-muted-foreground">
        <div className="flex flex-col items-center gap-1">
          <Lock className="h-4 w-4 text-brand-600" />
          <span>TLS 256-Bit</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Verified Vault</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span>Google OAuth</span>
        </div>
      </div>
    </div>
  );
}
