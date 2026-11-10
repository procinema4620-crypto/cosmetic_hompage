import bcrypt from "bcryptjs";
import type mysql from "mysql2/promise";
import { dbReady, pool } from "@/lib/db";
import { EMAIL_RULE, PHONE_RULE, PW_RULE, json, loadMember, serverError, startSession, todayKST } from "@/lib/auth-server";
import { welcomeCoupons } from "@/lib/members";

export async function POST(req: Request) {
  try {
    const b = await req.json().catch(() => null);
    const email = String(b?.email ?? "").trim().toLowerCase();
    const password = String(b?.password ?? "");
    const name = String(b?.name ?? "").trim();
    const phone = String(b?.phone ?? "");
    const marketing = !!b?.marketing;

    if (!EMAIL_RULE.test(email) || email.length > 190) return json({ ok: false, error: "올바른 이메일 형식이 아닙니다." }, 400);
    if (!PW_RULE.test(password)) return json({ ok: false, error: "영문, 숫자, 특수문자를 포함해 8자 이상 입력해 주세요." }, 400);
    if (name.length < 2 || name.length > 50) return json({ ok: false, error: "이름을 2자 이상 입력해 주세요." }, 400);
    if (!PHONE_RULE.test(phone)) return json({ ok: false, error: "휴대폰 번호를 정확히 입력해 주세요." }, 400);

    await dbReady();
    const hash = await bcrypt.hash(password, 10);
    let memberId: number;
    try {
      const [res] = await pool.query<mysql.ResultSetHeader>(
        "INSERT INTO members (email, password_hash, name, phone, grade, points, marketing, joined_at) VALUES (?,?,?,?,?,?,?,?)",
        [email, hash, name, phone, "웰컴", 3000, marketing ? 1 : 0, todayKST()],
      );
      memberId = res.insertId;
    } catch (e) {
      if ((e as { code?: string }).code === "ER_DUP_ENTRY") return json({ ok: false, error: "이미 가입된 이메일입니다." }, 409);
      throw e;
    }
    for (const c of welcomeCoupons()) {
      await pool.query("INSERT INTO member_coupons (member_id, code, title, description, expires) VALUES (?,?,?,?,?)", [memberId, c.id, c.title, c.desc, c.expires]);
    }
    await startSession(memberId);
    return json({ ok: true, user: await loadMember(memberId) });
  } catch (e) {
    return serverError(e);
  }
}
