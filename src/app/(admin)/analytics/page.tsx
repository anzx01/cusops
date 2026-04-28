import { MetricCard } from "@/components/metric-card";
import { formatCurrency, formatPercent } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { getCurrentMerchantId } from "@/lib/session";
import { BarChart3, Bot, CalendarCheck, MessageSquareWarning } from "lucide-react";

export default async function AnalyticsPage() {
  const merchantId = await getCurrentMerchantId();
  const [events, conversations, bookings, handoffs, missingKnowledge, roi] =
    await Promise.all([
      prisma.analyticsEvent.findMany({
        where: { merchantId },
        orderBy: { createdAt: "desc" },
        take: 30,
      }),
      prisma.conversation.count({ where: { merchantId } }),
      prisma.booking.count({ where: { merchantId } }),
      prisma.conversation.count({ where: { merchantId, handoffRequired: true } }),
      prisma.missingKnowledgeItem.count({ where: { merchantId, status: "open" } }),
      prisma.roiSettings.findUnique({ where: { merchantId } }),
    ]);

  const autoRate = conversations === 0 ? 0 : (conversations - handoffs) / conversations;
  const revenue = bookings * (roi?.averageOrderValueCents ?? 0);

  return (
    <>
      <section className="page-header">
        <div>
          <h1 className="page-title">数据</h1>
          <p className="page-description">
            指标来自真实业务事件，用于证明 AI 带来的预约、自动处理和 ROI。
          </p>
        </div>
      </section>

      <section className="grid grid-4">
        <MetricCard icon={BarChart3} label="事件数" value={events.length} />
        <MetricCard icon={CalendarCheck} label="预约数" value={bookings} />
        <MetricCard icon={Bot} label="自动处理率" value={formatPercent(autoRate)} />
        <MetricCard
          icon={MessageSquareWarning}
          label="待补充资料"
          value={missingKnowledge}
        />
      </section>

      <section className="panel">
        <h2 className="panel-title">ROI 估算</h2>
        <p className="metric-value">{formatCurrency(revenue)}</p>
        <p className="muted">
          按平均客单价 {formatCurrency(roi?.averageOrderValueCents ?? 0)} ×
          已创建预约数计算。
        </p>
      </section>

      <section className="panel">
        <h2 className="panel-title">最近事件</h2>
        <table className="table">
          <thead>
            <tr>
              <th>事件</th>
              <th>实体</th>
              <th>时间</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td>{event.eventType}</td>
                <td>
                  {event.entityType ?? "-"} {event.entityId ?? ""}
                </td>
                <td>{event.createdAt.toLocaleString("zh-CN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
