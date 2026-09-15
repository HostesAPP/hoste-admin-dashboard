// features/auth/auth.api.ts

import { apiClient } from "@/lib/api-client";
import type { LoginRequest, LoginResponse } from "@/features/auth";

export function login(data: LoginRequest) {
  return apiClient<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}