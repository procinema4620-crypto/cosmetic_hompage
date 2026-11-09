import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "기획전/이벤트" };

const exhibitions = [
  { title: "겨울철 수분 집중 기획전", desc: "건조한 계절, 보습 루틴 최대 20% 할인", href: "/products?category=스킨케어", cls: "edit-green" },
  { title: "데일리 선케어 위크", desc: "겨울에도 자외선 차단은 필수", href: "/products?category=선케어", cls: "edit-sand" },
  { title: "홈 프레그런스 컬렉션", desc: "차분한 숲 향으로 채우는 공간", href: "/products?category=향수/디퓨저", cls: "edit-green" },
];

export default function EventsPage() {
  return (
    <div className="container page">
      <nav className="crumb" aria-label="현재 위치"><Link href="/">홈</Link> <span>/</span> <span>기획전/이벤트</span></nav>
      <header className="list-head"><h1>기획전 / 이벤트</h1></header>

      <div className="ex-grid">
        {exhibitions.map((e) => (
          <Link key={e.title} href={e.href} className={`edit ${e.cls}`}>
            <div>
              <p className="eyebrow">EXHIBITION</p>
              <h3>{e.title}</h3>
              <p>{e.desc}</p>
              <span className="more">바로가기 →</span>
            </div>
          </Link>
        ))}
      </div>

      <section id="event" className="my-block">
        <h2>진행 중인 이벤트</h2>
        <ul className="coupons">
          <li><div><strong>신규 회원 웰컴 쿠폰팩</strong><span>가입 즉시 쿠폰 2종 + 3,000P</span></div><Link href="/join" className="more">가입하기</Link></li>
          <li><div><strong>첫 구매 샘플 2종 증정</strong><span>모든 주문에 샘플 2종 동봉</span></div><small>상시</small></li>
          <li><div><strong>리뷰 작성 시 500P</strong><span>포토 리뷰는 1,000P 적립</span></div><small>~ 2026.12.31</small></li>
        </ul>
      </section>
    </div>
  );
}
