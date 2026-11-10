"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";

export const safeNext = (n?: string) => (n && n.startsWith("/") && !n.startsWith("//") ? n : "/mypage");

export default function LoginForm({ next }: { next?: string }) {
  const { login, user, ready } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const dest = safeNext(next);

  useEffect(() => {
    if (ready && user) router.replace(dest);
  }, [ready, user, dest, router]);

  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    const r = await login(email, pw);
    setBusy(false);
    if (!r.ok) return setError(r.error ?? "로그인에 실패했습니다.");
    router.push(dest);
  };

  const fillDemo = (e: string, p: string) => {
    setEmail(e);
    setPw(p);
    setError("");
  };

  return (
    <div className="auth-card">
      <h1>로그인</h1>
      <p className="auth-sub">메종 베르 회원이 되어 다양한 혜택을 만나보세요.</p>

      <form onSubmit={submit} noValidate>
        <label className="field">
          <span>이메일</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@email.com" autoComplete="username" required />
        </label>
        <label className="field">
          <span>비밀번호</span>
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="비밀번호 입력" autoComplete="current-password" required />
        </label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="btn btn-solid btn-block" type="submit" disabled={busy}>{busy ? "로그인 중..." : "로그인"}</button>
      </form>

      <div className="auth-links">
        <Link href="/find-account">아이디 · 비밀번호 찾기</Link>
        <Link href="/join">회원가입</Link>
      </div>

      <div className="demo-box">
        <p><b>데모 계정</b> · 아래를 누르면 자동 입력됩니다</p>
        <button type="button" onClick={() => fillDemo("demo@maisonverde.com", "demo1234!")}>
          <b>김서연 (VIP · 주문 3건)</b><small>demo@maisonverde.com / demo1234!</small>
        </button>
        <button type="button" onClick={() => fillDemo("new@maisonverde.com", "new12345!")}>
          <b>박지훈 (신규 회원 · 주문 없음)</b><small>new@maisonverde.com / new12345!</small>
        </button>
      </div>
    </div>
  );
}
