"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  clearTokens as clearTokensFromStorage,
  setTokens as setTokensInStorage,
  getAccessToken,
} from "@/lib/api/client";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  avatarUrl?: string;
  status: string;
  createdAt: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (accessToken: string, refreshToken: string, user: AuthUser) => void;
  logout: () => void;
  setUser: (user: AuthUser) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "vibemart.auth";

function loadFromStorage(): { accessToken: string; refreshToken: string; user: AuthUser } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveToStorage(data: {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Hydrate from localStorage on mount (client-side only)
  useEffect(() => {
    const stored = loadFromStorage();
    if (stored) {
      setState({
        user: stored.user,
        accessToken: stored.accessToken,
        refreshToken: stored.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = useCallback(
    (accessToken: string, refreshToken: string, user: AuthUser) => {
      // IMPORTANT: setTokensInStorage must run BEFORE saveToStorage, because
      // setTokensInStorage writes {accessToken, refreshToken} only (no user).
      // If saveToStorage runs first, setTokensInStorage will overwrite and
      // remove the user from localStorage, causing the header to lose the
      // user info after page refresh (F5).
      setTokensInStorage(accessToken, refreshToken);
      const data = { accessToken, refreshToken, user };
      saveToStorage(data);
      setState({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
    },
    []
  );

  const logout = useCallback(() => {
    clearTokensFromStorage();
    setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const setUser = useCallback((user: AuthUser) => {
    setState((prev) => {
      if (!prev.accessToken || !prev.refreshToken) return prev;
      const data = {
        accessToken: prev.accessToken,
        refreshToken: prev.refreshToken,
        user,
      };
      saveToStorage(data);
      return { ...prev, user };
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
