import type { Metadata } from "next";
import FindAccount from "@/components/FindAccount";

export const metadata: Metadata = { title: "아이디 · 비밀번호 찾기" };

export default async function FindAccountPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  return (
    <div className="container auth-page">
      <FindAccount initialTab={tab === "pw" ? "pw" : "id"} />
    </div>
  );
}
