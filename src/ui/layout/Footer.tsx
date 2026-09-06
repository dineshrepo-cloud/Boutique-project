"use client";

import Link from "next/link";
import { ShieldCheck, Truck, Clock, Sparkles, Send } from "lucide-react";
import { Input } from "@/ui/primitives/input";
import { Button } from "@/ui/primitives/button";
import { Badge } from "@/ui/primitives/badge";

export function BoutiqueFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/40 mt-20">
      {/* Value Propositions */}
      <div className="border-b border-border/50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0" aria-hidden="true">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                100% Genuine &amp; Authentic
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Every product is quality-verified and 100% authentic.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0" aria-hidden="true">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Fast &amp; Insured Delivery
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Reliable express courier delivery with live order tracking.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0" aria-hidden="true">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Dedicated Customer Care
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Prompt customer assistance and 7-day hassle-free returns.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation & Brand Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-md bg-amber-600 text-white flex items-center justify-center font-sans font-bold text-sm" aria-hidden="true">
                Y
              </div>
              <span className="font-sans font-bold tracking-tight text-base">
                YUKA TRENDZ
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Curated collection of luxury timepieces, bespoke leather accessories, fine perfumes, and pure silk tailoring.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground mb-3">
              Collections
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/products?category=timepieces" className="hover:text-primary transition-colors">
                  Timepieces
                </Link>
              </li>
              <li>
                <Link href="/products?category=leather-goods" className="hover:text-primary transition-colors">
                  Leather Goods
                </Link>
              </li>
              <li>
                <Link href="/products?category=fragrance" className="hover:text-primary transition-colors">
                  Rare Perfumery
                </Link>
              </li>
              <li>
                <Link href="/products?category=apparel" className="hover:text-primary transition-colors">
                  Silk Tailoring
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground mb-3">
              Customer Support
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/admin" className="hover:text-primary transition-colors flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-brand-600" aria-hidden="true" />
                  Admin Inventory Dashboard
                </Link>
              </li>
              <li>
                <Link href="/#provenance" className="hover:text-primary transition-colors">
                  Shipping &amp; Delivery
                </Link>
              </li>
              <li>
                <Link href="/#provenance" className="hover:text-primary transition-colors">
                  Authenticity Guarantee
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-primary transition-colors">
                  Customer Sign In
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground">
                Stay Updated
              </h3>
              <Badge variant="brand" size="sm">
                VIP Access
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Receive special offers, new collection announcements, and exclusive discounts.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thank you for subscribing to Yuka Trendz.");
              }}
              className="flex gap-2 pt-1"
            >
              <label htmlFor="footer-newsletter-email" className="sr-only">
                Email address for newsletter
              </label>
              <Input
                id="footer-newsletter-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Enter your email..."
                className="h-9 text-xs bg-background/80"
                required
              />
              <Button
                variant="primary"
                size="sm"
                type="submit"
                className="shrink-0 shadow-unt-xs gap-1.5"
                aria-label="Subscribe to email newsletter"
              >
                <Send className="h-3.5 w-3.5" aria-hidden="true" />
                Join
              </Button>
            </form>
            <div className="text-[11px] text-muted-foreground pt-1">
              Support email:{" "}
              <a
                href="mailto:support@yukatrendz.com"
                className="font-medium text-foreground hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded px-1"
              >
                support@yukatrendz.com
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center text-[11px] text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} Yuka Trendz. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="gray" size="sm">100% Authentic</Badge>
            <Badge variant="gray" size="sm">Insured Delivery</Badge>
            <Badge variant="gray" size="sm">Secure Payments</Badge>
          </div>
        </div>
      </div>
    </footer>
  );
}

export const Footer = BoutiqueFooter;
