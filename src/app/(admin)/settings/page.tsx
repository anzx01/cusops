import { Bot, ShieldAlert, UserRoundCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentMerchantId } from "@/lib/session";

export default async function SettingsPage() {
  const merchantId = await getCurrentMerchantId();
  const [agent, handoffContact, merchant] = await Promise.all([
    prisma.aiAgent.findUnique({ where: { merchantId } }),
    prisma.handoffContact.findFirst({
      where: { merchantId, isDefault: true },
    }),
    prisma.merchant.findUniqueOrThrow({ where: { id: merchantId } }),
  ]);

  return (
    <>
      <section className="page-header">
        <div>
          <h1 className="page-title">AI设置</h1>
          <p className="page-description">
            当前是开发态只读配置，后续任务会接入表单编辑和真实认证。
          </p>
        </div>
      </section>

      <section className="grid grid-3">
        <div className="panel">
          <h2 className="panel-title">
            <Bot aria-hidden size={16} /> 接待员
          </h2>
          <table className="table">
            <tbody>
              <tr>
                <th>名称</th>
                <td>{agent?.name}</td>
              </tr>
              <tr>
                <th>语气</th>
                <td>{agent?.tone}</td>
              </tr>
              <tr>
                <th>主动预约</th>
                <td>{agent?.proactivelyGuideBooking ? "是" : "否"}</td>
              </tr>
              <tr>
                <th>允许报价</th>
                <td>{agent?.allowPriceQuote ? "是" : "否"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="panel">
          <h2 className="panel-title">
            <ShieldAlert aria-hidden size={16} /> 安全规则
          </h2>
          <ul className="list">
            <li className="list-item">命中投诉、退款、受伤、律师、差评等词转人工</li>
            <li className="list-item">不承诺最终价格</li>
            <li className="list-item">不处理退款争议和责任判断</li>
          </ul>
        </div>

        <div className="panel">
          <h2 className="panel-title">
            <UserRoundCheck aria-hidden size={16} /> 人工接管
          </h2>
          <table className="table">
            <tbody>
              <tr>
                <th>联系人</th>
                <td>{handoffContact?.name}</td>
              </tr>
              <tr>
                <th>邮箱</th>
                <td>{handoffContact?.email}</td>
              </tr>
              <tr>
                <th>电话</th>
                <td>{handoffContact?.phone}</td>
              </tr>
              <tr>
                <th>商家</th>
                <td>{merchant.name}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
