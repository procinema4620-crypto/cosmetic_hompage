import bcrypt from "bcryptjs";
import type mysql from "mysql2/promise";
import { dbReady, pool } from "@/lib/db";
import { PW_RULE, digits, json, sameText, serverError } from "@/lib/auth-server";

/**
 * 데모용: 이메일 + 이름 + 휴대폰 번호가 모두 맞으면 비밀번호를 바꿔 줍니다.
 * 실서비스에서는 문자/이메일 인증번호 확인이 반드시 필요합니다.
 */
export async function POST(req: Request) {
  try {
    const b = await req.json().catch(() => null);
    const email = String(b?.email ?? "").trim().toLowerCase();
    const newPassword = String(b?.newPassword ?? "");
    if (!PW_RULE.test(newPassword)) return json({ ok: false, error: "영문, 숫자, 특수문자를 포함해 8자 이상 입력해 주세요." }, 400);
    await dbReady();
    const [rows] = await pool.query<mysql.RowDataPacket[]>("SELECT id, name, phone FROM members WHERE email = ?", [email]);
    const m = rows[0];
    if (!m || !sameText(m.name, String(b?.name ?? "")) || digits(m.phone) !== digits(String(b?.phone ?? ""))) {
      return json({ ok: false, error: "회원 정보가 일치하지 않습니다." }, 400);
    }
    await pool.query("UPDATE members SET password_hash = ? WHERE id = ?", [await bcrypt.hash(newPassword, 10), m.id]);
    await pool.query("DELETE FROM sessions WHERE member_id = ?", [m.id]); // 기존 로그인은 모두 해제
    return json({ ok: true });
  } catch (e) {
    return serverError(e);
  }
}
