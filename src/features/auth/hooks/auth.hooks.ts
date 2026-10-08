"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { login, verifyOtp, resendOtp, forgotPassword, resetPassword, logout } from "../auth.api";
import { useAuthStore } from "../auth.store";
import type { LoginResponse, VerifyOtpResponse, User } from "../types/auth.types";

/**
 * Helper to safely extract authenticated user and accessToken from various backend response shapes.
 */
export function extractAuthData(
  response: LoginResponse | VerifyOtpResponse
): { user: User; accessToken: string } | null {
  if (!response) return null;

  // 1. Direct top-level response: { user, accessToken, ... }
  if (response.user && response.accessToken) {
    return {
      user: response.user,
      accessToken: response.accessToken,
    };
  }

  // 2. Direct top-level with tokens object: { user, tokens: { accessToken, ... } }
  if (response.user && response.tokens?.accessToken) {
    return {
      user: response.user,
      accessToken: response.tokens.accessToken,
    };
  }

  // 3. Wrapped in data: { data: { user, accessToken, ... } } or { data: { user, tokens: { accessToken, ... } } }
  if (response.data && "user" in response.data && response.data.user) {
    const data = response.data;
    const token = data.accessToken || data.tokens?.accessToken;
    if (token) {
      return {
        user: data.user,
        accessToken: token,
      };
    }
  }

  return null;
}

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: login,
    onSuccess: (response: LoginResponse) => {
      const auth = extractAuthData(response);
      if (auth) {
        setAuth(auth.accessToken, auth.user);
      }
    },
  });
}

export function useVerifyOtp() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: verifyOtp,
    onSuccess: (response: VerifyOtpResponse) => {
      const auth = extractAuthData(response);
      if (auth) {
        setAuth(auth.accessToken, auth.user);
      }
    },
  });
}

// not working yet
export function useResendOtp() {
  return useMutation({
    mutationFn: resendOtp,
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: resetPassword,
  });
}

export function useLogout() {
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      clearAuth();
      router.push("/sign-in");
    },
  });
}

