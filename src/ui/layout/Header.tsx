"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  ShoppingBag,
  Search,
  Menu,
  MapPin,
  ChevronDown,
  User as UserIcon,
  LogOut,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useCart } from "@/ui/features/cart/context/CartContext";
import { useAuth } from "@/ui/features/auth/context/AuthContext";
import { Button } from "@/ui/primitives/button";
import { Badge } from "@/ui/primitives/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/ui/primitives/dropdown-menu";
import { formatCurrency } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { CartDrawer } from "@/ui/features/cart/components/CartDrawer";
import { DeliveryModal } from "./DeliveryModal";
import { DepartmentsDrawer } from "./DepartmentsDrawer";

export function BoutiqueHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount, subtotal, setIsOpen } = useCart();
  const { user, signOut } = useAuth();

  // Modals & Drawers State
  const [deliveryOpen, setDeliveryOpen] = React.useState(false);
  const [departmentsOpen, setDepartmentsOpen] = React.useState(false);

  // Delivery destination state
  const [deliveryLocation, setDeliveryLocation] = React.useState("Mumbai (400001)");

  // Search state
  const [searchCategory, setSearchCategory] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (searchCategory !== "all") params.set("category", searchCategory);
    router.push(`/products?${params.toString()}`);
  };

  const navCategories = [
    { label: "All Collections", href: "/products" },
    { label: "Timepieces", href: "/products?category=timepieces" },
    { label: "Leather Goods", href: "/products?category=leather-goods" },
    { label: "Rare Perfumery", href: "/products?category=fragrance" },
    { label: "Silk Atelier", href: "/products?category=apparel" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-card/95 backdrop-blur-md shadow-unt-xs transition-all">
        {/* Main Tier Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4 lg:gap-8">
          {/* Mobile Drawer Toggle */}
          <div className="flex items-center lg:hidden">
            <Button
              variant="tertiary-gray"
              size="icon"
              className="h-9 w-9"
              onClick={() => setDepartmentsOpen(true)}
              aria-label="Open categories menu"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </Button>
          </div>

          {/* Logo Brand Mark */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group" aria-label="Yuka Trendz Home">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-brand-600 via-brand-500 to-amber-600 text-white flex items-center justify-center font-sans font-bold text-lg shadow-unt-xs group-hover:scale-105 transition-transform" aria-hidden="true">
              Y
            </div>
            <div>
              <span className="font-sans text-lg tracking-tight font-bold text-foreground leading-tight block">
                YUKA
              </span>
              <span className="text-[9px] block tracking-[0.25em] text-brand-600 uppercase font-sans font-semibold -mt-0.5">
                TRENDZ
              </span>
            </div>
          </Link>

          {/* "Deliver to" Pill */}
          <button
            type="button"
            onClick={() => setDeliveryOpen(true)}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border/80 hover:border-gray-300 hover:bg-gray-100 dark:hover:border-gray-700 dark:hover:bg-gray-800 transition-all text-left cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20"
            aria-label={`Deliver to ${deliveryLocation}. Click to change delivery location`}
          >
            <MapPin className="h-4 w-4 text-brand-600 shrink-0" aria-hidden="true" />
            <div className="leading-tight">
              <span className="text-[10px] text-muted-foreground block font-normal">
                Deliver to
              </span>
              <span className="text-xs font-semibold text-foreground truncate max-w-[120px] block">
                {deliveryLocation}
              </span>
            </div>
          </button>

          {/* Central Search Engine */}
          <form
            role="search"
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-xl flex items-center h-10 rounded-xl border border-border/80 bg-background shadow-unt-xs focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/20 transition-all overflow-hidden"
          >
            {/* Category Dropdown */}
            <label htmlFor="header-search-category" className="sr-only">
              Filter search by category
            </label>
            <select
              id="header-search-category"
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              aria-label="Filter search by category"
              className="hidden sm:block h-full bg-muted/50 text-xs font-medium text-muted-foreground px-3 border-r border-border/70 focus:outline-none cursor-pointer hover:text-foreground"
            >
              <option value="all">All Categories</option>
              <option value="timepieces">Timepieces</option>
              <option value="leather-goods">Leather Goods</option>
              <option value="fragrance">Perfumery</option>
              <option value="apparel">Silk Tailoring</option>
            </select>

            {/* Keyword Input */}
            <label htmlFor="header-search-input" className="sr-only">
              Search products by keyword
            </label>
            <input
              id="header-search-input"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search timepieces, leather goods, perfumes..."
              aria-label="Search catalog"
              className="flex-1 h-full px-3.5 text-xs sm:text-sm bg-transparent placeholder:text-muted-foreground text-foreground focus:outline-none"
            />

            {/* Submit Action */}
            <button
              type="submit"
              className="h-full px-4 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
              aria-label="Submit product search"
            >
              <Search className="h-4 w-4 stroke-[2.5]" aria-hidden="true" />
            </button>
          </form>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* User Profile Dropdown or Sign In CTA */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl border border-border/80 hover:border-gray-300 hover:bg-gray-100 dark:hover:border-gray-700 dark:hover:bg-gray-800 transition-all text-left cursor-pointer shrink-0 shadow-unt-xs focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20"
                    aria-label={`User account menu for ${user.name}`}
                  >
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-brand-600 to-amber-600 text-white font-bold text-xs flex items-center justify-center shadow-xs overflow-hidden shrink-0">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt=""
                          aria-hidden="true"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        user.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="hidden lg:flex flex-col leading-tight">
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <span>Hello,</span>
                        <span className="font-semibold text-foreground truncate max-w-[85px]">
                          {user.name.split(" ")[0]}
                        </span>
                      </span>
                      <span className="text-[11px] font-bold text-brand-600 flex items-center gap-0.5">
                        {user.role === "admin" ? "Admin" : user.tier}
                        <ChevronDown className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                      </span>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 p-1.5">
                  <DropdownMenuLabel className="px-2.5 py-2">
                    <div className="font-semibold text-foreground text-xs">{user.name}</div>
                    <div className="text-[10px] text-muted-foreground truncate">{user.email}</div>
                    <Badge variant="brand" size="sm" className="mt-1 text-[9px] py-0 px-1.5">
                      {user.role === "admin" ? "Administrator" : `${user.tier} Member`}
                    </Badge>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.role === "admin" && (
                    <DropdownMenuItem
                      onClick={() => router.push("/admin")}
                      className="w-full flex items-center gap-2 text-xs py-1.5 px-2.5 cursor-pointer font-medium text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-950/30 mb-1 rounded-md"
                    >
                      <ShieldCheck className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
                      <span>Admin Dashboard</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => router.push("/profile")}
                    className="flex items-center gap-2 text-xs py-1.5 px-2.5 cursor-pointer font-medium"
                  >
                    <UserIcon className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
                    <span>My Profile & Details</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/checkout")}
                    className="flex items-center gap-2 text-xs py-1.5 px-2.5 cursor-pointer"
                  >
                    <Truck className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
                    <span>Checkout & Payment</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="flex items-center gap-2 text-xs py-1.5 px-2.5 text-error-600 hover:text-error-700 hover:bg-error-50 dark:hover:bg-error-950/30 cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="secondary-gray"
                size="sm"
                asChild
                className="h-9 px-3.5 rounded-xl gap-2 shadow-unt-xs text-xs font-semibold"
              >
                <Link href="/login" aria-label="Sign In to your account">
                  <UserIcon className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
                  <span>Sign In</span>
                </Link>
              </Button>
            )}

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Visual Cart with Subtotal */}
            <Button
              variant="primary"
              size="sm"
              className="h-10 px-3.5 rounded-xl gap-2.5 shadow-unt-xs"
              onClick={() => setIsOpen(true)}
              aria-label={`Shopping cart with ${itemCount} ${itemCount === 1 ? "item" : "items"}, total amount ${formatCurrency(subtotal)}`}
            >
              <div className="relative" aria-hidden="true">
                <ShoppingBag className="h-4 w-4" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 h-4 min-w-[16px] px-1 bg-amber-400 text-neutral-950 font-bold text-[9px] rounded-full flex items-center justify-center shadow-xs">
                    {itemCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-tight" aria-hidden="true">
                <span className="text-[9px] font-normal opacity-90">Cart Total</span>
                <span className="text-xs font-bold whitespace-nowrap">
                  {formatCurrency(subtotal)}
                </span>
              </div>
            </Button>
          </div>
        </div>

        {/* Tier 2: Category Navigation Strip */}
        <div className="border-t border-border/50 bg-muted/30 text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto scrollbar-none py-2 gap-4">
            <nav aria-label="Product categories navigation" className="flex items-center space-x-1 shrink-0">
              {navCategories.map((cat) => {
                const isActive = pathname === cat.href;
                return (
                  <Link
                    key={cat.label}
                    href={cat.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                      isActive
                        ? "bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300 font-semibold"
                        : "text-muted-foreground hover:text-gray-900 hover:bg-gray-100 dark:hover:text-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {cat.label}
                  </Link>
                );
              })}
            </nav>

            {/* White-Glove Logistics Reassurance */}
            <div className="hidden md:flex items-center gap-2 shrink-0 text-[11px] text-muted-foreground font-medium" aria-label="Free Delivery benefit: Orders over ₹2,000 qualify for free express delivery">
              <Truck className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
              <span>Free Delivery on Orders Over {formatCurrency(2000)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Delivery Destination Modal */}
      <DeliveryModal
        isOpen={deliveryOpen}
        onClose={() => setDeliveryOpen(false)}
        currentLocation={deliveryLocation}
        onSelectLocation={(loc) => setDeliveryLocation(loc)}
      />

      {/* Mobile Departments Drawer */}
      <DepartmentsDrawer
        isOpen={departmentsOpen}
        onClose={() => setDepartmentsOpen(false)}
      />
    </>
  );
}

export const Header = BoutiqueHeader;

