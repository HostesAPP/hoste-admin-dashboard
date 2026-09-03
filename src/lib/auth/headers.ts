/**
 * Admin Token Header Configuration
 * Defines fallback header names for development admin authentication
 */

export const ADMIN_HEADER_NAMES = {
  primary: 'X-Dev-Admin-Token',
  fallbacks: ['X-Admin-Token', 'Authorization'],
} as const;

export type AdminHeaderName = typeof ADMIN_HEADER_NAMES.primary | typeof ADMIN_HEADER_NAMES.fallbacks[number];

/**
 * Extract admin token from request headers with fallback chain
 * @param headers - Request headers object
 * @returns Token value or null if not found
 */
export const getAdminTokenFromHeaders = (
  headers: Record<string, string | undefined>
): string | null => {
  // Normalize header names to lowercase for case-insensitive lookup
  const normalizedHeaders: Record<string, string> = {};
  Object.entries(headers).forEach(([key, value]) => {
    if (value) {
      normalizedHeaders[key.toLowerCase()] = value;
    }
  });

  // Try primary header first
  const primaryHeaderLower = ADMIN_HEADER_NAMES.primary.toLowerCase();
  if (normalizedHeaders[primaryHeaderLower]) {
    return normalizedHeaders[primaryHeaderLower];
  }

  // Try fallback headers
  for (const fallback of ADMIN_HEADER_NAMES.fallbacks) {
    const fallbackLower = fallback.toLowerCase();
    const token = normalizedHeaders[fallbackLower];
    if (token) {
      // Handle Bearer scheme for Authorization header
      if (fallback === 'Authorization' && token.startsWith('Bearer ')) {
        return token.substring(7); // Remove 'Bearer ' prefix
      }
      return token;
    }
  }

  return null;
};

/**
 * Check if token matches expected dev admin token
 * @param token - Token to validate
 * @param expectedToken - Expected token value
 * @returns True if tokens match
 */
export const validateAdminToken = (token: string | null, expectedToken: string): boolean => {
  if (!token) return false;
  return token === expectedToken;
};

/**
 * Extract headers from Next.js Request object
 * @param request - Next.js Request object
 * @returns Object with header key-value pairs
 */
export const extractHeadersFromRequest = (
  request: Request
): Record<string, string | undefined> => {
  const headers: Record<string, string | undefined> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });
  return headers;
};
