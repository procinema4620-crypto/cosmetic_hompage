import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCart from "@/components/AddToCart";
import ProductCard from "@/components/ProductCard";
import ProductImage from "@/components/ProductImage";
import { discountRate, formatPrice, getProduct, products } from "@/lib/products";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  return p ? { title: p.name, description: p.description } : {};
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();

  const rate = discountRate(p);
  const related = products.filter((x) => x.category === p.category && x.slug !== p.slug);
  const more = [...related, ...products.filter((x) => x.category !== p.category && x.slug !== p.slug)].slice(0, 4);

  return (
    <div className="container page">
      <nav className="crumb" aria-label="현재 위치">
        <Link href="/">홈</Link> <span>/</span>{" "}
        <Link href={`/products?category=${encodeURIComponent(p.category)}`}>{p.category}</Link> <span>/</span> <span>{p.name}</span>
      </nav>

      <div className="detail">
        <div className="detail-media">
          <ProductImage product={p} priority sizes="(max-width: 800px) 100vw, 600px" />
          {p.badge && <span className={`tag tag-${p.badge.toLowerCase()}`}>{p.badge}</span>}
        </div>

        <div className="detail-info">
          <p className="cat">{p.category}</p>
          <h1>{p.name}</h1>
          <p className="sub">{p.subtitle} · {p.size}</p>
          <p className="rating"><span aria-hidden="true">★</span> {p.rating.toFixed(1)} <small>리뷰 {p.reviews.toLocaleString("ko-KR")}개</small></p>

          <p className="price price-lg">
            {rate > 0 && <span className="rate">{rate}%</span>}
            <strong>{formatPrice(p.price)}</strong>
            {p.originalPrice && <del>{formatPrice(p.originalPrice)}</del>}
          </p>

          <p className="desc">{p.description}</p>
          <ul className="points">
            {p.highlights.map((h) => <li key={h}>{h}</li>)}
          </ul>

          <AddToCart slug={p.slug} />

          <dl className="meta">
            <div><dt>배송</dt><dd>40,000원 이상 무료배송 (미만 3,000원)</dd></div>
            <div><dt>증정</dt><dd>주문 시 샘플 2종 동봉</dd></div>
          </dl>

          <div className="acc">
            <details open>
              <summary>사용 방법</summary>
              <p>{p.howTo}</p>
            </details>
            <details>
              <summary>전성분</summary>
              <p>{p.ingredients}</p>
            </details>
            <details>
              <summary>배송 · 교환 · 반품 안내</summary>
              <p>결제 완료 후 1~2 영업일 내 출고됩니다. 미개봉 상품은 수령 후 7일 이내 교환 · 반품이 가능합니다.</p>
            </details>
          </div>
        </div>
      </div>

      <section className="section-sm">
        <header className="sec-head">
          <div>
            <p className="eyebrow">YOU MAY ALSO LIKE</p>
            <h2>함께 보면 좋은 제품</h2>
          </div>
        </header>
        <div className="grid">
          {more.map((x) => <ProductCard key={x.slug} product={x} />)}
        </div>
      </section>
    </div>
  );
}
