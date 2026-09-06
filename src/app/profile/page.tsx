import React, { Suspense } from "react";
import { Metadata } from "next";
import { ProfileForm } from "@/ui/features/profile/components/ProfileForm";

export const metadata: Metadata = {
  title: "My Profile & Delivery Vault | Yuka Trendz",
  description:
    "Manage your personal identity, contact details, and white-glove courier delivery address with seamless Google OAuth and credentials synchronization.",
};

export default function ProfilePage() {
  return (
    <div className="min-h-[85vh] py-10 sm:py-16 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      {/* Background Decorative Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-b from-brand-500/10 via-amber-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <Suspense
        fallback={
          <div className="max-w-2xl mx-auto p-12 text-center text-xs text-muted-foreground">
            Loading your profile vault...
          </div>
        }
      >
        <ProfileForm />
      </Suspense>
    </div>
  );
}
