"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Order, PublicMember } from "@/lib/members";

interface SignupInput {
  email: string;
  password: string;
  name: string;
  phone: string;
  marketing: boolean;
}

type Result = { ok: boolean; error?: string };

interface AuthCtx {
  user: PublicMember | null;
  /** 서버에 로그인 상태를 물어보는 첫 요청이 끝났는지 */
  ready: boolean;
  login: (email: string, password: string) => Promise<Result>;
  signup: (input: SignupInput) => Promise<Result>;
  logout: () => Promise<void>;
  /** 이름 + 휴대폰으로 가입 이메일(마스킹)을 찾습니다. */
  findEmail: (name: string, phone: string) => Promise<string | null>;
  /** 이메일 + 이름 + 휴대폰이 모두 일치하는 회원인지 확인합니다. */
  verifyMember: (email: string, name: string, phone: string) => Promise<boolean>;
  resetPassword: (email: string, name: string, phone: string, newPassword: string) => Promise<Result>;
  placeOrder: (lines: Record<string, number>) => Promise<Order | null>;
}

const Ctx = createContext<AuthCtx | null>(null);

const NETWORK_ERROR = "서버에 연결할 수 없어요. 잠시 후 다시 시도해 주세요.";

/** 서버 API 호출 (로그인 쿠키는 브라우저가 자동으로 함께 보냅니다) */
async function api<T>(url: string, body?: unknown): Promise<{ status: number; data: T | null }> {
  try {
    const res = await fetch(url, {
      method: body === undefined ? "GET" : "POST",
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
    });
    return { status: res.status, data: (await res.json().catch(() => null)) as T | null };
  } catch {
    return { status: 0, data: null };
  }
}

type AuthRes = { ok: boolean; error?: string; user?: PublicMember };

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PublicMember | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    api<{ user: PublicMember | null }>("/api/auth/me").then((r) => {
      if (!alive) return;
      setUser(r.data?.user ?? null);
      setReady(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  const authCall = useCallback(async (url: string, body: unknown): Promise<Result> => {
    const r = await api<AuthRes>(url, body);
    if (r.data?.ok && r.data.user) {
      setUser(r.data.user);
      return { ok: true };
    }
    return { ok: false, error: r.data?.error ?? NETWORK_ERROR };
  }, []);

  const login = useCallback<AuthCtx["login"]>((email, password) => authCall("/api/auth/login", { email, password }), [authCall]);
  const signup = useCallback<AuthCtx["signup"]>((input) => authCall("/api/auth/signup", input), [authCall]);

  const logout = useCallback(async () => {
    await api("/api/auth/logout", {});
    setUser(null);
  }, []);

  const findEmail = useCallback<AuthCtx["findEmail"]>(async (name, phone) => {
    const r = await api<{ email: string | null }>("/api/auth/find-email", { name, phone });
    return r.data?.email ?? null;
  }, []);

  const verifyMember = useCallback<AuthCtx["verifyMember"]>(async (email, name, phone) => {
    const r = await api<{ ok: boolean }>("/api/auth/verify", { email, name, phone });
    return !!r.data?.ok;
  }, []);

  const resetPassword = useCallback<AuthCtx["resetPassword"]>(async (email, name, phone, newPassword) => {
    const r = await api<AuthRes>("/api/auth/reset-password", { email, name, phone, newPassword });
    return r.data?.ok ? { ok: true } : { ok: false, error: r.data?.error ?? NETWORK_ERROR };
  }, []);

  const placeOrder = useCallback<AuthCtx["placeOrder"]>(async (lines) => {
    const r = await api<{ ok: boolean; order?: Order; user?: PublicMember }>("/api/orders", { lines });
    if (!r.data?.ok || !r.data.order) return null;
    if (r.data.user) setUser(r.data.user);
    return r.data.order;
  }, []);

  const value = useMemo(
    () => ({ user, ready, login, signup, logout, findEmail, verifyMember, resetPassword, placeOrder }),
    [user, ready, login, signup, logout, findEmail, verifyMember, resetPassword, placeOrder],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
}
