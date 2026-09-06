import { NextRequest, NextResponse } from "next/server";
import {
  getGoogleOAuthConfig,
  generateOAuthState,
  getGoogleAuthorizationUrl,
  OAUTH_STATE_COOKIE,
  OAUTH_COOKIE_OPTIONS,
  sanitizeReturnUrl,
} from "@/backend/auth/google";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const redirectParam = searchParams.get("redirect");
  const returnTo = sanitizeReturnUrl(redirectParam);

  const host = request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto");
  const config = getGoogleOAuthConfig({ host, proto });

  // If Google OAuth credentials are not configured in environment, redirect with notice
  if (!config.isConfigured) {
    const loginUrl = new URL("/login", request.nextUrl.origin);
    loginUrl.searchParams.set("error", "google_config_missing");
    if (returnTo && returnTo !== "/") {
      loginUrl.searchParams.set("redirect", returnTo);
    }
    return NextResponse.redirect(loginUrl);
  }

  // Generate signed state containing returnTo and a cryptographic nonce
  const state = generateOAuthState(returnTo);

  // Construct Google OAuth authorization URL
  const googleAuthUrl = getGoogleAuthorizationUrl({
    clientId: config.clientId,
    redirectUri: config.redirectUri,
    state,
  });

  const response = NextResponse.redirect(googleAuthUrl, { status: 302 });

  // Store state in an HTTP-only, secure cookie for double-submit verification on callback
  response.cookies.set(OAUTH_STATE_COOKIE, state, OAUTH_COOKIE_OPTIONS);

  return response;
}
