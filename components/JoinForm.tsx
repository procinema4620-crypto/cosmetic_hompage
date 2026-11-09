"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";

const terms = [
  { key: "service", label: "[필수] 이용약관 동의", req: true },
  { key: "privacy", label: "[필수] 개인정보 수집 및 이용 동의", req: true },
  { key: "age", label: "[필수] 만 14세 이상입니다", req: true },
  { key: "marketing", label: "[선택] 마케팅 정보 수신 동의 (이메일·문자)", req: false },
] as const;

type Errors = Partial<Record<"email" | "password" | "confirm" | "name" | "phone" | "terms" | "form", string>>;

export default function JoinForm() {
  const { signup, user, ready } = useAuth();
  const router = useRouter();
  const [f, setF] = useState({ email: "", password: "", confirm: "", name: "", phone: "" });
  const [agree, setAgree] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (ready && user && !done) router.replace("/mypage");
  }, [ready, user, done, router]);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value;
    if (k === "phone") {
      const d = v.replace(/\D/g, "").slice(0, 11);
      v = d.length > 7 ? `${d.slice(0, 3)}-${d.slice(3, d.length - 4)}-${d.slice(-4)}` : d.length > 3 ? `${d.slice(0, 3)}-${d.slice(3)}` : d;
    }
    setF((s) => ({ ...s, [k]: v }));
  };

  const all = terms.every((t) => agree[t.key]);
  const toggleAll = (v: boolean) => setAgree(Object.fromEntries(terms.map((t) => [t.key, v])));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) er.email = "올바른 이메일 형식이 아닙니다.";
    if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(f.password)) er.password = "영문, 숫자, 특수문자를 포함해 8자 이상 입력해 주세요.";
    if (f.confirm !== f.password) er.confirm = "비밀번호가 일치하지 않습니다.";
    if (f.name.trim().length < 2) er.name = "이름을 2자 이상 입력해 주세요.";
    if (!/^01\d-\d{3,4}-\d{4}$/.test(f.phone)) er.phone = "휴대폰 번호를 정확히 입력해 주세요.";
    if (!terms.filter((t) => t.req).every((t) => agree[t.key])) er.terms = "필수 약관에 모두 동의해 주세요.";
    setErrors(er);
    if (Object.keys(er).length) return;

    const r = signup({ ...f, marketing: !!agree.marketing });
    if (!r.ok) return setErrors({ email: r.error });
    setDone(true);
  };

  if (done) {
    return (
      <div className="auth-card auth-done">
        <p className="eyebrow">WELCOME</p>
        <h1>{f.name}님, 가입을 환영해요</h1>
        <p className="auth-sub">웰컴 쿠폰 2종과 3,000P가 지급되었어요.</p>
        <ul className="done-list">
          <li><b>웰컴 10% 할인</b><small>첫 구매 최대 10,000원</small></li>
          <li><b>무료배송 쿠폰</b><small>금액 제한 없이 1회</small></li>
          <li><b>3,000P</b><small>가입 축하 포인트</small></li>
        </ul>
        <div className="done-cta">
          <Link href="/products" className="btn btn-solid">쇼핑 시작하기</Link>
          <Link href="/mypage" className="btn btn-line">마이페이지</Link>
        </div>
      </div>
    );
  }

  const Field = ({ k, label, type = "text", ph, ac }: { k: keyof typeof f; label: string; type?: string; ph: string; ac?: string }) => (
    <label className="field">
      <span>{label}</span>
      <input type={type} value={f[k]} onChange={set(k)} placeholder={ph} autoComplete={ac} aria-invalid={!!errors[k]} />
      {errors[k] && <small className="form-error" role="alert">{errors[k]}</small>}
    </label>
  );

  return (
    <div className="auth-card auth-wide">
      <h1>회원가입</h1>
      <p className="auth-sub">가입 즉시 웰컴 쿠폰 2종과 3,000P를 드려요.</p>
      <form onSubmit={submit} noValidate>
        {Field({ k: "email", label: "이메일", type: "email", ph: "example@email.com", ac: "email" })}
        {Field({ k: "password", label: "비밀번호", type: "password", ph: "영문+숫자+특수문자 8자 이상", ac: "new-password" })}
        {Field({ k: "confirm", label: "비밀번호 확인", type: "password", ph: "비밀번호 재입력", ac: "new-password" })}
        {Field({ k: "name", label: "이름", ph: "이름 입력", ac: "name" })}
        {Field({ k: "phone", label: "휴대폰 번호", type: "tel", ph: "010-0000-0000", ac: "tel" })}

        <fieldset className="terms">
          <legend className="sr">약관 동의</legend>
          <label className="check check-all">
            <input type="checkbox" checked={all} onChange={(e) => toggleAll(e.target.checked)} />
            <span>전체 동의</span>
          </label>
          {terms.map((t) => (
            <label className="check" key={t.key}>
              <input type="checkbox" checked={!!agree[t.key]} onChange={(e) => setAgree((a) => ({ ...a, [t.key]: e.target.checked }))} />
              <span>{t.label}</span>
            </label>
          ))}
          {errors.terms && <small className="form-error" role="alert">{errors.terms}</small>}
        </fieldset>

        <button className="btn btn-solid btn-block" type="submit">가입하기</button>
      </form>
      <div className="auth-links">
        <span>이미 회원이신가요?</span>
        <Link href="/login">로그인</Link>
      </div>
    </div>
  );
}
