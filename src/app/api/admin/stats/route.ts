import { NextRequest, NextResponse } from 'next/server';

/**
 * Admin Dashboard Statistics API Route
 * Protected endpoint - requires valid admin token in headers
 * 
 * Accepted Headers (in priority order):
 * 1. X-Dev-Admin-Token: <token>
 * 2. X-Admin-Token: <token>
 * 3. Authorization: Bearer <token>
 */

export async function GET(request: NextRequest) {
  // Check if authentication was successful (set by middleware)
  const isAuthenticated = request.headers.get('x-admin-authenticated');

  if (!isAuthenticated) {
    return NextResponse.json(
      {
        error: 'Unauthorized',
        message: 'Admin authentication required',
      },
      { status: 401 }
    );
  }

  // Mock admin statistics data
  const statsData = {
    timestamp: new Date().toISOString(),
    data: {
      totalGroups: 156,
      activeGroups: 142,
      suspendedGroups: 14,
      totalMembers: 2847,
      activeMembers: 2641,
      suspendedMembers: 206,
      totalUsers: 3200,
      activeUsers: 2950,
      accountsCreatedToday: 45,
      suspensionsToday: 3,
    },
    metadata: {
      lastUpdated: new Date().toISOString(),
      dataSource: 'admin-dashboard-api',
      authenticatedAt: new Date().toISOString(),
    },
  };

  return NextResponse.json(statsData, { status: 200 });
}

export async function POST(request: NextRequest) {
  // Check if authentication was successful (set by middleware)
  const isAuthenticated = request.headers.get('x-admin-authenticated');

  if (!isAuthenticated) {
    return NextResponse.json(
      {
        error: 'Unauthorized',
        message: 'Admin authentication required',
      },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    // Example: Process admin action
    return NextResponse.json(
      {
        success: true,
        message: 'Admin action processed',
        action: body.action,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Invalid request',
        message: 'Failed to parse request body',
      },
      { status: 400 }
    );
  }
}
