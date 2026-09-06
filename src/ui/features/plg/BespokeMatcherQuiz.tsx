"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight, Check, RotateCcw, ShoppingBag, Award } from "lucide-react";
import { Button } from "@/ui/primitives/button";
import { Badge } from "@/ui/primitives/badge";
import { Card } from "@/ui/primitives/card";
import { useCart } from "@/ui/features/cart/context/CartContext";
import { formatCurrency } from "@/lib/utils";

interface QuizOption {
  label: string;
  sub: string;
  icon?: string;
  category: string;
}

const QUESTIONS = [
  {
    title: "1. Select your primary artisanal domain",
    subtitle: "Which master craft discipline speaks to your aesthetic sensibility?",
    options: [
      { label: "Haute Horlogerie", sub: "Mechanical tourbillons & complications", category: "timepieces" },
      { label: "Bespoke Leatherworks", sub: "Vegetable-tanned Florentine carryalls", category: "leather-goods" },
      { label: "Rare Botanical Perfumery", sub: "Cold-distilled pure perfume extracts", category: "fragrance" },
      { label: "Mulberry Silk Atelier", sub: "Structured tailoring & evening silks", category: "apparel" },
    ],
  },
  {
    title: "2. Intended occasion & provenance setting",
    subtitle: "How will this heirloom piece enter your daily ritual?",
    options: [
      { label: "Grand Tour & Travel", sub: "Built for transcontinental voyages", category: "leather-goods" },
      { label: "Black-Tie Gala & Evenings", sub: "Subtle luminescence and high complication", category: "timepieces" },
      { label: "Private Atelier Sanctuary", sub: "Personal olfactory intimacy & meditation", category: "fragrance" },
      { label: "Permanent Archival Reserve", sub: "Numbered edition destined for heirs", category: "timepieces" },
    ],
  },
  {
    title: "3. Signature material preference",
    subtitle: "Which elemental material commands your appreciation?",
    options: [
      { label: "Aerospace DLC Titanium & Sapphire", sub: "Lightweight architectural strength", category: "timepieces" },
      { label: "Hand-Waxed Tuscan Vachetta", sub: "Develops rich patina with decade-long wear", category: "leather-goods" },
      { label: "Aged Grasse Rose & Smoked Oud", sub: "Rare botanical absolutes in hand-blown crystal", category: "fragrance" },
      { label: "Heavy 28-Momme Mulberry Silk", sub: "Unrivaled drape with French seams", category: "apparel" },
    ],
  },
];

const CURATED_MATCHES = {
  timepieces: {
    id: 1,
    name: "Chronographe Royal Obsidian",
    slug: "chronographe-royal-obsidian",
    price: 3450,
    compareAtPrice: 3800,
    categorySlug: "timepieces",
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=900&auto=format&fit=crop",
    reason: "Your preference for high horology and architectural durability aligns with our 100-piece numbered skeleton tourbillon.",
    stock: 7,
    rating: 4.95,
    reviewsCount: 38,
    gallery: "[]",
    description: "Engineered with a skeletonized automatic tourbillon movement encased in DLC-treated aerospace titanium and anti-reflective sapphire crystal.",
    createdAt: new Date(),
    updatedAt: new Date(),
    featured: true,
    tagline: "Limited Edition / 100 Pieces",
    tags: "Limited Edition,Horology,Titanium",
  },
  "leather-goods": {
    id: 2,
    name: "Semainier Florentine Duffle",
    slug: "semainier-florentine-duffle",
    price: 1850,
    compareAtPrice: 2100,
    categorySlug: "leather-goods",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=900&auto=format&fit=crop",
    reason: "Your penchant for travel and hand-waxed leather points directly to our vegetable-tanned full-grain Tuscan carryall.",
    stock: 12,
    rating: 4.9,
    reviewsCount: 24,
    gallery: "[]",
    description: "Cut from the prime center cuts of vegetable-tanned Tuscan cowhide, hand-burnished with beeswax and solid brass hardware.",
    createdAt: new Date(),
    updatedAt: new Date(),
    featured: true,
    tagline: "Vegetable-Tanned Tuscan Cowhide",
    tags: "Leather,Travel,Bespoke",
  },
  fragrance: {
    id: 3,
    name: "Extrait de Nuit - Santal Impérial",
    slug: "extrait-de-nuit-santal-imperial",
    price: 680,
    compareAtPrice: 750,
    categorySlug: "fragrance",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=900&auto=format&fit=crop",
    reason: "Your appreciation for olfactory intimacy and rare botanicals matches our Mysore sandalwood and Grasse rose pure extract.",
    stock: 18,
    rating: 4.98,
    reviewsCount: 42,
    gallery: "[]",
    description: "A 35% concentration pure parfum extract featuring rare Mysore sandalwood, vintage orris root, and French centifolia rose.",
    createdAt: new Date(),
    updatedAt: new Date(),
    featured: true,
    tagline: "35% Concentration Artisanal Extract",
    tags: "Perfumery,Extrait,Rare",
  },
  apparel: {
    id: 4,
    name: "Atelier Smoked Silk Kimono Coat",
    slug: "atelier-smoked-silk-kimono-coat",
    price: 1450,
    compareAtPrice: 1650,
    categorySlug: "apparel",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=900&auto=format&fit=crop",
    reason: "Your eye for tailoring and drape pairs perfectly with our heavy 28-momme French-seamed raw mulberry silk coat.",
    stock: 5,
    rating: 4.88,
    reviewsCount: 15,
    gallery: "[]",
    description: "Tailored from 28-momme raw mulberry silk with a smoked charcoal finish and horn button closures.",
    createdAt: new Date(),
    updatedAt: new Date(),
    featured: true,
    tagline: "28-Momme Mulberry Silk",
    tags: "Silk,Tailoring,Atelier",
  },
};

export function BespokeMatcherQuiz() {
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState<string[]>([]);
  const { addItem } = useCart();
  const [added, setAdded] = React.useState(false);

  const handleSelectOption = (category: string) => {
    const nextAnswers = [...answers, category];
    setAnswers(nextAnswers);

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setStep(QUESTIONS.length); // Results screen
    }
  };

  const handleReset = () => {
    setStep(0);
    setAnswers([]);
    setAdded(false);
  };

  // Determine dominant category from answers
  const finalCategory = (answers[0] || "timepieces") as keyof typeof CURATED_MATCHES;
  const match = CURATED_MATCHES[finalCategory] || CURATED_MATCHES.timepieces;

  const handleAddToCart = () => {
    addItem(match as any, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <Card className="overflow-hidden border-brand-500/30 bg-gradient-to-br from-card via-card/90 to-brand-50/20 dark:to-brand-950/20 p-6 sm:p-10 shadow-unt-md">
      {step < QUESTIONS.length ? (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <Badge variant="brand" size="sm" className="gap-1.5 mb-1">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Find Your Perfect Match
            </Badge>
            <h3 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {QUESTIONS[step].title}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {QUESTIONS[step].subtitle}
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            {QUESTIONS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step
                    ? "w-8 bg-brand-600"
                    : i < step
                    ? "w-4 bg-brand-400"
                    : "w-4 bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {QUESTIONS[step].options.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(opt.category)}
                className="flex flex-col p-4 rounded-xl border border-border/80 bg-background/80 hover:border-brand-500/60 hover:bg-muted/60 text-left transition-all hover:scale-[1.01] shadow-unt-xs cursor-pointer group"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {opt.label}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all" />
                </div>
                <span className="text-xs text-muted-foreground mt-1 font-light">
                  {opt.sub}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Results Screen */
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in-50 duration-300">
          <div className="text-center space-y-1.5">
            <Badge variant="success" size="sm" dot className="mb-1">
              Your Perfect Match Found
            </Badge>
            <h3 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Your Recommended Product
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
              Based on your answers, here is the curated recommendation tailored for you.
            </p>
          </div>

          {/* Product Match Card */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-5 sm:p-6 rounded-2xl border border-brand-500/40 bg-background/90 shadow-unt-md items-center">
            <div className="md:col-span-4 relative aspect-square rounded-xl overflow-hidden bg-muted/40 border border-border/60">
              <Image
                src={match.image}
                alt={match.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>

            <div className="md:col-span-8 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="brand" size="sm">
                  {match.tagline}
                </Badge>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Save {formatCurrency(match.compareAtPrice - match.price)}
                </span>
              </div>

              <h4 className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {match.name}
              </h4>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {match.reason}
              </p>

              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-2xl font-bold text-foreground">
                  {formatCurrency(match.price)}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  {formatCurrency(match.compareAtPrice)}
                </span>
                <Badge variant="gray" size="sm" className="ml-2">
                  Free Express Delivery
                </Badge>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleAddToCart}
                  className="flex-1 gap-2 shadow-unt-xs"
                >
                  {added ? (
                    <>
                      <Check className="h-4 w-4" />
                      Item Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4" />
                      Add to Cart
                    </>
                  )}
                </Button>

                <Button variant="secondary-gray" size="md" asChild>
                  <Link href={`/products/${match.slug}`}>
                    View Product Details
                  </Link>
                </Button>

                <Button
                  variant="tertiary-gray"
                  size="icon"
                  onClick={handleReset}
                  title="Retake Quiz"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* PLG Voucher Code Banner */}
          <div className="p-3.5 rounded-xl border border-brand-300 bg-brand-50/60 dark:border-brand-900 dark:bg-brand-950/30 flex items-center justify-between text-xs">
            <span className="text-brand-900 dark:text-brand-200 font-medium flex items-center gap-1.5">
              <Award className="h-4 w-4 text-brand-600" />
              Special 10% Discount unlocked: Use code{" "}
              <strong className="font-mono text-brand-700 dark:text-brand-300">YUKA10</strong> at checkout.
            </span>
            <Button
              variant="secondary-gray"
              size="sm"
              className="text-xs h-7"
              onClick={() => navigator.clipboard.writeText("YUKA10")}
            >
              Copy Code
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
