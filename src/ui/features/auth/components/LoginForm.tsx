"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/ui/features/auth/context/AuthContext";
import { Button } from "@/ui/primitives/button";
import { Input } from "@/ui/primitives/input";
import { Label } from "@/ui/primitives/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/ui/primitives/card";
import { Badge } from "@/ui/primitives/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/ui/primitives/tabs";
import { Checkbox } from "@/ui/primitives/checkbox";
import { Alert, AlertDescription } from "@/ui/primitives/alert";

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
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

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const { signIn, signUp, signInWithGoogle, user } = useAuth();

  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // Sign Up Form State
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

  // Handle Basic Auth Sign In
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      const res = await signIn(signInEmail, signInPassword);
      if (res.success) {
        setSuccessMsg("Authentication successful. Redirecting to your vault...");
        setTimeout(() => {
          router.push(redirectUrl);
          router.refresh();
        }, 800);
      } else {
        setErrorMsg(res.error || "Failed to sign in. Please verify your credentials.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Basic Auth Sign Up
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      const res = await signUp(signUpName, signUpEmail, signUpPassword);
      if (res.success) {
        setSuccessMsg("Welcome to Yuka Trendz. Your Connoisseur account is ready.");
        setTimeout(() => {
          router.push(redirectUrl);
          router.refresh();
        }, 800);
      } else {
        setErrorMsg(res.error || "Registration failed. Please check your details.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      const res = await signInWithGoogle();
      if (res.success) {
        setSuccessMsg("Google account authenticated. Connecting to vault...");
        setTimeout(() => {
          router.push(redirectUrl);
          router.refresh();
        }, 800);
      } else {
        setErrorMsg(res.error || "Google sign-in encountered an issue.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick fill helper for demo review
  const handleFillDemo = (email: string, pass: string) => {
    setActiveTab("signin");
    setSignInEmail(email);
    setSignInPassword(pass);
    setErrorMsg(null);
  };

  if (user) {
    return (
      <Card className="w-full max-w-md mx-auto p-6 sm:p-8 text-center space-y-4 shadow-unt-md border-border/80">
        <div className="h-14 w-14 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <div>
          <Badge variant="success" size="sm" dot className="mb-2">
            Active Vault Session
          </Badge>
          <h3 className="font-sans text-xl font-bold tracking-tight text-foreground">
            Authenticated as {user.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {user.email} • {user.tier}
          </p>
        </div>
        <div className="pt-2 flex flex-col gap-2">
          <Button
            variant="primary"
            className="w-full gap-2 shadow-unt-xs"
            onClick={() => router.push(redirectUrl)}
          >
            <span>Continue to Store</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary-gray"
            className="w-full"
            onClick={() => router.push("/admin")}
          >
            Open Admin Dashboard
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-unt-lg border-border/80 bg-card overflow-hidden">
      {/* Header Banner */}
      <CardHeader className="p-6 sm:p-8 pb-4 text-center border-b border-border/60 bg-muted/30">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Badge variant="brand" size="sm" className="gap-1 font-medium">
            <ShieldCheck className="h-3.5 w-3.5 text-brand-600" />
            Secure Sign In
          </Badge>
        </div>
        <CardTitle className="font-sans text-2xl font-bold tracking-tight text-foreground">
          Sign In to Your Account
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground mt-1">
          Access your orders, saved cart items, and account settings.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 sm:p-8 pt-6 space-y-6">
        {/* Error or Success Alert */}
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

        {/* 1. Primary Action: Google Sign-In */}
        <div className="space-y-3">
          <Button
            type="button"
            variant="secondary-gray"
            className="w-full h-11 border-border hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:hover:border-gray-700 font-medium text-xs sm:text-sm gap-3 shadow-unt-xs flex items-center justify-center transition-all cursor-pointer"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
          >
            <GoogleIcon />
            <span>Continue with Google</span>
          </Button>

          {/* Clean Untitled UI Divider */}
          <div className="relative flex items-center justify-center py-1">
            <div className="w-full border-t border-border/80" />
            <span className="absolute bg-card px-3 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
              Or with Email Credential
            </span>
          </div>
        </div>

        {/* 2. Tabs: Sign In vs Create Account */}
        <Tabs
          value={activeTab}
          onValueChange={(val) => {
            setActiveTab(val as "signin" | "signup");
            setErrorMsg(null);
            setSuccessMsg(null);
          }}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 w-full mb-6">
            <TabsTrigger value="signin" className="text-xs font-semibold">
              Sign In
            </TabsTrigger>
            <TabsTrigger value="signup" className="text-xs font-semibold">
              Create Account
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Sign In (Basic Auth) */}
          <TabsContent value="signin" className="space-y-4">
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="signin-email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signin-email"
                    type="email"
                    required
                    placeholder="patron@yukatrendz.com"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    className="pl-10 h-10 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="signin-password">Password</Label>
                  <button
                    type="button"
                    onClick={() =>
                      alert("Demo Recovery: Use password 'password123' for patron@yukatrendz.com or 'admin123' for curator@yukatrendz.com")
                    }
                    className="text-[11px] text-brand-600 hover:underline cursor-pointer font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signin-password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    className="pl-10 pr-10 h-10 text-xs sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
                  />
                  <Label htmlFor="remember" className="text-xs text-muted-foreground font-normal cursor-pointer">
                    Remember this device for 7 days
                  </Label>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full h-10 text-xs sm:text-sm font-semibold shadow-unt-xs mt-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Authenticating..." : "Sign In to Sovereign Vault"}
              </Button>
            </form>

            {/* Quick Fill Demo Access Badges */}
            <div className="pt-4 border-t border-border/60">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block mb-2">
                Quick-Fill Demo Credentials (1-Click)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleFillDemo("patron@yukatrendz.com", "password123")}
                  className="flex flex-col text-left p-2 rounded-lg border border-border/80 bg-muted/40 hover:bg-gray-100 hover:border-gray-400 dark:hover:bg-gray-800 dark:hover:border-gray-600 transition-all text-xs cursor-pointer group"
                >
                  <span className="font-semibold text-[11px] text-foreground group-hover:text-brand-600 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-amber-500" />
                    VIP Connoisseur
                  </span>
                  <span className="text-[10px] text-muted-foreground truncate">patron@yukatrendz.com</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleFillDemo("curator@yukatrendz.com", "admin123")}
                  className="flex flex-col text-left p-2 rounded-lg border border-border/80 bg-muted/40 hover:bg-gray-100 hover:border-gray-400 dark:hover:bg-gray-800 dark:hover:border-gray-600 transition-all text-xs cursor-pointer group"
                >
                  <span className="font-semibold text-[11px] text-foreground group-hover:text-brand-600 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-brand-600" />
                    Curator Admin
                  </span>
                  <span className="text-[10px] text-muted-foreground truncate">curator@yukatrendz.com</span>
                </button>
              </div>
            </div>
          </TabsContent>

          {/* Tab 2: Create Account */}
          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="signup-name">Full Legal Name *</Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-name"
                    type="text"
                    required
                    placeholder="Lord Harrison Vance"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    className="pl-10 h-10 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="signup-email">Work / Personal Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-email"
                    type="email"
                    required
                    placeholder="harrison.vance@geneva.ch"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    className="pl-10 h-10 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="signup-password">Create Vault Passkey *</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    placeholder="At least 6 characters"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    className="pl-10 pr-10 h-10 text-xs sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300 font-semibold">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Instant Connoisseur Tier Unlocked</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Upon registration, you will receive private catalog allocations and 10% privilege on companion acquisitions.
                </p>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full h-10 text-xs sm:text-sm font-semibold shadow-unt-xs"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Provisioning Account..." : "Create Connoisseur Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
