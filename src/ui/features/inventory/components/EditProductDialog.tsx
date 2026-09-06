"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import {
  Edit3,
  Pencil,
  Loader2,
  Percent,
  Sparkles,
  Package,
  Layers,
  Image as ImageIcon,
  Check,
  Tag,
  HelpCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/ui/primitives/dialog";
import { Button } from "@/ui/primitives/button";
import { Input } from "@/ui/primitives/input";
import { Label } from "@/ui/primitives/label";
import { Textarea } from "@/ui/primitives/textarea";
import { Checkbox } from "@/ui/primitives/checkbox";
import { Badge } from "@/ui/primitives/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/primitives/select";
import { Product, Category } from "@/backend/db/schema";
import { updateProductAction } from "../actions";
import { formatCurrency } from "@/lib/utils";

interface EditProductDialogProps {
  product: Product;
  categories?: Category[];
  onUpdated?: (updated: Product) => void;
}

// Curated high-res luxury photography presets for fast image selection
const SAMPLE_IMAGE_PRESETS = [
  {
    label: "Skeleton Horology",
    url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop",
  },
  {
    label: "Chronograph Gold",
    url: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1200&auto=format&fit=crop",
  },
  {
    label: "Florentine Leather",
    url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1200&auto=format&fit=crop",
  },
  {
    label: "Tuscan Weekender",
    url: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1200&auto=format&fit=crop",
  },
  {
    label: "Botanical Perfumery",
    url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1200&auto=format&fit=crop",
  },
  {
    label: "Gold & Jewels",
    url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    label: "Mulberry Silk",
    url: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=1200&auto=format&fit=crop",
  },
];

export function EditProductDialog({
  product,
  categories = [],
  onUpdated,
}: EditProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Form State
  const [name, setName] = useState(product.name);
  const [tagline, setTagline] = useState(product.tagline || "");
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price.toString());
  const [compareAtPrice, setCompareAtPrice] = useState(
    product.compareAtPrice ? product.compareAtPrice.toString() : ""
  );
  const [stock, setStock] = useState(product.stock.toString());
  const [categorySlug, setCategorySlug] = useState(product.categorySlug);
  const [image, setImage] = useState(product.image);
  const [featured, setFeatured] = useState(product.featured);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Discount calculations
  const numPrice = parseFloat(price) || 0;
  const numCompare = parseFloat(compareAtPrice) || 0;
  const hasDiscount = numCompare > numPrice && numPrice > 0;
  const discountPercent = hasDiscount
    ? Math.round(((numCompare - numPrice) / numCompare) * 100)
    : 0;
  const savingsAmount = hasDiscount ? numCompare - numPrice : 0;

  // Quick discount calculation presets
  const applyDiscountPreset = (percent: number) => {
    // If compareAtPrice is not set, set it to the base price
    const baseOriginal = numCompare > 0 ? numCompare : numPrice > 0 ? numPrice : 1000;
    const newPrice = Math.round(baseOriginal * (1 - percent / 100));
    setCompareAtPrice(baseOriginal.toString());
    setPrice(newPrice.toString());
  };

  const clearDiscount = () => {
    setCompareAtPrice("");
  };

  // Stock quick adjustments
  const adjustStockBy = (delta: number) => {
    const current = parseInt(stock) || 0;
    setStock(Math.max(0, current + delta).toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setErrorMsg("Please provide a valid price greater than ₹0.");
      return;
    }

    const parsedStock = parseInt(stock);
    if (isNaN(parsedStock) || parsedStock < 0) {
      setErrorMsg("Please provide a valid stock count (0 or greater).");
      return;
    }

    startTransition(async () => {
      const res = await updateProductAction(product.id, {
        name,
        tagline: tagline || null,
        description,
        price: parsedPrice,
        compareAtPrice: compareAtPrice.trim() ? parseFloat(compareAtPrice) : null,
        stock: parsedStock,
        categorySlug,
        image,
        featured,
      });

      if (res.success && res.product) {
        setSuccessMsg("Product details and price updated successfully.");
        onUpdated?.(res.product);
        setTimeout(() => {
          setOpen(false);
          setSuccessMsg(null);
        }, 800);
      } else {
        setErrorMsg(res.error || "Failed to commit product adjustments.");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary-gray"
          size="sm"
          className="h-8 px-2.5 gap-1.5 text-xs shadow-unt-xs"
        >
          <Pencil className="h-3.5 w-3.5 text-brand-600" />
          <span>Edit</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 rounded-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-border/60 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="brand" size="sm">
                Product #{product.id}
              </Badge>
              {hasDiscount && (
                <Badge variant="error" size="sm">
                  {discountPercent}% Promo Active
                </Badge>
              )}
            </div>
          </div>
          <DialogTitle className="font-sans text-xl font-bold tracking-tight text-foreground mt-1">
            Edit Product & Price
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Update product name, image, pricing, stock count, and category.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-error-50 dark:bg-error-950/40 border border-error-200 dark:border-error-900 text-xs text-error-700 dark:text-error-300">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 font-medium">
              <Check className="h-4 w-4 text-emerald-600" />
              {successMsg}
            </div>
          )}

          {/* SECTION 1: Product Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border/50 pb-2">
              <Package className="h-4 w-4 text-brand-600" />
              <h3 className="font-semibold text-xs uppercase tracking-wider text-foreground">
                Product Information &amp; Details
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor={`edit-name-${product.id}`} className="text-xs font-medium">
                  Product Name *
                </Label>
                <Input
                  id={`edit-name-${product.id}`}
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Royal Skeleton Chronograph"
                  className="h-9 text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor={`edit-tagline-${product.id}`} className="text-xs font-medium">
                  Tagline / Subtitle
                </Label>
                <Input
                  id={`edit-tagline-${product.id}`}
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Swiss Automatic Chronometer in Obsidian Titanium"
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Product Category</Label>
                <Select value={categorySlug} onValueChange={setCategorySlug}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length > 0 ? (
                      categories.map((c) => (
                        <SelectItem key={c.slug} value={c.slug} className="text-xs">
                          {c.name}
                        </SelectItem>
                      ))
                    ) : (
                      <>
                        <SelectItem value="timepieces" className="text-xs">
                          Timepieces &amp; Watches
                        </SelectItem>
                        <SelectItem value="leather-goods" className="text-xs">
                          Leather Bags &amp; Accessories
                        </SelectItem>
                        <SelectItem value="fragrance" className="text-xs">
                          Fragrances &amp; Perfumes
                        </SelectItem>
                        <SelectItem value="apparel" className="text-xs">
                          Silk &amp; Apparel
                        </SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 flex items-center pt-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`edit-featured-${product.id}`}
                    checked={featured}
                    onCheckedChange={(checked) => setFeatured(Boolean(checked))}
                  />
                  <Label
                    htmlFor={`edit-featured-${product.id}`}
                    className="text-xs font-medium cursor-pointer"
                  >
                    Featured Product (Showcase on Homepage)
                  </Label>
                </div>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor={`edit-desc-${product.id}`} className="text-xs font-medium">
                  Product Description *
                </Label>
                <Textarea
                  id={`edit-desc-${product.id}`}
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter detailed product features, materials, and specifications..."
                  className="text-xs leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Discount & Pricing Engine */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-border/50 pb-2">
              <div className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-amber-500" />
                <h3 className="font-semibold text-xs uppercase tracking-wider text-foreground">
                  Pricing & Discount Updation
                </h3>
              </div>

              {hasDiscount && (
                <Badge variant="brand" size="sm" className="text-[10px]">
                  Saving: {formatCurrency(savingsAmount)} ({discountPercent}% OFF)
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor={`edit-price-${product.id}`} className="text-xs font-medium">
                  Active Price (₹ INR) *
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-mono">
                    ₹
                  </span>
                  <Input
                    id={`edit-price-${product.id}`}
                    type="number"
                    step="1"
                    min="1"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="pl-7 h-9 text-xs sm:text-sm font-semibold font-mono"
                  />
                </div>
                <span className="text-[10px] text-muted-foreground block">
                  Current price displayed in the store
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`edit-compare-${product.id}`} className="text-xs font-medium">
                    Original Price (₹ Strikethrough)
                  </Label>
                  {compareAtPrice && (
                    <button
                      type="button"
                      onClick={clearDiscount}
                      className="text-[10px] text-brand-600 hover:underline cursor-pointer"
                    >
                      Clear discount
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-mono">
                    ₹
                  </span>
                  <Input
                    id={`edit-compare-${product.id}`}
                    type="number"
                    step="1"
                    min="1"
                    value={compareAtPrice}
                    onChange={(e) => setCompareAtPrice(e.target.value)}
                    placeholder="Leave empty if no discount"
                    className="pl-7 h-9 text-xs sm:text-sm font-mono"
                  />
                </div>
                <span className="text-[10px] text-muted-foreground block">
                  Shown as crossed-out benchmark price to highlight savings
                </span>
              </div>
            </div>

            {/* Quick Discount Presets Toolbar */}
            <div className="p-3 rounded-xl border border-border/70 bg-muted/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-foreground flex items-center gap-1">
                  <Tag className="h-3 w-3 text-brand-600" />
                  1-Click Discount Presets:
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Automatically calculates active price
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {[10, 15, 20, 25, 30].map((pct) => (
                  <Button
                    key={pct}
                    type="button"
                    variant="secondary-gray"
                    size="sm"
                    className="h-7 text-xs px-2.5 shadow-unt-xs cursor-pointer hover:border-brand-500"
                    onClick={() => applyDiscountPreset(pct)}
                  >
                    {pct}% Off
                  </Button>
                ))}
                <Button
                  type="button"
                  variant="tertiary-gray"
                  size="sm"
                  className="h-7 text-xs px-2.5 text-muted-foreground hover:text-foreground"
                  onClick={clearDiscount}
                >
                  No Discount
                </Button>
              </div>
            </div>
          </div>

          {/* SECTION 3: Product Image Updation */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 border-b border-border/50 pb-2">
              <ImageIcon className="h-4 w-4 text-brand-600" />
              <h3 className="font-semibold text-xs uppercase tracking-wider text-foreground">
                Product Image & Visual Presentation
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
              {/* Image Preview Box */}
              <div className="sm:col-span-1">
                <Label className="text-xs font-medium block mb-1.5">Live Preview</Label>
                <div className="relative aspect-square rounded-xl overflow-hidden border border-border/70 bg-muted/50 shadow-unt-xs">
                  {image ? (
                    <Image
                      src={image}
                      alt={name || "Product image"}
                      fill
                      sizes="200px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground text-xs p-2 text-center">
                      <ImageIcon className="h-8 w-8 mb-1 opacity-40" />
                      No Image Provided
                    </div>
                  )}
                </div>
              </div>

              {/* Image URL Input & Presets */}
              <div className="sm:col-span-2 space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor={`edit-image-${product.id}`} className="text-xs font-medium">
                    Image Source URL *
                  </Label>
                  <Input
                    id={`edit-image-${product.id}`}
                    required
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="h-9 text-xs"
                  />
                  <span className="text-[10px] text-muted-foreground block">
                    Supports high-resolution WebP, PNG, and HTTPS photography URLs
                  </span>
                </div>

                {/* Sample Presets */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-medium text-foreground block">
                    Quick Curated Photography Presets:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {SAMPLE_IMAGE_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setImage(preset.url)}
                        className={`text-[11px] px-2.5 py-1 rounded-md border text-left transition-all cursor-pointer ${
                          image === preset.url
                            ? "border-brand-500 bg-brand-50/50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300 font-medium"
                            : "border-border hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 text-muted-foreground"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: Inventory Stock Management */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 border-b border-border/50 pb-2">
              <Layers className="h-4 w-4 text-emerald-600" />
              <h3 className="font-semibold text-xs uppercase tracking-wider text-foreground">
                Inventory &amp; Stock Quantity
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div className="space-y-1.5">
                <Label htmlFor={`edit-stock-${product.id}`} className="text-xs font-medium">
                  Units in Stock *
                </Label>
                <Input
                  id={`edit-stock-${product.id}`}
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="h-9 text-xs sm:text-sm font-semibold font-mono"
                />
              </div>

              <div className="space-y-1.5 pt-1">
                <Label className="text-xs font-medium block">
                  Quick Replenish / Adjustment:
                </Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="secondary-gray"
                    size="sm"
                    className="h-8 text-xs px-2.5 cursor-pointer"
                    onClick={() => adjustStockBy(5)}
                  >
                    +5 Units
                  </Button>
                  <Button
                    type="button"
                    variant="secondary-gray"
                    size="sm"
                    className="h-8 text-xs px-2.5 cursor-pointer"
                    onClick={() => adjustStockBy(10)}
                  >
                    +10 Units
                  </Button>
                  <Button
                    type="button"
                    variant="secondary-gray"
                    size="sm"
                    className="h-8 text-xs px-2.5 cursor-pointer"
                    onClick={() => adjustStockBy(25)}
                  >
                    +25 Units
                  </Button>
                  <Button
                    type="button"
                    variant="tertiary-gray"
                    size="sm"
                    className="h-8 text-xs px-2.5 text-error-600 hover:text-error-700"
                    onClick={() => setStock("0")}
                  >
                    Set Sold Out
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/70">
            <Button
              type="button"
              variant="secondary-gray"
              size="sm"
              className="h-9 text-xs"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="h-9 text-xs shadow-unt-xs gap-2"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Save Product Changes</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
