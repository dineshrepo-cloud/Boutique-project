"use client";

import React, { useState, useTransition } from "react";
import { FolderPlus, Loader2, Sparkles, Image as ImageIcon, Check, Tag } from "lucide-react";
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
import { Badge } from "@/ui/primitives/badge";
import { Alert, AlertDescription } from "@/ui/primitives/alert";
import { createCategoryAction } from "@/backend/actions/inventory.actions";
import { Category } from "@/backend/db/schema";
import { slugify } from "@/lib/utils";

interface AddCategoryDialogProps {
  onCategoryCreated?: (category: Category) => void;
  trigger?: React.ReactNode;
}

const PRESET_IMAGES = [
  {
    label: "Jewelry",
    url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=900&auto=format&fit=crop",
  },
  {
    label: "Footwear",
    url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=900&auto=format&fit=crop",
  },
  {
    label: "Silks & Apparel",
    url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=900&auto=format&fit=crop",
  },
  {
    label: "Accessories",
    url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=900&auto=format&fit=crop",
  },
];

export function AddCategoryDialog({ onCategoryCreated, trigger }: AddCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isCustomSlug, setIsCustomSlug] = useState(false);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(PRESET_IMAGES[0].url);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-generate slug when name changes, unless user manually edited the slug
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isCustomSlug) {
      setSlug(slugify(val));
    }
  };

  const handleSlugChange = (val: string) => {
    setIsCustomSlug(true);
    setSlug(slugify(val));
  };

  const handleReset = () => {
    setName("");
    setSlug("");
    setIsCustomSlug(false);
    setDescription("");
    setImage(PRESET_IMAGES[0].url);
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const targetSlug = slug.trim() || slugify(name);
    if (!name.trim()) {
      setErrorMessage("Please enter a category name.");
      return;
    }

    startTransition(async () => {
      const res = await createCategoryAction({
        name: name.trim(),
        slug: targetSlug,
        description: description.trim() || undefined,
        image: image.trim() || PRESET_IMAGES[0].url,
      });

      if (res.success && res.category) {
        onCategoryCreated?.(res.category);
        handleReset();
        setOpen(false);
      } else {
        setErrorMessage(res.error || "Failed to create category");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setErrorMessage(null); }}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button variant="secondary-gray" size="sm" className="gap-1.5 shadow-unt-xs cursor-pointer">
            <FolderPlus className="h-4 w-4 text-brand-600" />
            <span>Add Custom Category</span>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-lg p-0 overflow-hidden sm:rounded-2xl">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-amber-700 p-6 text-white">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="brand" size="sm" className="bg-white/20 text-white border-none font-mono text-[10px]">
              Taxonomy &amp; Catalog
            </Badge>
          </div>
          <DialogTitle className="font-sans text-xl sm:text-2xl text-white font-bold tracking-tight">
            Create Customized Category
          </DialogTitle>
          <DialogDescription className="text-xs text-white/80 mt-1">
            Add a new bespoke department, collection, or product category to the boutique store.
          </DialogDescription>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMessage && (
            <Alert variant="error" className="py-2.5">
              <AlertDescription className="text-xs font-medium text-error-700 dark:text-error-300">
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}

          {/* Category Name */}
          <div className="space-y-1.5">
            <Label htmlFor="category-name" className="text-xs font-semibold">
              Category Name *
            </Label>
            <Input
              id="category-name"
              required
              placeholder="e.g. Fine Jewelry, Cashmere Knitwear, Footwear"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="text-xs"
            />
          </div>

          {/* URL Identifier / Slug */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="category-slug" className="text-xs font-semibold flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                URL Slug / Key *
              </Label>
              {isCustomSlug && (
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomSlug(false);
                    setSlug(slugify(name));
                  }}
                  className="text-[10px] text-brand-600 hover:underline cursor-pointer"
                >
                  Reset to Auto-Slug
                </button>
              )}
            </div>
            <div className="flex items-center rounded-lg border border-border bg-muted/40 overflow-hidden focus-within:ring-2 focus-within:ring-brand-500/20">
              <span className="px-2.5 text-[11px] text-muted-foreground font-mono bg-muted/70 py-2 select-none border-r border-border">
                /products?category=
              </span>
              <Input
                id="category-slug"
                required
                placeholder="fine-jewelry"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                className="border-0 bg-transparent rounded-none focus-visible:ring-0 text-xs font-mono"
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              Unique routing identifier used for navigation filters and search indexing.
            </p>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="category-desc" className="text-xs font-semibold">
              Editorial Description
            </Label>
            <Textarea
              id="category-desc"
              rows={2}
              placeholder="A curated suite of handcrafted pieces and limited creations..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-xs"
            />
          </div>

          {/* Cover Image & Presets */}
          <div className="space-y-2">
            <Label htmlFor="category-image" className="text-xs font-semibold flex items-center gap-1.5">
              <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
              Category Showcase Image URL
            </Label>
            <Input
              id="category-image"
              placeholder="https://images.unsplash.com/..."
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="text-xs font-mono"
            />

            {/* Quick Luxury Presets */}
            <div className="pt-1">
              <span className="text-[11px] text-muted-foreground block mb-1.5">
                Or choose a luxury curated preset:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRESET_IMAGES.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setImage(preset.url)}
                    className={`px-2.5 py-1.5 rounded-lg border text-left text-xs transition-all cursor-pointer flex items-center justify-between ${
                      image === preset.url
                        ? "border-brand-500 bg-brand-50/50 text-brand-700 dark:bg-brand-950/30 dark:text-brand-300 font-medium"
                        : "border-border/80 hover:bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    <span className="truncate">{preset.label}</span>
                    {image === preset.url && <Check className="h-3 w-3 text-brand-600 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live Preview Card */}
          {name.trim() && (
            <div className="p-3 rounded-xl border border-dashed border-border/80 bg-muted/20 space-y-1">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Category Preview
              </span>
              <div className="flex items-center gap-2">
                <Badge variant="brand" size="sm" dot>
                  {name}
                </Badge>
                <span className="text-[11px] font-mono text-muted-foreground">
                  slug: {slug || slugify(name)}
                </span>
              </div>
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/60">
            <Button
              type="button"
              variant="secondary-gray"
              size="sm"
              disabled={isPending}
              onClick={() => {
                handleReset();
                setOpen(false);
              }}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isPending || !name.trim()}
              className="gap-1.5 shadow-unt-xs cursor-pointer font-semibold"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Creating Category...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Save Category</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
