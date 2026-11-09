export type Grade = "웰컴" | "실버" | "골드" | "VIP";
export type OrderStatus = "결제완료" | "배송준비" | "배송중" | "배송완료";

export interface Coupon {
  id: string;
  title: string;
  desc: string;
  expires: string;
}

export interface OrderItem {
  slug: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  shipping: number;
  total: number;
  tracking?: string;
}

export interface Member {
  email: string;
  /** 데모용: 실제 서비스에서는 절대 평문 저장 금지 (서버 + 해시 필요) */
  password: string;
  name: string;
  phone: string;
  grade: Grade;
  points: number;
  coupons: Coupon[];
  orders: Order[];
  joinedAt: string;
  marketing: boolean;
}

export const orderSteps: OrderStatus[] = ["결제완료", "배송준비", "배송중", "배송완료"];

export const gradeBenefit: Record<Grade, { rate: string; note: string }> = {
  웰컴: { rate: "1%", note: "가입 후 첫 구매까지" },
  실버: { rate: "2%", note: "누적 구매 10만원 이상" },
  골드: { rate: "3%", note: "누적 구매 30만원 이상" },
  VIP: { rate: "5%", note: "누적 구매 60만원 이상" },
};

export const welcomeCoupons = (): Coupon[] => [
  { id: "WELCOME10", title: "웰컴 10% 할인", desc: "첫 구매 시 최대 10,000원 할인", expires: "2027-02-28" },
  { id: "FREESHIP", title: "무료배송 쿠폰", desc: "금액 제한 없이 1회 사용", expires: "2027-02-28" },
];

/** 데모용 더미 회원 */
export const seedMembers: Member[] = [
  {
    email: "demo@maisonverde.com",
    password: "demo1234!",
    name: "김서연",
    phone: "010-1234-5678",
    grade: "VIP",
    points: 12400,
    joinedAt: "2025-03-14",
    marketing: true,
    coupons: [
      { id: "VIP5000", title: "VIP 감사 5,000원 쿠폰", desc: "30,000원 이상 구매 시", expires: "2026-12-31" },
      { id: "FREESHIP", title: "무료배송 쿠폰", desc: "금액 제한 없이 1회 사용", expires: "2026-12-31" },
      { id: "BDAY15", title: "생일 축하 15% 할인", desc: "생일 달 한정 최대 20,000원", expires: "2027-01-31" },
    ],
    orders: [
      {
        id: "MV20261104-0412",
        date: "2026-11-04",
        status: "배송중",
        shipping: 0,
        total: 80000,
        tracking: "CJ대한통운 6012 3456 7890",
        items: [
          { slug: "calming-cica-serum", qty: 1, price: 38000 },
          { slug: "hydra-cloud-cream", qty: 1, price: 42000 },
        ],
      },
      {
        id: "MV20261019-0187",
        date: "2026-10-19",
        status: "배송완료",
        shipping: 0,
        total: 47000,
        tracking: "CJ대한통운 6012 1111 2222",
        items: [
          { slug: "soft-melt-cleansing-balm", qty: 1, price: 29000 },
          { slug: "gentle-foam-cleanser", qty: 1, price: 18000 },
        ],
      },
      {
        id: "MV20260921-0733",
        date: "2026-09-21",
        status: "배송완료",
        shipping: 3000,
        total: 28000,
        tracking: "CJ대한통운 6012 9999 0000",
        items: [{ slug: "daily-mild-sun-fluid", qty: 1, price: 25000 }],
      },
    ],
  },
  {
    email: "new@maisonverde.com",
    password: "new12345!",
    name: "박지훈",
    phone: "010-9876-5432",
    grade: "웰컴",
    points: 3000,
    joinedAt: "2026-11-06",
    marketing: false,
    coupons: welcomeCoupons(),
    orders: [],
  },
];
