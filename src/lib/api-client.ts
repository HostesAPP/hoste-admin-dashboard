import { useAuthStore } from "@/features/auth/auth.store";
import type { RefreshTokenResponse } from "@/features/auth/types/auth.types";
import { redirect } from "next/navigation";

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

// Shared active refresh promise to prevent duplicate rotation calls during concurrent 401s
let activeRefreshPromise: Promise<string | null> | null = null;

async function executeTokenRefresh(): Promise<string | null> {
  const { refreshToken, accessToken, setTokens, clearAuth } = useAuthStore.getState();

  if (!refreshToken) {
    clearAuth();
    return null;
  }

  try {
    const response = await fetch(`${API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        refreshToken,
        ...(accessToken ? { accessToken } : {}),
      }),
    });

    const data: RefreshTokenResponse = await response.json().catch(() => null);

    if (!response.ok || !data?.data?.accessToken) {
      clearAuth();
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/sign-in")) {
        redirect("/sign-in")
      }
      return null;
    }

    const newAccessToken = data.data.accessToken;
    const newRefreshToken = data.data.refreshToken;

    setTokens(newAccessToken, newRefreshToken);
    return newAccessToken;
  } catch {
    clearAuth();
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/sign-in")) {
      redirect("/sign-in")
    }
    return null;
  } finally {
    activeRefreshPromise = null;
  }
}

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

  const isAuthEndpoint =
    endpoint.includes("/auth/refresh-token") ||
    endpoint.includes("/auth/staff/login") ||
    endpoint.includes("/auth/staff/verify-otp") ||
    endpoint.includes("/auth/forgot-password") ||
    endpoint.includes("/auth/reset-password");

  // Intercept 401 Unauthorized for token refresh & retry
  if (response.status === 401 && !isAuthEndpoint) {
    if (!activeRefreshPromise) {
      activeRefreshPromise = executeTokenRefresh();
    }

    const newAccessToken = await activeRefreshPromise;

    if (newAccessToken) {
      // Retry original request with new access token
      const retryHeaders = new Headers(options?.headers);
      if (!retryHeaders.has("Content-Type") && !(options?.body instanceof FormData)) {
        retryHeaders.set("Content-Type", "application/json");
      }
      retryHeaders.set("Authorization", `Bearer ${newAccessToken}`);

      const retryResponse = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: retryHeaders,
        credentials: "include",
      });

      const retryData = await retryResponse.json().catch(() => null);

      if (!retryResponse.ok) {
        throw new ApiError(
          retryData?.message ||
            retryData?.error?.message ||
            `Request failed with status ${retryResponse.status}`,
          retryResponse.status,
          retryData?.code || retryData?.error?.code
        );
      }

      return retryData as T;
    }
  }

  const data = await response.json().catch(() => null);

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

