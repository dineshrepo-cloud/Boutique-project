"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowLeft, KeyRound, Loader2, Sparkles, LogOut } from "lucide-react";
import { SafeUser } from "@/backend/actions/auth.actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/ui/primitives/card";
import { Badge } from "@/ui/primitives/badge";
import { Button } from "@/ui/primitives/button";
import { useAuth } from "@/ui/features/auth/context/AuthContext";

interface AdminAccessDeniedProps {
  user: SafeUser;
}

export function AdminAccessDenied({ user }: AdminAccessDeniedProps) {
  const router = useRouter();
  const { signIn, signOut } = useAuth();
  const [isSwitching, startSwitching] = useTransition();
  const [switchError, setSwitchError] = useState<string | null>(null);

  const handleQuickSwitchToAdmin = () => {
    setSwitchError(null);
    startSwitching(async () => {
      const res = await signIn("curator@yukatrendz.com", "admin123");
      if (res.success) {
        router.refresh();
      } else {
        setSwitchError(res.error || "Failed to switch to Curator Admin account.");
      }
    });
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <Card className="w-full max-w-lg shadow-unt-xl border-border/80 bg-card overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-error-500/10 dark:bg-error-950/30 border-b border-error-500/20 p-6 sm:p-8 text-center">
          <div className="h-14 w-14 rounded-2xl bg-error-500/15 text-error-600 dark:text-error-400 flex items-center justify-center mx-auto mb-4 border border-error-500/20 shadow-unt-xs">
            <ShieldAlert className="h-7 w-7" />
          </div>

          <Badge variant="error" size="sm" className="mb-2 uppercase tracking-widest font-mono text-[10px]">
            <ShieldAlert className="h-4 w-4 mr-1" />
            Access Restricted
          </Badge>

          <CardTitle className="font-sans text-2xl font-bold tracking-tight text-foreground">
            Admin Access Required
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-1.5 max-w-sm mx-auto leading-relaxed">
            The store inventory management portal and product controls are restricted to administrators.
          </CardDescription>
        </div>

        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Current User Session Status Card */}
          <div className="p-4 rounded-xl border border-border/70 bg-muted/30 space-y-2">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block">
              Your Current Account
            </span>

            <div className="flex items-center justify-between gap-3">
              <div className="truncate">
                <div className="font-semibold text-sm text-foreground truncate">
                  {user.name}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {user.email}
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0 gap-1">
                <Badge variant="gray" size="sm" className="capitalize text-[10px]">
                  Role: {user.role}
                </Badge>
                <span className="text-[10px] text-muted-foreground font-mono">
                  Tier: {user.tier}
                </span>
              </div>
            </div>
          </div>

          {switchError && (
            <div className="p-3 rounded-lg bg-error-50 dark:bg-error-950/50 border border-error-200 dark:border-error-900 text-xs text-error-700 dark:text-error-300">
              {switchError}
            </div>
          )}

          {/* Quick-Switch Demo Admin Access */}
          <div className="p-4 rounded-xl border border-brand-500/30 bg-brand-50/40 dark:bg-brand-950/20 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <KeyRound className="h-4 w-4 text-brand-600" />
              <span>Demo Admin Access</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Admin access is enabled for <strong className="text-foreground">curator@yukatrendz.com</strong>. You can switch to this account below to manage inventory and pricing.
            </p>

            <Button
              variant="primary"
              size="sm"
              className="w-full h-9 text-xs shadow-unt-xs gap-2"
              onClick={handleQuickSwitchToAdmin}
              disabled={isSwitching}
            >
              {isSwitching ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Signing in as Admin...</span>
                </>
              ) : (
                <>
                  <KeyRound className="h-3.5 w-3.5" />
                  <span>Switch to Admin Account</span>
                </>
              )}
            </Button>
          </div>

          {/* Fallback Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Button
              variant="secondary-gray"
              size="sm"
              className="w-full sm:flex-1 h-9 text-xs gap-1.5"
              asChild
            >
              <Link href="/">
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Return to Storefront</span>
              </Link>
            </Button>

            <Button
              variant="tertiary-gray"
              size="sm"
              className="w-full sm:flex-1 h-9 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
              onClick={() => {
                signOut();
                router.push("/login?redirect=/admin");
              }}
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign In with Different ID</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
