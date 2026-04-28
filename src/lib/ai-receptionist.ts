import { prisma } from "@/lib/prisma";
import { trackEvent } from "@/lib/analytics";

const riskWords = ["人工", "投诉", "退款", "受伤", "律师", "差评", "紧急", "急救"];

function extractPhone(text: string) {
  return text.match(/1[3-9]\d{9}/)?.[0];
}

function detectServiceNeed(text: string) {
  if (text.includes("深度")) return "深度清洁";
  if (text.includes("日常")) return "日常保洁";
  if (text.includes("搬家")) return "搬家前后清洁";
  return undefined;
}

function detectPreferredTime(text: string) {
  if (text.includes("明天")) return "明天";
  if (text.includes("后天")) return "后天";
  if (text.includes("周末")) return "周末";
  if (text.includes("下午")) return "下午";
  if (text.includes("上午")) return "上午";
  return undefined;
}

function looksLikeAddress(text: string) {
  return ["上海", "浦东", "徐汇", "静安", "路", "区", "弄"].some((token) =>
    text.includes(token),
  );
}

function hasRisk(text: string) {
  return riskWords.find((word) => text.includes(word));
}

export async function handleAiReception(input: {
  conversationId: string;
  message: string;
}) {
  const conversation = await prisma.conversation.findUniqueOrThrow({
    where: { id: input.conversationId },
    include: {
      channel: true,
      lead: true,
      merchant: {
        include: {
          aiAgent: true,
          businessProfile: true,
          faqs: { where: { active: true } },
          serviceAreas: { where: { active: true } },
          services: { where: { active: true } },
        },
      },
    },
  });

  if (!conversation.aiEnabled) {
    return null;
  }

  const risk = hasRisk(input.message);

  if (risk) {
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        aiEnabled: false,
        handoffRequired: true,
        handoffReason: `命中高风险词：${risk}`,
        status: "handoff",
        tag: "需跟进",
        summary: `客户消息包含“${risk}”，建议人工立即接管。`,
      },
    });

    const reply =
      "我先帮您转接人工处理。为了避免信息遗漏，我已经把当前情况标记给值班客服。";

    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderType: "ai",
        content: reply,
      },
    });

    await prisma.aiRun.create({
      data: {
        conversationId: conversation.id,
        model: "rule-based-mvp",
        action: "handoff",
        confidence: 1,
        safetyResult: `risk_word:${risk}`,
        inputSnapshot: input.message,
        outputSnapshot: reply,
      },
    });

    await trackEvent({
      merchantId: conversation.merchantId,
      eventType: "handoff_requested",
      entityType: "conversation",
      entityId: conversation.id,
      properties: { reason: risk },
    });

    return reply;
  }

  const serviceNeed = detectServiceNeed(input.message);
  const phone = extractPhone(input.message);
  const preferredTime = detectPreferredTime(input.message);
  const address = looksLikeAddress(input.message) ? input.message : undefined;

  const lead = conversation.lead
    ? await prisma.lead.update({
        where: { id: conversation.lead.id },
        data: {
          phone: phone ?? conversation.lead.phone,
          address: address ?? conversation.lead.address,
          serviceNeed: serviceNeed ?? conversation.lead.serviceNeed,
          preferredTime: preferredTime ?? conversation.lead.preferredTime,
        },
      })
    : await prisma.lead.create({
        data: {
          merchantId: conversation.merchantId,
          phone,
          address,
          serviceNeed,
          preferredTime,
        },
      });

  if (!conversation.leadId) {
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { leadId: lead.id },
    });
  }

  const serviceAreaMatched =
    lead.address &&
    conversation.merchant.serviceAreas.some((area) =>
      lead.address?.includes(area.ruleValue),
    );

  if (lead.address && !serviceAreaMatched) {
    await prisma.lead.update({
      where: { id: lead.id },
      data: { qualificationStatus: "unqualified", status: "closed" },
    });

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        status: "closed",
        tag: "无效",
        summary: "客户地址暂不在服务范围内，AI 已礼貌说明。",
      },
    });

    const reply =
      "抱歉，您提供的地址目前不在我们的服务范围内。我已经记录这条咨询，后续开通该区域时可以再联系您。";

    await prisma.message.create({
      data: { conversationId: conversation.id, senderType: "ai", content: reply },
    });

    await prisma.aiRun.create({
      data: {
        conversationId: conversation.id,
        model: "rule-based-mvp",
        action: "check_area",
        confidence: 0.9,
        inputSnapshot: input.message,
        outputSnapshot: reply,
      },
    });

    return reply;
  }

  const missingFields = [
    !lead.serviceNeed && "服务类型",
    !lead.phone && "联系电话",
    !lead.address && "服务地址",
    !lead.preferredTime && "期望时间",
  ].filter(Boolean);

  let reply: string;
  let action = "ask_field";

  if (missingFields.length > 0) {
    reply = `我可以帮您先确认预约。还需要补充：${missingFields.join("、")}。`;
  } else {
    const bookingStart = new Date(Date.now() + 24 * 60 * 60 * 1000);
    bookingStart.setMinutes(0, 0, 0);
    const bookingEnd = new Date(bookingStart.getTime() + 4 * 60 * 60 * 1000);
    const service = lead.serviceNeed
      ? await prisma.service.findFirst({
          where: {
            merchantId: conversation.merchantId,
            name: lead.serviceNeed,
            active: true,
          },
        })
      : null;

    await prisma.booking.create({
      data: {
        merchantId: conversation.merchantId,
        leadId: lead.id,
        serviceId: service?.id,
        startsAt: bookingStart,
        endsAt: bookingEnd,
        address: lead.address,
        status: "confirmed",
        calendarEventId: `local-${Date.now()}`,
      },
    });

    await prisma.lead.update({
      where: { id: lead.id },
      data: { qualificationStatus: "qualified", status: "booked" },
    });

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        status: "booked",
        tag: "已预约",
        summary: `${lead.serviceNeed}，${lead.address}，${lead.preferredTime}，已由 AI 创建预约。`,
      },
    });

    await trackEvent({
      merchantId: conversation.merchantId,
      eventType: "lead_qualified",
      entityType: "lead",
      entityId: lead.id,
    });
    await trackEvent({
      merchantId: conversation.merchantId,
      eventType: "booking_created",
      entityType: "lead",
      entityId: lead.id,
    });

    reply =
      "信息已收齐，我已为您创建一个临时预约。稍后值班客服会确认最终上门时间和价格。";
    action = "create_booking";
  }

  await prisma.message.create({
    data: { conversationId: conversation.id, senderType: "ai", content: reply },
  });

  await prisma.aiRun.create({
    data: {
      conversationId: conversation.id,
      model: "rule-based-mvp",
      action,
      confidence: 0.82,
      inputSnapshot: input.message,
      outputSnapshot: reply,
    },
  });

  await trackEvent({
    merchantId: conversation.merchantId,
    eventType: "ai_replied",
    entityType: "conversation",
    entityId: conversation.id,
  });

  return reply;
}
