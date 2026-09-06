/**
 * Authentication & OAuth Properties
 * 
 * Centralized properties configuration file for OAuth providers and session settings.
 * You can paste your Google Client ID & Client Secret directly here, or set them
 * in your .env.local file.
 * 
 * Security: This file is located in src/backend/* and is only ever executed server-side.
 */

export interface GoogleOAuthProperties {
  clientId: string;
  clientSecret: string;
  redirectUri?: string;
  scopes: string[];
}

export interface SessionProperties {
  secret: string;
  cookieName: string;
  maxAgeSeconds: number;
}

export interface AuthProperties {
  google: GoogleOAuthProperties;
  session: SessionProperties;
  app: {
    baseUrl?: string;
  };
}

export const authProperties: AuthProperties = {
  google: {
    // ---------------------------------------------------------------------------
    // PASTE YOUR GOOGLE OAUTH CREDENTIALS HERE:
    // (Or provide them via GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET in .env.local)
    // ---------------------------------------------------------------------------
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    redirectUri: process.env.GOOGLE_REDIRECT_URI || "",
    scopes: ["openid", "email", "profile"],
  },
  session: {
    secret: process.env.SESSION_SECRET || "yuka-trendz-cryptographic-vault-key-2026",
    cookieName: "yuka_session",
    maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
  },
  app: {
    baseUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  },
};
