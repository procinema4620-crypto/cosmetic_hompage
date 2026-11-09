import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container page" style={{ textAlign: "center", padding: "120px 0" }}>
      <p className="eyebrow">404</p>
      <h1 style={{ fontFamily: "var(--serif)", fontSize: 32, margin: "12px 0 24px" }}>페이지를 찾을 수 없어요</h1>
      <Link href="/products" className="btn btn-solid">상품 보러 가기</Link>
    </div>
  );
}
