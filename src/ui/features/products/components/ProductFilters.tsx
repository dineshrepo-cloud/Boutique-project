"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Category } from "@/backend/db/schema";
import { Button } from "@/ui/primitives/button";
import { Input } from "@/ui/primitives/input";
import { Badge } from "@/ui/primitives/badge";
import { Search, RotateCcw } from "lucide-react";
import { useState, useTransition } from "react";

interface ProductFiltersProps {
  categories: Category[];
  totalCount: number;
}

export function ProductFilters({ categories, totalCount }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentCategory = searchParams.get("category") || "all";
  const currentSearch = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(currentSearch);

  const applyFilter = (category: string, search: string) => {
    startTransition(() => {
      const params = new URLSearchParams();
      if (category && category !== "all") params.set("category", category);
      if (search) params.set("search", search);
      const query = params.toString();
      router.push(`/products${query ? `?${query}` : ""}`);
    });
  };

  const handleCategorySelect = (categorySlug: string) => {
    applyFilter(categorySlug, searchInput);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilter(currentCategory, searchInput);
  };

  const handleReset = () => {
    setSearchInput("");
    startTransition(() => {
      router.push("/products");
    });
  };

  const hasFilters = currentCategory !== "all" || Boolean(currentSearch);

  return (
    <div className="space-y-5 mb-8">
      {/* Search and Quick Filters bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        <form
          role="search"
          onSubmit={handleSearchSubmit}
          className="relative flex-1 max-w-md flex items-center"
        >
          <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <label htmlFor="catalog-search-input" className="sr-only">
            Search products catalog
          </label>
          <Input
            id="catalog-search-input"
            type="search"
            placeholder="Search by collection, gemstone, or fragrance note..."
            aria-label="Search by collection, gemstone, or fragrance note"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10 pr-4"
          />
        </form>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {hasFilters && (
            <Button
              variant="tertiary-gray"
              size="sm"
              onClick={handleReset}
              className="gap-1.5"
              aria-label="Reset all catalog filters"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Reset Filters
            </Button>
          )}
          <div role="status" aria-live="polite">
            <Badge variant="gray" size="md">
              {totalCount} {totalCount === 1 ? "product" : "products"} available
            </Badge>
          </div>
        </div>
      </div>

      {/* Category Pills using Untitled UI Button Group / Filter Pills */}
      <div
        role="group"
        aria-label="Filter products by category"
        className="flex flex-wrap gap-2 pt-2 border-t border-border/50"
      >
        <Button
          size="sm"
          variant={currentCategory === "all" ? "primary" : "secondary-gray"}
          className="rounded-full"
          onClick={() => handleCategorySelect("all")}
          disabled={isPending}
          aria-pressed={currentCategory === "all"}
        >
          All Collections
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.id}
            size="sm"
            variant={currentCategory === cat.slug ? "primary" : "secondary-gray"}
            className="rounded-full"
            onClick={() => handleCategorySelect(cat.slug)}
            disabled={isPending}
            aria-pressed={currentCategory === cat.slug}
          >
            {cat.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
