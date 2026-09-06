import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME, sanitizeUser } from "@/backend/auth/session";
import { dataLayer } from "@/backend/db";

/**
 * GET /api/auth/me
 * REST API endpoint to retrieve the current authenticated user's details.
 * Reads the cryptographic session token from cookies and returns the sanitized user profile.
 */
export async function GET(request: NextRequest) {
  try {
    const token =
      request.cookies.get(SESSION_COOKIE_NAME)?.value ||
      request.cookies.get("maison_session")?.value;

    if (!token) {
      return NextResponse.json(
        { authenticated: false, user: null },
        {
          status: 200,
          headers: { "Cache-Control": "no-store, max-age=0" },
        }
      );
    }

    const payload = verifySessionToken(token);
    if (!payload) {
      return NextResponse.json(
        { authenticated: false, user: null, message: "Session expired or invalid" },
        {
          status: 200,
          headers: { "Cache-Control": "no-store, max-age=0" },
        }
      );
    }

    const user = await dataLayer.getUserById(payload.userId);
    if (!user) {
      return NextResponse.json(
        { authenticated: false, user: null, message: "User account not found" },
        {
          status: 200,
          headers: { "Cache-Control": "no-store, max-age=0" },
        }
      );
    }

    return NextResponse.json(
      {
        authenticated: true,
        user: sanitizeUser(user),
      },
      {
        status: 200,
        headers: { "Cache-Control": "no-store, max-age=0" },
      }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json(
      { authenticated: false, user: null, error: message },
      { status: 500 }
    );
  }
}
