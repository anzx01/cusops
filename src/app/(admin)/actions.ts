"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentMerchantId } from "@/lib/session";

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function flag(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

async function assertScopedConversation(conversationId: string, merchantId: string) {
  return prisma.conversation.findFirstOrThrow({
    where: { id: conversationId, merchantId },
  });
}

export async function updateBusinessProfile(formData: FormData) {
  const merchantId = await getCurrentMerchantId();

  await prisma.businessProfile.upsert({
    where: { merchantId },
    update: {
      companyIntro: value(formData, "companyIntro"),
      businessHours: value(formData, "businessHours"),
      bookingRules: value(formData, "bookingRules"),
      priceRules: value(formData, "priceRules"),
      forbiddenPromises: value(formData, "forbiddenPromises"),
    },
    create: {
      merchantId,
      companyIntro: value(formData, "companyIntro"),
      businessHours: value(formData, "businessHours"),
      bookingRules: value(formData, "bookingRules"),
      priceRules: value(formData, "priceRules"),
      forbiddenPromises: value(formData, "forbiddenPromises"),
    },
  });

  revalidatePath("/business-profile");
}

export async function addService(formData: FormData) {
  const merchantId = await getCurrentMerchantId();
  const durationMinutes = Number(value(formData, "durationMinutes")) || 90;

  await prisma.service.create({
    data: {
      merchantId,
      name: value(formData, "name"),
      description: value(formData, "description"),
      durationMinutes,
      priceNote: value(formData, "priceNote"),
      aiBookingAllowed: flag(formData, "aiBookingAllowed"),
    },
  });

  revalidatePath("/business-profile");
}

export async function toggleService(formData: FormData) {
  const merchantId = await getCurrentMerchantId();
  const id = value(formData, "id");
  const service = await prisma.service.findFirstOrThrow({
    where: { id, merchantId },
  });

  await prisma.service.update({
    where: { id },
    data: { active: !service.active },
  });

  revalidatePath("/business-profile");
}

export async function addServiceArea(formData: FormData) {
  const merchantId = await getCurrentMerchantId();

  await prisma.serviceArea.create({
    data: {
      merchantId,
      label: value(formData, "label"),
      ruleType: value(formData, "ruleType") || "city",
      ruleValue: value(formData, "ruleValue"),
    },
  });

  revalidatePath("/business-profile");
}

export async function toggleServiceArea(formData: FormData) {
  const merchantId = await getCurrentMerchantId();
  const id = value(formData, "id");
  const area = await prisma.serviceArea.findFirstOrThrow({
    where: { id, merchantId },
  });

  await prisma.serviceArea.update({
    where: { id },
    data: { active: !area.active },
  });

  revalidatePath("/business-profile");
}

export async function addFaq(formData: FormData) {
  const merchantId = await getCurrentMerchantId();

  await prisma.faq.create({
    data: {
      merchantId,
      question: value(formData, "question"),
      answer: value(formData, "answer"),
    },
  });

  const missingKnowledgeId = value(formData, "missingKnowledgeId");

  if (missingKnowledgeId) {
    await prisma.missingKnowledgeItem.updateMany({
      where: { id: missingKnowledgeId, merchantId },
      data: { status: "resolved" },
    });
  }

  revalidatePath("/business-profile");
}

export async function toggleFaq(formData: FormData) {
  const merchantId = await getCurrentMerchantId();
  const id = value(formData, "id");
  const faq = await prisma.faq.findFirstOrThrow({ where: { id, merchantId } });

  await prisma.faq.update({
    where: { id },
    data: { active: !faq.active },
  });

  revalidatePath("/business-profile");
}

export async function ignoreMissingKnowledge(formData: FormData) {
  const merchantId = await getCurrentMerchantId();

  await prisma.missingKnowledgeItem.updateMany({
    where: { id: value(formData, "id"), merchantId },
    data: { status: "ignored" },
  });

  revalidatePath("/business-profile");
}

export async function requestManualHandoff(formData: FormData) {
  const merchantId = await getCurrentMerchantId();
  const conversationId = value(formData, "conversationId");
  await assertScopedConversation(conversationId, merchantId);

  await prisma.conversation.update({
    where: { id: conversationId },
    data: {
      aiEnabled: false,
      handoffRequired: true,
      handoffReason: value(formData, "reason") || "人工手动接管",
      status: "handoff",
      tag: "需跟进",
    },
  });

  await prisma.analyticsEvent.create({
    data: {
      merchantId,
      eventType: "handoff_requested",
      entityType: "conversation",
      entityId: conversationId,
      properties: JSON.stringify({ source: "manual" }),
    },
  });

  revalidatePath("/inbox");
}

export async function resumeAi(formData: FormData) {
  const merchantId = await getCurrentMerchantId();
  const conversationId = value(formData, "conversationId");
  await assertScopedConversation(conversationId, merchantId);

  await prisma.conversation.update({
    where: { id: conversationId },
    data: {
      aiEnabled: true,
      handoffRequired: false,
      handoffReason: null,
      status: "new",
      tag: null,
    },
  });

  revalidatePath("/inbox");
}

export async function closeConversation(formData: FormData) {
  const merchantId = await getCurrentMerchantId();
  const conversationId = value(formData, "conversationId");
  await assertScopedConversation(conversationId, merchantId);

  await prisma.conversation.update({
    where: { id: conversationId },
    data: {
      status: "closed",
      tag: value(formData, "tag") || "已关闭",
      aiEnabled: false,
    },
  });

  revalidatePath("/inbox");
}

export async function cancelBooking(formData: FormData) {
  const merchantId = await getCurrentMerchantId();
  const id = value(formData, "id");

  await prisma.booking.updateMany({
    where: { id, merchantId },
    data: {
      status: "cancelled",
      calendarEventId: null,
    },
  });

  await prisma.analyticsEvent.create({
    data: {
      merchantId,
      eventType: "booking_cancelled",
      entityType: "booking",
      entityId: id,
    },
  });

  revalidatePath("/bookings");
  revalidatePath("/dashboard");
  revalidatePath("/analytics");
}

export async function updateAiSettings(formData: FormData) {
  const merchantId = await getCurrentMerchantId();

  await prisma.aiAgent.upsert({
    where: { merchantId },
    update: {
      name: value(formData, "name"),
      tone: value(formData, "tone"),
      defaultLanguage: value(formData, "defaultLanguage") || "zh-CN",
      proactivelyGuideBooking: flag(formData, "proactivelyGuideBooking"),
      allowPriceQuote: flag(formData, "allowPriceQuote"),
      allowServiceTimeCommitment: flag(formData, "allowServiceTimeCommitment"),
    },
    create: {
      merchantId,
      name: value(formData, "name"),
      tone: value(formData, "tone"),
      defaultLanguage: value(formData, "defaultLanguage") || "zh-CN",
      proactivelyGuideBooking: flag(formData, "proactivelyGuideBooking"),
      allowPriceQuote: flag(formData, "allowPriceQuote"),
      allowServiceTimeCommitment: flag(formData, "allowServiceTimeCommitment"),
    },
  });

  revalidatePath("/settings");
}

export async function updateHandoffContact(formData: FormData) {
  const merchantId = await getCurrentMerchantId();
  const current = await prisma.handoffContact.findFirst({
    where: { merchantId, isDefault: true },
  });

  if (current) {
    await prisma.handoffContact.update({
      where: { id: current.id },
      data: {
        name: value(formData, "name"),
        email: value(formData, "email"),
        phone: value(formData, "phone"),
      },
    });
  } else {
    await prisma.handoffContact.create({
      data: {
        merchantId,
        name: value(formData, "name"),
        email: value(formData, "email"),
        phone: value(formData, "phone"),
        isDefault: true,
      },
    });
  }

  revalidatePath("/settings");
}

export async function updateRoiSettings(formData: FormData) {
  const merchantId = await getCurrentMerchantId();

  await prisma.roiSettings.upsert({
    where: { merchantId },
    update: {
      averageOrderValueCents: Math.round(Number(value(formData, "averageOrderValue")) * 100),
      minutesSavedPerAiLead: Number(value(formData, "minutesSavedPerAiLead")) || 0,
      hourlyLaborCostCents: Math.round(Number(value(formData, "hourlyLaborCost")) * 100),
    },
    create: {
      merchantId,
      averageOrderValueCents: Math.round(Number(value(formData, "averageOrderValue")) * 100),
      minutesSavedPerAiLead: Number(value(formData, "minutesSavedPerAiLead")) || 0,
      hourlyLaborCostCents: Math.round(Number(value(formData, "hourlyLaborCost")) * 100),
    },
  });

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  revalidatePath("/analytics");
}
