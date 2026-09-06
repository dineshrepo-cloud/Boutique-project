import crypto from "crypto";
import { authProperties } from "@/backend/config/auth.properties";

export const SESSION_SECRET =
  authProperties.session.secret ||
  process.env.SESSION_SECRET ||
  "yuka-trendz-cryptographic-vault-key-2026";
export const SESSION_COOKIE_NAME = authProperties.session.cookieName || "yuka_session";

export interface SessionPayload {
  userId: number;
  email: string;
  name: string;
  role: string;
  tier: string;
  exp: number; // Unix timestamp in ms
}

/**
 * Creates a cryptographically signed HMAC SHA-256 session token.
 */
export function createSessionToken(user: {
  id: number;
  email: string;
  name: string;
  role: string;
  tier: string;
}): string {
  const payload: SessionPayload = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    tier: user.tier,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days validity
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payloadB64)
    .digest("base64url");

  return `${payloadB64}.${signature}`;
}

/**
 * Verifies the integrity and expiration of a session token.
 */
export function verifySessionToken(token: string): SessionPayload | null {
  try {
    if (!token || !token.includes(".")) return null;
    const [payloadB64, signature] = token.split(".");
    if (!payloadB64 || !signature) return null;

    const expectedSignature = crypto
      .createHmac("sha256", SESSION_SECRET)
      .update(payloadB64)
      .digest("base64url");

    // Constant-time comparison to prevent timing attacks
    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);
    if (sigBuffer.length !== expectedBuffer.length) return null;
    if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) return null;

    const payloadJson = Buffer.from(payloadB64, "base64url").toString("utf-8");
    const payload: SessionPayload = JSON.parse(payloadJson);

    if (Date.now() > payload.exp) {
      return null; // Expired session
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Standard cookie configuration for session persistence.
 */
export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
};
