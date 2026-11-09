"use client";

import { useState } from "react";
import { useAuth } from "./AuthProvider";

export default function InquiryForm() {
  const { user } = useAuth();
  const [sent, setSent] = useState(false);
  const [type, setType] = useState("배송");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim().length < 2 || body.trim().length < 10) return setErr("제목 2자 이상, 내용 10자 이상 입력해 주세요.");
    setErr("");
    setSent(true);
  };

  if (sent) {
    return (
      <div className="empty-box">
        <p><b>문의가 접수되었어요.</b><br />영업일 기준 1~2일 내 {user?.email ?? "남겨주신 연락처"}로 답변드릴게요.</p>
        <button className="btn btn-line" onClick={() => { setSent(false); setTitle(""); setBody(""); }}>새 문의 작성</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="inq" noValidate>
      <label className="field">
        <span>문의 유형</span>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          {["배송", "교환/반품", "상품", "결제", "회원", "기타"].map((t) => <option key={t}>{t}</option>)}
        </select>
      </label>
      <label className="field">
        <span>제목</span>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목을 입력해 주세요" />
      </label>
      <label className="field">
        <span>내용</span>
        <textarea rows={6} value={body} onChange={(e) => setBody(e.target.value)} placeholder="문의 내용을 자세히 적어주시면 빠르게 답변드릴 수 있어요." />
      </label>
      {err && <p className="form-error" role="alert">{err}</p>}
      <button className="btn btn-solid" type="submit">문의 접수</button>
    </form>
  );
}
