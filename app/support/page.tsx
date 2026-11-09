import type { Metadata } from "next";
import Link from "next/link";
import InquiryForm from "@/components/InquiryForm";

export const metadata: Metadata = { title: "고객센터" };

const notices = [
  { tag: "공지", title: "겨울 시즌 택배 지연 안내 (11/20 ~ 12/31)", date: "2026.11.05" },
  { tag: "공지", title: "개인정보처리방침 개정 안내", date: "2026.10.28" },
  { tag: "이벤트", title: "신규 가입 웰컴 쿠폰 지급 안내", date: "2026.10.15" },
  { tag: "안내", title: "추석 연휴 이후 정상 배송 안내", date: "2026.10.02" },
];

const faqs = [
  { q: "주문 후 배송은 얼마나 걸리나요?", a: "결제 완료 후 1~2 영업일 내 출고되며, 출고 후 1~2일 내 수령하실 수 있습니다. 도서산간 지역은 1~2일 더 소요될 수 있어요." },
  { q: "배송비는 얼마인가요?", a: "40,000원 이상 구매 시 무료배송이며, 미만일 때는 3,000원이 부과됩니다." },
  { q: "교환 · 반품은 어떻게 하나요?", a: "미개봉 상품은 수령 후 7일 이내 마이페이지 > 주문배송에서 신청하실 수 있습니다. 단순 변심으로 인한 왕복 배송비는 고객 부담입니다." },
  { q: "비밀번호를 잊어버렸어요.", a: "로그인 화면의 '아이디 · 비밀번호 찾기'에서 가입 시 입력한 이름과 휴대폰 번호로 아이디를 찾고 비밀번호를 재설정할 수 있어요." },
  { q: "포인트와 쿠폰은 어떻게 사용하나요?", a: "주문 단계에서 보유 포인트와 쿠폰을 선택해 사용할 수 있습니다. 쿠폰은 중복 사용이 불가하며 마이페이지에서 만료일을 확인할 수 있어요." },
];

export default function SupportPage() {
  return (
    <div className="container page">
      <nav className="crumb" aria-label="현재 위치"><Link href="/">홈</Link> <span>/</span> <span>고객센터</span></nav>
      <header className="list-head"><h1>고객센터</h1><p>무엇을 도와드릴까요?</p></header>

      <section className="help-hero">
        <div>
          <small>고객센터 전화</small>
          <strong className="tel-big">1234-5678</strong>
          <p>평일 10:00 – 17:00 (점심 12:00 – 13:00) · 주말/공휴일 휴무</p>
        </div>
        <ul className="help-quick">
          <li><Link href="/orders"><b>주문배송 조회</b><span>배송 현황 확인</span></Link></li>
          <li><a href="#faq"><b>자주 묻는 질문</b><span>빠른 해결</span></a></li>
          <li><a href="#inquiry"><b>1:1 문의</b><span>직접 문의하기</span></a></li>
          <li><Link href="/membership"><b>멤버십 안내</b><span>등급 · 쿠폰</span></Link></li>
        </ul>
      </section>

      <section id="notice" className="my-block">
        <h2>공지사항</h2>
        <ul className="notice">
          {notices.map((n) => (
            <li key={n.title}><span className="n-tag">{n.tag}</span><span className="n-title">{n.title}</span><time>{n.date}</time></li>
          ))}
        </ul>
      </section>

      <section id="faq" className="my-block">
        <h2>자주 묻는 질문</h2>
        <div className="acc">
          {faqs.map((f) => (
            <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>
          ))}
        </div>
      </section>

      <section id="inquiry" className="my-block">
        <h2>1:1 문의</h2>
        <InquiryForm />
      </section>
    </div>
  );
}
