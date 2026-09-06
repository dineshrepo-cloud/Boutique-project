"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Untitled UI Select Component Specification (Radix-Free)
 */
interface SelectContextType {
  value: string;
  onValueChange: (val: string) => void;
  open: boolean;
  setOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  displayMap: Record<string, React.ReactNode>;
  registerOption: (val: string, label: React.ReactNode) => void;
  name?: string;
  required?: boolean;
}

const SelectContext = React.createContext<SelectContextType | null>(null);

export interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  required?: boolean;
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({
  value: controlledValue,
  defaultValue = "",
  onValueChange,
  name,
  required,
  children,
}) => {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const [open, setOpen] = React.useState(false);
  const [displayMap, setDisplayMap] = React.useState<Record<string, React.ReactNode>>({});

  const value = controlledValue !== undefined ? controlledValue : uncontrolledValue;

  const onValueChangeInternal = React.useCallback(
    (nextVal: string) => {
      if (controlledValue === undefined) {
        setUncontrolledValue(nextVal);
      }
      onValueChange?.(nextVal);
      setOpen(false);
    },
    [controlledValue, onValueChange]
  );

  const registerOption = React.useCallback((val: string, label: React.ReactNode) => {
    setDisplayMap((prev) => (prev[val] === label ? prev : { ...prev, [val]: label }));
  }, []);

  // Close dropdown on click outside
  const selectRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <SelectContext.Provider
      value={{
        value,
        onValueChange: onValueChangeInternal,
        open,
        setOpen,
        displayMap,
        registerOption,
        name,
        required,
      }}
    >
      <div ref={selectRef} className="relative inline-block w-full">
        {name && <input type="hidden" name={name} value={value} required={required} />}
        {children}
      </div>
    </SelectContext.Provider>
  );
};

const SelectGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-1", className)} {...props} />
));
SelectGroup.displayName = "SelectGroup";

const SelectValue: React.FC<{ placeholder?: string; className?: string }> = ({
  placeholder = "Select an option",
  className,
}) => {
  const ctx = React.useContext(SelectContext);
  const text =
    ctx && ctx.value ? ctx.displayMap[ctx.value] || ctx.value : placeholder;
  return <span className={cn("truncate", className)}>{text}</span>;
};

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const ctx = React.useContext(SelectContext);
  return (
    <button
      ref={ref}
      type="button"
      onClick={() => ctx?.setOpen((prev) => !prev)}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-lg border border-border bg-card px-3.5 py-2 text-sm text-foreground shadow-unt-xs transition-all placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer select-none",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown
        className={cn(
          "h-4 w-4 opacity-60 transition-transform",
          ctx?.open && "rotate-180"
        )}
      />
    </button>
  );
});
SelectTrigger.displayName = "SelectTrigger";

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const ctx = React.useContext(SelectContext);
  if (!ctx?.open) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "absolute top-full left-0 mt-1.5 z-50 max-h-60 w-full min-w-[8rem] overflow-y-auto rounded-xl border border-border bg-card text-card-foreground shadow-unt-lg animate-in fade-in-80 zoom-in-95 p-1.5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, children, value, ...props }, ref) => {
  const ctx = React.useContext(SelectContext);
  const isSelected = ctx?.value === value;

  React.useEffect(() => {
    ctx?.registerOption(value, children);
  }, [value, children, ctx]);

  return (
    <div
      ref={ref}
      role="option"
      aria-selected={isSelected}
      onClick={() => ctx?.onValueChange(value)}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-lg py-2 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100 text-foreground",
        isSelected && "font-semibold bg-gray-100 dark:bg-gray-800",
        className
      )}
      {...props}
    >
      <span className="absolute left-2.5 flex h-3.5 w-3.5 items-center justify-center">
        {isSelected && <Check className="h-4 w-4 text-primary" />}
      </span>
      {children}
    </div>
  );
});
SelectItem.displayName = "SelectItem";

const SelectLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "py-1.5 pl-8 pr-2 text-xs font-semibold text-muted-foreground",
      className
    )}
    {...props}
  />
));
SelectLabel.displayName = "SelectLabel";

const SelectSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
));
SelectSeparator.displayName = "SelectSeparator";

const SelectScrollUpButton = () => null;
const SelectScrollDownButton = () => null;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
