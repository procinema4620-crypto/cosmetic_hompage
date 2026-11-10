import { endSession, json, serverError } from "@/lib/auth-server";
import { dbReady } from "@/lib/db";

export async function POST() {
  try {
    await dbReady();
    await endSession();
    return json({ ok: true });
  } catch (e) {
    return serverError(e);
  }
}
