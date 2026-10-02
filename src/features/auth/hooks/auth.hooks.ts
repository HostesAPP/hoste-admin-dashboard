import { useMutation } from "@tanstack/react-query";
import { login, verifyOtp, resendOtp } from "../auth.api";
import { useAuthStore } from "../auth.store";
import type { LoginResponse } from "../types/auth.types";

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: login,
    onSuccess: (response: LoginResponse) => {
      if ("tokens" in response.data && response.data.tokens?.accessToken) {
        setAuth(response.data.user, response.data.tokens.accessToken);
      }
    },
  });
}

export function useVerifyOtp() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: verifyOtp,
    onSuccess: (response) => {
      if (response.data?.user && response.data?.tokens?.accessToken) {
        setAuth(response.data.user, response.data.tokens.accessToken);
      }
    },
  });
}

export function useResendOtp() {
  return useMutation({
    mutationFn: resendOtp,
  });
}