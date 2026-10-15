import { create } from "zustand";
import type { User } from "./types/auth.types";

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (accessToken: string | User, user?: User | string, refreshToken?: string) => void;
  setTokens: (accessToken: string, refreshToken?: string) => void;
  setAccessToken: (accessToken: string | null) => void;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,

  setAuth: (arg1: string | User, arg2?: string | User, arg3?: string) => {
    let accessToken: string | null = null;
    let user: User | null = null;
    const refreshToken: string | null = arg3 || null;

    // Handle setAuth(accessToken, user, refreshToken) and setAuth(user, accessToken, refreshToken)
    if (typeof arg1 === "string") {
      accessToken = arg1;
      user = (arg2 as User) || null;
    } else if (arg1 && typeof arg1 === "object") {
      user = arg1;
      accessToken = typeof arg2 === "string" ? arg2 : null;
    }

    set((state) => ({
      accessToken,
      refreshToken: refreshToken || state.refreshToken,
      user,
      isAuthenticated: Boolean(accessToken && user),
    }));

    if (typeof document !== "undefined" && user) {
      document.cookie = `auth_role=${encodeURIComponent(
        user.role
      )}; path=/; SameSite=Lax`;
      document.cookie = `auth_user=${encodeURIComponent(
        JSON.stringify(user)
      )}; path=/; SameSite=Lax`;
    }
  },

  setTokens: (accessToken: string, refreshToken?: string) => {
    set((state) => ({
      accessToken,
      refreshToken: refreshToken !== undefined ? refreshToken : state.refreshToken,
      isAuthenticated: Boolean(accessToken && state.user),
    }));
  },

  setAccessToken: (accessToken: string | null) => {
    set((state) => ({
      accessToken,
      isAuthenticated: Boolean(accessToken && state.user),
    }));
  },

  setUser: (user: User | null) => {
    set((state) => ({
      user,
      isAuthenticated: Boolean(state.accessToken && user),
    }));

    if (typeof document !== "undefined") {
      if (user) {
        document.cookie = `auth_role=${encodeURIComponent(
          user.role
        )}; path=/; SameSite=Lax`;
        document.cookie = `auth_user=${encodeURIComponent(
          JSON.stringify(user)
        )}; path=/; SameSite=Lax`;
      } else {
        document.cookie = "auth_role=; path=/; max-age=0; SameSite=Lax";
        document.cookie = "auth_user=; path=/; max-age=0; SameSite=Lax";
      }
    }
  },

  clearAuth: () => {
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
    });

    if (typeof document !== "undefined") {
      document.cookie = "auth_role=; path=/; max-age=0; SameSite=Lax";
      document.cookie = "auth_user=; path=/; max-age=0; SameSite=Lax";
    }
  },
}));

