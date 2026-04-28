import {
  CalendarCheck,
  Clock3,
  Inbox,
  MessageCircle,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import { MetricCard } from "@/components/metric-card";
import { StatusBadge } from "@/components/status-badge";
import { formatCurrency, formatDateTime, formatPercent } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { getCurrentMerchantId } from "@/lib/session";

export default async function DashboardPage() {
  const merchantId = await getCurrentMerchantId();

  const [
    conversationCount,
    qualifiedLeadCount,
    bookingCount,
    handoffCount,
    aiReplyCount,
    recentConversations,
    upcomingBookings,
    roiSettings,
  ] = await Promise.all([
    prisma.conversation.count({ where: { merchantId } }),
    prisma.lead.count({
      where: { merchantId, qualificationStatus: "qualified" },
    }),
    prisma.booking.count({ where: { merchantId } }),
    prisma.conversation.count({ where: { merchantId, handoffRequired: true } }),
    prisma.analyticsEvent.count({ where: { merchantId, eventType: "ai_replied" } }),
    prisma.conversation.findMany({
      where: { merchantId },
      orderBy: { lastMessageAt: "desc" },
      take: 5,
      include: { channel: true, lead: true },
    }),
    prisma.booking.findMany({
      where: { merchantId },
      orderBy: { startsAt: "asc" },
      take: 5,
      include: { service: true, lead: true },
    }),
    prisma.roiSettings.findUnique({ where: { merchantId } }),
  ]);

  const aiAutoRate =
    conversationCount === 0
      ? 0
      : Math.max(0, (conversationCount - handoffCount) / conversationCount);
  const estimatedRevenue =
    bookingCount * (roiSettings?.averageOrderValueCents ?? 0);
  const savedMinutes =
    qualifiedLeadCount * (roiSettings?.minutesSavedPerAiLead ?? 0);

  return (
    <>
      <section className="page-header">
        <div>
          <h1 className="page-title">工作台</h1>
          <p className="page-description">
            这里展示 AI 接待员对咨询、有效线索、预约和人工节省的影响。
          </p>
        </div>
      </section>

      <section className="grid grid-4">
        <MetricCard icon={MessageCircle} label="咨询数" value={conversationCount} />
        <MetricCard icon={UserCheck} label="有效线索" value={qualifiedLeadCount} />
        <MetricCard icon={CalendarCheck} label="预约数" value={bookingCount} />
        <MetricCard
          icon={TrendingUp}
          label="AI自动处理率"
          value={formatPercent(aiAutoRate)}
          note="未转人工对话占比"
        />
      </section>

      <section className="grid grid-3">
        <MetricCard
          icon={Clock3}
          label="节省人工时间"
          value={`${savedMinutes} 分钟`}
          note="按有效线索估算"
        />
        <MetricCard
          icon={TrendingUp}
          label="预计新增收入"
          value={formatCurrency(estimatedRevenue)}
          note="预约数 × 平均客单价"
        />
        <MetricCard icon={Inbox} label="待人工处理" value={handoffCount} />
      </section>

      <section className="grid grid-2">
        <div className="panel">
          <h2 className="panel-title">最近对话</h2>
          <table className="table">
            <thead>
              <tr>
                <th>客户</th>
                <th>状态</th>
                <th>渠道</th>
                <th>最近消息</th>
              </tr>
            </thead>
            <tbody>
              {recentConversations.map((conversation) => (
                <tr key={conversation.id}>
                  <td>{conversation.lead?.name ?? "匿名客户"}</td>
                  <td>
                    <StatusBadge status={conversation.status} />
                  </td>
                  <td>{conversation.channel.name}</td>
                  <td>{formatDateTime(conversation.lastMessageAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel">
          <h2 className="panel-title">近期预约</h2>
          <table className="table">
            <thead>
              <tr>
                <th>服务</th>
                <th>客户</th>
                <th>时间</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              {upcomingBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.service?.name ?? "未指定服务"}</td>
                  <td>{booking.lead?.name ?? booking.lead?.phone ?? "匿名客户"}</td>
                  <td>{formatDateTime(booking.startsAt)}</td>
                  <td>
                    <StatusBadge status={booking.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
