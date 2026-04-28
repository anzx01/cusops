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
  const embedCode = `<script src="/widget.js" data-channel="${channel?.publicKey ?? "demo-web-chat"}"></script>`;

  return (
    <>
      <section className="page-header">
        <div>
          <h1 className="page-title">渠道</h1>
          <p className="page-description">
            MVP 已接入 Web Chat。客户消息会进入统一 Inbox，并由同一套 AI 接待逻辑处理。
          </p>
        </div>
        <a className="button button-primary" href={`/chat/${channel?.publicKey ?? "demo-web-chat"}`}>
          <ExternalLink aria-hidden size={16} />
          预览聊天
        </a>
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
            当前版本先提供预览地址和 public key。真实站点脚本打包会在后续渠道任务中补齐。
          </p>
        </div>
      </section>
    </>
  );
}
