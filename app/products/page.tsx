import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { categories, products, type Category } from "@/lib/products";

export const metadata: Metadata = { title: "전체 상품" };

const sorts = [
  { key: "popular", label: "인기순" },
  { key: "new", label: "신상품순" },
  { key: "low", label: "낮은 가격순" },
  { key: "high", label: "높은 가격순" },
] as const;

type SP = { category?: string; sort?: string; q?: string; sale?: string };

export default async function ProductsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const { category, sort = "popular", q, sale } = await searchParams;
  const active = categories.includes(category as Category) ? (category as Category) : undefined;
  const kw = q?.trim().toLowerCase();

  let list = active ? products.filter((p) => p.category === active) : [...products];
  if (sale) list = list.filter((p) => p.originalPrice);
  if (kw) list = list.filter((p) => [p.name, p.subtitle, p.category, p.ingredients].join(" ").toLowerCase().includes(kw));
  if (sort === "low") list.sort((a, b) => a.price - b.price);
  else if (sort === "high") list.sort((a, b) => b.price - a.price);
  else if (sort === "new") list.sort((a, b) => Number(b.badge === "NEW") - Number(a.badge === "NEW"));
  else list.sort((a, b) => b.reviews - a.reviews);

  const href = (c?: string, s?: string) => {
    const q = new URLSearchParams();
    if (c) q.set("category", c);
    if (s && s !== "popular") q.set("sort", s);
    if (kw) q.set("q", kw);
    if (sale) q.set("sale", "1");
    const str = q.toString();
    return str ? `/products?${str}` : "/products";
  };

  return (
    <div className="container page">
      <nav className="crumb" aria-label="현재 위치">
        <Link href="/">홈</Link> <span>/</span> <span>{active ?? "전체 상품"}</span>
      </nav>
      <header className="list-head">
        <h1>{kw ? `‘${q}’ 검색 결과` : sale ? "세일" : active ?? "전체 상품"}</h1>
        <p>{list.length}개의 제품</p>
      </header>

      <div className="filters">
        <ul className="chips" aria-label="카테고리">
          <li><Link href={href(undefined, sort)} className={!active ? "on" : ""} aria-current={!active ? "page" : undefined}>전체</Link></li>
          {categories.map((c) => (
            <li key={c}>
              <Link href={href(c, sort)} className={active === c ? "on" : ""} aria-current={active === c ? "page" : undefined}>{c}</Link>
            </li>
          ))}
        </ul>
        <ul className="sorts" aria-label="정렬">
          {sorts.map((s) => (
            <li key={s.key}>
              <Link href={href(active, s.key)} className={sort === s.key ? "on" : ""}>{s.label}</Link>
            </li>
          ))}
        </ul>
      </div>

      {list.length === 0 ? (
        <div className="empty-box">
          <p>조건에 맞는 상품이 없어요.</p>
          <Link href="/products" className="btn btn-line">전체 상품 보기</Link>
        </div>
      ) : (
        <div className="grid">
          {list.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
      )}
    </div>
  );
}
