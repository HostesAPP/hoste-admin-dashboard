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

export interface LoginData {
  user: User;
  tokens: AuthTokens;
}

export interface LoginResponse {
  success: boolean;
  data: LoginData;
}
