import { NextRequest, NextResponse } from 'next/server';

/**
 * Health Check API Route
 * Public endpoint - no authentication required
 */
export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'hoste-admin-dashboard',
    },
    { status: 200 }
  );
}
