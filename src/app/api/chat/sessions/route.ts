import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { trackEvent } from "@/lib/analytics";

const bodySchema = z.object({
  publicKey: z.string().min(1),
});

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const channel = await prisma.channel.findUnique({
    where: { publicKey: parsed.data.publicKey },
  });

  if (!channel || !channel.active) {
    return NextResponse.json({ error: "Channel not found" }, { status: 404 });
  }

  const lead = await prisma.lead.create({
    data: {
      merchantId: channel.merchantId,
      status: "new",
      qualificationStatus: "new",
    },
  });

  const conversation = await prisma.conversation.create({
    data: {
      merchantId: channel.merchantId,
      channelId: channel.id,
      leadId: lead.id,
      status: "new",
      lastMessageAt: new Date(),
    },
  });

  const welcomeMessage = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderType: "ai",
      content: channel.welcomeText,
    },
  });

  await trackEvent({
    merchantId: channel.merchantId,
    eventType: "conversation_created",
    entityType: "conversation",
    entityId: conversation.id,
  });

  return NextResponse.json({
    conversationId: conversation.id,
    messages: [welcomeMessage],
  });
}
