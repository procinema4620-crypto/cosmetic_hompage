"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { useCart } from "@/components/CartProvider";
import ProductImage from "@/components/ProductImage";
import { formatPrice, getProduct } from "@/lib/products";

const FREE_SHIPPING = 40000;

export default function CartPage() {
  const { lines, total, setQty, remove, clear } = useCart();
  const { user, placeOrder } = useAuth();
  const router = useRouter();

  const items = Object.entries(lines)
    .map(([slug, qty]) => ({ p: getProduct(slug), qty }))
    .filter((i): i is { p: NonNullable<typeof i.p>; qty: number } => !!i.p);

  const shipping = items.length === 0 || total >= FREE_SHIPPING ? 0 : 3000;

  const checkout = async () => {
    if (!user) return router.push("/login?next=/cart");
    const order = await placeOrder(lines);
    if (!order) return;
    clear();
    router.push("/orders");
  };

  return (
    <div className="container page">
      <nav className="crumb" aria-label="현재 위치"><Link href="/">홈</Link> <span>/</span> <span>장바구니</span></nav>
      <header className="list-head"><h1>장바구니</h1><p>{items.length}개 상품</p></header>

      {items.length === 0 ? (
        <div className="empty-box">
          <p>장바구니가 비어 있어요.</p>
          <Link href="/products" className="btn btn-solid">쇼핑 계속하기</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <ul className="cart-list">
            {items.map(({ p, qty }) => (
              <li key={p.slug} className="cart-line">
                <Link href={`/products/${p.slug}`} className="cl-img"><ProductImage product={p} sizes="110px" /></Link>
                <div className="cl-info">
                  <Link href={`/products/${p.slug}`}>{p.name}</Link>
                  <small>{p.subtitle} · {p.size}</small>
                  <div className="qty">
                    <button onClick={() => setQty(p.slug, qty - 1)} aria-label="수량 감소">−</button>
                    <span aria-live="polite">{qty}</span>
                    <button onClick={() => setQty(p.slug, qty + 1)} aria-label="수량 증가">+</button>
                  </div>
                </div>
                <div className="cl-price">
                  <strong>{formatPrice(p.price * qty)}</strong>
                  <button onClick={() => remove(p.slug)} className="line-x">삭제</button>
                </div>
              </li>
            ))}
          </ul>

          <aside className="summary" aria-label="결제 예정 금액">
            <h2>결제 예정 금액</h2>
            <dl>
              <div><dt>상품금액</dt><dd>{formatPrice(total)}</dd></div>
              <div><dt>배송비</dt><dd>{shipping === 0 ? "무료" : formatPrice(shipping)}</dd></div>
              <div className="sum-total"><dt>총 결제금액</dt><dd>{formatPrice(total + shipping)}</dd></div>
            </dl>
            {shipping > 0 && <p className="sum-note">{formatPrice(FREE_SHIPPING - total)} 더 담으면 무료배송</p>}
            <button className="btn btn-solid btn-block" onClick={checkout}>{user ? "주문하기" : "로그인하고 주문하기"}</button>
            <p className="sum-note">데모 사이트로 실제 결제는 진행되지 않으며, 주문은 마이페이지에 저장됩니다.</p>
          </aside>
        </div>
      )}
    </div>
  );
}
