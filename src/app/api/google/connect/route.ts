import crypto from "crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getGoogleAuthUrl } from "@/lib/google-calendar";

export const GOOGLE_OAUTH_STATE_COOKIE = "google_oauth_state";

export async function GET(request: Request) {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return NextResponse.redirect(
      new URL("/settings?google_error=not_configured", request.url)
    );
  }

  const state = crypto.randomBytes(24).toString("hex");

  const cookieStore = await cookies();
  cookieStore.set(GOOGLE_OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });

  return NextResponse.redirect(getGoogleAuthUrl(state));
}
