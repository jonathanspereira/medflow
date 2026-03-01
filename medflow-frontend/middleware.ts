import { NextRequest, NextResponse } from "next/server";

const WEBHOOK_PREFIX = "/api/webhooks/";
const SESSION_COOKIE_ORG = "medauth_org_id";
const SESSION_COOKIE_USER = "medauth_user_id";
const PUBLIC_PATHS = ["/login", "/esqueceu-senha", "/unauthorized"];
const AUTH_PROTECTION_PAUSED = true;

export function middleware(request: NextRequest) {
  if (AUTH_PROTECTION_PAUSED) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  if (pathname.startsWith(WEBHOOK_PREFIX) || isPublicPath) {
    return NextResponse.next();
  }

  const organizationId = request.cookies.get(SESSION_COOKIE_ORG)?.value;
  const userId = request.cookies.get(SESSION_COOKIE_USER)?.value;

  if (!organizationId || !userId) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.redirect(new URL("/login", request.url));
  }

  const headers = new Headers(request.headers);
  headers.set("x-organization-id", organizationId);
  headers.set("x-user-id", userId);

  return NextResponse.next({
    request: {
      headers,
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
