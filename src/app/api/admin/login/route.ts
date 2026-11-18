import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE_OPTIONS,
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  isAdminAuthenticated,
  isAdminPasswordConfigured,
  verifyAdminPassword,
} from "@/lib/adminAuth";

export async function GET() {
  const configured = isAdminPasswordConfigured();
  const authenticated = configured ? await isAdminAuthenticated() : false;
  return NextResponse.json({ configured, authenticated });
}

export async function POST(request: NextRequest) {
  if (!isAdminPasswordConfigured()) {
    return NextResponse.json(
      {
        error:
          "ADMIN_PASSWORD is not configured yet in your Vercel Environment Variables.",
      },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const password = typeof body?.password === "string" ? body.password : "";

    if (!password || !verifyAdminPassword(password)) {
      return NextResponse.json(
        { error: "Incorrect admin password. Please try again." },
        { status: 401 }
      );
    }

    const token = createAdminSessionToken();
    const isHttps =
      request.url.startsWith("https://") ||
      request.headers.get("x-forwarded-proto") === "https";

    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, token, {
      ...ADMIN_COOKIE_OPTIONS,
      secure: isHttps,
    });
    return response;
  } catch {
    return NextResponse.json(
      { error: "Invalid login request." },
      { status: 400 }
    );
  }
}
