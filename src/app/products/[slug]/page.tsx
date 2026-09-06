import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, ShieldCheck, Truck, Sparkles, ChevronRight, CheckCircle2, Lock, ArrowRight } from "lucide-react";
import { dataLayer } from "@/backend/db";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/ui/primitives/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/ui/primitives/tabs";
import { AmazonBuyBox } from "@/ui/features/products/components/AmazonBuyBox";
import { FrequentlyBoughtTogether } from "@/ui/features/products/components/FrequentlyBoughtTogether";
import { CustomerReviews } from "@/ui/features/products/components/CustomerReviews";

interface BoutiqueProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BoutiqueProductDetailPageProps) {
  const { slug } = await params;
  const product = await dataLayer.getProductBySlug(slug);
  if (!product) return { title: "Piece Not Found | Yuka Trendz" };

  return {
    title: `${product.name} | Yuka Trendz`,
    description: product.description,
  };
}

export default async function BoutiqueProductDetailPage({
  params,
}: BoutiqueProductDetailPageProps) {
  const { slug } = await params;
  const product = await dataLayer.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Fetch complementary item for Frequently Bought Together bundle
  const allProducts = await dataLayer.getProducts({});
  const bundleProduct =
    allProducts.find((p) => p.id !== product.id && p.categorySlug !== product.categorySlug) ||
    allProducts.find((p) => p.id !== product.id) ||
    product;

  const gallery: string[] = product.gallery
    ? JSON.parse(product.gallery)
    : [product.image];

  const savings = product.compareAtPrice ? product.compareAtPrice - product.price : 0;
  const savingsPercent = product.compareAtPrice
    ? Math.round((savings / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12">
      {/* Amazon-Style Breadcrumb Bar */}
      <nav className="flex items-center text-xs text-muted-foreground gap-2 flex-wrap">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-3 w-3 text-border" />
        <Link href="/products" className="hover:text-foreground">
          Salons & Collections
        </Link>
        <ChevronRight className="h-3 w-3 text-border" />
        <Link
          href={`/products?category=${product.categorySlug}`}
          className="hover:text-foreground capitalize"
        >
          {product.categorySlug.replace("-", " ")}
        </Link>
        <ChevronRight className="h-3 w-3 text-border" />
        <span className="text-foreground font-medium truncate max-w-[240px]">
          {product.name}
        </span>
      </nav>

      {/* 3-Column Amazon Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Column 1: Image Showcase (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-border/80 bg-muted/30 shadow-unt-md">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
            {product.featured && (
              <div className="absolute top-3.5 left-3.5">
                <Badge variant="brand" size="sm" className="backdrop-blur-md shadow-unt-xs">
                  Yuka Exclusive
                </Badge>
              </div>
            )}
          </div>

          {/* Secondary Thumbnails */}
          {gallery.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {gallery.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-xl overflow-hidden border border-border/70 bg-muted/30 hover:border-brand-500 cursor-pointer transition-colors"
                >
                  <Image
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Column 2: Product Overview & Technical Specs (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="space-y-2 border-b border-border/60 pb-5">
            <div className="flex items-center gap-2 text-xs">
              <Badge variant="gray" size="sm" className="uppercase tracking-wider">
                {product.categorySlug}
              </Badge>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground font-mono text-[11px]">
                ID: MA-{product.id.toString().padStart(4, "0")}
              </span>
            </div>

            <h1 className="font-sans text-2xl sm:text-3xl text-foreground font-bold tracking-tight leading-tight">
              {product.name}
            </h1>

            {product.tagline && (
              <p className="text-xs font-semibold text-brand-600">
                {product.tagline}
              </p>
            )}

            {/* Amazon-Style Rating Summary */}
            <div className="flex items-center gap-2 text-xs pt-1">
              <div className="flex items-center text-amber-500">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                <span className="font-bold text-foreground ml-1">{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-muted-foreground">|</span>
              <span className="text-brand-600 hover:underline cursor-pointer">
                {product.reviewsCount} customer ratings
              </span>
              <span className="text-muted-foreground">|</span>
              <Badge variant="brand" size="sm">Swiss Certified Provenance</Badge>
            </div>
          </div>

          {/* Amazon-Style Price & Savings Breakdown */}
          <div className="space-y-1.5 border-b border-border/60 pb-5">
            {product.compareAtPrice && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Typical Price:</span>
                <span className="line-through">{formatCurrency(product.compareAtPrice)}</span>
              </div>
            )}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground">
                {formatCurrency(product.price)}
              </span>
              {savings > 0 && (
                <span className="text-xs font-semibold text-error-600 dark:text-error-400">
                  Save {formatCurrency(savings)} ({savingsPercent}%)
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Prices include international customs clearances, import tariffs, and transit escrow.
            </p>
          </div>

          {/* Amazon Bullet Highlights */}
          <div className="space-y-2 border-b border-border/60 pb-5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              About This Heirloom Piece
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-brand-600 mt-0.5 shrink-0" />
                <span>Hand-finished under microscope in Geneva and Florence ateliers.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-brand-600 mt-0.5 shrink-0" />
                <span>Limited numbered archive run with individual engraved custody serial.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-brand-600 mt-0.5 shrink-0" />
                <span>Accompanied by signed certificate of origin and tamper-evident transit seals.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-brand-600 mt-0.5 shrink-0" />
                <span>Full transit insurance and vault custody authentication guaranteed.</span>
              </li>
            </ul>
          </div>

          {/* Technical Specifications Table (Amazon Pattern) */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Technical Specifications
            </h4>
            <div className="rounded-xl border border-border/70 overflow-hidden text-xs divide-y divide-border/60">
              <div className="grid grid-cols-2 p-2.5 bg-muted/30">
                <span className="text-muted-foreground font-medium">Department</span>
                <span className="text-foreground capitalize font-semibold">{product.categorySlug}</span>
              </div>
              <div className="grid grid-cols-2 p-2.5">
                <span className="text-muted-foreground font-medium">Mintage Status</span>
                <span className="text-foreground">Numbered Archive Run</span>
              </div>
              <div className="grid grid-cols-2 p-2.5 bg-muted/30">
                <span className="text-muted-foreground font-medium">Atelier Origin</span>
                <span className="text-foreground">Geneva, Switzerland / Florence, Italy</span>
              </div>
              <div className="grid grid-cols-2 p-2.5">
                <span className="text-muted-foreground font-medium">Transit Insurance</span>
                <span className="text-foreground">Lloyd&apos;s of London 100% Policy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Amazon-Style Sticky Buy Box (lg:col-span-3) */}
        <div className="lg:col-span-3">
          <AmazonBuyBox product={product} />
        </div>
      </div>

      {/* Frequently Bought Together (Amazon Upsell Bundle) */}
      <section className="pt-6">
        <FrequentlyBoughtTogether
          mainProduct={product}
          bundleProduct={bundleProduct}
        />
      </section>

      {/* Detailed Technical Tabs */}
      <section className="pt-6 border-t border-border/60">
        <Tabs defaultValue="craftsmanship">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="craftsmanship">Craftsmanship &amp; Quality</TabsTrigger>
            <TabsTrigger value="materials">Materials &amp; Authenticity</TabsTrigger>
            <TabsTrigger value="shipping">Shipping &amp; Delivery</TabsTrigger>
          </TabsList>

          <TabsContent value="craftsmanship" className="text-xs sm:text-sm text-muted-foreground space-y-3 pt-3">
            <p>
              Every piece in the Yuka Trendz collection is crafted to the highest standards. Watches undergo precision chronometric testing across multiple positions. Leather items are handcrafted using prime top-grain leathers.
            </p>
            <p className="flex items-center gap-1.5 text-brand-600 font-medium">
              <Sparkles className="h-4 w-4" /> Each order includes an official certificate of authenticity.
            </p>
          </TabsContent>

          <TabsContent value="materials" className="text-xs sm:text-sm text-muted-foreground space-y-2 pt-3">
            <p>
              Materials are premium quality and responsibly sourced: solid stainless steel and sapphire crystal, vegetable-tanned Tuscan leather, pure natural fragrance extracts, and 100% pure mulberry silk.
            </p>
          </TabsContent>

          <TabsContent value="shipping" className="text-xs sm:text-sm text-muted-foreground space-y-2 pt-3">
            <p className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-emerald-600" />
              Priority express courier with secure delivery confirmation.
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-brand-600" />
              100% insured transit with real-time shipment tracking.
            </p>
          </TabsContent>
        </Tabs>
      </section>

      {/* Customer Ratings & Star Distribution (Amazon Pattern) */}
      <section className="pt-6 border-t border-border/60">
        <CustomerReviews product={product} />
      </section>
    </div>
  );
}
