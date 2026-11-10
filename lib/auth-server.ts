import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import type mysql from "mysql2/promise";
import { dbReady, pool } from "./db";
import type { Coupon, Grade, Order, OrderStatus, PublicMember } from "./members";

export const SESSION_COOKIE = "mv_session";
const SESSION_DAYS = 7;

const sha256 = (v: string) => createHash("sha256").update(v).digest("hex");

/** 서울 기준 오늘 날짜 (YYYY-MM-DD) */
export const todayKST = () => new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });

/** DB 행 → 화면용 회원 정보(쿠폰·주문 포함, 비밀번호 제외) */
export async function loadMember(memberId: number): Promise<PublicMember | null> {
  const [rows] = await pool.query<mysql.RowDataPacket[]>("SELECT * FROM members WHERE id = ?", [memberId]);
  const m = rows[0];
  if (!m) return null;

  const [cps] = await pool.query<mysql.RowDataPacket[]>("SELECT code, title, description, expires FROM member_coupons WHERE member_id = ? ORDER BY id", [memberId]);
  const coupons: Coupon[] = cps.map((c) => ({ id: c.code, title: c.title, desc: c.description, expires: c.expires }));

  const [ords] = await pool.query<mysql.RowDataPacket[]>("SELECT * FROM orders WHERE member_id = ? ORDER BY ordered_at DESC, id DESC", [memberId]);
  const orders: Order[] = [];
  if (ords.length) {
    const [its] = await pool.query<mysql.RowDataPacket[]>("SELECT order_id, slug, qty, price FROM order_items WHERE order_id IN (?) ORDER BY id", [ords.map((o) => o.id)]);
    for (const o of ords) {
      orders.push({
        id: o.id,
        date: o.ordered_at,
        status: o.status as OrderStatus,
        shipping: o.shipping,
        total: o.total,
        tracking: o.tracking ?? undefined,
        items: its.filter((i) => i.order_id === o.id).map((i) => ({ slug: i.slug, qty: i.qty, price: i.price })),
      });
    }
  }

  return {
    email: m.email,
    name: m.name,
    phone: m.phone,
    grade: m.grade as Grade,
    points: m.points,
    marketing: !!m.marketing,
    joinedAt: m.joined_at,
    coupons,
    orders,
  };
}

/** 로그인 성공 시 세션을 만들고 httpOnly 쿠키로 내려줍니다. (DB에는 토큰의 해시만 저장) */
export async function startSession(memberId: number) {
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + SESSION_DAYS * 86400_000);
  await pool.query("INSERT INTO sessions (token_hash, member_id, expires_at) VALUES (?, ?, ?)", [sha256(token), memberId, expires]);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true, // 자바스크립트로 읽을 수 없음
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  });
  // 만료된 세션 정리
  pool.query("DELETE FROM sessions WHERE expires_at < NOW()").catch(() => {});
}

export async function endSession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) await pool.query("DELETE FROM sessions WHERE token_hash = ?", [sha256(token)]);
  jar.delete(SESSION_COOKIE);
}

/** 쿠키의 세션으로 현재 로그인한 회원 id를 찾습니다. */
export async function currentMemberId(): Promise<number | null> {
  await dbReady();
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const [rows] = await pool.query<mysql.RowDataPacket[]>("SELECT member_id FROM sessions WHERE token_hash = ? AND expires_at > NOW()", [sha256(token)]);
  return rows[0]?.member_id ?? null;
}

export const digits = (v: string) => v.replace(/\D/g, "");
export const EMAIL_RULE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PW_RULE = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,72}$/;
export const PHONE_RULE = /^01\d-\d{3,4}-\d{4}$/;

export function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

/** demo@maisonverde.com → de**@maisonverde.com */
export const maskEmail = (email: string) => {
  const [id, domain] = email.split("@");
  return `${id.slice(0, 2)}${"*".repeat(Math.max(2, id.length - 2))}@${domain}`;
};

export const sameText = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

/** DB가 꺼져 있을 때 등 서버 오류를 사용자 친화적인 메시지로 바꿉니다. */
export function serverError(e: unknown) {
  console.error("[api]", e);
  return json({ ok: false, error: "서버에 연결할 수 없어요. 잠시 후 다시 시도해 주세요." }, 503);
}
