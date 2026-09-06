import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Untitled UI Alert & Notification Component Specification
 * Featuring soft background tint, colored border, and icon alignment.
 */
const alertVariants = cva(
  "relative w-full rounded-xl border p-4 shadow-unt-xs [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4.5",
  {
    variants: {
      variant: {
        default: "bg-card text-foreground border-border [&>svg]:text-foreground",
        destructive:
          "bg-error-50 text-error-700 border-error-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/60 [&>svg]:text-error-600",
        error:
          "bg-error-50 text-error-700 border-error-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/60 [&>svg]:text-error-600",
        brand:
          "bg-brand-50 text-brand-800 border-brand-200 dark:bg-brand-950/40 dark:text-brand-300 dark:border-brand-800/60 [&>svg]:text-brand-600",
        success:
          "bg-success-50 text-success-700 border-success-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60 [&>svg]:text-success-600",
        warning:
          "bg-warning-50 text-warning-700 border-warning-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60 [&>svg]:text-warning-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-semibold text-sm leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed opacity-90", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
