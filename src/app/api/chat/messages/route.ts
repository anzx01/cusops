import { NextResponse } from "next/server";
import { z } from "zod";
import { handleAiReception } from "@/lib/ai-receptionist";
import { trackEvent } from "@/lib/analytics";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  conversationId: z.string().min(1),
  content: z.string().min(1).max(1200),
});

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: parsed.data.conversationId },
    select: { id: true, merchantId: true },
  });

  if (!conversation) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderType: "customer",
      content: parsed.data.content,
    },
  });

  await prisma.conversation.update({
    where: { id: conversation.id },
    data: { lastMessageAt: new Date() },
  });

  await trackEvent({
    merchantId: conversation.merchantId,
    eventType: "message_received",
    entityType: "conversation",
    entityId: conversation.id,
  });

  await handleAiReception({
    conversationId: conversation.id,
    message: parsed.data.content,
  });

  const messages = await prisma.message.findMany({
    where: { conversationId: conversation.id },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      senderType: true,
      content: true,
      createdAt: true,
    },
  });

  const updatedConversation = await prisma.conversation.findUniqueOrThrow({
    where: { id: conversation.id },
    select: {
      id: true,
      status: true,
      handoffRequired: true,
      handoffReason: true,
    },
  });

  return NextResponse.json({
    conversation: updatedConversation,
    messages,
  });
}
