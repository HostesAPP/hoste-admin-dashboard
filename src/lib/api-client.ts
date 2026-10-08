import { useAuthStore } from "@/features/auth/auth.store";

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const headers = new Headers(options?.headers);

  // Set default Content-Type header if not provided and body is not FormData
  if (!headers.has("Content-Type") && !(options?.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // Automatically attach access token from Zustand memory if present
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include", // Enables sending/receiving HttpOnly cookies (e.g., refresh token)
  });

  const data = await response.json().catch(() => null);

  // TODO: Expected Future Token Refresh Flow (when backend refresh endpoint is provided):
  // 1. Intercept 401 response.
  // 2. Call refresh endpoint (e.g. POST /auth/refresh or /auth/staff/refresh) with credentials: 'include'.
  // 3. Backend reads the HttpOnly refresh-token cookie.
  // 4. On success, receive new accessToken from backend response.
  // 5. Update Zustand store: useAuthStore.getState().setAccessToken(newAccessToken).
  // 6. Retry original request with the new access token.
  // 7. If refresh fails (or returns 401), clear auth via useAuthStore.getState().clearAuth() and redirect to login.

  if (!response.ok) {
    throw new ApiError(
      data?.message ||
      data?.error?.message ||
      `Request failed with status ${response.status}`,
      response.status,
      data?.code || data?.error?.code
    );
  }

  return data as T;
}
