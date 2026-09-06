import { NextRequest, NextResponse } from "next/server";
import {
  getGoogleOAuthConfig,
  verifyOAuthState,
  exchangeGoogleCode,
  fetchGoogleUserInfo,
  OAUTH_STATE_COOKIE,
} from "@/backend/auth/google";
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
} from "@/backend/auth/session";
import { dataLayer } from "@/backend/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const errorParam = searchParams.get("error");

  const host = request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto");
  const config = getGoogleOAuthConfig({ host, proto, pathname: request.nextUrl.pathname });

  const errorRedirect = (errorReason: string) => {
    const loginUrl = new URL("/login", request.nextUrl.origin);
    loginUrl.searchParams.set("error", errorReason);
    const res = NextResponse.redirect(loginUrl, { status: 302 });
    res.cookies.delete(OAUTH_STATE_COOKIE);
    return res;
  };

  // Handle explicit OAuth errors from Google (e.g. user cancelled prompt)
  if (errorParam) {
    if (errorParam === "access_denied") {
      return errorRedirect("google_access_denied");
    }
    return errorRedirect("oauth_failed");
  }

  // Retrieve stored state cookie
  const cookieState = request.cookies.get(OAUTH_STATE_COOKIE)?.value;

  // Verify double-submit CSRF state and signature
  const stateVerification = verifyOAuthState(state, cookieState);
  if (!stateVerification.valid) {
    return errorRedirect("invalid_state");
  }

  if (!code) {
    return errorRedirect("missing_code");
  }

  if (!config.isConfigured) {
    return errorRedirect("google_config_missing");
  }

  // 1. Exchange authorization code for tokens
  const tokenResult = await exchangeGoogleCode(
    code,
    config.redirectUri,
    config.clientId,
    config.clientSecret
  );

  if (!tokenResult.success) {
    console.error("Google OAuth token exchange failed:", tokenResult.error);
    return errorRedirect("oauth_token_failed");
  }

  // 2. Fetch authenticated profile from Google OpenID UserInfo endpoint
  const userResult = await fetchGoogleUserInfo(tokenResult.tokens.access_token);
  if (!userResult.success) {
    console.error("Google UserInfo retrieval failed:", userResult.error);
    return errorRedirect("oauth_userinfo_failed");
  }

  const profile = userResult.user;
  const email = profile.email.trim().toLowerCase();
  const name = profile.name || profile.given_name || "Google Patron";
  const avatarUrl = profile.picture || null;

  try {
    // 3. Find or provision user in data layer
    let user = await dataLayer.getUserByEmail(email);

    if (!user) {
      user = await dataLayer.createUser({
        name,
        email,
        passwordHash: null,
        provider: "google",
        role: "customer",
        tier: "Connoisseur",
        avatarUrl,
      });
    } else if (avatarUrl && (!user.avatarUrl || user.avatarUrl.includes("dicebear"))) {
      // Update avatar if not set or was placeholder
      user = await dataLayer.updateUser(user.id, { avatarUrl });
    }

    // 4. Issue cryptographic HMAC SHA-256 session token
    const sessionToken = createSessionToken(user);

    // 5. Establish authenticated redirect to destination
    const destinationUrl = new URL(stateVerification.returnTo, request.nextUrl.origin);
    const response = NextResponse.redirect(destinationUrl, { status: 302 });

    // Set standard session cookie
    response.cookies.set(SESSION_COOKIE_NAME, sessionToken, SESSION_COOKIE_OPTIONS);

    // Clean up one-time OAuth state cookie
    response.cookies.delete(OAUTH_STATE_COOKIE);

    return response;
  } catch (error: unknown) {
    console.error("Error provisioning Google authenticated session:", error);
    return errorRedirect("oauth_failed");
  }
}
