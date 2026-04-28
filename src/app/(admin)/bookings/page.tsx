import { StatusBadge } from "@/components/status-badge";
import { formatDateTime } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { getCurrentMerchantId } from "@/lib/session";

export default async function BookingsPage() {
  const merchantId = await getCurrentMerchantId();
  const bookings = await prisma.booking.findMany({
    where: { merchantId },
    orderBy: { startsAt: "asc" },
    include: { service: true, lead: true },
  });

  return (
    <>
      <section className="page-header">
        <div>
          <h1 className="page-title">预约</h1>
          <p className="page-description">
            查看 AI 和人工创建的预约，确认服务、时间、地址和日历事件状态。
          </p>
        </div>
      </section>

      <section className="panel">
        <table className="table">
          <thead>
            <tr>
              <th>服务</th>
              <th>客户</th>
              <th>电话</th>
              <th>地址</th>
              <th>时间</th>
              <th>状态</th>
              <th>日历</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.service?.name ?? "未指定服务"}</td>
                <td>{booking.lead?.name ?? "匿名客户"}</td>
                <td>{booking.lead?.phone ?? "-"}</td>
                <td>{booking.address ?? "-"}</td>
                <td>{formatDateTime(booking.startsAt)}</td>
                <td>
                  <StatusBadge status={booking.status} />
                </td>
                <td className="mono">{booking.calendarEventId ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
