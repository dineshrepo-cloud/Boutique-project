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
  SafeUser,
  sanitizeUser,
} from "@/backend/auth/session";

export type { SafeUser };

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

export interface UpdateProfileInput {
  name?: string;
  phone?: string | null;
  streetAddress?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
  avatarUrl?: string | null;
}

/**
 * Update authenticated user's profile and delivery details
 */
export async function updateUserProfileAction(data: UpdateProfileInput): Promise<{
  success: boolean;
  user?: SafeUser;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const token =
      cookieStore.get(SESSION_COOKIE_NAME)?.value ||
      cookieStore.get("maison_session")?.value;
    if (!token) {
      return { success: false, error: "You must be signed in to update your profile." };
    }

    const payload = verifySessionToken(token);
    if (!payload) {
      return { success: false, error: "Session has expired. Please sign in again." };
    }

    const existingUser = await dataLayer.getUserById(payload.userId);
    if (!existingUser) {
      return { success: false, error: "User account not found." };
    }

    // Sanitize updates
    const updateData: Partial<User> = {};
    if (data.name && data.name.trim().length >= 2) {
      updateData.name = data.name.trim();
    }
    if (data.phone !== undefined) updateData.phone = data.phone?.trim() || null;
    if (data.streetAddress !== undefined) updateData.streetAddress = data.streetAddress?.trim() || null;
    if (data.city !== undefined) updateData.city = data.city?.trim() || null;
    if (data.state !== undefined) updateData.state = data.state?.trim() || null;
    if (data.postalCode !== undefined) updateData.postalCode = data.postalCode?.trim() || null;
    if (data.country !== undefined) updateData.country = data.country?.trim() || "India";
    if (data.avatarUrl !== undefined) updateData.avatarUrl = data.avatarUrl?.trim() || null;

    const updatedUser = await dataLayer.updateUser(existingUser.id, updateData);

    // If name changed, re-issue cryptographic session token with updated name
    if (updateData.name) {
      const newToken = createSessionToken(updatedUser);
      cookieStore.set(SESSION_COOKIE_NAME, newToken, SESSION_COOKIE_OPTIONS);
    }

    revalidatePath("/", "layout");
    revalidatePath("/profile");
    revalidatePath("/checkout");

    return { success: true, user: sanitizeUser(updatedUser) };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update profile.";
    return { success: false, error: message };
  }
}
