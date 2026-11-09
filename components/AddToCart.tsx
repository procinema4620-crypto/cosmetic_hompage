"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";

export default function AddToCart({ slug }: { slug: string }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);

  return (
    <div className="buy">
      <div className="qty qty-lg" aria-label="수량">
        <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="수량 감소">−</button>
        <span aria-live="polite">{qty}</span>
        <button onClick={() => setQty((q) => Math.min(10, q + 1))} aria-label="수량 증가">+</button>
      </div>
      <button className="btn btn-solid" onClick={() => add(slug, qty)}>장바구니 담기</button>
    </div>
  );
}
