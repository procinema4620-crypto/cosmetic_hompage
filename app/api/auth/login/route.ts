import bcrypt from "bcryptjs";
import type mysql from "mysql2/promise";
import { dbReady, pool } from "@/lib/db";
import { json, loadMember, serverError, startSession } from "@/lib/auth-server";

// 존재하지 않는 이메일일 때도 같은 시간이 걸리도록 쓰는 가짜 해시(계정 존재 여부 추측 방지)
const DUMMY_HASH = bcrypt.hashSync("dummy-password-for-timing", 10);

export async function POST(req: Request) {
  try {
    const b = await req.json().catch(() => null);
    const email = String(b?.email ?? "").trim().toLowerCase();
    const password = String(b?.password ?? "");
    await dbReady();
    const [rows] = await pool.query<mysql.RowDataPacket[]>("SELECT id, password_hash FROM members WHERE email = ?", [email]);
    const m = rows[0];
    const ok = await bcrypt.compare(password, m?.password_hash ?? DUMMY_HASH);
    if (!m || !ok) return json({ ok: false, error: "이메일 또는 비밀번호가 올바르지 않습니다." }, 401);
    await startSession(m.id);
    return json({ ok: true, user: await loadMember(m.id) });
  } catch (e) {
    return serverError(e);
  }
}
