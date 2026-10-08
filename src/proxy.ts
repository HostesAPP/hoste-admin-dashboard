import { NextRequest, NextResponse } from "next/server";

// Routes accessible only by unauthenticated guests
const GUEST_AUTH_ROUTES = [
  "/sign-in",
  "/verify-otp",
  "/forgot-password",
  "/reset-password",
];

// All auth-related routes (including status/error routes)
const ALL_AUTH_ROUTES = [
  ...GUEST_AUTH_ROUTES,
  "/account-locked",
  "/account-blocked",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Bypass Next.js internals, API routes, and static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|css|js)$/)
  ) {
    return NextResponse.next();
  }

  // Check route types
  const isAuthRoute = ALL_AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  const isGuestAuthRoute = GUEST_AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Retrieve role and check authentication status
  const authRole = request.cookies.get("auth_role")?.value;
  const isAuthenticated = Boolean(authRole === "STAFF" || authRole === "ADMIN" || authRole);

  // 1. Unauthenticated user trying to access protected dashboard routes
  if (!isAuthenticated && !isAuthRoute) {
    const signInUrl = new URL("/sign-in", request.url);
    if (pathname !== "/") {
      signInUrl.searchParams.set("redirect", pathname);
    }
    return NextResponse.redirect(signInUrl);
  }

  // 2. Authenticated user trying to access guest auth routes (/sign-in, /verify-otp, /forgot-password, /reset-password)
  if (isAuthenticated && isGuestAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

