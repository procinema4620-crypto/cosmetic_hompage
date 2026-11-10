import type mysql from "mysql2/promise";
import { dbReady, pool } from "@/lib/db";
import { digits, json, maskEmail, sameText, serverError } from "@/lib/auth-server";

export async function POST(req: Request) {
  try {
    const b = await req.json().catch(() => null);
    const name = String(b?.name ?? "");
    const phone = digits(String(b?.phone ?? ""));
    if (name.trim().length < 2 || phone.length < 10) return json({ email: null });
    await dbReady();
    const [rows] = await pool.query<mysql.RowDataPacket[]>("SELECT email, name FROM members WHERE REPLACE(phone, '-', '') = ?", [phone]);
    const m = rows.find((r) => sameText(r.name, name));
    return json({ email: m ? maskEmail(m.email) : null });
  } catch (e) {
    return serverError(e);
  }
}
