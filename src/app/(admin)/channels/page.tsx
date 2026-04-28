import Link from "next/link";
import { Copy, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentMerchantId } from "@/lib/session";

export default async function ChannelsPage() {
  const merchantId = await getCurrentMerchantId();
  const channels = await prisma.channel.findMany({
    where: { merchantId },
    orderBy: { createdAt: "asc" },
  });
  const channel = channels[0];
  const publicKey = channel?.publicKey ?? "demo-web-chat";
  const embedCode = `<script async src="/widget.js" data-channel="${publicKey}" data-label="在线咨询"></script>`;

  return (
    <>
      <section className="page-header">
        <div>
          <h1 className="page-title">渠道</h1>
          <p className="page-description">
            MVP 已接入 Web Chat。客户消息会进入统一 Inbox，并由同一套 AI 接待逻辑处理。
          </p>
        </div>
        <Link className="button button-primary" href={`/chat/${publicKey}`}>
          <ExternalLink aria-hidden size={16} />
          预览聊天
        </Link>
      </section>

      <section className="grid grid-2">
        <div className="panel">
          <h2 className="panel-title">Web Chat</h2>
          <table className="table">
            <tbody>
              <tr>
                <th>名称</th>
                <td>{channel?.name}</td>
              </tr>
              <tr>
                <th>Public Key</th>
                <td className="mono">{channel?.publicKey}</td>
              </tr>
              <tr>
                <th>欢迎语</th>
                <td>{channel?.welcomeText}</td>
              </tr>
              <tr>
                <th>状态</th>
                <td>{channel?.active ? "启用" : "停用"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="panel">
          <h2 className="panel-title">
            <Copy aria-hidden size={16} /> 嵌入代码
          </h2>
          <pre
            className="mono"
            style={{
              whiteSpace: "pre-wrap",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: 14,
            }}
          >
            {embedCode}
          </pre>
          <p className="muted">
            将这段代码放到网站页面中，右下角会出现聊天按钮，客户消息会进入统一 Inbox。
          </p>
        </div>
      </section>
    </>
  );
}
