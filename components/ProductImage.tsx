import Image from "next/image";
import { productImages, type Product } from "@/lib/products";

/**
 * 제품 사진(next/image, 정사각 cover).
 * 사진이 아직 없는 제품은 자리를 그대로 두고 비워 둡니다(나중에 productImages에 경로만 추가하면 채워짐).
 * 부모 요소는 position: relative + 크기가 정해져 있어야 합니다.
 */
export default function ProductImage({
  product,
  sizes,
  priority = false,
}: {
  product: Pick<Product, "slug" | "name">;
  sizes: string;
  priority?: boolean;
}) {
  const src = productImages[product.slug];
  if (!src) return <div className="photo-empty" role="img" aria-label={`${product.name} (이미지 준비 중)`} />;
  return <Image src={src} alt={product.name} fill sizes={sizes} priority={priority} className="photo" />;
}
