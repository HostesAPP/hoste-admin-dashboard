import { apiClient } from "@/lib/api-client";
import type {
  LoginRequest,
  LoginResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ResendOtpRequest,
  ResendOtpResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from "./types/auth.types";

export async function login(data: LoginRequest) {
  return apiClient<LoginResponse>("/auth/staff/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function verifyOtp(data: VerifyOtpRequest) {
  return apiClient<VerifyOtpResponse>("/auth/staff/verify-otp", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// no route for this yet
export async function resendOtp(data: ResendOtpRequest) {
  return apiClient<ResendOtpResponse>("", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function forgotPassword(data: ForgotPasswordRequest) {
  return apiClient<ForgotPasswordResponse>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function resetPassword(data: ResetPasswordRequest) {
  return apiClient<ResetPasswordResponse>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function rotateRefreshToken(data: RefreshTokenRequest) {
  return apiClient<RefreshTokenResponse>("/auth/refresh-token", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function logout() {
  return apiClient<{ success?: boolean; message?: string }>("/auth/logout", {
    method: "POST",
  });
}


