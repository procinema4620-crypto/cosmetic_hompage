import "server-only";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import { seedMembers } from "./members";

/**
 * MySQL 연결 풀 + 테이블 자동 생성 + 데모 회원 시드.
 * 개발 서버가 코드를 다시 불러와도 연결이 늘어나지 않도록 globalThis에 보관합니다.
 */
declare global {
  var __mvPool: mysql.Pool | undefined;
  var __mvReady: Promise<void> | undefined;
}

export const pool: mysql.Pool =
  globalThis.__mvPool ??
  (globalThis.__mvPool = mysql.createPool({
    host: process.env.DB_HOST ?? "127.0.0.1",
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? "mv_app",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME ?? "maisonverde",
    waitForConnections: true,
    connectionLimit: 10,
    charset: "utf8mb4",
    timezone: "+09:00",
    dateStrings: true, // DATE 컬럼을 "2026-11-10" 문자열로 받음
  }));

const schema = [
  `CREATE TABLE IF NOT EXISTS members (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(190) NOT NULL UNIQUE,
    password_hash VARCHAR(100) NOT NULL,
    name VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    grade VARCHAR(10) NOT NULL DEFAULT '웰컴',
    points INT NOT NULL DEFAULT 0,
    marketing TINYINT(1) NOT NULL DEFAULT 0,
    joined_at DATE NOT NULL,
    INDEX idx_name_phone (name, phone)
  )`,
  `CREATE TABLE IF NOT EXISTS member_coupons (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    member_id INT UNSIGNED NOT NULL,
    code VARCHAR(40) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(200) NOT NULL,
    expires DATE NOT NULL,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(32) PRIMARY KEY,
    member_id INT UNSIGNED NOT NULL,
    ordered_at DATE NOT NULL,
    status VARCHAR(10) NOT NULL,
    shipping INT NOT NULL,
    total INT NOT NULL,
    tracking VARCHAR(100) NULL,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    INDEX idx_member (member_id, ordered_at)
  )`,
  `CREATE TABLE IF NOT EXISTS order_items (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(32) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    qty INT NOT NULL,
    price INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS sessions (
    token_hash CHAR(64) PRIMARY KEY,
    member_id INT UNSIGNED NOT NULL,
    expires_at DATETIME NOT NULL,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    INDEX idx_expires (expires_at)
  )`,
];

async function init() {
  for (const sql of schema) await pool.query(sql);

  const [rows] = await pool.query<mysql.RowDataPacket[]>("SELECT COUNT(*) AS n FROM members");
  if (rows[0].n > 0) return;

  // 최초 1회: 데모 회원(김서연, 박지훈)과 주문 내역을 넣어 둡니다. 비밀번호는 해시로 저장.
  for (const m of seedMembers) {
    const hash = await bcrypt.hash(m.password, 10);
    const [res] = await pool.query<mysql.ResultSetHeader>(
      "INSERT INTO members (email, password_hash, name, phone, grade, points, marketing, joined_at) VALUES (?,?,?,?,?,?,?,?)",
      [m.email, hash, m.name, m.phone, m.grade, m.points, m.marketing ? 1 : 0, m.joinedAt],
    );
    const memberId = res.insertId;
    for (const c of m.coupons) {
      await pool.query("INSERT INTO member_coupons (member_id, code, title, description, expires) VALUES (?,?,?,?,?)", [memberId, c.id, c.title, c.desc, c.expires]);
    }
    for (const o of m.orders) {
      await pool.query("INSERT INTO orders (id, member_id, ordered_at, status, shipping, total, tracking) VALUES (?,?,?,?,?,?,?)", [o.id, memberId, o.date, o.status, o.shipping, o.total, o.tracking ?? null]);
      for (const it of o.items) {
        await pool.query("INSERT INTO order_items (order_id, slug, qty, price) VALUES (?,?,?,?)", [o.id, it.slug, it.qty, it.price]);
      }
    }
  }
}

/** 모든 API는 시작할 때 이 함수를 await 하면 테이블이 준비된 상태가 보장됩니다. */
export function dbReady(): Promise<void> {
  if (!globalThis.__mvReady) {
    globalThis.__mvReady = init().catch((e) => {
      globalThis.__mvReady = undefined; // 다음 요청에서 재시도
      throw e;
    });
  }
  return globalThis.__mvReady;
}
