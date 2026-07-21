import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { exchangeCodeAndConnect } from "@/lib/google-calendar";
import { GOOGLE_OAUTH_STATE_COOKIE } from "../connect/route";

export async function GET(request: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const cookieStore = await cookies();
  const expectedState = cookieStore.get(GOOGLE_OAUTH_STATE_COOKIE)?.value;
  cookieStore.delete(GOOGLE_OAUTH_STATE_COOKIE);

  if (error) {
    return NextResponse.redirect(
      new URL(`/settings?google_error=${encodeURIComponent(error)}`, request.url)
    );
  }
  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(new URL("/settings?google_error=invalid_state", request.url));
  }

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) {
    return NextResponse.redirect(new URL("/settings?google_error=no_user", request.url));
  }

  try {
    await exchangeCodeAndConnect(code, user.id);
  } catch (err) {
    console.error("Google OAuth callback failed:", err);
    return NextResponse.redirect(new URL("/settings?google_error=exchange_failed", request.url));
  }

  return NextResponse.redirect(new URL("/settings?google_connected=1", request.url));
}
