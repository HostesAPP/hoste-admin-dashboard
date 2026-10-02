// features/auth/auth.api.ts

import { apiClient } from "@/lib/api-client";
import type {
  LoginRequest,
  LoginResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ResendOtpRequest,
  ResendOtpResponse,
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

export async function resendOtp(data: ResendOtpRequest) {
  return apiClient<ResendOtpResponse>("/auth/staff/resend-otp", {
    method: "POST",
    body: JSON.stringify(data),
  });
}