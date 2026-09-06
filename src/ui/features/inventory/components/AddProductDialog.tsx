"use client";

import { useState, useTransition } from "react";
import { Plus, Loader2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/primitives/select";
import { createProductAction } from "@/backend/actions/inventory.actions";
import { Category } from "@/backend/db/schema";

export function AddProductDialog({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [stock, setStock] = useState("10");
  const [categorySlug, setCategorySlug] = useState(categories[0]?.slug || "timepieces");
  const [image, setImage] = useState("");
  const [featured, setFeatured] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await createProductAction({
        name,
        tagline,
        description,
        price: parseFloat(price),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        stock: parseInt(stock),
        categorySlug,
        image:
          image ||
          "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=900&auto=format&fit=crop",
        featured,
      });

      if (res.success) {
        setOpen(false);
        // Reset form
        setName("");
        setTagline("");
        setDescription("");
        setPrice("");
        setCompareAtPrice("");
        setImage("");
      } else {
        alert(res.error || "Failed to create product");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary" size="sm" className="gap-1.5 shadow-unt-xs">
          <Plus className="h-4 w-4" />
          Add New Product
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-sans text-xl font-bold tracking-tight text-foreground">
            Add New Product
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Add a new luxury timepiece, leather good, or perfume to the store catalog.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="piece-name">Product Name *</Label>
            <Input
              id="piece-name"
              required
              placeholder="e.g. Royal Skeleton Chronograph"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="piece-tagline">Tagline / Subtitle</Label>
            <Input
              id="piece-tagline"
              placeholder="e.g. Limited Edition / 18K Solid Gold"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="piece-price">Price (₹ INR) *</Label>
              <Input
                id="piece-price"
                required
                type="number"
                step="0.01"
                placeholder="2450"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="piece-compare">Original / Strikethrough</Label>
              <Input
                id="piece-compare"
                type="number"
                step="0.01"
                placeholder="e.g. 2950"
                value={compareAtPrice}
                onChange={(e) => setCompareAtPrice(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="piece-stock">Stock Units *</Label>
              <Input
                id="piece-stock"
                required
                type="number"
                min="0"
                placeholder="10"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Category *</Label>
            <Select value={categorySlug} onValueChange={setCategorySlug}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.slug}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="piece-image">Image URL</Label>
            <Input
              id="piece-image"
              placeholder="https://images.unsplash.com/..."
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="piece-desc">Product Description *</Label>
            <Textarea
              id="piece-desc"
              required
              rows={3}
              placeholder="Description of materials, design, and details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <Checkbox
              id="featured-check"
              checked={featured}
              onCheckedChange={(checked) => setFeatured(Boolean(checked))}
            />
            <Label
              htmlFor="featured-check"
              className="text-xs font-medium cursor-pointer text-foreground"
            >
              Feature on Homepage
            </Label>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full gap-2 shadow-unt-xs font-medium"
              disabled={isPending}
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Product
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
