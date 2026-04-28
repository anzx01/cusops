import { ClipboardList, MapPin, MessageSquareText, ShieldAlert } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { prisma } from "@/lib/prisma";
import { getCurrentMerchantId } from "@/lib/session";

export default async function BusinessProfilePage() {
  const merchantId = await getCurrentMerchantId();
  const [profile, services, areas, faqs, missingKnowledge] = await Promise.all([
    prisma.businessProfile.findUnique({ where: { merchantId } }),
    prisma.service.findMany({ where: { merchantId }, orderBy: { name: "asc" } }),
    prisma.serviceArea.findMany({ where: { merchantId }, orderBy: { label: "asc" } }),
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
            AI 接待员优先基于这些业务资料回答、筛选和推进预约。
          </p>
        </div>
      </section>

      <section className="grid grid-2">
        <div className="panel">
          <h2 className="panel-title">公司与规则</h2>
          <ul className="list">
            <li className="list-item">
              <strong>公司介绍</strong>
              <p className="muted">{profile?.companyIntro}</p>
            </li>
            <li className="list-item">
              <strong>营业时间</strong>
              <p className="muted">{profile?.businessHours}</p>
            </li>
            <li className="list-item">
              <strong>预约规则</strong>
              <p className="muted">{profile?.bookingRules}</p>
            </li>
            <li className="list-item">
              <strong>价格规则</strong>
              <p className="muted">{profile?.priceRules}</p>
            </li>
            <li className="list-item">
              <strong>不可承诺事项</strong>
              <p className="muted">{profile?.forbiddenPromises}</p>
            </li>
          </ul>
        </div>

        <div className="panel">
          <h2 className="panel-title">待补充问题</h2>
          <ul className="list">
            {missingKnowledge.map((item) => (
              <li className="list-item" key={item.id}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <span>{item.question}</span>
                  <StatusBadge status={item.status} />
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
                <strong>{service.name}</strong>
                <p className="muted">{service.description}</p>
                <p className="muted">{service.priceNote}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel">
          <h2 className="panel-title">
            <MapPin aria-hidden size={16} /> 服务区域
          </h2>
          <ul className="list">
            {areas.map((area) => (
              <li className="list-item" key={area.id}>
                <strong>{area.label}</strong>
                <p className="muted">
                  {area.ruleType}: {area.ruleValue}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel">
          <h2 className="panel-title">
            <MessageSquareText aria-hidden size={16} /> FAQ
          </h2>
          <ul className="list">
            {faqs.map((faq) => (
              <li className="list-item" key={faq.id}>
                <strong>{faq.question}</strong>
                <p className="muted">{faq.answer}</p>
              </li>
            ))}
          </ul>
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
