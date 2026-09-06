"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/ui/primitives/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="tertiary-gray" size="icon" className="h-9 w-9 opacity-70">
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="tertiary-gray"
      size="icon"
      className="h-9 w-9 rounded-full hover:bg-muted"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      title="Toggle Light / Dark mode"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-amber-400 transition-all" />
      ) : (
        <Moon className="h-4 w-4 text-slate-700 transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
