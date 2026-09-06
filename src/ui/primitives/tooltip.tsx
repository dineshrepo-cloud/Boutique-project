"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Untitled UI Tooltip Component Specification (Radix-Free)
 */
interface TooltipContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const TooltipContext = React.createContext<TooltipContextType>({
  open: false,
  setOpen: () => {},
});

const TooltipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>{children}</>
);

const Tooltip: React.FC<{
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
}> = ({ children, open: controlledOpen, defaultOpen = false }) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;

  return (
    <TooltipContext.Provider value={{ open, setOpen: setUncontrolledOpen }}>
      <div className="relative inline-flex">{children}</div>
    </TooltipContext.Provider>
  );
};

const TooltipTrigger = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & { asChild?: boolean }
>(({ children, asChild, ...props }, ref) => {
  const { setOpen } = React.useContext(TooltipContext);

  const handleMouseEnter = () => setOpen(true);
  const handleMouseLeave = () => setOpen(false);
  const handleFocus = () => setOpen(true);
  const handleBlur = () => setOpen(false);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      ref,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onFocus: handleFocus,
      onBlur: handleBlur,
      ...props,
    });
  }

  return (
    <span
      ref={ref as any}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    >
      {children}
    </span>
  );
});
TooltipTrigger.displayName = "TooltipTrigger";

const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { sideOffset?: number }
>(({ className, children, ...props }, ref) => {
  const { open } = React.useContext(TooltipContext);

  if (!open) return null;

  return (
    <div
      ref={ref}
      role="tooltip"
      className={cn(
        "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 overflow-hidden rounded-lg bg-gray-900 dark:bg-gray-800 px-3 py-1.5 text-xs font-medium text-white shadow-unt-md border border-gray-800 dark:border-gray-700 animate-in fade-in-0 zoom-in-95 pointer-events-none select-none whitespace-nowrap",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
