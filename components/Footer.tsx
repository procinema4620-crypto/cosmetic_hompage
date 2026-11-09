import Link from "next/link";
import { categories } from "@/lib/products";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container foot-grid">
        <div>
          <p className="logo logo-foot">MAISON <em>VERDE</em></p>
          <p className="foot-note">피부 본연의 균형을 찾는<br />차분하고 깨끗한 스킨케어.</p>
        </div>
        <div>
          <h3>SHOP</h3>
          <ul>
            {categories.map((c) => (
              <li key={c}><Link href={`/products?category=${encodeURIComponent(c)}`}>{c}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3>HELP</h3>
          <ul>
            <li><Link href="/support#notice">공지사항</Link></li>
            <li><Link href="/support#faq">자주 묻는 질문</Link></li>
            <li><Link href="/support#inquiry">1:1 문의</Link></li>
            <li><Link href="/orders">주문배송 조회</Link></li>
          </ul>
        </div>
        <div>
          <h3>CUSTOMER CENTER</h3>
          <p className="tel">1234-5678</p>
          <p className="foot-note">평일 10:00 – 17:00<br />점심 12:00 – 13:00 · 주말/공휴일 휴무</p>
        </div>
      </div>
      <div className="container foot-bottom">
        <p>© 2026 MAISON VERDE. All rights reserved. · 본 사이트는 데모용 샘플입니다.</p>
        <p><a href="#">이용약관</a> · <a href="#"><b>개인정보처리방침</b></a></p>
      </div>
    </footer>
  );
}
