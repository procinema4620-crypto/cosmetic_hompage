"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { useRequireAuth } from "@/components/useRequireAuth";
import OrderCard from "@/components/OrderCard";
import { gradeBenefit, orderSteps } from "@/lib/members";

export default function MyPage() {
  const { user, ready } = useRequireAuth();
  const { logout } = useAuth();
  const router = useRouter();

  if (!ready || !user) return <div className="container page"><p className="muted-p">불러오는 중…</p></div>;

  const counts = orderSteps.map((s) => user.orders.filter((o) => o.status === s).length);
  const benefit = gradeBenefit[user.grade];

  return (
    <div className="container page">
      <nav className="crumb" aria-label="현재 위치"><Link href="/">홈</Link> <span>/</span> <span>마이페이지</span></nav>

      <section className="my-hero">
        <div className="my-who">
          <span className="avatar" aria-hidden="true">{user.name.slice(0, 1)}</span>
          <div>
            <p className="eyebrow">MY MAISON</p>
            <h1>{user.name}님, 안녕하세요</h1>
            <p className="my-mail">{user.email} · 가입일 {user.joinedAt.replaceAll("-", ".")}</p>
          </div>
        </div>
        <div className="my-actions">
          <Link href="/orders" className="btn btn-line">주문배송 조회</Link>
          <button className="btn btn-line" onClick={() => { logout(); router.push("/"); }}>로그아웃</button>
        </div>
      </section>

      <section className="stat-grid" aria-label="회원 혜택 요약">
        <div className="stat">
          <small>회원 등급</small>
          <strong className={`grade grade-${user.grade}`}>{user.grade}</strong>
          <span>포인트 {benefit.rate} 적립</span>
        </div>
        <div className="stat">
          <small>보유 포인트</small>
          <strong>{user.points.toLocaleString("ko-KR")}<em>P</em></strong>
          <span>1P = 1원 · 현금처럼 사용</span>
        </div>
        <div className="stat">
          <small>보유 쿠폰</small>
          <strong>{user.coupons.length}<em>장</em></strong>
          <span>가장 빠른 만료 {user.coupons.map((c) => c.expires).sort()[0]?.replaceAll("-", ".") ?? "-"}</span>
        </div>
        <div className="stat">
          <small>총 주문</small>
          <strong>{user.orders.length}<em>건</em></strong>
          <span>{user.orders.length ? "최근 주문 " + user.orders[0].date.replaceAll("-", ".") : "첫 주문을 기다려요"}</span>
        </div>
      </section>

      <section className="my-block">
        <h2>주문 진행 현황</h2>
        <ol className="flow">
          {orderSteps.map((s, i) => (
            <li key={s} className={counts[i] > 0 ? "has" : ""}>
              <strong>{counts[i]}</strong>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="my-block">
        <div className="blk-head"><h2>최근 주문</h2>{user.orders.length > 0 && <Link href="/orders" className="more">전체 보기 →</Link>}</div>
        {user.orders.length === 0 ? (
          <div className="empty-box">
            <p>아직 주문 내역이 없어요.</p>
            <Link href="/products" className="btn btn-solid">베스트 상품 보러 가기</Link>
          </div>
        ) : (
          <div className="order-list">
            {user.orders.slice(0, 2).map((o) => <OrderCard key={o.id} order={o} />)}
          </div>
        )}
      </section>

      <section className="my-block">
        <h2>보유 쿠폰</h2>
        <ul className="coupons">
          {user.coupons.map((c) => (
            <li key={c.id}>
              <div>
                <strong>{c.title}</strong>
                <span>{c.desc}</span>
              </div>
              <small>~ {c.expires.replaceAll("-", ".")}</small>
            </li>
          ))}
        </ul>
      </section>

      <section className="my-block">
        <h2>회원 정보</h2>
        <dl className="info">
          <div><dt>이름</dt><dd>{user.name}</dd></div>
          <div><dt>이메일</dt><dd>{user.email}</dd></div>
          <div><dt>휴대폰</dt><dd>{user.phone}</dd></div>
          <div><dt>마케팅 수신</dt><dd>{user.marketing ? "동의" : "미동의"}</dd></div>
        </dl>
      </section>
    </div>
  );
}
