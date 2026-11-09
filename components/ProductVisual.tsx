import { useId } from "react";
import type { Product } from "@/lib/products";

/** 이미지 자산 없이도 제품감을 주는 SVG 용기 일러스트 */
export default function ProductVisual({ product }: { product: Pick<Product, "shape" | "tone" | "name"> }) {
  const gid = "g" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const [body, accent] = product.tone;
  const bg = "#f3eee4";
  const shade = "rgba(31,58,46,.12)";

  const shapes: Record<Product["shape"], React.ReactNode> = {
    jar: (
      <>
        <ellipse cx="100" cy="196" rx="52" ry="7" fill={shade} />
        <rect x="52" y="108" width="96" height="84" rx="14" fill={body} />
        <rect x="46" y="88" width="108" height="30" rx="8" fill={accent} />
        <rect x="46" y="88" width="108" height="8" rx="4" fill="rgba(255,255,255,.35)" />
        <rect x="70" y="140" width="60" height="2" fill={accent} opacity=".7" />
        <rect x="80" y="150" width="40" height="2" fill={accent} opacity=".45" />
      </>
    ),
    dropper: (
      <>
        <ellipse cx="100" cy="196" rx="40" ry="7" fill={shade} />
        <rect x="64" y="96" width="72" height="96" rx="12" fill={body} />
        <rect x="84" y="80" width="32" height="20" rx="4" fill={accent} />
        <path d="M90 80 V46 a10 10 0 0 1 20 0 V80 z" fill={accent} opacity=".92" />
        <rect x="76" y="122" width="48" height="2" fill={accent} opacity=".75" />
        <rect x="84" y="132" width="32" height="2" fill={accent} opacity=".45" />
      </>
    ),
    tube: (
      <>
        <ellipse cx="100" cy="198" rx="34" ry="6" fill={shade} />
        <path d="M66 54 h68 l-6 128 a6 6 0 0 1 -6 6 h-44 a6 6 0 0 1 -6 -6 z" fill={body} />
        <rect x="76" y="34" width="48" height="24" rx="5" fill={accent} />
        <rect x="76" y="34" width="48" height="6" rx="3" fill="rgba(255,255,255,.35)" />
        <rect x="78" y="100" width="44" height="2" fill={accent} opacity=".8" />
        <rect x="84" y="110" width="32" height="2" fill={accent} opacity=".5" />
      </>
    ),
    pump: (
      <>
        <ellipse cx="100" cy="198" rx="42" ry="7" fill={shade} />
        <rect x="62" y="84" width="76" height="108" rx="14" fill={body} />
        <rect x="92" y="52" width="16" height="34" rx="3" fill={accent} />
        <path d="M92 52 h40 a5 5 0 0 1 0 10 h-40 z" fill={accent} />
        <rect x="76" y="128" width="48" height="2" fill={accent} opacity=".8" />
        <rect x="84" y="138" width="32" height="2" fill={accent} opacity=".5" />
      </>
    ),
    bottle: (
      <>
        <ellipse cx="100" cy="198" rx="40" ry="7" fill={shade} />
        <rect x="88" y="42" width="24" height="22" rx="4" fill={accent} />
        <path d="M90 64 h20 v14 c0 8 28 8 28 28 v78 a12 12 0 0 1 -12 12 h-52 a12 12 0 0 1 -12 -12 v-78 c0 -20 28 -20 28 -28 z" fill={body} />
        <rect x="74" y="122" width="52" height="40" rx="3" fill={accent} opacity=".85" />
        <rect x="82" y="132" width="36" height="2" fill={body} opacity=".7" />
        <rect x="88" y="142" width="24" height="2" fill={body} opacity=".45" />
      </>
    ),
    diffuser: (
      <>
        <ellipse cx="100" cy="198" rx="44" ry="7" fill={shade} />
        <rect x="90" y="68" width="20" height="18" rx="3" fill={accent} />
        <path d="M94 68 L72 14 M100 68 L100 8 M106 68 L128 18" stroke="#b89b6a" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M92 86 h16 v12 c0 8 30 10 30 32 v50 a12 12 0 0 1 -12 12 h-52 a12 12 0 0 1 -12 -12 v-50 c0 -22 30 -24 30 -32 z" fill={body} />
        <rect x="76" y="140" width="48" height="30" rx="3" fill={accent} opacity=".85" />
      </>
    ),
    brush: (
      <>
        <ellipse cx="100" cy="190" rx="56" ry="7" fill={shade} />
        <ellipse cx="76" cy="150" rx="30" ry="22" fill={body} stroke={accent} strokeWidth="2" />
        <ellipse cx="128" cy="130" rx="26" ry="19" fill={body} stroke={accent} strokeWidth="2" />
        <ellipse cx="98" cy="96" rx="22" ry="16" fill={body} stroke={accent} strokeWidth="2" />
      </>
    ),
    nail: (
      <>
        <ellipse cx="100" cy="196" rx="34" ry="6" fill={shade} />
        <rect x="88" y="34" width="24" height="56" rx="6" fill={accent} />
        <rect x="88" y="34" width="24" height="8" rx="4" fill="rgba(255,255,255,.2)" />
        <rect x="68" y="90" width="64" height="100" rx="14" fill={body} />
        <rect x="78" y="112" width="44" height="40" rx="4" fill="rgba(255,255,255,.35)" />
      </>
    ),
    compact: (
      <>
        <ellipse cx="100" cy="190" rx="60" ry="8" fill={shade} />
        <rect x="44" y="76" width="112" height="108" rx="22" fill={body} />
        <rect x="44" y="76" width="112" height="14" rx="7" fill="rgba(255,255,255,.12)" />
        <circle cx="100" cy="132" r="30" fill="none" stroke={accent} strokeWidth="2" />
        <circle cx="100" cy="132" r="4" fill={accent} />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 200 220" role="img" aria-label={product.name} className="visual" preserveAspectRatio="xMidYMid meet">
      <title>{product.name}</title>
      <defs>
        <radialGradient id={gid} cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#fff" stopOpacity=".7" />
          <stop offset="100%" stopColor={bg} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="200" height="220" fill={bg} />
      <rect width="200" height="220" fill={`url(#${gid})`} />
      {shapes[product.shape]}
    </svg>
  );
}
