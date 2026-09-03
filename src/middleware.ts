import { NextRequest, NextResponse } from 'next/server';
import { getAdminTokenFromHeaders, validateAdminToken, extractHeadersFromRequest } from '@/lib/auth/headers';

/**
 * Admin Authentication Middleware
 * Validates incoming requests for dev admin token in fallback header chain
 * 
 * Header Priority:
 * 1. X-Dev-Admin-Token (primary)
 * 2. X-Admin-Token (fallback)
 * 3. Authorization (fallback, supports Bearer scheme)
 */

// Routes that require admin authentication
const PROTECTED_ROUTES = [
  '/api/admin',
];

// Routes that don't require authentication
const PUBLIC_ROUTES = [
  '/api/health',
  '/api/public',
];

/**
 * Check if a route requires admin authentication
 */
const isProtectedRoute = (pathname: string): boolean => {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route));
};

/**
 * Check if a route is public
 */
const isPublicRoute = (pathname: string): boolean => {
  return PUBLIC_ROUTES.some(route => pathname.startsWith(route));
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for non-API routes
  if (!pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Public routes - no auth required
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Protected routes - require admin token
  if (isProtectedRoute(pathname)) {
    const headers = extractHeadersFromRequest(request);
    const adminToken = getAdminTokenFromHeaders(headers);

    // Get expected token from environment variable
    const expectedToken = process.env.NEXT_PUBLIC_ADMIN_DEV_TOKEN || process.env.ADMIN_DEV_TOKEN;

    if (!adminToken || !validateAdminToken(adminToken, expectedToken || '')) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'Missing or invalid admin token',
          headers_checked: [
            'X-Dev-Admin-Token',
            'X-Admin-Token',
            'Authorization',
          ],
        },
        { status: 401 }
      );
    }

    // Token is valid, add admin context to request
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-admin-authenticated', 'true');
    requestHeaders.set('x-admin-token-source', 'header-auth');

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Non-protected API routes - allow
  return NextResponse.next();
}

/**
 * Middleware configuration
 * Define which routes this middleware applies to
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
