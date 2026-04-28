import { notFound } from "next/navigation";
import { ChatClient } from "@/components/chat-client";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ChatPage({
  params,
  searchParams,
}: {
  params: Promise<{ publicKey: string }>;
  searchParams: Promise<{ embed?: string }>;
}) {
  const { publicKey } = await params;
  const { embed } = await searchParams;
  const channel = await prisma.channel.findUnique({
    where: { publicKey },
    include: { merchant: true },
  });

  if (!channel || !channel.active) {
    notFound();
  }

  return (
    <main className={embed === "1" ? "chat-page chat-page-embedded" : "chat-page"}>
      <ChatClient
        publicKey={channel.publicKey}
        title={channel.merchant.name}
        welcomeText={channel.welcomeText}
      />
    </main>
  );
}
