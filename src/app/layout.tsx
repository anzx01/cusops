import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI接待员",
  description: "本地服务商的 AI 接待、筛选和预约工具",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
