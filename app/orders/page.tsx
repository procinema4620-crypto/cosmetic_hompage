"use client";

import Link from "next/link";
import { useRequireAuth } from "@/components/useRequireAuth";
import OrderCard from "@/components/OrderCard";

export default function OrdersPage() {
  const { user, ready } = useRequireAuth();

  if (!ready || !user) return <div className="container page"><p className="muted-p">불러오는 중…</p></div>;

  return (
    <div className="container page">
      <nav className="crumb" aria-label="현재 위치"><Link href="/">홈</Link> <span>/</span> <span>주문배송 조회</span></nav>
      <header className="list-head">
        <h1>주문배송 조회</h1>
        <p>{user.orders.length}건</p>
      </header>
      {user.orders.length === 0 ? (
        <div className="empty-box">
          <p>주문 내역이 없어요.</p>
          <Link href="/products" className="btn btn-solid">쇼핑하러 가기</Link>
        </div>
      ) : (
        <div className="order-list">
          {user.orders.map((o) => <OrderCard key={o.id} order={o} />)}
        </div>
      )}
    </div>
  );
}
