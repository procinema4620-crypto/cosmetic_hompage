import type mysql from "mysql2/promise";
import { dbReady, pool } from "@/lib/db";
import { digits, json, sameText, serverError } from "@/lib/auth-server";

export async function POST(req: Request) {
  try {
    const b = await req.json().catch(() => null);
    const email = String(b?.email ?? "").trim().toLowerCase();
    await dbReady();
    const [rows] = await pool.query<mysql.RowDataPacket[]>("SELECT name, phone FROM members WHERE email = ?", [email]);
    const m = rows[0];
    const ok = !!m && sameText(m.name, String(b?.name ?? "")) && digits(m.phone) === digits(String(b?.phone ?? ""));
    return json({ ok });
  } catch (e) {
    return serverError(e);
  }
}
