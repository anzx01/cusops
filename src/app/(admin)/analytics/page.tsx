import { MetricCard } from "@/components/metric-card";
import { formatCurrency, formatDateTime, formatPercent } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { getCurrentMerchantId } from "@/lib/session";
import { BarChart3, Bot, CalendarCheck, MessageSquareWarning } from "lucide-react";

const eventCopy: Record<
  string,
  { title: string; object: string; description: string }
> = {
  conversation_created: {
    title: "新增咨询",
    object: "客户对话",
    description: "有客户打开聊天并开始咨询。",
  },
  message_received: {
    title: "收到客户消息",
    object: "客户对话",
    description: "客户发送了一条新消息。",
  },
  ai_replied: {
    title: "AI 已回复",
    object: "AI 接待",
    description: "AI 接待员完成了一次自动回复。",
  },
  lead_qualified: {
    title: "有效线索",
    object: "客户线索",
    description: "客户信息满足服务范围和预约条件。",
  },
  booking_created: {
    title: "创建预约",
    object: "预约",
    description: "AI 或人工创建了一条预约。",
  },
  booking_cancelled: {
    title: "取消预约",
    object: "预约",
    description: "有一条预约被取消。",
  },
  handoff_requested: {
    title: "转人工处理",
    object: "人工接管",
    description: "AI 暂停处理，等待人工接管。",
  },
};

function describeEvent(eventType: string) {
  return (
    eventCopy[eventType] ?? {
      title: "业务动态",
      object: "系统",
      description: "系统记录了一条业务动作。",
    }
  );
}

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
        <h2 className="panel-title">最近业务动态</h2>
        <table className="table">
          <thead>
            <tr>
              <th>动态</th>
              <th>对象</th>
              <th>说明</th>
              <th>时间</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => {
              const copy = describeEvent(event.eventType);

              return (
                <tr key={event.id}>
                  <td>{copy.title}</td>
                  <td>{copy.object}</td>
                  <td className="muted">{copy.description}</td>
                  <td>{formatDateTime(event.createdAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </>
  );
}
