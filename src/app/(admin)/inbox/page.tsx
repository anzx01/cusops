import Link from "next/link";
import {
  closeConversation,
  requestManualHandoff,
  resumeAi,
} from "@/app/(admin)/actions";
import { StatusBadge } from "@/components/status-badge";
import { formatDateTime } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { getCurrentMerchantId } from "@/lib/session";

export default async function InboxPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const merchantId = await getCurrentMerchantId();
  const params = await searchParams;
  const conversations = await prisma.conversation.findMany({
    where: { merchantId },
    orderBy: { lastMessageAt: "desc" },
    include: { lead: true, channel: true },
  });
  const selectedId = params.id ?? conversations[0]?.id;
  const selected = selectedId
    ? await prisma.conversation.findFirst({
        where: { id: selectedId, merchantId },
        include: {
          lead: true,
          channel: true,
          messages: { orderBy: { createdAt: "asc" } },
          aiRuns: { orderBy: { createdAt: "desc" }, take: 5 },
        },
      })
    : null;

  return (
    <>
      <section className="page-header">
        <div>
          <h1 className="page-title">对话</h1>
          <p className="page-description">
            查看客户消息、AI 状态、线索字段、转人工原因和 AI 审计记录。
          </p>
        </div>
      </section>

      <section className="grid" style={{ gridTemplateColumns: "340px minmax(0, 1fr)" }}>
        <div className="panel">
          <h2 className="panel-title">对话列表</h2>
          <ul className="list">
            {conversations.map((conversation) => (
              <li className="list-item" key={conversation.id}>
                <Link href={`/inbox?id=${conversation.id}`}>
                  <strong>
                    {conversation.lead?.name ?? conversation.lead?.phone ?? "匿名客户"}
                  </strong>
                  <p className="muted">{conversation.channel.name}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <StatusBadge status={conversation.status} />
                    <span className="muted">
                      {formatDateTime(conversation.lastMessageAt)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {selected ? (
          <div className="grid">
            <div className="panel">
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                <div>
                  <h2 className="panel-title">消息记录</h2>
                  <p className="muted">
                    {selected.channel.name} · AI {selected.aiEnabled ? "运行中" : "已暂停"}
                  </p>
                </div>
                <StatusBadge status={selected.status} />
              </div>

              <div className="form-actions" style={{ marginBottom: 16 }}>
                <form action={requestManualHandoff}>
                  <input name="conversationId" type="hidden" value={selected.id} />
                  <input name="reason" type="hidden" value="人工手动接管" />
                  <button className="button button-primary" type="submit">
                    人工接管
                  </button>
                </form>
                <form action={resumeAi}>
                  <input name="conversationId" type="hidden" value={selected.id} />
                  <button className="button button-muted" type="submit">
                    恢复 AI
                  </button>
                </form>
                <form action={closeConversation}>
                  <input name="conversationId" type="hidden" value={selected.id} />
                  <input name="tag" type="hidden" value="已关闭" />
                  <button className="button button-danger" type="submit">
                    关闭对话
                  </button>
                </form>
              </div>

              <div className="chat-messages" style={{ maxHeight: 420 }}>
                {selected.messages.map((message) => (
                  <div
                    className={`chat-bubble ${
                      message.senderType === "customer"
                        ? "chat-bubble-customer"
                        : "chat-bubble-ai"
                    }`}
                    key={message.id}
                  >
                    {message.content}
                  </div>
                ))}
              </div>
            </div>

            <section className="grid grid-2">
              <div className="panel">
                <h2 className="panel-title">线索信息</h2>
                <table className="table">
                  <tbody>
                    <tr>
                      <th>姓名</th>
                      <td>{selected.lead?.name ?? "-"}</td>
                    </tr>
                    <tr>
                      <th>电话</th>
                      <td>{selected.lead?.phone ?? "-"}</td>
                    </tr>
                    <tr>
                      <th>地址</th>
                      <td>{selected.lead?.address ?? "-"}</td>
                    </tr>
                    <tr>
                      <th>需求</th>
                      <td>{selected.lead?.serviceNeed ?? "-"}</td>
                    </tr>
                    <tr>
                      <th>期望时间</th>
                      <td>{selected.lead?.preferredTime ?? "-"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="panel">
                <h2 className="panel-title">AI 审计</h2>
                {selected.handoffReason ? (
                  <p className="badge badge-amber">{selected.handoffReason}</p>
                ) : null}
                <p className="muted">{selected.summary ?? "暂无摘要"}</p>
                <ul className="list">
                  {selected.aiRuns.map((run) => (
                    <li className="list-item" key={run.id}>
                      <strong>{run.action}</strong>
                      <p className="muted">{run.safetyResult ?? run.model}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>
        ) : (
          <div className="panel">暂无对话</div>
        )}
      </section>
    </>
  );
}
