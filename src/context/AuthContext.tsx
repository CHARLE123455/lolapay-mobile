import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { onAuthExpired } from "../lib/api";
import type { LoginInput, RegisterInput } from "../lib/types";
import { authService, usersService, type MeResponse } from "../services";

interface AuthState {
  user: MeResponse | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const loadMe = useCallback(async () => setUser(await usersService.me()), []);

  useEffect(() => {
    (async () => {
      try {
        if (await authService.restoreSession()) await loadMe();
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [loadMe]);

  useEffect(
    () =>
      onAuthExpired(() => {
        setUser(null);
        queryClient.clear();
      }),
    [queryClient],
  );

  const login = useCallback(
    async (input: LoginInput) => {
      await authService.login(input);
      await loadMe();
    },
    [loadMe],
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      await authService.register(input);
      await loadMe();
    },
    [loadMe],
  );

  const loginWithGoogle = useCallback(
    async (idToken: string) => {
      await authService.loginWithGoogle(idToken);
      await loadMe();
    },
    [loadMe],
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      queryClient.clear();
    }
  }, [queryClient]);

  const value = useMemo<AuthState>(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      loginWithGoogle,
      logout,
      refreshUser: loadMe,
    }),
    [user, loading, login, register, loginWithGoogle, logout, loadMe],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
