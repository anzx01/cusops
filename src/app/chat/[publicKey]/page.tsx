import { notFound } from "next/navigation";
import { ChatClient } from "@/components/chat-client";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ publicKey: string }>;
}) {
  const { publicKey } = await params;
  const channel = await prisma.channel.findUnique({
    where: { publicKey },
    include: { merchant: true },
  });

  if (!channel || !channel.active) {
    notFound();
  }

  return (
    <main className="chat-page">
      <ChatClient
        publicKey={channel.publicKey}
        title={channel.merchant.name}
        welcomeText={channel.welcomeText}
      />
    </main>
  );
}
