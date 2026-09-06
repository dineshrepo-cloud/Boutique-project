"use client";

import * as React from "react";
import Link from "next/link";
import {
  Watch,
  Briefcase,
  Sparkles,
  Flame,
  Award,
  HelpCircle,
  ChevronRight,
  ShieldCheck,
  Gift,
  Compass,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/ui/primitives/sheet";
import { Badge } from "@/ui/primitives/badge";
import { Separator } from "@/ui/primitives/separator";

interface DepartmentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DepartmentsDrawer({ isOpen, onClose }: DepartmentsDrawerProps) {
  const departments = [
    {
      title: "Product Categories",
      items: [
        { label: "Luxury Watches & Timepieces", href: "/products?category=timepieces", icon: Watch, badge: "Popular" },
        { label: "Leather Bags & Accessories", href: "/products?category=leather-goods", icon: Briefcase },
        { label: "Perfumes & Fragrances", href: "/products?category=fragrance", icon: Sparkles },
        { label: "Silk & Designer Apparel", href: "/products?category=apparel", icon: Compass },
      ],
    },
    {
      title: "Featured & Deals",
      items: [
        { label: "Today's Top Offers", href: "/products", icon: Flame, badge: "Offers" },
        { label: "All Luxury Products", href: "/products", icon: Award },
        { label: "Gift Ideas & Sets", href: "/products", icon: Gift },
      ],
    },
    {
      title: "Customer Support & Services",
      items: [
        { label: "Fast & Insured Delivery", href: "/#shipping", icon: ShieldCheck },
        { label: "100% Genuine Authenticity", href: "/#authenticity", icon: ShieldCheck },
        { label: "Admin Inventory Dashboard", href: "/admin", icon: HelpCircle },
      ],
    },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="left" className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-6 bg-muted/60 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 text-white flex items-center justify-center font-sans font-bold text-lg shadow-unt-xs">
              Y
            </div>
            <div>
              <span className="text-xs uppercase font-medium text-muted-foreground tracking-wider block">
                Store Directory
              </span>
              <SheetTitle className="font-sans text-xl font-bold tracking-tight text-foreground">
                All Departments &amp; Categories
              </SheetTitle>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-border/40">
          {departments.map((dept, idx) => (
            <div key={idx} className="py-4 first:pt-1 last:pb-4 space-y-2">
              <span className="text-[11px] uppercase font-semibold tracking-wider text-muted-foreground block px-2">
                {dept.title}
              </span>
              <div className="space-y-1">
                {dept.items.map((item, iIdx) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={iIdx}
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center justify-between p-2.5 rounded-lg text-xs font-medium text-foreground hover:bg-muted/80 hover:text-primary transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4 text-brand-600 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.badge && (
                          <Badge variant="brand" size="sm">
                            {item.badge}
                          </Badge>
                        )}
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-muted/30 border-t border-border/60 text-[11px] text-muted-foreground text-center">
          Yuka Trendz Store • 100% Genuine &amp; Authentic Guarantee
        </div>
      </SheetContent>
    </Sheet>
  );
}
