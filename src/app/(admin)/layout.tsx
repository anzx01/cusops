import Link from "next/link";
import { AdminNav } from "@/components/admin-nav";
import { getCurrentMerchant } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const merchant = await getCurrentMerchant();

  return (
    <div className="app-shell">
      <AdminNav />
      <main className="main">
        <header className="topbar">
          <div>
            <p className="topbar-title">{merchant.name}</p>
            <p className="topbar-meta">
              {merchant.industry} · {merchant.timezone}
            </p>
          </div>
          <Link className="button button-primary" href="/chat/demo-web-chat">
            打开 Web Chat
          </Link>
        </header>
        <div className="content">{children}</div>
      </main>
    </div>
  );
}
