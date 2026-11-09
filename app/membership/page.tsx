import type { Metadata } from "next";
import Link from "next/link";
import { gradeBenefit, type Grade } from "@/lib/members";

export const metadata: Metadata = { title: "멤버십/쿠폰" };

export default function MembershipPage() {
  const grades = Object.keys(gradeBenefit) as Grade[];
  return (
    <div className="container page">
      <nav className="crumb" aria-label="현재 위치"><Link href="/">홈</Link> <span>/</span> <span>멤버십/쿠폰</span></nav>
      <header className="list-head"><h1>멤버십 / 쿠폰</h1><p>구매할수록 커지는 혜택</p></header>

      <ul className="tiers">
        {grades.map((g) => (
          <li key={g} className={`tier tier-${g}`}>
            <p className="eyebrow">GRADE</p>
            <strong>{g}</strong>
            <span className="tier-rate">{gradeBenefit[g].rate} 적립</span>
            <small>{gradeBenefit[g].note}</small>
          </li>
        ))}
      </ul>

      <section className="my-block">
        <h2>신규 가입 웰컴 혜택</h2>
        <ul className="coupons">
          <li><div><strong>웰컴 10% 할인 쿠폰</strong><span>첫 구매 시 최대 10,000원 할인</span></div><small>가입 즉시 지급</small></li>
          <li><div><strong>무료배송 쿠폰</strong><span>금액 제한 없이 1회 사용</span></div><small>가입 즉시 지급</small></li>
          <li><div><strong>3,000P 적립금</strong><span>1P = 1원으로 사용</span></div><small>가입 즉시 지급</small></li>
        </ul>
        <div className="done-cta" style={{ justifyContent: "flex-start", marginTop: 28 }}>
          <Link href="/join" className="btn btn-solid">회원가입하고 혜택 받기</Link>
          <Link href="/login" className="btn btn-line">로그인</Link>
        </div>
      </section>
    </div>
  );
}
