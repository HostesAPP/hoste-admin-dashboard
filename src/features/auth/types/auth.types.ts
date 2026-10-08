// features/auth/auth.types.ts

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  phoneNumber?: string;
  role: "STAFF" | "ADMIN" | "USER" | string;
  staffRole?: string;
  accountStatus: "ACTIVE" | "INACTIVE" | "SUSPENDED" | string;
  emailVerified?: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: number;
  activeProfileId?: string;
}

export interface LoginSuccessData {
  user: User;
  accessToken?: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: number;
  activeProfileId?: string;
  tokens?: AuthTokens;
  requiresOtp?: false;
}

export interface LoginOtpRequiredData {
  message?: string;
  email: string;
  requiresOtp: true;
}

export type LoginData = LoginSuccessData | LoginOtpRequiredData;

export interface LoginResponse {
  success?: boolean;
  message?: string;
  data?: LoginData;
  user?: User;
  accessToken?: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: number;
  activeProfileId?: string;
  tokens?: AuthTokens;
  requiresOtp?: boolean;
  email?: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  success?: boolean;
  message?: string;
  data?: LoginSuccessData;
  user?: User;
  accessToken?: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: number;
  tokens?: AuthTokens;
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

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

