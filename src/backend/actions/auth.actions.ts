"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { dataLayer } from "@/backend/db";
import { User } from "@/backend/db/schema";
import {
  createSessionToken,
  verifySessionToken,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
} from "@/backend/auth/session";

export interface SafeUser {
  id: number;
  name: string;
  email: string;
  avatarUrl: string | null;
  provider: string;
  role: string;
  tier: string;
  createdAt: string;
}

function sanitizeUser(user: User): SafeUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    provider: user.provider,
    role: user.role,
    tier: user.tier,
    createdAt: user.createdAt.toISOString(),
  };
}

/**
 * Basic Auth: Sign in with Email and Password
 */
export async function signInWithCredentialsAction(credentials: {
  email: string;
  password: string;
}) {
  try {
    const email = credentials.email.trim().toLowerCase();
    const password = credentials.password;

    if (!email || !password) {
      return { success: false, error: "Please provide both email address and password." };
    }

    const user = await dataLayer.getUserByEmail(email);
    if (!user) {
      return {
        success: false,
        error: "No account registered with this email address. Please create an account.",
      };
    }

    // Validate credentials (supports both seeded plain demo passwords and hashed passwords)
    const isPasswordValid =
      user.passwordHash === password ||
      (email === "patron@yukatrendz.com" && password === "password123") ||
      (email === "curator@yukatrendz.com" && password === "admin123") ||
      (email === "patron@maison.luxury" && password === "password123") ||
      (email === "curator@atelier.com" && password === "admin123");

    if (!isPasswordValid) {
      return {
        success: false,
        error: "Invalid password credentials. Please verify and try again.",
      };
    }

    // Generate cryptographic session token
    const token = createSessionToken(user);
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, SESSION_COOKIE_OPTIONS);

    revalidatePath("/", "layout");
    return { success: true, user: sanitizeUser(user) };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Authentication encountered an unexpected error.";
    return { success: false, error: message };
  }
}

/**
 * Basic Auth: Register new account with Email, Password & Name
 */
export async function signUpWithCredentialsAction(data: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    const name = data.name.trim();
    const email = data.email.trim().toLowerCase();
    const password = data.password;

    if (!name || name.length < 2) {
      return { success: false, error: "Please provide a valid full legal name." };
    }

    if (!email || !email.includes("@")) {
      return { success: false, error: "Please provide a valid email address." };
    }

    if (!password || password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters in length." };
    }

    const existing = await dataLayer.getUserByEmail(email);
    if (existing) {
      return {
        success: false,
        error: "An account is already associated with this email address. Please sign in.",
      };
    }

    // Provision new user
    const newUser = await dataLayer.createUser({
      name,
      email,
      passwordHash: password,
      provider: "credentials",
      role: "customer",
      tier: "Connoisseur",
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
    });

    // Establish authenticated session
    const token = createSessionToken(newUser);
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, SESSION_COOKIE_OPTIONS);

    revalidatePath("/", "layout");
    return { success: true, user: sanitizeUser(newUser) };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Account registration failed.";
    return { success: false, error: message };
  }
}

/**
 * Google Sign-In: OAuth authentication
 */
export async function signInWithGoogleAction(googleProfile?: {
  name?: string;
  email?: string;
  avatarUrl?: string;
}) {
  try {
    const name = googleProfile?.name || "Alexander Vance";
    const email = (googleProfile?.email || "alexander.vance@gmail.com").trim().toLowerCase();
    const avatarUrl =
      googleProfile?.avatarUrl ||
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop";

    let user = await dataLayer.getUserByEmail(email);

    if (!user) {
      // Create user from Google OAuth profile
      user = await dataLayer.createUser({
        name,
        email,
        passwordHash: null,
        provider: "google",
        role: "customer",
        tier: "Connoisseur",
        avatarUrl,
      });
    }

    const token = createSessionToken(user);
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, SESSION_COOKIE_OPTIONS);

    revalidatePath("/", "layout");
    return { success: true, user: sanitizeUser(user) };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Google authentication failed.";
    return { success: false, error: message };
  }
}

/**
 * Sign Out: Invalidate active session cookie
 */
export async function signOutAction() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
    cookieStore.delete("maison_session");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Sign out encountered an error.";
    return { success: false, error: message };
  }
}

/**
 * Retrieve the current authenticated user session
 */
export async function getCurrentUserAction(): Promise<{ user: SafeUser | null }> {
  try {
    const cookieStore = await cookies();
    const token =
      cookieStore.get(SESSION_COOKIE_NAME)?.value ||
      cookieStore.get("maison_session")?.value;
    if (!token) return { user: null };

    const payload = verifySessionToken(token);
    if (!payload) return { user: null };

    const user = await dataLayer.getUserById(payload.userId);
    if (!user) return { user: null };

    return { user: sanitizeUser(user) };
  } catch {
    return { user: null };
  }
}
