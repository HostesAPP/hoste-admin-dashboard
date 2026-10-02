// features/auth/auth.types.ts

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  phoneNumber?: string;
  role: "USER" | "ADMIN" | "STAFF";
  accountStatus: "ACTIVE" | "INACTIVE" | "SUSPENDED";
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface LoginSuccessData {
  user: User;
  tokens: AuthTokens;
  requiresOtp?: false;
}

export interface LoginOtpRequiredData {
  message?: string;
  email: string;
  requiresOtp: true;
}

export type LoginData = LoginSuccessData | LoginOtpRequiredData;

export interface LoginResponse {
  success: boolean;
  data: LoginData;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  data: LoginSuccessData;
}

export interface ResendOtpRequest {
  email: string;
}

export interface ResendOtpResponse {
  success: boolean;
  data: {
    message?: string;
  };
}

