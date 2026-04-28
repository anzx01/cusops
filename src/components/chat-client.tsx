"use client";

import { SendHorizontal } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";

type ChatMessage = {
  id: string;
  senderType: string;
  content: string;
};

export function ChatClient({
  publicKey,
  title,
  welcomeText,
}: {
  publicKey: string;
  title: string;
  welcomeText: string;
}) {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function startSession() {
      const response = await fetch("/api/chat/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicKey }),
      });

      if (!response.ok) {
        setError("聊天渠道暂不可用");
        return;
      }

      const data = (await response.json()) as {
        conversationId: string;
        messages: ChatMessage[];
      };

      if (!cancelled) {
        setConversationId(data.conversationId);
        setMessages(data.messages);
      }
    }

    startSession();

    return () => {
      cancelled = true;
    };
  }, [publicKey]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!conversationId || !input.trim()) return;

    setIsSending(true);
    setError(null);

    const content = input.trim();
    setInput("");

    const response = await fetch("/api/chat/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId, content }),
    });

    setIsSending(false);

    if (!response.ok) {
      setError("消息发送失败，请稍后再试");
      return;
    }

    const data = (await response.json()) as { messages: ChatMessage[] };
    setMessages(data.messages);
  }

  return (
    <div className="chat-window">
      <header className="chat-header">
        <h1 className="topbar-title">{title}</h1>
        <p className="topbar-meta">{welcomeText}</p>
      </header>

      <div className="chat-messages">
        {messages.map((message) => (
          <div
            className={`chat-bubble ${
              message.senderType === "customer"
                ? "chat-bubble-customer"
                : "chat-bubble-ai"
            }`}
            key={message.id}
          >
            {message.content}
          </div>
        ))}
        {error ? <div className="badge badge-red">{error}</div> : null}
        <div ref={bottomRef} />
      </div>

      <form className="chat-form" onSubmit={submitMessage}>
        <input
          aria-label="输入消息"
          className="input"
          disabled={!conversationId || isSending}
          onChange={(event) => setInput(event.target.value)}
          placeholder="输入服务需求、地址和期望时间"
          value={input}
        />
        <button
          aria-label="发送消息"
          className="button button-primary"
          disabled={!conversationId || isSending}
          type="submit"
        >
          <SendHorizontal aria-hidden size={17} />
          发送
        </button>
      </form>
    </div>
  );
}
