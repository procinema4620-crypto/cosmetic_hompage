import Link from "next/link";
import ProductImage from "./ProductImage";
import { getProduct, formatPrice } from "@/lib/products";
import { orderSteps, type Order } from "@/lib/members";

export default function OrderCard({ order, showSteps = true }: { order: Order; showSteps?: boolean }) {
  const step = orderSteps.indexOf(order.status);
  return (
    <article className="order">
      <header className="order-head">
        <div>
          <strong>{order.date.replaceAll("-", ".")}</strong>
          <span>주문번호 {order.id}</span>
        </div>
        <span className={`status status-${step}`}>{order.status}</span>
      </header>

      {showSteps && (
        <ol className="steps" aria-label="배송 진행 단계">
          {orderSteps.map((s, i) => (
            <li key={s} className={i <= step ? "done" : ""} aria-current={i === step ? "step" : undefined}>{s}</li>
          ))}
        </ol>
      )}

      <ul className="order-items">
        {order.items.map((it) => {
          const p = getProduct(it.slug);
          if (!p) return null;
          return (
            <li key={it.slug}>
              <Link href={`/products/${p.slug}`} className="oi-img"><ProductImage product={p} sizes="72px" /></Link>
              <div>
                <Link href={`/products/${p.slug}`}>{p.name}</Link>
                <small>{p.size} · {it.qty}개</small>
              </div>
              <strong>{formatPrice(it.price * it.qty)}</strong>
            </li>
          );
        })}
      </ul>

      <footer className="order-foot">
        {order.tracking ? <span>{order.tracking}</span> : <span>상품 준비 중입니다</span>}
        <span>
          배송비 {order.shipping === 0 ? "무료" : formatPrice(order.shipping)} · 결제금액 <b>{formatPrice(order.total)}</b>
        </span>
      </footer>
    </article>
  );
}
