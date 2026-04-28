import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "owner@example.com" },
    update: {},
    create: {
      email: "owner@example.com",
      name: "演示管理员",
    },
  });

  const merchant = await prisma.merchant.upsert({
    where: { id: "demo-merchant" },
    update: {},
    create: {
      id: "demo-merchant",
      name: "安心家政清洁",
      industry: "home_cleaning",
      phone: "400-800-1000",
      email: "hello@example.com",
      onboardingCompleted: true,
    },
  });

  await prisma.merchantMember.upsert({
    where: {
      userId_merchantId: {
        userId: user.id,
        merchantId: merchant.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      merchantId: merchant.id,
      role: "admin",
    },
  });

  await prisma.businessProfile.upsert({
    where: { merchantId: merchant.id },
    update: {},
    create: {
      merchantId: merchant.id,
      companyIntro:
        "安心家政清洁提供家庭日常保洁、深度清洁和搬家前后清洁服务。服务人员经过基础培训，可按预约时间上门。",
      businessHours: "周一至周日 09:00-20:00",
      bookingRules:
        "预约需提供姓名、电话、服务地址、清洁类型和期望时间。建议至少提前 24 小时预约。",
      priceRules:
        "日常保洁 4 小时起，擦窗户/玻璃清洁和深度清洁需根据面积、清洁类型和地址确认。AI 只能提供价格范围，最终价格由人工确认。",
      forbiddenPromises:
        "AI 不承诺最终价格、不承诺特殊清洁效果、不处理退款争议、不对安全事故做责任判断。",
    },
  });

  await prisma.aiAgent.upsert({
    where: { merchantId: merchant.id },
    update: {},
    create: {
      merchantId: merchant.id,
      name: "安心清洁 AI 接待员",
      tone: "专业、简洁、耐心，主动推进预约",
      proactivelyGuideBooking: true,
    },
  });

  const services = [
    {
      name: "日常保洁",
      description: "适合家庭定期清洁，包含地面、台面、厨房和卫生间基础清洁。",
      durationMinutes: 240,
      priceNote: "4 小时起，价格按城市和面积确认。",
    },
    {
      name: "深度清洁",
      description: "适合长期未清洁或节前大扫除，覆盖更细致的油污、死角和卫生间清洁。",
      durationMinutes: 360,
      priceNote: "需根据面积和清洁难度确认。",
    },
    {
      name: "搬家前后清洁",
      description: "适合搬入、搬出前后的空房清洁。",
      durationMinutes: 300,
      priceNote: "按房屋面积和清洁范围报价。",
    },
    {
      name: "擦窗户",
      description: "适合家庭窗户、阳台玻璃和室内玻璃清洁。",
      durationMinutes: 180,
      priceNote: "按窗户数量、高度和清洁难度确认。",
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: {
        id: `${merchant.id}-${service.name}`,
      },
      update: service,
      create: {
        id: `${merchant.id}-${service.name}`,
        merchantId: merchant.id,
        ...service,
      },
    });
  }

  const serviceAreas = [
    { label: "上海市区", ruleType: "city", ruleValue: "上海" },
    { label: "浦东新区", ruleType: "district", ruleValue: "浦东" },
    { label: "徐汇区", ruleType: "district", ruleValue: "徐汇" },
    { label: "静安区", ruleType: "district", ruleValue: "静安" },
    { label: "西安市", ruleType: "city", ruleValue: "西安" },
  ];

  for (const area of serviceAreas) {
    await prisma.serviceArea.upsert({
      where: { id: `${merchant.id}-${area.ruleValue}` },
      update: area,
      create: {
        id: `${merchant.id}-${area.ruleValue}`,
        merchantId: merchant.id,
        ...area,
      },
    });
  }

  const faqs = [
    {
      question: "最快什么时候可以上门？",
      answer: "通常可预约明天或后天的时间段，具体以日历空闲时间为准。",
    },
    {
      question: "需要自己准备清洁工具吗？",
      answer: "常规工具由服务人员携带。如需特殊清洁剂，请提前说明。",
    },
    {
      question: "可以开发票吗？",
      answer: "可以。请在预约时备注发票抬头，服务完成后由人工协助处理。",
    },
  ];

  for (const faq of faqs) {
    await prisma.faq.upsert({
      where: { id: `${merchant.id}-${faq.question}` },
      update: faq,
      create: {
        id: `${merchant.id}-${faq.question}`,
        merchantId: merchant.id,
        ...faq,
      },
    });
  }

  await prisma.handoffContact.upsert({
    where: { id: `${merchant.id}-default-handoff` },
    update: {},
    create: {
      id: `${merchant.id}-default-handoff`,
      merchantId: merchant.id,
      name: "值班客服",
      email: "support@example.com",
      phone: "13800000000",
      isDefault: true,
    },
  });

  const channel = await prisma.channel.upsert({
    where: { publicKey: "demo-web-chat" },
    update: {},
    create: {
      merchantId: merchant.id,
      type: "web_chat",
      name: "官网 Web Chat",
      publicKey: "demo-web-chat",
      brandColor: "#155EEF",
      welcomeText: "您好，我是安心清洁 AI 接待员。请问您想预约哪类清洁服务？",
    },
  });

  const lead = await prisma.lead.upsert({
    where: { id: "demo-lead-001" },
    update: {},
    create: {
      id: "demo-lead-001",
      merchantId: merchant.id,
      name: "王女士",
      phone: "13900001111",
      address: "上海市徐汇区漕溪北路",
      serviceNeed: "深度清洁",
      preferredTime: "明天下午",
      qualificationStatus: "qualified",
      status: "booked",
    },
  });

  const conversation = await prisma.conversation.upsert({
    where: { id: "demo-conversation-001" },
    update: {},
    create: {
      id: "demo-conversation-001",
      merchantId: merchant.id,
      channelId: channel.id,
      leadId: lead.id,
      status: "booked",
      tag: "已预约",
      summary: "客户咨询深度清洁，地址在徐汇区，已确认明天下午可预约。",
      lastMessageAt: new Date(),
    },
  });

  const existingMessages = await prisma.message.count({
    where: { conversationId: conversation.id },
  });

  if (existingMessages === 0) {
    await prisma.message.createMany({
      data: [
        {
          conversationId: conversation.id,
          senderType: "customer",
          content: "明天能安排深度清洁吗？我在徐汇。",
        },
        {
          conversationId: conversation.id,
          senderType: "ai",
          content:
            "可以帮您确认。请问方便提供具体地址、联系电话，以及大概房屋面积吗？",
        },
        {
          conversationId: conversation.id,
          senderType: "customer",
          content: "徐汇区漕溪北路，电话 13900001111，90 平左右。",
        },
      ],
    });
  }

  const service = await prisma.service.findFirstOrThrow({
    where: { merchantId: merchant.id, name: "深度清洁" },
  });

  await prisma.booking.upsert({
    where: { id: "demo-booking-001" },
    update: {},
    create: {
      id: "demo-booking-001",
      merchantId: merchant.id,
      leadId: lead.id,
      serviceId: service.id,
      startsAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      endsAt: new Date(Date.now() + 30 * 60 * 60 * 1000),
      address: "上海市徐汇区漕溪北路",
      status: "confirmed",
      calendarEventId: "demo-calendar-event",
    },
  });

  const existingEvents = await prisma.analyticsEvent.count({
    where: { merchantId: merchant.id },
  });

  if (existingEvents === 0) {
    const events = [
      "conversation_created",
      "message_received",
      "ai_replied",
      "lead_qualified",
      "booking_created",
    ];

    for (const eventType of events) {
      await prisma.analyticsEvent.create({
        data: {
          merchantId: merchant.id,
          eventType,
          entityType: "conversation",
          entityId: conversation.id,
        },
      });
    }
  }

  await prisma.missingKnowledgeItem.upsert({
    where: { id: "demo-missing-001" },
    update: {},
    create: {
      id: "demo-missing-001",
      merchantId: merchant.id,
      conversationId: conversation.id,
      question: "宠物毛发深度清洁是否加价？",
      status: "open",
    },
  });

  await prisma.roiSettings.upsert({
    where: { merchantId: merchant.id },
    update: {},
    create: {
      merchantId: merchant.id,
      averageOrderValueCents: 58000,
      minutesSavedPerAiLead: 6,
      hourlyLaborCostCents: 5500,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
