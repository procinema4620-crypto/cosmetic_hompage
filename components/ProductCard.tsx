import Link from "next/link";
import ProductImage from "./ProductImage";
import { discountRate, formatPrice, type Product } from "@/lib/products";

export default function ProductCard({ product: p }: { product: Product }) {
  const rate = discountRate(p);
  return (
    <article className="card">
      <Link href={`/products/${p.slug}`} className="card-media" aria-label={p.name}>
        <ProductImage product={p} sizes="(max-width: 800px) 50vw, (max-width: 1100px) 33vw, 300px" />
        {p.badge && <span className={`tag tag-${p.badge.toLowerCase()}`}>{p.badge}</span>}
      </Link>
      <div className="card-body">
        <p className="cat">{p.category}</p>
        <h3><Link href={`/products/${p.slug}`}>{p.name}</Link></h3>
        <p className="sub">{p.subtitle}</p>
        <p className="price">
          {rate > 0 && <span className="rate">{rate}%</span>}
          <strong>{formatPrice(p.price)}</strong>
          {p.originalPrice && <del>{formatPrice(p.originalPrice)}</del>}
        </p>
        <p className="rating"><span aria-hidden="true">★</span> {p.rating.toFixed(1)} <small>({p.reviews.toLocaleString("ko-KR")})</small></p>
      </div>
    </article>
  );
}
