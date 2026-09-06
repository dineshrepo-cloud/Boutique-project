import { Sparkles, ShieldCheck, PhoneCall } from "lucide-react";
import { Badge } from "@/ui/primitives/badge";

export function BoutiqueStatusBanner() {
  return (
    <div className="bg-muted/80 backdrop-blur-md border-b border-border/50 text-[11px] py-1.5 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="flex items-center gap-1 font-medium text-foreground">
            <Sparkles className="h-3 w-3 text-brand-600" aria-hidden="true" />
            Yuka Trendz Luxury Store
          </span>
          <span className="hidden sm:inline text-border" aria-hidden="true">|</span>
          <span className="hidden sm:inline">
            Free Insured Express Delivery &amp; Premium Packaging
          </span>
        </div>

        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="hidden md:flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
            <span>100% Guaranteed Authentic</span>
          </div>
          <span className="hidden md:inline text-border" aria-hidden="true">|</span>
          <div className="flex items-center gap-1 font-medium text-foreground">
            <PhoneCall className="h-3 w-3 text-brand-600" aria-hidden="true" />
            <a
              href="tel:+919820012345"
              className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded px-1"
              aria-label="Customer Support, call +91 98200 12345"
            >
              Customer Support: +91 98200 12345
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export const StatusBanner = BoutiqueStatusBanner;
