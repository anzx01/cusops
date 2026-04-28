import { Bot, ShieldAlert, TrendingUp, UserRoundCheck } from "lucide-react";
import {
  updateAiSettings,
  updateHandoffContact,
  updateRoiSettings,
} from "@/app/(admin)/actions";
import { formatCurrency } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { getCurrentMerchantId } from "@/lib/session";

export default async function SettingsPage() {
  const merchantId = await getCurrentMerchantId();
  const [agent, handoffContact, merchant, roi] = await Promise.all([
    prisma.aiAgent.findUnique({ where: { merchantId } }),
    prisma.handoffContact.findFirst({
      where: { merchantId, isDefault: true },
    }),
    prisma.merchant.findUniqueOrThrow({ where: { id: merchantId } }),
    prisma.roiSettings.findUnique({ where: { merchantId } }),
  ]);

  return (
    <>
      <section className="page-header">
        <div>
          <h1 className="page-title">AI设置</h1>
          <p className="page-description">
            配置 AI 接待员语气、预约边界、人工接管联系人和 ROI 估算口径。
          </p>
        </div>
      </section>

      <section className="grid grid-2">
        <form action={updateAiSettings} className="panel form">
          <h2 className="panel-title">
            <Bot aria-hidden size={16} /> 接待员
          </h2>
          <label className="form-field">
            <span>名称</span>
            <input className="input" name="name" required defaultValue={agent?.name} />
          </label>
          <label className="form-field">
            <span>语气</span>
            <textarea
              className="input textarea"
              name="tone"
              required
              defaultValue={agent?.tone}
            />
          </label>
          <label className="form-field">
            <span>默认语言</span>
            <input
              className="input"
              name="defaultLanguage"
              required
              defaultValue={agent?.defaultLanguage ?? "zh-CN"}
            />
          </label>
          <label className="field-label">
            <input
              name="proactivelyGuideBooking"
              type="checkbox"
              defaultChecked={agent?.proactivelyGuideBooking}
            />{" "}
            主动引导预约
          </label>
          <label className="field-label">
            <input name="allowPriceQuote" type="checkbox" defaultChecked={agent?.allowPriceQuote} />{" "}
            允许 AI 报价
          </label>
          <label className="field-label">
            <input
              name="allowServiceTimeCommitment"
              type="checkbox"
              defaultChecked={agent?.allowServiceTimeCommitment}
            />{" "}
            允许 AI 承诺服务时间
          </label>
          <button className="button button-primary" type="submit">
            保存 AI 设置
          </button>
        </form>

        <form action={updateHandoffContact} className="panel form">
          <h2 className="panel-title">
            <UserRoundCheck aria-hidden size={16} /> 人工接管
          </h2>
          <label className="form-field">
            <span>联系人</span>
            <input className="input" name="name" required defaultValue={handoffContact?.name} />
          </label>
          <label className="form-field">
            <span>邮箱</span>
            <input className="input" name="email" type="email" defaultValue={handoffContact?.email ?? ""} />
          </label>
          <label className="form-field">
            <span>电话</span>
            <input className="input" name="phone" defaultValue={handoffContact?.phone ?? ""} />
          </label>
          <p className="muted">当前商家：{merchant.name}</p>
          <button className="button button-primary" type="submit">
            保存联系人
          </button>
        </form>
      </section>

      <section className="grid grid-2">
        <form action={updateRoiSettings} className="panel form">
          <h2 className="panel-title">
            <TrendingUp aria-hidden size={16} /> ROI 口径
          </h2>
          <label className="form-field">
            <span>平均客单价</span>
            <input
              className="input"
              min={0}
              name="averageOrderValue"
              required
              step="1"
              type="number"
              defaultValue={(roi?.averageOrderValueCents ?? 0) / 100}
            />
          </label>
          <label className="form-field">
            <span>每条有效线索节省分钟数</span>
            <input
              className="input"
              min={0}
              name="minutesSavedPerAiLead"
              required
              type="number"
              defaultValue={roi?.minutesSavedPerAiLead ?? 0}
            />
          </label>
          <label className="form-field">
            <span>人工时薪</span>
            <input
              className="input"
              min={0}
              name="hourlyLaborCost"
              required
              step="1"
              type="number"
              defaultValue={(roi?.hourlyLaborCostCents ?? 0) / 100}
            />
          </label>
          <p className="muted">
            当前平均客单价：{formatCurrency(roi?.averageOrderValueCents ?? 0)}
          </p>
          <button className="button button-primary" type="submit">
            保存 ROI
          </button>
        </form>

        <div className="panel">
          <h2 className="panel-title">
            <ShieldAlert aria-hidden size={16} /> 安全规则
          </h2>
          <ul className="list">
            <li className="list-item">命中投诉、退款、受伤、律师、差评等词转人工</li>
            <li className="list-item">不承诺最终价格</li>
            <li className="list-item">不处理退款争议和责任判断</li>
            <li className="list-item">客户要求人工时必须暂停 AI</li>
          </ul>
        </div>
      </section>
    </>
  );
}
