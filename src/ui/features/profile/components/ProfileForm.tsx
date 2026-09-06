"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Globe,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Save,
  Truck,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/ui/features/auth/context/AuthContext";
import { Button } from "@/ui/primitives/button";
import { Input } from "@/ui/primitives/input";
import { Label } from "@/ui/primitives/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/ui/primitives/card";
import { Badge } from "@/ui/primitives/badge";
import { Alert, AlertDescription } from "@/ui/primitives/alert";

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" {...props}>
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.37 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

export function ProfileForm() {
  const router = useRouter();
  const { user, isLoading, updateProfile, signOut } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Profile state autofilled from user session
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [phone, setPhone] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("India");

  // Autofill form when authenticated user session is loaded
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setAvatarUrl(user.avatarUrl || "");
      setPhone(user.phone || "");
      setStreetAddress(user.streetAddress || "");
      setCity(user.city || "");
      setState(user.state || "");
      setPostalCode(user.postalCode || "");
      setCountry(user.country || "India");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      const res = await updateProfile({
        name,
        phone,
        streetAddress,
        city,
        state,
        postalCode,
        country,
        avatarUrl,
      });

      if (res.success) {
        setSuccessMsg("Your profile and delivery details have been saved to your vault.");
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setErrorMsg(res.error || "Failed to update profile details.");
      }
    } catch {
      setErrorMsg("An unexpected error occurred while saving your profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-12 text-center text-xs text-muted-foreground animate-pulse">
        Accessing your sovereign vault profile...
      </div>
    );
  }

  if (!user) {
    return (
      <Card className="max-w-md mx-auto p-6 sm:p-8 text-center space-y-4 shadow-unt-md border-border/80">
        <div className="h-14 w-14 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 mx-auto flex items-center justify-center">
          <User className="h-7 w-7" />
        </div>
        <div>
          <Badge variant="brand" size="sm" className="mb-2">
            Authentication Required
          </Badge>
          <h3 className="font-sans text-xl font-bold tracking-tight text-foreground">
            Sign In to Access Your Profile
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Sign in with Google OAuth or your account credentials to view and manage your saved details.
          </p>
        </div>
        <div className="pt-3">
          <Button
            variant="primary"
            className="w-full gap-2 shadow-unt-xs"
            onClick={() => router.push("/login?redirect=/profile")}
          >
            <span>Proceed to Sign In</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    );
  }

  const isGoogleUser = user.provider === "google";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Return to Hub */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Return to Boutique Hub</span>
        </Link>

        <div className="flex items-center gap-2">
          <Badge variant="gray" size="sm" className="text-[10px]">
            Member ID: #{user.id.toString().padStart(4, "0")}
          </Badge>
          <Button
            variant="tertiary-gray"
            size="sm"
            className="h-7 text-xs text-error-600 hover:text-error-700 gap-1.5"
            onClick={() => signOut()}
          >
            <LogOut className="h-3 w-3" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>

      {/* Main Profile Card */}
      <Card className="shadow-unt-lg border-border/80 bg-card overflow-hidden">
        {/* Header with Avatar and Badges */}
        <CardHeader className="p-6 sm:p-8 pb-6 border-b border-border/60 bg-muted/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-brand-600 to-amber-600 text-white font-bold text-xl flex items-center justify-center shadow-md overflow-hidden shrink-0 border-2 border-background">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
                {isGoogleUser && (
                  <div
                    className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-background border border-border flex items-center justify-center shadow-xs"
                    title="Google OAuth Account"
                  >
                    <GoogleIcon />
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <CardTitle className="font-sans text-xl font-bold tracking-tight text-foreground">
                    {name || user.name}
                  </CardTitle>
                  <Badge variant="brand" size="sm">
                    {user.tier}
                  </Badge>
                  {user.role === "admin" && (
                    <Badge variant="error" size="sm" className="gap-1">
                      <ShieldCheck className="h-3 w-3" />
                      Admin
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                  <span>{email || user.email}</span>
                  <span>•</span>
                  <span>Member since {new Date(user.createdAt).getFullYear()}</span>
                </CardDescription>
              </div>
            </div>

            {/* Authentication Source Pill */}
            <div className="sm:text-right">
              {isGoogleUser ? (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 text-[11px] font-semibold">
                  <GoogleIcon />
                  <span>Google Account Linked</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Credential Protected</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Notifications */}
          {errorMsg && (
            <Alert variant="error" className="animate-in fade-in-50 duration-200">
              <AlertCircle className="h-4 w-4 text-error-600 shrink-0" />
              <AlertDescription className="text-xs text-error-700 dark:text-error-300">
                {errorMsg}
              </AlertDescription>
            </Alert>
          )}

          {successMsg && (
            <Alert variant="success" className="animate-in fade-in-50 duration-200">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <AlertDescription className="text-xs text-emerald-700 dark:text-emerald-300">
                {successMsg}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Personal Account Identity */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border/60">
                <User className="h-4 w-4 text-brand-600" />
                <h4 className="font-semibold text-sm text-foreground">Identity & Account Details</h4>
                <span className="text-[11px] text-muted-foreground ml-auto font-normal">
                  Autofilled from {isGoogleUser ? "Google OAuth" : "Registration"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="profile-name">Full Legal Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="profile-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="pl-10 h-10 text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="profile-email">Email Address</Label>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified
                    </span>
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="profile-email"
                      type="email"
                      readOnly
                      value={email}
                      className="pl-10 h-10 text-xs sm:text-sm bg-muted/50 cursor-not-allowed text-muted-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="profile-avatar">Profile Avatar Image URL</Label>
                  <Input
                    id="profile-avatar"
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://..."
                    className="h-10 text-xs sm:text-sm"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    {isGoogleUser
                      ? "Automatically synchronized with your Google profile photo. You may also specify a custom image URL."
                      : "Avatar image URL used for your vault identifier."}
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: Delivery & Shipping Information */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 pb-2 border-b border-border/60">
                <Truck className="h-4 w-4 text-brand-600" />
                <h4 className="font-semibold text-sm text-foreground">
                  Default Delivery & Courier Destination
                </h4>
                <Badge variant="brand" size="sm" className="ml-auto text-[10px]">
                  Autofills Checkout
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="profile-phone">Contact Phone / WhatsApp Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="profile-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="pl-10 h-10 text-xs sm:text-sm"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Used for white-glove courier notifications and dispatch confirmations.
                  </p>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="profile-address">Street / Residence Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="profile-address"
                      type="text"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="Penthouse 4B, Skyview Towers, Nariman Point"
                      className="pl-10 h-10 text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="profile-city">City</Label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="profile-city"
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Mumbai"
                      className="pl-10 h-10 text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="profile-state">State / Province</Label>
                  <Input
                    id="profile-state"
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Maharashtra"
                    className="h-10 text-xs sm:text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="profile-postal">PIN / Postal Code</Label>
                  <Input
                    id="profile-postal"
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="400001"
                    className="h-10 text-xs sm:text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="profile-country">Country</Label>
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="profile-country"
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="India"
                      className="pl-10 h-10 text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* VIP Tier Perks Reassurance */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300 font-semibold">
                <Sparkles className="h-4 w-4" />
                <span>{user.tier} Sovereign Privileges Active</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Your profile address is encrypted and secured under 256-bit TLS vault protocols. Saving your details enables 1-click Express Checkout with automatic shipping address prefill.
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border/60">
              <Button
                type="submit"
                variant="primary"
                className="w-full sm:w-auto h-11 px-6 text-xs sm:text-sm font-semibold shadow-unt-xs gap-2"
                disabled={isSubmitting}
              >
                <Save className="h-4 w-4" />
                <span>{isSubmitting ? "Saving Changes..." : "Save Profile Details"}</span>
              </Button>

              <Button
                type="button"
                variant="secondary-gray"
                className="w-full sm:w-auto h-11 px-5 text-xs sm:text-sm font-medium gap-2"
                onClick={() => router.push("/checkout")}
              >
                <span>Go to Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
