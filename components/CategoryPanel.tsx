import Link from "next/link";
import { categories } from "@/lib/products";

export default function CategoryPanel({ onNavigate, className = "" }: { onNavigate?: () => void; className?: string }) {
  return (
    <div className={`catpanel ${className}`}>
      <ul>
        {categories.map((c) => (
          <li key={c}>
            <Link href={`/products?category=${encodeURIComponent(c)}`} onClick={onNavigate}>{c}</Link>
          </li>
        ))}
      </ul>
      <div className="catpanel-foot">
        <Link href="/products?sort=popular" onClick={onNavigate}>BEST</Link>
        <Link href="/products?sort=new" onClick={onNavigate}>NEW</Link>
      </div>
    </div>
  );
}
