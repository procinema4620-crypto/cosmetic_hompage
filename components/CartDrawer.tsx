"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "./CartProvider";
import ProductImage from "./ProductImage";
import { formatPrice, getProduct } from "@/lib/products";

const FREE_SHIPPING = 40000;

export default function CartDrawer() {
  const { lines, open, setOpen, total, count, setQty, remove } = useCart();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, setOpen]);

  const items = Object.entries(lines)
    .map(([slug, qty]) => ({ p: getProduct(slug), qty }))
    .filter((i): i is { p: NonNullable<typeof i.p>; qty: number } => !!i.p);

  const remain = Math.max(0, FREE_SHIPPING - total);

  return (
    <>
      <div className={`scrim ${open ? "on" : ""}`} onClick={() => setOpen(false)} aria-hidden="true" />
      <aside className={`drawer ${open ? "on" : ""}`} role="dialog" aria-modal="true" aria-label="장바구니" aria-hidden={!open}>
        <header className="drawer-head">
          <h2>장바구니 <span>{count}</span></h2>
          <button className="icon-btn" onClick={() => setOpen(false)} aria-label="장바구니 닫기" tabIndex={open ? 0 : -1}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 5l14 14M19 5L5 19" /></svg>
          </button>
        </header>

        {items.length > 0 && (
          <div className="ship">
            <p>
              {remain > 0 ? (
                <>무료배송까지 <b>{formatPrice(remain)}</b> 남았어요</>
              ) : (
                <b>무료배송 혜택이 적용되었어요</b>
              )}
            </p>
            <div className="ship-bar"><i style={{ width: `${Math.min(100, (total / FREE_SHIPPING) * 100)}%` }} /></div>
          </div>
        )}

        <div className="drawer-body">
          {items.length === 0 ? (
            <div className="empty">
              <p>장바구니가 비어 있어요.</p>
              <Link href="/products" className="btn btn-line" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>쇼핑 계속하기</Link>
            </div>
          ) : (
            <ul>
              {items.map(({ p, qty }) => (
                <li key={p.slug} className="line">
                  <div className="line-img"><ProductImage product={p} sizes="84px" /></div>
                  <div className="line-info">
                    <Link href={`/products/${p.slug}`} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>{p.name}</Link>
                    <small>{p.size}</small>
                    <div className="qty-row">
                      <div className="qty" aria-label="수량">
                        <button onClick={() => setQty(p.slug, qty - 1)} aria-label="수량 감소" tabIndex={open ? 0 : -1}>−</button>
                        <span aria-live="polite">{qty}</span>
                        <button onClick={() => setQty(p.slug, qty + 1)} aria-label="수량 증가" tabIndex={open ? 0 : -1}>+</button>
                      </div>
                      <strong>{formatPrice(p.price * qty)}</strong>
                    </div>
                  </div>
                  <button className="line-x" onClick={() => remove(p.slug)} aria-label={`${p.name} 삭제`} tabIndex={open ? 0 : -1}>삭제</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <footer className="drawer-foot">
            <div className="sum"><span>총 상품금액</span><strong>{formatPrice(total)}</strong></div>
            <Link href="/cart" className="btn btn-solid btn-block" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>장바구니에서 주문하기</Link>
          </footer>
        )}
      </aside>
    </>
  );
}
