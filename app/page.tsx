import Link from "next/link";
import HeroVideo from "@/components/HeroVideo";
import CategoryPanel from "@/components/CategoryPanel";
import MemberBand from "@/components/MemberBand";
import ProductCard from "@/components/ProductCard";
import { categories, formatPrice, products } from "@/lib/products";

const best = products.filter((p) => p.badge === "BEST").slice(0, 4);
const fresh = products.filter((p) => p.badge === "NEW" || p.badge === "SALE").slice(0, 4);
const ranking = [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 5);

const catTiles: Record<string, string> = {
  스킨케어: "진정 · 보습 · 톤업",
  클렌징: "부드럽게 씻어내는",
  선케어: "가볍게 밀착되는",
  "메이크업/네일": "맑은 피부 표현",
  바디케어: "온몸을 감싸는 촉촉함",
  헤어케어: "윤기 나는 모발",
  "향수/디퓨저": "차분한 공간의 향",
  뷰티소품: "메이크업 필수템",
};

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="hero" aria-label="메인 비주얼">
        <div className="container hero-grid">
          <CategoryPanel className="hero-panel" />
          <div className="hero-stage">
            <HeroVideo />
            <div className="hero-copy">
              <p className="eyebrow">2026 WINTER HYDRATION</p>
              <h1>
                맑고 깊은 수분,<br />
                <em>피부의 균형</em>을 되찾다
              </h1>
              <p className="lead">자극은 덜어내고 촉촉함은 채운 데일리 스킨케어.</p>
              <div className="hero-cta">
                <Link href="/products" className="btn btn-solid">전체 상품 보기</Link>
                <Link href="/products/hydra-cloud-cream" className="btn btn-ghost">시그니처 크림</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MemberBand />

      {/* TRUST STRIP */}
      <section className="strip" aria-label="브랜드 약속">
        <div className="container strip-grid">
          <div><b>저자극 테스트</b><span>피부 자극 테스트 완료</span></div>
          <div><b>비건 처방</b><span>동물 유래 성분 불사용</span></div>
          <div><b>무료배송</b><span>40,000원 이상 구매 시</span></div>
          <div><b>무료 샘플</b><span>주문마다 2종 증정</span></div>
        </div>
      </section>

      {/* BEST */}
      <section className="section container">
        <header className="sec-head">
          <div>
            <p className="eyebrow">BEST SELLERS</p>
            <h2>지금 가장 사랑받는 제품</h2>
          </div>
          <Link href="/products" className="more">전체 보기 →</Link>
        </header>
        <div className="grid">
          {best.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
      </section>

      {/* EDITORIAL */}
      <section className="section container">
        <div className="edit-grid">
          <Link href="/products/calming-cica-serum" className="edit edit-green">
            <div>
              <p className="eyebrow">SIGNATURE</p>
              <h3>민감한 날엔<br />카밍 시카 세럼</h3>
              <p>센텔라 78%로 붉어진 피부를 빠르게 진정시켜요.</p>
              <span className="more">자세히 보기 →</span>
            </div>
          </Link>
          <Link href="/products?category=선케어" className="edit edit-sand">
            <div>
              <p className="eyebrow">SUN CARE</p>
              <h3>끈적임 없는<br />데일리 선케어</h3>
              <p>백탁 없이 투명하게, 겨울에도 자외선 차단은 필수.</p>
              <span className="more">선케어 보기 →</span>
            </div>
          </Link>
        </div>
      </section>

      {/* CATEGORY */}
      <section className="section container">
        <header className="sec-head">
          <div>
            <p className="eyebrow">CATEGORY</p>
            <h2>카테고리로 찾아보기</h2>
          </div>
        </header>
        <ul className="cat-tiles">
          {categories.map((c, i) => (
            <li key={c}>
              <Link href={`/products?category=${encodeURIComponent(c)}`}>
                <span className="num">0{i + 1}</span>
                <strong>{c}</strong>
                <small>{catTiles[c]}</small>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* NEW & SALE */}
      <section className="section container">
        <header className="sec-head">
          <div>
            <p className="eyebrow">NEW &amp; SALE</p>
            <h2>새로 나왔어요, 지금 특가예요</h2>
          </div>
          <Link href="/products?sort=new" className="more">더보기 →</Link>
        </header>
        <div className="grid">
          {fresh.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
      </section>

      {/* STORY + RANKING */}
      <section className="section story-wrap">
        <div className="container story">
          <div className="story-copy">
            <p className="eyebrow">OUR PHILOSOPHY</p>
            <h2>덜어내고, 깨끗하게.<br />필요한 것만 담았습니다.</h2>
            <p>
              메종 베르는 불필요한 성분은 덜어내고 피부가 실제로 필요로 하는 성분에 집중합니다.
              매일 쓰는 만큼 안심할 수 있도록, 처방부터 용기까지 하나하나 꼼꼼하게 만들었어요.
            </p>
            <Link href="/products" className="btn btn-line">브랜드 제품 보기</Link>
          </div>
          <div className="rank">
            <h3>실시간 인기 TOP 5</h3>
            <ol>
              {ranking.map((p, i) => (
                <li key={p.slug}>
                  <Link href={`/products/${p.slug}`}>
                    <span className="rk">{i + 1}</span>
                    <span className="rk-name">{p.name}</span>
                    <span className="rk-price">{formatPrice(p.price)}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}
