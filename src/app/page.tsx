import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  CheckCircle2,
  PhoneCall,
  Clock,
} from "lucide-react";
import { dataLayer } from "@/backend/db";
import { Button } from "@/ui/primitives/button";
import { Badge } from "@/ui/primitives/badge";
import { Card } from "@/ui/primitives/card";
import { ProductGrid } from "@/ui/features/products/components/ProductGrid";
import { formatCurrency } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yuka Trendz | Luxury Watches, Leather Bags & Perfumes",
  description:
    "Discover luxury watches, handcrafted leather bags, and exclusive fragrances at Yuka Trendz.",
};

export default async function HomePage() {
  const [allProducts, featuredProducts, categories] = await Promise.all([
    dataLayer.getProducts({}),
    dataLayer.getProducts({ featured: true }),
    dataLayer.getCategories(),
  ]);

  const topRatedProducts = [...allProducts].sort((a, b) => b.rating - a.rating).slice(0, 8);

  return (
    <div className="flex flex-col gap-14 sm:gap-20 pb-20 bg-background">
      {/* 1. Refined Luxury      {/* Hero Banner */}
      <section className="relative w-full overflow-hidden bg-neutral-950 text-white">
        <div className="relative h-[480px] sm:h-[540px] lg:h-[600px] w-full">
          <Image
            src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=2000&auto=format&fit=crop"
            alt="Yuka Trendz Luxury Goods & Watches"
            fill
            priority
            className="object-cover object-center brightness-[0.45] scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-black/20" />

          {/* Hero Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
            <div className="max-w-2xl space-y-5">
              <Badge
                variant="brand"
                size="md"
                className="gap-2 bg-brand-600/30 text-amber-300 border-amber-500/30 backdrop-blur-md"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>New Seasonal Arrivals</span>
              </Badge>

              <h1 className="font-sans text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                Artisanal Luxury &amp; <br />
                <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                  Timeless Craftsmanship
                </span>
              </h1>

              <p className="text-sm sm:text-base text-neutral-300 font-light max-w-xl leading-relaxed">
                Discover our exclusive collection of luxury watches, handcrafted Italian leather bags, and rare artisanal perfumes.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  asChild
                  className="shadow-unt-md gap-2 text-sm font-semibold rounded-xl"
                >
                  <Link href="/products">
                    <span>Explore All Products</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>

                <Button
                  variant="secondary-gray"
                  size="lg"
                  asChild
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md rounded-xl text-sm"
                >
                  <Link href="/products?category=timepieces">
                    <span>Luxury Watches</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Curated Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase font-semibold tracking-widest text-brand-600 dark:text-brand-400 block mb-1">
              Categories
            </span>
            <h2 className="text-2xl sm:text-3xl font-sans font-bold tracking-tight text-foreground">
              Shop by Category
            </h2>
          </div>
          <Button variant="secondary-gray" size="sm" asChild className="shrink-0 text-xs">
            <Link href="/products" className="gap-1.5">
              <span>View All Products</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden border border-border/70 bg-card p-4 shadow-unt-xs hover:shadow-unt-lg hover:border-brand-500/50 transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-muted mb-4">
                <Image
                  src={
                    cat.image ||
                    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=900&auto=format&fit=crop"
                  }
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
              </div>

              <div>
                <h3 className="font-sans font-bold text-base text-foreground group-hover:text-brand-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                  {cat.description || "Explore luxury collection"}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-brand-600">
                <span>Shop Category</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Products with 1-Click Add to Cart */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="brand" size="sm" dot>
                Best Sellers
              </Badge>
              <span className="text-xs text-muted-foreground">Handcrafted Luxury Pieces</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-sans font-bold tracking-tight text-foreground">
              Featured Products
            </h2>
          </div>
          <Button variant="secondary-gray" size="sm" asChild className="shrink-0 text-xs">
            <Link href="/products">View All Products</Link>
          </Button>
        </div>

        {/* Standardized Product Grid */}
        <ProductGrid products={featuredProducts.length > 0 ? featuredProducts : allProducts.slice(0, 4)} />
      </section>

      {/* 4. Top Rated Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase font-semibold tracking-widest text-brand-600 dark:text-brand-400 block mb-1">
              Customer Favorites
            </span>
            <h2 className="text-2xl sm:text-3xl font-sans font-bold tracking-tight text-foreground">
              Top Rated Products
            </h2>
          </div>
          <Button variant="secondary-gray" size="sm" asChild className="shrink-0 text-xs">
            <Link href="/products">Browse Full Catalog</Link>
          </Button>
        </div>

        <ProductGrid products={topRatedProducts} />
      </section>

      {/* 5. Trust, Delivery & Quality Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 sm:p-8 rounded-2xl border border-border/80 bg-card/60 shadow-unt-xs">
          <div className="flex items-start gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-foreground">Free Express Delivery</h4>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Complimentary insured delivery on orders over ₹2,000 across India.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-foreground">100% Genuine &amp; Authentic</h4>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Every item is authenticated and accompanied by an official certificate.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-foreground">7-Day Easy Returns</h4>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Hassle-free return policy with complimentary courier pickup.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <PhoneCall className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-foreground">24/7 Customer Support</h4>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Dedicated support specialists available anytime to assist you.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
