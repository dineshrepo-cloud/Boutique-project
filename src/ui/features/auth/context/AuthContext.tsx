"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import {
  SafeUser,
  signInWithCredentialsAction,
  signUpWithCredentialsAction,
  signInWithGoogleAction,
  signOutAction,
  getCurrentUserAction,
  updateUserProfileAction,
  UpdateProfileInput,
} from "@/backend/actions/auth.actions";

interface AuthContextType {
  user: SafeUser | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: (profile?: { name?: string; email?: string; avatarUrl?: string }) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (data: UpdateProfileInput) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  const refreshUser = useCallback(async () => {
    try {
      // Primary: Call server action
      const res = await getCurrentUserAction();
      if (res?.user) {
        setUser(res.user);
        return;
      }

      // Secondary fallback: Query /api/auth/me REST endpoint
      const meRes = await fetch("/api/auth/me", { cache: "no-store" });
      const meData = await meRes.json();
      if (meData?.authenticated && meData.user) {
        setUser(meData.user);
        return;
      }

      setUser(null);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Re-sync user session whenever the route/pathname changes
  useEffect(() => {
    refreshUser();
  }, [pathname, refreshUser]);

  // Re-sync session when tab/window regains focus
  useEffect(() => {
    const handleFocus = () => refreshUser();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [refreshUser]);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await signInWithCredentialsAction({ email, password });
      if (res.success && res.user) {
        setUser(res.user);
        return { success: true };
      }
      return { success: false, error: res.error || "Failed to sign in." };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await signUpWithCredentialsAction({ name, email, password });
      if (res.success && res.user) {
        setUser(res.user);
        return { success: true };
      }
      return { success: false, error: res.error || "Failed to create account." };
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async (profile?: { name?: string; email?: string; avatarUrl?: string }) => {
    setIsLoading(true);
    try {
      const res = await signInWithGoogleAction(profile);
      if (res.success && res.user) {
        setUser(res.user);
        return { success: true };
      }
      return { success: false, error: res.error || "Google sign-in failed." };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await signOutAction();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: UpdateProfileInput) => {
    setIsLoading(true);
    try {
      const res = await updateUserProfileAction(data);
      if (res.success && res.user) {
        setUser(res.user);
        return { success: true };
      }
      return { success: false, error: res.error || "Failed to update profile." };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        refreshUser,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
