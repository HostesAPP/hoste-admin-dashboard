import { create } from "zustand";
import type { User } from "@/features/auth";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,

  setAuth: (user, accessToken) => {
    set({
      user,
      accessToken,
      isAuthenticated: true,
    });

    if (typeof document !== "undefined") {
      document.cookie = `auth_role=${encodeURIComponent(
        user.role
      )}; path=/; SameSite=Lax`;
      document.cookie = `auth_user=${encodeURIComponent(
        JSON.stringify(user)
      )}; path=/; SameSite=Lax`;
    }
  },

  clearAuth: () => {
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    });

    if (typeof document !== "undefined") {
      document.cookie =
        "auth_role=; path=/; max-age=0; SameSite=Lax";
      document.cookie =
        "auth_user=; path=/; max-age=0; SameSite=Lax";
    }
  },
}));