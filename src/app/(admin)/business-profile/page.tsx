import {
  ClipboardList,
  MapPin,
  MessageSquareText,
  Plus,
  ShieldAlert,
} from "lucide-react";
import {
  addFaq,
  addService,
  addServiceArea,
  ignoreMissingKnowledge,
  toggleFaq,
  toggleService,
  toggleServiceArea,
  updateBusinessProfile,
} from "@/app/(admin)/actions";
import { StatusBadge } from "@/components/status-badge";
import { prisma } from "@/lib/prisma";
import { getCurrentMerchantId } from "@/lib/session";

export default async function BusinessProfilePage() {
  const merchantId = await getCurrentMerchantId();
  const [profile, services, areas, faqs, missingKnowledge] = await Promise.all([
    prisma.businessProfile.findUnique({ where: { merchantId } }),
    prisma.service.findMany({ where: { merchantId }, orderBy: { name: "asc" } }),
    prisma.serviceArea.findMany({
      where: { merchantId },
      orderBy: { label: "asc" },
    }),
    prisma.faq.findMany({ where: { merchantId }, orderBy: { createdAt: "asc" } }),
    prisma.missingKnowledgeItem.findMany({
      where: { merchantId },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <>
      <section className="page-header">
        <div>
          <h1 className="page-title">业务资料</h1>
          <p className="page-description">
            AI 接待员优先基于这些业务资料回答、筛选和推进预约。这里的内容会直接影响后续对话。
          </p>
        </div>
      </section>

      <section className="grid grid-2">
        <form action={updateBusinessProfile} className="panel form">
          <h2 className="panel-title">公司与规则</h2>
          <label className="form-field">
            <span>公司介绍</span>
            <textarea
              className="input textarea"
              name="companyIntro"
              required
              defaultValue={profile?.companyIntro}
            />
          </label>
          <label className="form-field">
            <span>营业时间</span>
            <input
              className="input"
              name="businessHours"
              required
              defaultValue={profile?.businessHours}
            />
          </label>
          <label className="form-field">
            <span>预约规则</span>
            <textarea
              className="input textarea"
              name="bookingRules"
              required
              defaultValue={profile?.bookingRules}
            />
          </label>
          <label className="form-field">
            <span>价格规则</span>
            <textarea
              className="input textarea"
              name="priceRules"
              required
              defaultValue={profile?.priceRules}
            />
          </label>
          <label className="form-field">
            <span>不可承诺事项</span>
            <textarea
              className="input textarea"
              name="forbiddenPromises"
              required
              defaultValue={profile?.forbiddenPromises}
            />
          </label>
          <div>
            <button className="button button-primary" type="submit">
              保存业务资料
            </button>
          </div>
        </form>

        <div className="panel">
          <h2 className="panel-title">待补充问题</h2>
          <ul className="list">
            {missingKnowledge.map((item) => (
              <li className="list-item" key={item.id}>
                <div className="form">
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <strong>{item.question}</strong>
                    <StatusBadge status={item.status} />
                  </div>
                  {item.status === "open" ? (
                    <div className="form-actions">
                      <form action={addFaq} className="form-actions">
                        <input name="missingKnowledgeId" type="hidden" value={item.id} />
                        <input name="question" type="hidden" value={item.question} />
                        <input
                          aria-label={`补充 ${item.question} 的答案`}
                          className="input"
                          name="answer"
                          placeholder="补充为 FAQ 答案"
                          required
                          style={{ minWidth: 220 }}
                        />
                        <button className="button button-primary" type="submit">
                          保存为 FAQ
                        </button>
                      </form>
                      <form action={ignoreMissingKnowledge}>
                        <input name="id" type="hidden" value={item.id} />
                        <button className="button button-muted" type="submit">
                          忽略
                        </button>
                      </form>
                    </div>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid grid-3">
        <div className="panel">
          <h2 className="panel-title">
            <ClipboardList aria-hidden size={16} /> 服务项目
          </h2>
          <ul className="list">
            {services.map((service) => (
              <li className="list-item" key={service.id}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <strong>{service.name}</strong>
                  <StatusBadge status={service.active ? "qualified" : "closed"} />
                </div>
                <p className="muted">{service.description}</p>
                <p className="muted">{service.priceNote}</p>
                <form action={toggleService}>
                  <input name="id" type="hidden" value={service.id} />
                  <button className="button button-muted" type="submit">
                    {service.active ? "停用" : "启用"}
                  </button>
                </form>
              </li>
            ))}
          </ul>
          <form action={addService} className="form" style={{ marginTop: 16 }}>
            <h3 className="panel-title">
              <Plus aria-hidden size={15} /> 新增服务
            </h3>
            <input className="input" name="name" placeholder="服务名称" required />
            <textarea
              className="input textarea"
              name="description"
              placeholder="服务说明"
              required
            />
            <div className="form-grid">
              <input
                className="input"
                min={15}
                name="durationMinutes"
                placeholder="时长分钟"
                type="number"
              />
              <input className="input" name="priceNote" placeholder="价格说明" />
            </div>
            <label className="field-label">
              <input name="aiBookingAllowed" type="checkbox" defaultChecked /> 允许 AI 预约
            </label>
            <button className="button button-primary" type="submit">
              添加服务
            </button>
          </form>
        </div>

        <div className="panel">
          <h2 className="panel-title">
            <MapPin aria-hidden size={16} /> 服务区域
          </h2>
          <ul className="list">
            {areas.map((area) => (
              <li className="list-item" key={area.id}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <strong>{area.label}</strong>
                  <StatusBadge status={area.active ? "qualified" : "closed"} />
                </div>
                <p className="muted">
                  {area.ruleType}: {area.ruleValue}
                </p>
                <form action={toggleServiceArea}>
                  <input name="id" type="hidden" value={area.id} />
                  <button className="button button-muted" type="submit">
                    {area.active ? "停用" : "启用"}
                  </button>
                </form>
              </li>
            ))}
          </ul>
          <form action={addServiceArea} className="form" style={{ marginTop: 16 }}>
            <h3 className="panel-title">
              <Plus aria-hidden size={15} /> 新增区域
            </h3>
            <input className="input" name="label" placeholder="区域名称" required />
            <div className="form-grid">
              <select className="input" name="ruleType" defaultValue="district">
                <option value="city">城市</option>
                <option value="district">区县</option>
                <option value="postal_code">邮编</option>
              </select>
              <input className="input" name="ruleValue" placeholder="匹配值" required />
            </div>
            <button className="button button-primary" type="submit">
              添加区域
            </button>
          </form>
        </div>

        <div className="panel">
          <h2 className="panel-title">
            <MessageSquareText aria-hidden size={16} /> FAQ
          </h2>
          <ul className="list">
            {faqs.map((faq) => (
              <li className="list-item" key={faq.id}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <strong>{faq.question}</strong>
                  <StatusBadge status={faq.active ? "qualified" : "closed"} />
                </div>
                <p className="muted">{faq.answer}</p>
                <form action={toggleFaq}>
                  <input name="id" type="hidden" value={faq.id} />
                  <button className="button button-muted" type="submit">
                    {faq.active ? "停用" : "启用"}
                  </button>
                </form>
              </li>
            ))}
          </ul>
          <form action={addFaq} className="form" style={{ marginTop: 16 }}>
            <h3 className="panel-title">
              <Plus aria-hidden size={15} /> 新增 FAQ
            </h3>
            <input className="input" name="question" placeholder="问题" required />
            <textarea className="input textarea" name="answer" placeholder="答案" required />
            <button className="button button-primary" type="submit">
              添加 FAQ
            </button>
          </form>
        </div>
      </section>

      <section className="panel">
        <h2 className="panel-title">
          <ShieldAlert aria-hidden size={16} /> AI 安全边界
        </h2>
        <p className="muted">
          禁止 AI 承诺最终价格、退款结论、特殊清洁效果和安全事故责任。命中投诉、退款、受伤、律师、差评等词时自动转人工。
        </p>
      </section>
    </>
  );
}
