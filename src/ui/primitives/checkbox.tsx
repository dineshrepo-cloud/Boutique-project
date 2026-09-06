"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Untitled UI Checkbox Component Specification (Radix-Free)
 */
export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      checked,
      defaultChecked,
      onCheckedChange,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const [isChecked, setIsChecked] = React.useState(defaultChecked ?? false);
    const controlled = checked !== undefined;
    const currentChecked = controlled ? checked : isChecked;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.checked;
      if (!controlled) {
        setIsChecked(next);
      }
      onCheckedChange?.(next);
    };

    return (
      <label
        htmlFor={id}
        className={cn(
          "relative inline-flex items-center justify-center h-4.5 w-4.5 shrink-0 rounded-md border transition-all cursor-pointer select-none",
          currentChecked
            ? "bg-primary border-primary text-primary-foreground"
            : "border-border bg-card hover:border-gray-400",
          disabled && "cursor-not-allowed opacity-50",
          "focus-within:ring-4 focus-within:ring-brand-500/20 shadow-unt-xs",
          className
        )}
      >
        <input
          id={id}
          ref={ref}
          type="checkbox"
          checked={currentChecked}
          disabled={disabled}
          onChange={handleChange}
          className="sr-only"
          {...props}
        />
        {currentChecked && (
          <Check className="h-3.5 w-3.5 stroke-[3] text-primary-foreground pointer-events-none" />
        )}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
