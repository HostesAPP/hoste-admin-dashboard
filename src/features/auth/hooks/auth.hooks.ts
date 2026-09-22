import { useMutation } from "@tanstack/react-query";

import { login } from "../auth.api";
import { useAuthStore } from "../auth.store";

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: login,

    onSuccess: (response) => {
      const { user, tokens } = response.data;

      setAuth(user, tokens.accessToken);
    },
  });
}