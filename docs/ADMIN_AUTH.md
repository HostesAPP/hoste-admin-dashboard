# Admin Authentication System Documentation

## Overview

This document explains the admin authentication system implemented for the Hosté Admin Dashboard. The system uses a **header-based token authentication** with a fallback chain for flexibility in development.

---

## Authentication Headers

The system checks for admin tokens in the following priority order:

### 1. **Primary Header: `X-Dev-Admin-Token`** (Recommended)
Most specific and explicit for development admin scenarios.

```bash
curl -H "X-Dev-Admin-Token: your_token_here" http://localhost:3000/api/admin/stats
```

### 2. **Fallback Header: `X-Admin-Token`**
Alternative admin token header.

```bash
curl -H "X-Admin-Token: your_token_here" http://localhost:3000/api/admin/stats
```

### 3. **Fallback Header: `Authorization` (Bearer Scheme)**
Standard HTTP Authorization header with Bearer token.

```bash
curl -H "Authorization: Bearer your_token_here" http://localhost:3000/api/admin/stats
```

---

## Setup Instructions

### 1. Configure Environment Variables

Create a `.env.local` file in the root directory (copy from `.env.example`):

```bash
# .env.local
ADMIN_DEV_TOKEN=your_secure_dev_token_here
```

Generate a secure token:
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32
```

### 2. File Structure

```
src/
├── lib/
│   └── auth/
│       └── headers.ts           # Header configuration & utilities
├── middleware.ts                # Authentication middleware
└── app/
    └── api/
        ├── health/
        │   └── route.ts         # Public health check endpoint
        └── admin/
            └── stats/
                └── route.ts     # Protected admin stats endpoint
```

---

## Usage Examples

### Testing the Health Check (Public - No Auth Required)

```bash
curl http://localhost:3000/api/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2026-09-03T04:52:24.000Z",
  "service": "hoste-admin-dashboard"
}
```

### Testing Protected Endpoint (Requires Auth)

**Using X-Dev-Admin-Token:**
```bash
curl -H "X-Dev-Admin-Token: your_secure_dev_token_here" \
  http://localhost:3000/api/admin/stats
```

**Using X-Admin-Token:**
```bash
curl -H "X-Admin-Token: your_secure_dev_token_here" \
  http://localhost:3000/api/admin/stats
```

**Using Authorization Bearer:**
```bash
curl -H "Authorization: Bearer your_secure_dev_token_here" \
  http://localhost:3000/api/admin/stats
```

Success Response:
```json
{
  "timestamp": "2026-09-03T04:52:24.000Z",
  "data": {
    "totalGroups": 156,
    "activeGroups": 142,
    "suspendedGroups": 14,
    "totalMembers": 2847,
    "activeMembers": 2641,
    "suspendedMembers": 206,
    "totalUsers": 3200,
    "activeUsers": 2950,
    "accountsCreatedToday": 45,
    "suspensionsToday": 3
  },
  "metadata": {
    "lastUpdated": "2026-09-03T04:52:24.000Z",
    "dataSource": "admin-dashboard-api",
    "authenticatedAt": "2026-09-03T04:52:24.000Z"
  }
}
```

**Without Token (Unauthorized):**
```bash
curl http://localhost:3000/api/admin/stats
```

Error Response (401):
```json
{
  "error": "Unauthorized",
  "message": "Missing or invalid admin token",
  "headers_checked": [
    "X-Dev-Admin-Token",
    "X-Admin-Token",
    "Authorization"
  ]
}
```

---

## Implementation Details

### Middleware (`src/middleware.ts`)

- Validates all `/api/*` routes
- Checks protected routes (`/api/admin/*`) for valid tokens
- Allows public routes (`/api/health/*`) without authentication
- Adds `x-admin-authenticated` header to validated requests

### Header Utilities (`src/lib/auth/headers.ts`)

Key functions:

| Function | Purpose |
|----------|---------|
| `getAdminTokenFromHeaders()` | Extracts token from headers with fallback chain |
| `validateAdminToken()` | Validates token against expected value |
| `extractHeadersFromRequest()` | Converts Next.js Request headers to object |

### Protected Routes

Routes requiring authentication (prefix `/api/admin`):
- `/api/admin/stats` - Dashboard statistics
- `/api/admin/**` - Any admin routes

Public routes (no authentication):
- `/api/health` - Service health check
- `/api/public/**` - Any public routes

---

## Adding New Protected Endpoints

To create a new protected admin endpoint:

1. Create a new route file:
```typescript
// src/app/api/admin/groups/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Check authentication (set by middleware)
  if (!request.headers.get('x-admin-authenticated')) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Your protected logic here
  return NextResponse.json({ data: [] });
}
```

2. Middleware will automatically protect it since it's under `/api/admin`

---

## Security Best Practices

### Development
✅ Use `.env.local` (never commit to git)
✅ Generate strong random tokens
✅ Use `ADMIN_DEV_TOKEN` for sensitive operations

### Production
⚠️ Replace token-based auth with proper OAuth/JWT
⚠️ Use environment-specific tokens
⚠️ Implement rate limiting on auth failures
⚠️ Add logging for unauthorized attempts
⚠️ Use HTTPS only
⚠️ Implement token rotation

### Token Generation
```bash
# Recommended: 32 bytes = 64 hex characters
openssl rand -hex 32

# Or use: crypto module in Node.js
```

---

## Troubleshooting

### 401 Unauthorized Error

**Check:**
1. Token is set in `.env.local`
2. Token value matches between `.env.local` and request header
3. Header name is correct (case-insensitive)
4. Token is passed in correct format

```bash
# Debug: Print your token
cat .env.local | grep ADMIN_DEV_TOKEN

# Test with explicit token
curl -H "X-Dev-Admin-Token: test123" http://localhost:3000/api/admin/stats
```

### Header Not Recognized

**Check:**
1. Middleware is in `src/middleware.ts` (not buried in routes)
2. Route is under `/api/admin` prefix
3. Header names match defined constants in `src/lib/auth/headers.ts`

### Environment Variable Not Loading

```bash
# Restart dev server after changing .env.local
npm run dev

# Verify env var is loaded
node -e "console.log(process.env.ADMIN_DEV_TOKEN)"
```

---

## Related Files

- **Middleware**: `src/middleware.ts`
- **Header Config**: `src/lib/auth/headers.ts`
- **Example Endpoints**: 
  - `src/app/api/health/route.ts`
  - `src/app/api/admin/stats/route.ts`
- **Environment**: `.env.example`, `.env.local` (not in git)

---

## Migration Path (Future)

When ready to move to production:

1. **Phase 1**: Current token-based system (development)
2. **Phase 2**: Add JWT/OAuth with backend integration
3. **Phase 3**: Remove header-based fallback tokens
4. **Phase 4**: Implement service-to-service auth

---

## References

- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [HTTP Authorization Header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization)
