"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "./CartProvider";
import { useAuth } from "./AuthProvider";
import CategoryPanel from "./CategoryPanel";

const menu = [
  { href: "/products?sort=popular", label: "랭킹" },
  { href: "/products?sort=new", label: "신상품" },
  { href: "/products?sale=1", label: "세일" },
  { href: "/events", label: "기획전" },
  { href: "/membership", label: "멤버십/쿠폰" },
  { href: "/events#event", label: "이벤트" },
];

export default function Header() {
  const { count } = useCart();
  const { user, ready, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const [more, setMore] = useState(false);

  useEffect(() => {
    const el = menuRef.current;
    if (!el) return;
    const update = () => setMore(el.scrollWidth - el.clientWidth - el.scrollLeft > 4);
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = String(new FormData(e.currentTarget).get("q") ?? "").trim();
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
  };

  return (
    <>
      <div className="top">
        <div className="container brand-row">
          <Link href="/" className="logo" aria-label="메종 베르 홈">MAISON <em>VERDE</em></Link>
          <form className="search" role="search" onSubmit={onSearch}>
            <input name="q" type="search" placeholder="상품명, 성분, 카테고리 검색" aria-label="상품 검색" autoComplete="off" />
            <button type="submit" aria-label="검색">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></svg>
            </button>
          </form>
          <ul className="util" aria-label="회원 메뉴">
            {!ready ? null : user ? (
              <>
                <li className="util-hi"><Link href="/mypage"><b>{user.name}</b>님</Link></li>
                <li className="util-my"><Link href="/mypage">마이페이지</Link></li>
                <li><button onClick={() => { logout(); router.push("/"); }}>로그아웃</button></li>
              </>
            ) : (
              <>
                <li><Link href="/join">회원가입</Link></li>
                <li><Link href="/login">로그인</Link></li>
              </>
            )}
            <li><Link href="/cart">장바구니{count > 0 && <em className="util-n">{count}</em>}</Link></li>
            <li><Link href="/orders">주문배송</Link></li>
            <li><Link href="/support">고객센터</Link></li>
          </ul>
        </div>
      </div>

      <div className="navrow" data-home={pathname === "/"}>
        <div className={`container navin ${more ? "has-more" : ""}`}>
          <div className="cat-wrap" ref={wrap}>
            <button className="cat-btn" aria-expanded={open} aria-controls="cat-drop" onClick={() => setOpen((v) => !v)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
              카테고리
            </button>
            <div id="cat-drop" className={`cat-drop ${open ? "on" : ""}`}>
              <CategoryPanel onNavigate={() => setOpen(false)} />
            </div>
          </div>
          <ul className="menu" ref={menuRef}>
            {menu.map((m) => (
              <li key={m.label}><Link href={m.href}>{m.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
