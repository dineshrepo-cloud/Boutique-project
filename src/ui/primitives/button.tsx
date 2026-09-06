import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Clean native Slot helper
 */
const Slot = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ children, className, ...props }, ref) => {
    if (React.isValidElement(children)) {
      const childProps = (children.props || {}) as Record<string, any>;
      return React.cloneElement(children as React.ReactElement<any>, {
        ...props,
        ...childProps,
        className: cn(className, childProps.className),
        ref: ref || (children as any).ref,
      });
    }
    return null;
  }
);
Slot.displayName = "Slot";

/**
 * Untitled UI Button Component Specification
 * Supports Untitled UI hierarchy: Primary, Secondary Gray, Secondary Color,
 * Tertiary Gray, Tertiary Color, Destructive, and Luxury Gold.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer focus:outline-none focus-visible:ring-4",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground border border-primary hover:bg-brand-700 hover:border-brand-700 hover:text-white active:bg-brand-800 shadow-unt-xs focus-visible:ring-brand-500/25 dark:border-brand-600",
        "secondary-gray":
          "bg-card text-foreground border border-border hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300 active:bg-gray-200/80 shadow-unt-xs focus-visible:ring-gray-400/20 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:hover:border-gray-700",
        "secondary-color":
          "bg-brand-50 text-brand-700 border border-brand-200 hover:bg-brand-100 hover:text-brand-800 hover:border-brand-300 active:bg-brand-200 dark:bg-brand-900/30 dark:text-brand-300 dark:border-brand-800/40 dark:hover:bg-brand-900/50 dark:hover:text-brand-200 dark:hover:border-brand-700 focus-visible:ring-brand-500/20",
        "tertiary-gray":
          "text-muted-foreground hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200/80 dark:hover:bg-gray-800 dark:hover:text-gray-100 focus-visible:ring-gray-400/20",
        "tertiary-color":
          "text-brand-700 hover:bg-brand-50 hover:text-brand-800 active:bg-brand-100 dark:text-brand-300 dark:hover:bg-brand-950 dark:hover:text-brand-200 focus-visible:ring-brand-500/20",
        destructive:
          "bg-error-600 text-white border border-error-600 hover:bg-error-700 hover:border-error-700 hover:text-white active:bg-error-800 shadow-unt-xs focus-visible:ring-error-500/20",
        luxury:
          "bg-gradient-to-r from-brand-600 via-brand-500 to-brand-600 text-white border border-brand-400/40 hover:from-brand-500 hover:to-brand-700 active:scale-[0.99] shadow-unt-sm focus-visible:ring-brand-500/30",
        // Backward-compatible aliases
        default:
          "bg-primary text-primary-foreground border border-primary hover:bg-brand-700 hover:border-brand-700 hover:text-white shadow-unt-xs focus-visible:ring-brand-500/25 dark:border-brand-600",
        outline:
          "bg-card text-foreground border border-border hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300 active:bg-gray-200/80 shadow-unt-xs focus-visible:ring-gray-400/20 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:hover:border-gray-700",
        secondary:
          "bg-card text-foreground border border-border hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300 active:bg-gray-200/80 shadow-unt-xs focus-visible:ring-gray-400/20 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:hover:border-gray-700",
        ghost:
          "text-muted-foreground hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200/80 dark:hover:bg-gray-800 dark:hover:text-gray-100 focus-visible:ring-gray-400/20",
        link:
          "text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 underline-offset-4 hover:underline p-0 h-auto font-semibold focus-visible:ring-0",
      },
      size: {
        sm: "h-9 px-3.5 text-xs rounded-md",
        default: "h-10 px-4 text-sm rounded-lg",
        md: "h-10 px-4 text-sm rounded-lg",
        lg: "h-11 px-4.5 text-sm rounded-lg font-semibold",
        xl: "h-12 px-5 text-base rounded-xl font-semibold",
        icon: "h-9 w-9 rounded-lg p-0",
        "icon-sm": "h-8 w-8 rounded-md p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
