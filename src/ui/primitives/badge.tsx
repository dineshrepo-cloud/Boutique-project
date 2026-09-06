import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Untitled UI Badge Component Specification
 * Supports Pill Badges and Modern Badges with inset rings and indicator dots.
 */
const badgeVariants = cva(
  "inline-flex items-center gap-1.5 font-medium transition-colors select-none",
  {
    variants: {
      variant: {
        brand:
          "bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-200 dark:bg-brand-900/30 dark:text-brand-300 dark:ring-brand-800/50",
        gray:
          "bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700",
        success:
          "bg-success-50 text-success-700 ring-1 ring-inset ring-success-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-800/50",
        warning:
          "bg-warning-50 text-warning-700 ring-1 ring-inset ring-warning-200 dark:bg-amber-950/50 dark:text-amber-300 dark:ring-amber-800/50",
        error:
          "bg-error-50 text-error-700 ring-1 ring-inset ring-error-200 dark:bg-red-950/50 dark:text-red-300 dark:ring-red-800/50",
        gold:
          "bg-brand-50 text-brand-800 ring-1 ring-inset ring-brand-300 dark:bg-brand-900/40 dark:text-brand-200 dark:ring-brand-700/60",
        // Backward-compatible aliases
        default:
          "bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-200 dark:bg-brand-900/30 dark:text-brand-300 dark:ring-brand-800/50",
        secondary:
          "bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700",
        destructive:
          "bg-error-50 text-error-700 ring-1 ring-inset ring-error-200 dark:bg-red-950/50 dark:text-red-300 dark:ring-red-800/50",
        outline:
          "bg-transparent text-foreground ring-1 ring-inset ring-border",
        emerald:
          "bg-success-50 text-success-700 ring-1 ring-inset ring-success-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-800/50",
      },
      size: {
        sm: "px-2 py-0.5 text-xs rounded-full",
        default: "px-2.5 py-0.5 text-xs rounded-full",
        md: "px-2.5 py-0.5 text-xs rounded-full",
        lg: "px-3 py-1 text-sm rounded-full",
        square: "px-2 py-0.5 text-xs rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, size, dot, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            variant === "success" || variant === "emerald"
              ? "bg-success-500"
              : variant === "error" || variant === "destructive"
              ? "bg-error-500"
              : variant === "warning"
              ? "bg-warning-500"
              : variant === "gold"
              ? "bg-brand-500"
              : "bg-brand-600"
          )}
        />
      )}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
