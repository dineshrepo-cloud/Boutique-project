"use client";

import * as React from "react";
import { Star, CheckCircle, ShieldCheck, ThumbsUp } from "lucide-react";
import { Product } from "@/backend/db/schema";
import { Progress } from "@/ui/primitives/progress";
import { Badge } from "@/ui/primitives/badge";
import { Card } from "@/ui/primitives/card";

interface CustomerReviewsProps {
  product: Product;
}

const SAMPLE_REVIEWS = [
  {
    author: "Lord Julian K.",
    location: "Geneva, Switzerland",
    date: "August 14, 2026",
    rating: 5,
    title: "Uncompromising horological architecture",
    content: "The finishing on the titanium skeleton carriage is sublime. Verified at 28,800 vph with immaculate balance wheel tolerances. The climate-controlled transit case and personalized calligraphed certificate were an absolute joy to unbox.",
    verified: true,
    helpful: 24,
  },
  {
    author: "Claire D.",
    location: "Paris, France",
    date: "July 29, 2026",
    rating: 5,
    title: "Florentine leather with unmatched character",
    content: "Substantial hand feel and rich vegetable-tanned aroma. The stitching along the stress points uses bonded linen thread that will unquestionably outlive me. Truly an heirloom acquisition.",
    verified: true,
    helpful: 18,
  },
];

export function CustomerReviews({ product }: CustomerReviewsProps) {
  const rating = product.rating;
  const reviewsCount = product.reviewsCount;

  const distributions = [
    { stars: 5, percentage: 86 },
    { stars: 4, percentage: 11 },
    { stars: 3, percentage: 3 },
    { stars: 2, percentage: 0 },
    { stars: 1, percentage: 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-sans text-xl font-bold tracking-tight text-foreground">
          Collector Reviews & Verification
        </h3>
        <Badge variant="success" size="sm" dot>
          100% Verified Provenance
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Amazon-Style Rating Breakdown Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-sans font-black tracking-tight text-foreground">
              {rating.toFixed(1)}
            </span>
            <span className="text-sm text-muted-foreground">out of 5</span>
          </div>

          <div className="flex items-center gap-1 text-amber-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.round(rating)
                    ? "fill-amber-500 text-amber-500"
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-2">
              {reviewsCount} global ratings
            </span>
          </div>

          {/* Star Distribution Bars */}
          <div className="space-y-2 pt-2">
            {distributions.map((dist) => (
              <div key={dist.stars} className="flex items-center gap-2 text-xs">
                <span className="w-12 text-muted-foreground font-medium">
                  {dist.stars} star
                </span>
                <Progress value={dist.percentage} className="h-2 flex-1" />
                <span className="w-8 text-right text-muted-foreground font-mono">
                  {dist.percentage}%
                </span>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl border border-border/70 bg-muted/30 text-xs space-y-1">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-brand-600" />
              Yuka Custody Seal
            </span>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Every review corresponds to a cryptographically verified order logged on the sovereign blockchain registry.
            </p>
          </div>
        </div>

        {/* Customer Testimonials List */}
        <div className="lg:col-span-8 space-y-4">
          {SAMPLE_REVIEWS.map((rev, idx) => (
            <Card key={idx} className="p-4 sm:p-5 border-border/70 bg-card space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-brand-500/15 text-brand-700 dark:text-brand-300 font-bold text-xs flex items-center justify-center">
                    {rev.author[0]}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-foreground block">
                      {rev.author}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {rev.location} • {rev.date}
                    </span>
                  </div>
                </div>
                {rev.verified && (
                  <Badge variant="brand" size="sm" className="gap-1 text-[10px]">
                    <CheckCircle className="h-3 w-3 text-brand-600" />
                    Verified Custody
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-1 text-amber-500 text-xs">
                {Array.from({ length: rev.rating }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-amber-500" />
                ))}
                <span className="font-semibold text-foreground ml-1.5 text-xs">
                  {rev.title}
                </span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {rev.content}
              </p>

              <div className="pt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                <ThumbsUp className="h-3 w-3" />
                <span>{rev.helpful} people found this helpful</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
