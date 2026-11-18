import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_OPTIONS, ADMIN_SESSION_COOKIE } from "@/lib/adminAuth";

export async function POST(request: NextRequest) {
  const isHttps =
    request.url.startsWith("https://") ||
    request.headers.get("x-forwarded-proto") === "https";
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    ...ADMIN_COOKIE_OPTIONS,
    secure: isHttps,
    maxAge: 0,
  });
  return response;
}
