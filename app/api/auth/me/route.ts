import { currentMemberId, json, loadMember, serverError } from "@/lib/auth-server";

export async function GET() {
  try {
    const id = await currentMemberId();
    return json({ user: id ? await loadMember(id) : null });
  } catch (e) {
    return serverError(e);
  }
}
