import crypto from "crypto";
import { authProperties } from "@/backend/config/auth.properties";
import { SESSION_SECRET } from "./session";

export const OAUTH_STATE_COOKIE = "oauth_state";

export const OAUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 10 * 60, // 10 minutes
};

export interface GoogleOAuthTokens {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  id_token?: string;
  refresh_token?: string;
}

export interface GoogleUserInfo {
  sub: string;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email: string;
  email_verified?: boolean;
}

export interface OAuthStatePayload {
  returnTo: string;
  nonce: string;
  exp: number;
}

/**
 * Sanitizes return URL to prevent open redirect vulnerabilities.
 * Ensures the path is strictly relative and not protocol-relative (//evil.com).
 */
export function sanitizeReturnUrl(url?: string | null): string {
  if (!url) return "/";
  const trimmed = url.trim();
  if (trimmed.startsWith("/") && !trimmed.startsWith("//") && !trimmed.includes("\\")) {
    return trimmed;
  }
  return "/";
}

/**
 * Retrieves the Google OAuth configuration.
 * Resolves Client ID, Secret, and dynamic Redirect URI.
 */
export function getGoogleOAuthConfig(requestHeaders?: {
  host?: string | null;
  proto?: string | null;
  pathname?: string | null;
}) {
  const clientId = (
    authProperties.google.clientId ||
    process.env.GOOGLE_CLIENT_ID ||
    ""
  ).trim();

  const clientSecret = (
    authProperties.google.clientSecret ||
    process.env.GOOGLE_CLIENT_SECRET ||
    ""
  ).trim();

  const customRedirectUri = (
    authProperties.google.redirectUri ||
    process.env.GOOGLE_REDIRECT_URI ||
    ""
  ).trim();

  const isConfigured = Boolean(
    clientId &&
    clientSecret &&
    !clientId.includes("PASTE_") &&
    !clientSecret.includes("PASTE_")
  );

  let baseUrl = (
    authProperties.app.baseUrl ||
    process.env.NEXT_PUBLIC_APP_URL ||
    ""
  ).trim().replace(/\/$/, "");

  if (!baseUrl && requestHeaders?.host) {
    const proto =
      requestHeaders.proto ||
      (requestHeaders.host.includes("localhost") || requestHeaders.host.includes("127.0.0.1")
        ? "http"
        : "https");
    baseUrl = `${proto}://${requestHeaders.host}`;
  }

  if (!baseUrl) {
    baseUrl = "http://localhost:3000";
  }

  const redirectPath = requestHeaders?.pathname || "/api/auth/google/callback";
  const redirectUri = customRedirectUri || `${baseUrl}${redirectPath}`;

  return {
    clientId,
    clientSecret,
    isConfigured,
    redirectUri,
    baseUrl,
  };
}

/**
 * Generates a signed, tamper-evident CSRF state parameter.
 */
export function generateOAuthState(returnTo: string = "/"): string {
  const payload: OAuthStatePayload = {
    returnTo: sanitizeReturnUrl(returnTo),
    nonce: crypto.randomBytes(16).toString("hex"),
    exp: Date.now() + 10 * 60 * 1000, // 10 minutes
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payloadB64)
    .digest("base64url");

  return `${payloadB64}.${signature}`;
}

/**
 * Verifies the incoming state parameter against the stored cookie.
 * Validates HMAC signature, expiration, and CSRF token match.
 */
export function verifyOAuthState(
  stateParam: string | null | undefined,
  cookieValue: string | null | undefined
): { valid: boolean; returnTo: string; error?: string } {
  if (!stateParam || !cookieValue) {
    return { valid: false, returnTo: "/", error: "Missing state parameter or verification cookie" };
  }

  // Ensure state parameter matches the cookie (Double Submit CSRF protection)
  const stateBuffer = Buffer.from(stateParam);
  const cookieBuffer = Buffer.from(cookieValue);
  if (stateBuffer.length !== cookieBuffer.length || !crypto.timingSafeEqual(stateBuffer, cookieBuffer)) {
    return { valid: false, returnTo: "/", error: "OAuth state parameter mismatch" };
  }

  const parts = stateParam.split(".");
  if (parts.length !== 2) {
    return { valid: false, returnTo: "/", error: "Invalid state parameter structure" };
  }

  const [payloadB64, signature] = parts;
  const expectedSignature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payloadB64)
    .digest("base64url");

  const sigBuffer = Buffer.from(signature);
  const expectedSigBuffer = Buffer.from(expectedSignature);
  if (sigBuffer.length !== expectedSigBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedSigBuffer)) {
    return { valid: false, returnTo: "/", error: "Tampered state parameter signature" };
  }

  try {
    const payloadJson = Buffer.from(payloadB64, "base64url").toString("utf-8");
    const payload: OAuthStatePayload = JSON.parse(payloadJson);

    if (Date.now() > payload.exp) {
      return { valid: false, returnTo: "/", error: "OAuth session expired. Please try again." };
    }

    return { valid: true, returnTo: sanitizeReturnUrl(payload.returnTo) };
  } catch {
    return { valid: false, returnTo: "/", error: "Malformed state payload" };
  }
}

/**
 * Constructs the standard Google OAuth 2.0 authorization URL.
 */
export function getGoogleAuthorizationUrl(options: {
  clientId: string;
  redirectUri: string;
  state: string;
}): string {
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", options.clientId);
  url.searchParams.set("redirect_uri", options.redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", authProperties.google.scopes.join(" ") || "openid email profile");
  url.searchParams.set("state", options.state);
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "select_account");
  return url.toString();
}

/**
 * Server-side exchange of the authorization code for tokens.
 */
export async function exchangeGoogleCode(
  code: string,
  redirectUri: string,
  clientId: string,
  clientSecret: string
): Promise<{ success: true; tokens: GoogleOAuthTokens } | { success: false; error: string }> {
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.error_description || data.error || "Token exchange failed";
      return { success: false, error: errorMsg };
    }

    return { success: true, tokens: data as GoogleOAuthTokens };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Network error during token exchange";
    return { success: false, error: message };
  }
}

/**
 * Retrieves authenticated user profile from Google's OpenID Connect UserInfo endpoint.
 */
export async function fetchGoogleUserInfo(
  accessToken: string
): Promise<{ success: true; user: GoogleUserInfo } | { success: false; error: string }> {
  try {
    const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.error_description || data.error || "Failed to retrieve user profile";
      return { success: false, error: errorMsg };
    }

    if (!data.email) {
      return { success: false, error: "Google account does not contain a verified email address" };
    }

    return { success: true, user: data as GoogleUserInfo };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Network error retrieving user profile";
    return { success: false, error: message };
  }
}
