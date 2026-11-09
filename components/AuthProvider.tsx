"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getProduct } from "@/lib/products";
import { seedMembers, welcomeCoupons, type Member, type Order } from "@/lib/members";

interface SignupInput {
  email: string;
  password: string;
  name: string;
  phone: string;
  marketing: boolean;
}

interface AuthCtx {
  user: Member | null;
  ready: boolean;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  signup: (input: SignupInput) => { ok: boolean; error?: string };
  logout: () => void;
  /** 이름 + 휴대폰으로 가입 이메일(마스킹)을 찾습니다. */
  findEmail: (name: string, phone: string) => string | null;
  /** 이메일 + 이름 + 휴대폰이 모두 일치하는 회원인지 확인합니다. */
  verifyMember: (email: string, name: string, phone: string) => boolean;
  resetPassword: (email: string, name: string, phone: string, newPassword: string) => { ok: boolean; error?: string };
  placeOrder: (lines: Record<string, number>) => Order | null;
}

const Ctx = createContext<AuthCtx | null>(null);
const MEMBERS_KEY = "mv-members";
const SESSION_KEY = "mv-session";
const FREE_SHIPPING = 40000;

const digits = (v: string) => v.replace(/\D/g, "");
const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

/** demo@maisonverde.com → de**@maisonverde.com */
export const maskEmail = (email: string) => {
  const [id, domain] = email.split("@");
  return `${id.slice(0, 2)}${"*".repeat(Math.max(2, id.length - 2))}@${domain}`;
};

const today = () => new Date().toISOString().slice(0, 10);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [members, setMembers] = useState<Member[]>(seedMembers);
  const [session, setSession] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(MEMBERS_KEY);
      if (raw) setMembers(JSON.parse(raw));
      setSession(localStorage.getItem(SESSION_KEY));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
      if (session) localStorage.setItem(SESSION_KEY, session);
      else localStorage.removeItem(SESSION_KEY);
    } catch {}
  }, [members, session, ready]);

  const user = useMemo(() => members.find((m) => m.email === session) ?? null, [members, session]);

  const login = useCallback<AuthCtx["login"]>(
    (email, password) => {
      const m = members.find((x) => x.email.toLowerCase() === email.trim().toLowerCase());
      if (!m || m.password !== password) return { ok: false, error: "이메일 또는 비밀번호가 올바르지 않습니다." };
      setSession(m.email);
      return { ok: true };
    },
    [members],
  );

  const signup = useCallback<AuthCtx["signup"]>(
    (input) => {
      const email = input.email.trim().toLowerCase();
      if (members.some((m) => m.email.toLowerCase() === email)) return { ok: false, error: "이미 가입된 이메일입니다." };
      const member: Member = {
        email,
        password: input.password,
        name: input.name.trim(),
        phone: input.phone,
        grade: "웰컴",
        points: 3000,
        coupons: welcomeCoupons(),
        orders: [],
        joinedAt: today(),
        marketing: input.marketing,
      };
      setMembers((l) => [...l, member]);
      setSession(email);
      return { ok: true };
    },
    [members],
  );

  const logout = useCallback(() => setSession(null), []);

  const findEmail = useCallback<AuthCtx["findEmail"]>(
    (name, phone) => {
      const m = members.find((x) => same(x.name, name) && digits(x.phone) === digits(phone));
      return m ? maskEmail(m.email) : null;
    },
    [members],
  );

  const verifyMember = useCallback<AuthCtx["verifyMember"]>(
    (email, name, phone) =>
      members.some((x) => same(x.email, email) && same(x.name, name) && digits(x.phone) === digits(phone)),
    [members],
  );

  const resetPassword = useCallback<AuthCtx["resetPassword"]>(
    (email, name, phone, newPassword) => {
      if (!verifyMember(email, name, phone)) return { ok: false, error: "회원 정보가 일치하지 않습니다." };
      setMembers((l) => l.map((m) => (same(m.email, email) ? { ...m, password: newPassword } : m)));
      return { ok: true };
    },
    [verifyMember],
  );

  const placeOrder = useCallback<AuthCtx["placeOrder"]>(
    (lines) => {
      if (!user) return null;
      const items = Object.entries(lines)
        .map(([slug, qty]) => ({ p: getProduct(slug), qty }))
        .filter((i): i is { p: NonNullable<typeof i.p>; qty: number } => !!i.p && i.qty > 0)
        .map(({ p, qty }) => ({ slug: p.slug, qty, price: p.price }));
      if (items.length === 0) return null;
      const sum = items.reduce((a, i) => a + i.price * i.qty, 0);
      const shipping = sum >= FREE_SHIPPING ? 0 : 3000;
      const d = today();
      const order: Order = {
        id: `MV${d.replace(/-/g, "")}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        date: d,
        status: "결제완료",
        items,
        shipping,
        total: sum + shipping,
      };
      setMembers((l) =>
        l.map((m) =>
          m.email === user.email
            ? { ...m, orders: [order, ...m.orders], points: m.points + Math.floor(sum * 0.01) }
            : m,
        ),
      );
      return order;
    },
    [user],
  );

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
