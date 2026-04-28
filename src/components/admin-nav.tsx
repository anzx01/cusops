import Link from "next/link";
import {
  BarChart3,
  CalendarCheck,
  Inbox,
  LayoutDashboard,
  MessageSquare,
  Settings,
  SlidersHorizontal,
} from "lucide-react";

const items = [
  { href: "/dashboard", label: "工作台", icon: LayoutDashboard },
  { href: "/inbox", label: "对话", icon: Inbox },
  { href: "/bookings", label: "预约", icon: CalendarCheck },
  { href: "/business-profile", label: "业务资料", icon: SlidersHorizontal },
  { href: "/channels", label: "渠道", icon: MessageSquare },
  { href: "/analytics", label: "数据", icon: BarChart3 },
  { href: "/settings", label: "设置", icon: Settings },
];

export function AdminNav() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <p className="brand-title">AI接待员</p>
        <p className="brand-subtitle">接待、筛选、预约、转人工</p>
      </div>
      <nav className="nav-list" aria-label="后台导航">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Link className="nav-link" href={item.href} key={item.label}>
              <Icon aria-hidden size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
