import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Noto_Serif_KR } from "next/font/google";
// Pretendard 가변 폰트 · 동적 서브셋(화면에 쓰인 글자 조각만 내려받음). npm 패키지에서 직접 포함 — 외부 CDN 의존 없음
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { AuthProvider } from "@/components/AuthProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

const display = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-display" });
const serifKr = Noto_Serif_KR({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-serif-kr", preload: false });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // 노치·홈 바 영역까지 사용(env(safe-area-inset-*)로 보정)
  themeColor: "#f7f3ea",
};

export const metadata: Metadata = {
  title: { default: "MAISON VERDE | 차분하고 깨끗한 스킨케어", template: "%s | MAISON VERDE" },
  description: "피부 본연의 균형을 찾는 프리미엄 스킨케어 브랜드, 메종 베르.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${display.variable} ${serifKr.variable}`}>
      <body>
        <AuthProvider>
        <CartProvider>
          <a href="#main" className="skip">본문 바로가기</a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
