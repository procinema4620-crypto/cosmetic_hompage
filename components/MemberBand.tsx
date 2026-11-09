"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { discountRate, products } from "@/lib/products";

const maxDiscount = Math.max(...products.map(discountRate));

/** label: 화면 표시 / q: 실제 검색어 */
const hotKeywords = [
  { label: "시카 세럼", q: "시카" },
  { label: "선케어", q: "선케어" },
  { label: "비타민C", q: "비타" },
  { label: "클렌징밤", q: "클렌징 밤" },
  { label: "수분", q: "수분" },
];

/** 비로그인: 가입 유도 / 로그인: 개인화된 요약 */
export default function MemberBand() {
  const { user, ready } = useAuth();

  if (!ready) return <section className="member-band" aria-hidden="true" />;

  if (!user) {
    return (
      <section className="member-band promo-band" aria-label="이번 주 특가와 인기 검색어">
        <div className="container mb-in">
          <Link href="/products?sale=1" className="promo">
            <span className="promo-tag">WINTER SALE</span>
            <span className="promo-text">이번 주 특가 · <b>최대 {maxDiscount}% 할인</b></span>
            <span className="promo-go">세일 상품 보기 →</span>
          </Link>
          <div className="hot" aria-label="인기 검색어">
            <span className="hot-label">인기 검색어</span>
            <ul>
              {hotKeywords.map((k) => (
                <li key={k.label}>
                  <Link href={`/products?q=${encodeURIComponent(k.q)}`}>#{k.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    );
  }

  const shipping = user.orders.filter((o) => o.status !== "배송완료").length;
  return (
    <section className="member-band is-in" aria-label="내 정보 요약">
      <div className="container mb-in">
        <p><b>{user.name}님</b>, 오늘도 맑은 하루 되세요 <span className={`grade grade-${user.grade}`}>{user.grade}</span></p>
        <ul className="mb-stats">
          <li><Link href="/mypage"><small>포인트</small><b>{user.points.toLocaleString("ko-KR")}P</b></Link></li>
          <li><Link href="/mypage"><small>쿠폰</small><b>{user.coupons.length}장</b></Link></li>
          <li><Link href="/orders"><small>진행 중 주문</small><b>{shipping}건</b></Link></li>
          <li><Link href="/orders"><small>전체 주문</small><b>{user.orders.length}건</b></Link></li>
        </ul>
      </div>
    </section>
  );
}
