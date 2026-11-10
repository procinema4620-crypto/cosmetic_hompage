import { randomInt } from "node:crypto";
import { dbReady, pool } from "@/lib/db";
import { currentMemberId, json, loadMember, serverError, todayKST } from "@/lib/auth-server";
import { getProduct } from "@/lib/products";

const FREE_SHIPPING = 40000;

export async function POST(req: Request) {
  try {
    const memberId = await currentMemberId();
    if (!memberId) return json({ ok: false, error: "로그인이 필요합니다." }, 401);

    const b = await req.json().catch(() => null);
    const lines = (b?.lines ?? {}) as Record<string, unknown>;
    // 가격은 브라우저가 보낸 값을 믿지 않고, 서버의 상품 정보로 다시 계산합니다.
    const items = Object.entries(lines)
      .map(([slug, qty]) => ({ p: getProduct(slug), qty: Math.floor(Number(qty)) }))
      .filter((i): i is { p: NonNullable<typeof i.p>; qty: number } => !!i.p && i.qty > 0 && i.qty <= 99)
      .map(({ p, qty }) => ({ slug: p.slug, qty, price: p.price }));
    if (items.length === 0) return json({ ok: false, error: "주문할 상품이 없습니다." }, 400);

    const sum = items.reduce((a, i) => a + i.price * i.qty, 0);
    const shipping = sum >= FREE_SHIPPING ? 0 : 3000;
    const date = todayKST();
    const id = `MV${date.replace(/-/g, "")}-${randomInt(1000, 10000)}`;

    await dbReady();
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      await conn.query("INSERT INTO orders (id, member_id, ordered_at, status, shipping, total) VALUES (?,?,?,?,?,?)", [id, memberId, date, "결제완료", shipping, sum + shipping]);
      for (const it of items) await conn.query("INSERT INTO order_items (order_id, slug, qty, price) VALUES (?,?,?,?)", [id, it.slug, it.qty, it.price]);
      await conn.query("UPDATE members SET points = points + ? WHERE id = ?", [Math.floor(sum * 0.01), memberId]);
      await conn.commit();
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }

    const user = await loadMember(memberId);
    return json({ ok: true, order: user?.orders.find((o) => o.id === id), user });
  } catch (e) {
    return serverError(e);
  }
}
