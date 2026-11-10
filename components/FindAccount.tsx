"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "./AuthProvider";

type Tab = "id" | "pw";

const formatPhone = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  return d.length > 7 ? `${d.slice(0, 3)}-${d.slice(3, d.length - 4)}-${d.slice(-4)}` : d.length > 3 ? `${d.slice(0, 3)}-${d.slice(3)}` : d;
};
const PW_RULE = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
const PHONE_RULE = /^01\d-\d{3,4}-\d{4}$/;

export default function FindAccount({ initialTab }: { initialTab: Tab }) {
  const [tab, setTab] = useState<Tab>(initialTab);

  return (
    <div className="auth-card auth-wide">
      <h1>아이디 · 비밀번호 찾기</h1>
      <p className="auth-sub">가입할 때 입력한 정보로 확인해 드려요.</p>

      <div className="tabs" role="tablist" aria-label="찾기 유형">
        <button role="tab" aria-selected={tab === "id"} className={tab === "id" ? "on" : ""} onClick={() => setTab("id")}>
          아이디 찾기
        </button>
        <button role="tab" aria-selected={tab === "pw"} className={tab === "pw" ? "on" : ""} onClick={() => setTab("pw")}>
          비밀번호 재설정
        </button>
      </div>

      {tab === "id" ? <FindId onGoReset={() => setTab("pw")} /> : <ResetPw />}

      <div className="auth-links">
        <Link href="/login">로그인</Link>
        <Link href="/join">회원가입</Link>
      </div>
      <p className="demo-note">
        데모 사이트라 문자 인증 없이 이름·휴대폰 번호 일치 여부만 확인합니다.
        <br />
        데모 계정: 김서연 010-1234-5678 / 박지훈 010-9876-5432
      </p>
    </div>
  );
}

function FindId({ onGoReset }: { onGoReset: () => void }) {
  const { findEmail } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    if (name.trim().length < 2 || !PHONE_RULE.test(phone)) return setError("이름과 휴대폰 번호를 정확히 입력해 주세요.");
    const found = await findEmail(name, phone);
    if (!found) return setError("일치하는 회원 정보를 찾을 수 없어요.");
    setError("");
    setResult(found);
  };

  if (result) {
    return (
      <div className="found" role="status">
        <p>가입하신 아이디(이메일)는</p>
        <strong>{result}</strong>
        <p className="found-note">개인정보 보호를 위해 일부는 가려서 보여드려요.</p>
        <div className="done-cta">
          <Link href="/login" className="btn btn-solid">로그인하기</Link>
          <button className="btn btn-line" onClick={onGoReset}>비밀번호 재설정</button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <label className="field">
        <span>이름</span>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="가입 시 입력한 이름" autoComplete="name" />
      </label>
      <label className="field">
        <span>휴대폰 번호</span>
        <input type="tel" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} placeholder="010-0000-0000" autoComplete="tel" />
      </label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="btn btn-solid btn-block" type="submit">아이디 찾기</button>
    </form>
  );
}

function ResetPw() {
  const { verifyMember, resetPassword } = useAuth();
  const [f, setF] = useState({ email: "", name: "", phone: "" });
  const [verified, setVerified] = useState(false);
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) return setError("올바른 이메일 형식이 아닙니다.");
    if (f.name.trim().length < 2 || !PHONE_RULE.test(f.phone)) return setError("이름과 휴대폰 번호를 정확히 입력해 주세요.");
    if (!(await verifyMember(f.email, f.name, f.phone))) return setError("입력하신 정보와 일치하는 회원이 없어요.");
    setError("");
    setVerified(true);
  };

  const reset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!PW_RULE.test(pw)) return setError("영문, 숫자, 특수문자를 포함해 8자 이상 입력해 주세요.");
    if (pw !== confirm) return setError("비밀번호가 일치하지 않습니다.");
    const r = await resetPassword(f.email, f.name, f.phone, pw);
    if (!r.ok) return setError(r.error ?? "재설정에 실패했어요.");
    setError("");
    setDone(true);
  };

  if (done) {
    return (
      <div className="found" role="status">
        <strong>비밀번호가 변경되었어요</strong>
        <p className="found-note">새 비밀번호로 로그인해 주세요.</p>
        <div className="done-cta">
          <Link href="/login" className="btn btn-solid">로그인하기</Link>
        </div>
      </div>
    );
  }

  if (verified) {
    return (
      <form onSubmit={reset} noValidate>
        <p className="verified-note">✓ 본인 확인이 완료되었어요. 새 비밀번호를 입력해 주세요.</p>
        <label className="field">
          <span>새 비밀번호</span>
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="영문+숫자+특수문자 8자 이상" autoComplete="new-password" />
        </label>
        <label className="field">
          <span>새 비밀번호 확인</span>
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="비밀번호 재입력" autoComplete="new-password" />
        </label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="btn btn-solid btn-block" type="submit">비밀번호 변경</button>
      </form>
    );
  }

  return (
    <form onSubmit={verify} noValidate>
      <label className="field">
        <span>이메일</span>
        <input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} placeholder="example@email.com" autoComplete="username" />
      </label>
      <label className="field">
        <span>이름</span>
        <input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="가입 시 입력한 이름" autoComplete="name" />
      </label>
      <label className="field">
        <span>휴대폰 번호</span>
        <input type="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: formatPhone(e.target.value) })} placeholder="010-0000-0000" autoComplete="tel" />
      </label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="btn btn-solid btn-block" type="submit">본인 확인</button>
    </form>
  );
}
