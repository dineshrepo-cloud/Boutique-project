"use client";

import * as React from "react";
import { MapPin, Check, Globe } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/ui/primitives/dialog";
import { Button } from "@/ui/primitives/button";
import { Input } from "@/ui/primitives/input";
import { Badge } from "@/ui/primitives/badge";

interface DeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: string;
  onSelectLocation: (location: string) => void;
}

const LUXURY_HUBS = [
  { city: "Mumbai", country: "India", postal: "400001", note: "BKC & South Mumbai Armored Express" },
  { city: "New Delhi", country: "India", postal: "110001", note: "Lutyens & Chanakyapuri White-Glove" },
  { city: "Bengaluru", country: "India", postal: "560001", note: "UB City Private Handover" },
  { city: "Geneva", country: "Switzerland", postal: "1204", note: "Atelier Vault Priority" },
  { city: "London", country: "United Kingdom", postal: "W1S", note: "Mayfair Private Handover" },
  { city: "Dubai", country: "UAE", postal: "DIFC", note: "Emirates Armored Transit" },
];

export function DeliveryModal({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
}: DeliveryModalProps) {
  const [customZip, setCustomZip] = React.useState("");

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customZip.trim()) {
      onSelectLocation(`Postal Code: ${customZip.trim()}`);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader className="space-y-1 text-left">
          <div className="flex items-center gap-2 text-brand-600 mb-1">
            <MapPin className="h-5 w-5" />
            <Badge variant="brand" size="sm">Express Delivery</Badge>
          </div>
          <DialogTitle className="font-sans text-xl font-bold tracking-tight text-foreground">
            Select Delivery Location
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Select your city to view estimated delivery schedules and local express courier availability.
          </DialogDescription>
        </DialogHeader>

        {/* Global Delivery Hubs */}
        <div className="space-y-2 mt-4">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground block">
            Major Delivery Cities
          </span>
          <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto pr-1">
            {LUXURY_HUBS.map((hub) => {
              const label = `${hub.city} (${hub.postal})`;
              const isSelected = currentLocation.includes(hub.city);

              return (
                <button
                  key={hub.city}
                  type="button"
                  onClick={() => {
                    onSelectLocation(label);
                    onClose();
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                    isSelected
                      ? "border-primary bg-primary/5 text-foreground font-semibold shadow-unt-xs"
                      : "border-border/70 bg-card/60 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Globe className="h-4 w-4 text-brand-600 shrink-0" />
                    <div>
                      <span className="font-medium block text-foreground">
                        {hub.city}, {hub.country}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-normal">
                        {hub.note}
                      </span>
                    </div>
                  </div>
                  {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Postal Code Form */}
        <form onSubmit={handleCustomSubmit} className="mt-4 pt-4 border-t border-border/60">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground block mb-2">
            Or Enter Global Postal Code
          </span>
          <div className="flex gap-2">
            <Input
              placeholder="e.g. 90210 or SW1A 1AA"
              value={customZip}
              onChange={(e) => setCustomZip(e.target.value)}
              className="text-xs font-mono uppercase"
            />
            <Button type="submit" variant="primary" size="sm" className="shrink-0 text-xs">
              Apply
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
