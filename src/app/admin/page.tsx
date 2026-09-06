import { redirect } from "next/navigation";
import { dataLayer } from "@/backend/db";
import { getCurrentUserAction } from "@/backend/actions/auth.actions";
import { formatCurrency } from "@/lib/utils";
import { InventoryTable } from "@/ui/features/inventory/components/InventoryTable";
import { AddProductDialog } from "@/ui/features/inventory/components/AddProductDialog";
import { AdminAccessDenied } from "@/ui/features/inventory/components/AdminAccessDenied";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/primitives/card";
import { Badge } from "@/ui/primitives/badge";
import {
  Package,
  Layers,
  AlertTriangle,
  TrendingUp,
  Percent,
  ShieldCheck,
} from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inventory Management | Yuka Trendz",
  description: "Store inventory management, stock controls, and recent customer orders.",
};

export const dynamic = "force-dynamic";

export default async function BoutiqueAdminVaultPage() {
  // 1. Authorize User: Client vs Admin
  const { user } = await getCurrentUserAction();

  if (!user) {
    redirect("/login?redirect=/admin");
  }

  if (user.role !== "admin") {
    return <AdminAccessDenied user={user} />;
  }

  // 2. Fetch Vault Data for Authenticated Admin
  const [products, categories, orders] = await Promise.all([
    dataLayer.getProducts(),
    dataLayer.getCategories(),
    dataLayer.getOrders(),
  ]);

  const totalVaultValue = products.reduce(
    (sum, p) => sum + p.price * p.stock,
    0
  );
  const totalUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStockCount = products.filter((p) => p.stock <= 8).length;
  const discountedCount = products.filter(
    (p) => p.compareAtPrice && p.compareAtPrice > p.price
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-semibold tracking-widest text-primary">
              Admin Portal
            </span>
            <Badge variant="brand" size="sm" dot>
              Inventory Active
            </Badge>
            <Badge variant="gray" size="sm" className="font-mono text-[10px]">
              Admin: {user.name}
            </Badge>
          </div>
          <h1 className="font-sans text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Store Inventory Management
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Real-time stock controls, promotional price discounts, and product details.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <AddProductDialog categories={categories} />
        </div>
      </div>

      {/* Analytics KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Valuation */}
        <Card className="shadow-unt-xs border-border/70 hover:shadow-unt-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Total Stock Value
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-brand-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold font-sans tracking-tight text-foreground">
              {formatCurrency(totalVaultValue)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Active inventory value
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Catalog Count */}
        <Card className="shadow-unt-xs border-border/70 hover:shadow-unt-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold font-sans tracking-tight text-foreground">
              {products.length} Products
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Across {categories.length} categories
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Total Units */}
        <Card className="shadow-unt-xs border-border/70 hover:shadow-unt-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Total Units
            </CardTitle>
            <Layers className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold font-sans tracking-tight text-foreground">
              {totalUnits} Units
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              In active warehouse stock
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Discount Pricing Active */}
        <Card className="shadow-unt-xs border-border/70 hover:shadow-unt-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Active Promos
            </CardTitle>
            <Percent className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold font-sans tracking-tight text-amber-600 dark:text-amber-400">
              {discountedCount} Discounted
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Strikethrough pricing active
            </p>
          </CardContent>
        </Card>

        {/* Card 5: Low Stock Warnings */}
        <Card className="shadow-unt-xs border-border/70 hover:shadow-unt-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Low Stock Alert
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold font-sans tracking-tight text-warning-700 dark:text-warning-300">
              {lowStockCount} Items
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Requires replenishment
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Inventory Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-sans text-xl font-bold tracking-tight text-foreground">
              Product Catalog &amp; Pricing Controls
            </h2>
            <p className="text-xs text-muted-foreground">
              Adjust stock levels, update promotional discounts, or click &apos;Edit&apos; to update product information and images.
            </p>
          </div>
        </div>

        <InventoryTable products={products} categories={categories} />
      </div>

      {/* Recent Orders Section */}
      <div className="space-y-4 pt-6 border-t border-border/60">
        <div>
          <h2 className="font-sans text-xl font-bold tracking-tight text-foreground">
            Recent Customer Orders
          </h2>
          <p className="text-xs text-muted-foreground">
            Orders processed through the store checkout.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders.map((order) => (
            <Card
              key={order.id}
              className="p-5 shadow-unt-xs border-border/70 flex flex-col justify-between space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono text-xs font-bold text-primary">
                    {order.orderNumber}
                  </span>
                  <h4 className="font-medium text-sm text-foreground mt-0.5">
                    {order.customerName}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {order.customerEmail}
                  </p>
                </div>
                <Badge
                  variant={order.status === "fulfilled" ? "success" : "warning"}
                  dot
                  size="sm"
                >
                  {order.status}
                </Badge>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-border/40 text-xs">
                <span className="text-muted-foreground">Settlement:</span>
                <span className="font-bold text-foreground font-mono">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
