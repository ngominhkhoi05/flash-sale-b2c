"use client";

/**
 * Auth API hooks (React Query)
 * POST /auth/register, /auth/login, /auth/refresh-token, /auth/logout
 */
import { useMutation } from "@tanstack/react-query";
import { apiFetch, ApiError } from "./client";
import { useAuth } from "@/lib/auth/store";
import { useRouter } from "next/navigation";

// ── Types (mirror API doc) ─────────────────────────────────────────────────────

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  role: "BUYER";
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface AuthUser {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  avatarUrl?: string;
  status: string;
  createdAt: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: AuthUser;
}

// ── API functions ──────────────────────────────────────────────────────────────

async function registerApi(data: RegisterRequest): Promise<AuthSession> {
  return apiFetch<AuthSession>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
    skipAuth: true,
  });
}

async function loginApi(data: LoginRequest): Promise<AuthSession> {
  return apiFetch<AuthSession>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
    skipAuth: true,
  });
}

async function refreshTokenApi(data: RefreshRequest): Promise<{ accessToken: string; refreshToken: string }> {
  return apiFetch("/auth/refresh-token", {
    method: "POST",
    body: JSON.stringify(data),
    skipAuth: true,
  });
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

export function useRegister() {
  const { login } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterRequest) => registerApi(data),
    onSuccess: (session) => {
      login(session.accessToken, session.refreshToken, session.user);
      router.push("/");
    },
  });
}

export function useLogin() {
  const { login } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginRequest) => loginApi(data),
    onSuccess: (session) => {
      login(session.accessToken, session.refreshToken, session.user);
      router.push("/");
    },
  });
}

export function useRefreshToken() {
  const { login } = useAuth();

  return useMutation({
    mutationFn: (data: RefreshRequest) => refreshTokenApi(data),
    onSuccess: (tokens, _vars, _ctx) => {
      // Re-hydrate user from storage on refresh
      const raw = localStorage.getItem("vibemart.auth");
      if (raw) {
        try {
          const stored = JSON.parse(raw);
          login(tokens.accessToken, tokens.refreshToken, stored.user);
        } catch {
          // ignore
        }
      }
    },
  });
}

export function useLogout() {
  const { logout } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      // Call logout API (fire-and-forget, ignore errors)
      try {
        await apiFetch("/auth/logout", { method: "POST", skipAuth: true });
      } catch {
        // ignore
      }
    },
    onSuccess: () => {
      logout();
      router.push("/login");
    },
  });
}
