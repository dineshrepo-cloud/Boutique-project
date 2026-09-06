"use client";

import React, { useState, useTransition, useMemo } from "react";
import Image from "next/image";
import { Product, Category } from "@/backend/db/schema";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/ui/primitives/table";
import { Badge } from "@/ui/primitives/badge";
import { Button } from "@/ui/primitives/button";
import { Input } from "@/ui/primitives/input";
import { Alert, AlertDescription } from "@/ui/primitives/alert";
import { formatCurrency } from "@/lib/utils";
import { updateStockAction, deleteProductAction } from "@/backend/actions/inventory.actions";
import { EditProductDialog } from "./EditProductDialog";
import {
  Check,
  Edit2,
  Loader2,
  Sparkles,
  Search,
  Filter,
  Trash2,
  Plus,
  Minus,
  Percent,
  TrendingDown,
} from "lucide-react";

interface InventoryTableProps {
  products: Product[];
  categories?: Category[];
}

function TableThumbnail({ src, alt }: { src: string; alt: string }) {
  const [imgSrc, setImgSrc] = useState(src);
  const fallback = "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=900&auto=format&fit=crop";

  React.useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <Image
      src={imgSrc || fallback}
      alt={alt}
      fill
      sizes="48px"
      className="object-cover"
      onError={() => setImgSrc(fallback)}
    />
  );
}

export function InventoryTable({ products, categories = [] }: InventoryTableProps) {
  const [items, setItems] = useState<Product[]>(products);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [stockVal, setStockVal] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "low-stock" | "sold-out" | "discounted">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isPending, startTransition] = useTransition();
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  // Sync state if products prop changes
  React.useEffect(() => {
    setItems(products);
  }, [products]);

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setStockVal(product.stock);
  };

  const handleSaveStock = (productId: number) => {
    startTransition(async () => {
      const res = await updateStockAction(productId, stockVal);
      if (res.success && res.product) {
        setEditingId(null);
        setItems((prev) =>
          prev.map((p) => (p.id === productId ? res.product! : p))
        );
        setStatusFeedback(`Stock updated to ${stockVal} units for product #${productId}`);
        setTimeout(() => setStatusFeedback(null), 3000);
      } else {
        alert(res.error || "Failed to update stock");
      }
    });
  };

  const handleQuickStep = (productId: number, currentStock: number, delta: number) => {
    const nextStock = Math.max(0, currentStock + delta);
    startTransition(async () => {
      const res = await updateStockAction(productId, nextStock);
      if (res.success && res.product) {
        setItems((prev) =>
          prev.map((p) => (p.id === productId ? res.product! : p))
        );
        setStatusFeedback(`Stock updated to ${nextStock} units`);
        setTimeout(() => setStatusFeedback(null), 2500);
      } else {
        alert(res.error || "Failed to update stock");
      }
    });
  };

  const handleDelete = (productId: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from inventory?`)) {
      return;
    }

    startTransition(async () => {
      const res = await deleteProductAction(productId);
      if (res.success) {
        setItems((prev) => prev.filter((p) => p.id !== productId));
        setStatusFeedback(`Product "${name}" has been removed from inventory.`);
        setTimeout(() => setStatusFeedback(null), 3000);
      } else {
        alert(res.error || "Failed to delete product");
      }
    });
  };

  const handleProductUpdated = (updated: Product) => {
    setItems((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
    setStatusFeedback(`Product "${updated.name}" details and pricing updated.`);
    setTimeout(() => setStatusFeedback(null), 3000);
  };

  // Filter items
  const filteredProducts = useMemo(() => {
    return items.filter((p) => {
      // Category filter
      if (selectedCategory !== "all" && p.categorySlug !== selectedCategory) {
        return false;
      }

      // Tab filter
      if (filterTab === "low-stock" && p.stock > 8) return false;
      if (filterTab === "sold-out" && p.stock > 0) return false;
      if (filterTab === "discounted" && (!p.compareAtPrice || p.compareAtPrice <= p.price)) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesTagline = p.tagline?.toLowerCase().includes(query);
        const matchesCategory = p.categorySlug.toLowerCase().includes(query);
        if (!matchesName && !matchesTagline && !matchesCategory) return false;
      }

      return true;
    });
  }, [items, filterTab, selectedCategory, searchQuery]);

  // Counts for tabs
  const lowStockCount = items.filter((p) => p.stock <= 8 && p.stock > 0).length;
  const soldOutCount = items.filter((p) => p.stock === 0).length;
  const discountedCount = items.filter((p) => p.compareAtPrice && p.compareAtPrice > p.price).length;

  return (
    <div className="space-y-4">
      {statusFeedback && (
        <Alert variant="success" className="py-2.5 animate-in fade-in-50">
          <Sparkles className="h-4 w-4 text-success-600" />
          <AlertDescription className="text-xs font-medium text-success-700 dark:text-success-300">
            {statusFeedback}
          </AlertDescription>
        </Alert>
      )}

      {/* Control Bar: Search & Filter Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 p-3 rounded-2xl border border-border/70 bg-card/60 shadow-unt-xs">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Button
            type="button"
            variant={filterTab === "all" ? "primary" : "secondary-gray"}
            size="sm"
            className="h-8 text-xs px-3 shadow-unt-xs cursor-pointer"
            onClick={() => setFilterTab("all")}
          >
            All Products ({items.length})
          </Button>

          <Button
            type="button"
            variant={filterTab === "discounted" ? "primary" : "secondary-gray"}
            size="sm"
            className="h-8 text-xs px-3 gap-1.5 shadow-unt-xs cursor-pointer"
            onClick={() => setFilterTab("discounted")}
          >
            <Percent className="h-3 w-3 text-amber-500" />
            <span>Discounted ({discountedCount})</span>
          </Button>

          <Button
            type="button"
            variant={filterTab === "low-stock" ? "primary" : "secondary-gray"}
            size="sm"
            className="h-8 text-xs px-3 gap-1.5 shadow-unt-xs cursor-pointer"
            onClick={() => setFilterTab("low-stock")}
          >
            <span className="h-2 w-2 rounded-full bg-warning-500" />
            <span>Low Stock ({lowStockCount})</span>
          </Button>

          <Button
            type="button"
            variant={filterTab === "sold-out" ? "primary" : "secondary-gray"}
            size="sm"
            className="h-8 text-xs px-3 gap-1.5 shadow-unt-xs cursor-pointer"
            onClick={() => setFilterTab("sold-out")}
          >
            <span className="h-2 w-2 rounded-full bg-error-500" />
            <span>Sold Out ({soldOutCount})</span>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {/* Category Quick Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-8 text-xs px-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Search Box */}
          <div className="relative flex-1 md:w-56">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-xs bg-background"
            />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-unt-xs">
        <Table>
          <TableHeader className="bg-muted/40 border-b border-border/70">
            <TableRow>
              <TableHead className="w-[80px]">Product</TableHead>
              <TableHead>Title &amp; Category</TableHead>
              <TableHead>Pricing &amp; Discounts</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Stock Level</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-xs text-muted-foreground">
                  No products found matching the current search or filter.
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => {
                const isEditing = editingId === product.id;
                const isLowStock = product.stock <= 8 && product.stock > 0;
                const isSoldOut = product.stock === 0;
                const hasDiscount =
                  product.compareAtPrice && product.compareAtPrice > product.price;
                const discountPercent = hasDiscount
                  ? Math.round(
                      ((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100
                    )
                  : 0;

                return (
                  <TableRow key={product.id} className="hover:bg-muted/30 transition-colors">
                    {/* Thumbnail */}
                    <TableCell>
                      <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-border/60 bg-muted/40 shadow-unt-xs shrink-0">
                        <TableThumbnail src={product.image} alt={product.name} />
                      </div>
                    </TableCell>

                    {/* Title & Category */}
                    <TableCell>
                      <div className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                        <span>{product.name}</span>
                        {product.featured && (
                          <Badge variant="brand" size="sm" className="text-[9px] py-0 px-1.5 font-normal">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <span className="uppercase font-medium tracking-wider text-primary">
                          {product.categorySlug}
                        </span>
                        {product.tagline && (
                          <>
                            <span>•</span>
                            <span className="truncate max-w-[240px] italic">{product.tagline}</span>
                          </>
                        )}
                      </div>
                    </TableCell>

                    {/* Pricing & Discounts (Active Price + Compare At Strikethrough) */}
                    <TableCell>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground text-sm font-mono">
                            {formatCurrency(product.price)}
                          </span>

                          {hasDiscount && (
                            <span className="text-xs text-muted-foreground line-through font-mono">
                              {formatCurrency(product.compareAtPrice!)}
                            </span>
                          )}
                        </div>

                        {hasDiscount ? (
                          <Badge variant="error" size="sm" className="text-[10px] py-0 px-1.5 gap-1">
                            <TrendingDown className="h-3 w-3" />
                            <span>Save {formatCurrency(product.compareAtPrice! - product.price)} ({discountPercent}% OFF)</span>
                          </Badge>
                        ) : (
                          <span className="text-[10px] text-muted-foreground">
                            Regular Price
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell>
                      {isSoldOut ? (
                        <Badge variant="error" dot size="sm">
                          Sold Out (0)
                        </Badge>
                      ) : isLowStock ? (
                        <Badge variant="warning" dot size="sm">
                          Low Stock ({product.stock})
                        </Badge>
                      ) : (
                        <Badge variant="success" dot size="sm">
                          In Stock ({product.stock})
                        </Badge>
                      )}
                    </TableCell>

                    {/* Stock Level & Quick Adjust */}
                    <TableCell>
                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <Input
                            type="number"
                            min="0"
                            value={stockVal}
                            onChange={(e) =>
                              setStockVal(Math.max(0, parseInt(e.target.value) || 0))
                            }
                            className="w-20 h-8 text-xs bg-background font-mono"
                          />
                          <Button
                            size="sm"
                            variant="primary"
                            className="h-8 px-2.5"
                            disabled={isPending}
                            onClick={() => handleSaveStock(product.id)}
                          >
                            {isPending ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Check className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold tabular-nums font-mono min-w-[50px]">
                            {product.stock} units
                          </span>

                          <button
                            type="button"
                            onClick={() => handleQuickStep(product.id, product.stock, -1)}
                            disabled={isPending || product.stock === 0}
                            title="Decrement stock by 1"
                            className="h-6 w-6 rounded border border-border hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:hover:border-gray-700 text-muted-foreground flex items-center justify-center text-xs cursor-pointer disabled:opacity-40 transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleQuickStep(product.id, product.stock, 5)}
                            disabled={isPending}
                            title="Replenish stock by 5 units"
                            className="h-6 w-7 rounded border border-border hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:hover:border-gray-700 text-muted-foreground flex items-center justify-center text-[10px] font-medium cursor-pointer transition-colors"
                          >
                            +5
                          </button>
                        </div>
                      )}
                    </TableCell>

                    {/* Actions Toolbar */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Edit Full Product Modal */}
                        <EditProductDialog
                          product={product}
                          categories={categories}
                          onUpdated={handleProductUpdated}
                        />

                        {/* Inline Stock Toggle */}
                        {!isEditing ? (
                          <Button
                            variant="tertiary-gray"
                            size="sm"
                            className="h-8 w-8 p-0"
                            title="Inline stock adjustment"
                            onClick={() => startEdit(product)}
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                        ) : null}

                        {/* Delete Piece Button */}
                        <Button
                          variant="tertiary-gray"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-error-600 hover:bg-error-50 dark:hover:bg-error-950/40"
                          title="Delete product from inventory"
                          disabled={isPending}
                          onClick={() => handleDelete(product.id, product.name)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
